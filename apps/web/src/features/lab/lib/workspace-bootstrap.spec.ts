import {
  deriveHomeDir,
  bootstrapWorkspace,
  type BootstrapResult,
} from './workspace-bootstrap';

// ─── deriveHomeDir ───────────────────────────────────────

describe('deriveHomeDir', () => {
  it('extracts /Users/vx from macOS deep path', () => {
    expect(deriveHomeDir('/Users/vx/WebstormProjects/vibe-trading')).toBe(
      '/Users/vx',
    );
  });

  it('extracts /Users/vx from macOS home directly', () => {
    expect(deriveHomeDir('/Users/vx')).toBe('/Users/vx');
  });

  it('extracts /home/ubuntu from Linux deep path', () => {
    expect(deriveHomeDir('/home/ubuntu/projects/app')).toBe('/home/ubuntu');
  });

  it('extracts /home/user from Linux home directly', () => {
    expect(deriveHomeDir('/home/user')).toBe('/home/user');
  });

  it('returns root as-is for unknown structure like /opt/app', () => {
    expect(deriveHomeDir('/opt/app')).toBe('/opt/app');
  });

  it('returns root as-is for /tmp', () => {
    expect(deriveHomeDir('/tmp')).toBe('/tmp');
  });

  it('strips trailing slash', () => {
    expect(deriveHomeDir('/opt/app/')).toBe('/opt/app');
  });

  it('handles single slash root', () => {
    expect(deriveHomeDir('/')).toBe('/');
  });

  it('handles empty string', () => {
    expect(deriveHomeDir('')).toBe('/');
  });
});

// ─── bootstrapWorkspace ──────────────────────────────────

const KERNEL_BASE = 'http://localhost:2728';

/** Helper: create a mock Response */
function mockResponse(
  body: unknown,
  ok = true,
  status = ok ? 200 : 500,
): Response {
  return {
    ok,
    status,
    json: () => Promise.resolve(body),
  } as Response;
}

