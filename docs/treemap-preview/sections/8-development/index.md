# Section 8: Development

Project setup, development commands, testing strategies, and build configuration.

---

## Threads

### [Setup](./threads/setup/index.md)
Nx app generation, project.json configuration (port 4300), next.config.js (static export), tailwind.config.ts (conservative colors).

### [Commands](./threads/commands/index.md)
Development server (`nx serve preview`), production build (`nx build preview`), linting, formatting.

### [Testing](./threads/testing/index.md)
Visual verification checklist (31 sectors, hover interactions), responsive testing, build verification, accessibility checks.

---

## Quick Commands

```bash
# Development
npx nx serve preview                    # Start dev server (port 4300)
npx nx run preview:lint                # Run ESLint
npx nx format:write                    # Format all files

# Production
npx nx build preview                   # Build static site
npx nx run preview:build --prod       # Production build

# Verification
ls -la dist/apps/preview/.next/       # Check static export
```

## Port Assignment

| Service | Port | URL |
|---------|------|-----|
| Preview App (Dev) | 4300 | http://localhost:4300 |
| Main Web App | 4200 | http://localhost:4200 |
| API Server | 3000 | http://localhost:3000 |

---

## Build Output

**Static Export Mode:**
- Output: `dist/apps/preview/.next/`
- Format: Pre-rendered HTML files (no server.js)
- Deployment: Can be served from any static file server
- Images: Unoptimized (no Next.js Image Optimization API)