describe('bootstrapWorkspace', () => {
  const originalFetch = globalThis.fetch;

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it('returns workspace and notebook paths when everything exists', async () => {
    const calls: { url: string; body: unknown }[] = [];

    globalThis.fetch = jest.fn(
      async (input: RequestInfo | URL, init?: RequestInit) => {
        const url = input.toString();
        const body = JSON.parse(init?.body as string);
        calls.push({ url, body });

        // Step 1: root listing
        if (url.includes('list_files') && body.path === '') {
          return mockResponse({
            root: '/Users/vx/some/project',
            files: [],
          });
        }
        // Step 2: workspace exists
        if (url.includes('list_files') && body.path === '/Users/vx/.vt-lab') {
          return mockResponse({
            root: '/Users/vx/.vt-lab',
            files: [{ name: 'welcome.py' }, { name: 'other.py' }],
          });
        }
        return mockResponse({}, false, 500);
      },
    );

    const result = await bootstrapWorkspace(KERNEL_BASE);

    expect(result).toEqual({
      workspacePath: '/Users/vx/.vt-lab',
      notebookPath: '/Users/vx/.vt-lab/welcome.py',
    });

    // Should NOT call create — workspace and welcome.py both exist
    expect(calls.every((c) => !c.url.includes('/api/files/create'))).toBe(true);
  });

  it('creates workspace dir when it does not exist', async () => {
    const calls: { url: string; body: unknown }[] = [];

    globalThis.fetch = jest.fn(
      async (input: RequestInfo | URL, init?: RequestInit) => {
        const url = input.toString();
        const body = JSON.parse(init?.body as string);
        calls.push({ url, body });

        // Root listing
        if (url.includes('list_files') && body.path === '') {
          return mockResponse({ root: '/Users/vx/project', files: [] });
        }
        // Workspace does NOT exist (first check)
        if (
          url.includes('list_files') &&
          body.path === '/Users/vx/.vt-lab' &&
          calls.filter(
            (c) =>
              c.url.includes('list_files') &&
              (c.body as Record<string, string>).path === '/Users/vx/.vt-lab',
          ).length === 1
        ) {
          return mockResponse({}, false, 404);
        }
        // Create directory
        if (url.includes('/api/files/create') && body.type === 'directory') {
          return mockResponse({ success: true, info: {} });
        }
        // After creation, listing works (step 3)
        if (url.includes('list_files') && body.path === '/Users/vx/.vt-lab') {
          return mockResponse({ root: '/Users/vx/.vt-lab', files: [] });
        }
        // Create welcome.py
        if (url.includes('/api/files/create') && body.type === 'file') {
          return mockResponse({ success: true, info: {} });
        }
        // Update welcome.py content
        if (url.includes('/api/files/update')) {
          return mockResponse({ success: true });
        }

        return mockResponse({}, false, 500);
      },
    );

    const result = await bootstrapWorkspace(KERNEL_BASE);

    expect(result.workspacePath).toBe('/Users/vx/.vt-lab');
    expect(result.notebookPath).toBe('/Users/vx/.vt-lab/welcome.py');

    // Should have called create for directory
    const createDirCall = calls.find(
      (c) =>
        c.url.includes('/api/files/create') &&
        (c.body as Record<string, string>).type === 'directory',
    );
    expect(createDirCall).toBeDefined();
    expect((createDirCall!.body as Record<string, string>).path).toBe(
      '/Users/vx',
    );
    expect((createDirCall!.body as Record<string, string>).name).toBe(
      '.vt-lab',
    );
  });

  it('creates welcome.py when workspace exists but notebook missing', async () => {
    const calls: { url: string; body: unknown }[] = [];

    globalThis.fetch = jest.fn(
      async (input: RequestInfo | URL, init?: RequestInit) => {
        const url = input.toString();
        const body = JSON.parse(init?.body as string);
        calls.push({ url, body });

        if (url.includes('list_files') && body.path === '') {
          return mockResponse({ root: '/home/ubuntu/work', files: [] });
        }
        if (
          url.includes('list_files') &&
          body.path === '/home/ubuntu/.vt-lab'
        ) {
          return mockResponse({
            root: '/home/ubuntu/.vt-lab',
            files: [{ name: 'other_notebook.py' }], // no welcome.py
          });
        }
        if (url.includes('/api/files/create') && body.name === 'welcome.py') {
          return mockResponse({ success: true, info: {} });
        }
        if (url.includes('/api/files/update')) {
          return mockResponse({ success: true });
        }
        return mockResponse({}, false, 500);
      },
    );

    const result = await bootstrapWorkspace(KERNEL_BASE);

    expect(result).toEqual({
      workspacePath: '/home/ubuntu/.vt-lab',
      notebookPath: '/home/ubuntu/.vt-lab/welcome.py',
    });

    // Should have called create for welcome.py file
    const createFileCall = calls.find(
      (c) =>
        c.url.includes('/api/files/create') &&
        (c.body as Record<string, string>).name === 'welcome.py',
    );
    expect(createFileCall).toBeDefined();

    // Should have called update to write content
    const updateCall = calls.find((c) => c.url.includes('/api/files/update'));
    expect(updateCall).toBeDefined();
    expect((updateCall!.body as Record<string, string>).path).toBe(
      '/home/ubuntu/.vt-lab/welcome.py',
    );
  });

  it('does not send Marimo-Server-Token header', async () => {
    let capturedHeaders: Record<string, string> = {};

    globalThis.fetch = jest.fn(
      async (input: RequestInfo | URL, init?: RequestInit) => {
        const headers = init?.headers as Record<string, string>;
        capturedHeaders = headers;
        return mockResponse({
          root: '/Users/vx',
          files: [{ name: 'welcome.py' }],
        });
      },
    );

    await bootstrapWorkspace(KERNEL_BASE);

    expect(capturedHeaders['Marimo-Server-Token']).toBeUndefined();
    expect(capturedHeaders['Content-Type']).toBe('application/json');
  });

  it('falls back to /tmp/vt-lab.py when root listing fails', async () => {
    globalThis.fetch = jest.fn(async () => mockResponse({}, false, 500));

    const result = await bootstrapWorkspace(KERNEL_BASE);

    expect(result).toEqual({
      workspacePath: '',
      notebookPath: '/tmp/vt-lab.py',
    });
  });

  it('falls back when fetch throws network error', async () => {
    globalThis.fetch = jest.fn(async () => {
      throw new Error('Network error');
    });

    const result = await bootstrapWorkspace(KERNEL_BASE);

    expect(result).toEqual({
      workspacePath: '',
      notebookPath: '/tmp/vt-lab.py',
    });
  });

  it('does not create welcome.py when it already exists', async () => {
    const calls: { url: string; body: unknown }[] = [];

    globalThis.fetch = jest.fn(
      async (input: RequestInfo | URL, init?: RequestInit) => {
        const url = input.toString();
        const body = JSON.parse(init?.body as string);
        calls.push({ url, body });

        if (url.includes('list_files') && body.path === '') {
          return mockResponse({ root: '/Users/vx', files: [] });
        }
        if (url.includes('list_files') && body.path === '/Users/vx/.vt-lab') {
          return mockResponse({
            root: '/Users/vx/.vt-lab',
            files: [{ name: 'welcome.py' }],
          });
        }
        return mockResponse({}, false, 500);
      },
    );

    await bootstrapWorkspace(KERNEL_BASE);

    // No create or update calls
    expect(
      calls.filter((c) => c.url.includes('/api/files/create')),
    ).toHaveLength(0);
    expect(
      calls.filter((c) => c.url.includes('/api/files/update')),
    ).toHaveLength(0);
  });
});
