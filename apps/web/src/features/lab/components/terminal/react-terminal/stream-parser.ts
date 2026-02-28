// ANSI cursor-movement escape codes to strip (keep color codes)
const CURSOR_MOVEMENT_RE =
  /\x1b\[\d*[ABCDHJ]|\x1b\[\d*;\d*[Hf]|\x1b\[(?:\??\d+[hl])|(?:\x1b\]).*?(?:\x07|\x1b\\)/g;

// Clear-screen sequences: \x1b[2J (erase display) or \x1b[3J (erase scrollback)
const CLEAR_SCREEN_RE = /\x1b\[[23]J/;

// All ANSI escape sequences (including colors)
const ALL_ANSI_RE = /\x1b\[[\d;]*[a-zA-Z]|\x1b\].*?(?:\x07|\x1b\\)/g;

// Shell prompt patterns
const PROMPT_PATTERNS = [
  /\$\s*$/,
  /%\s*$/,
  /❯\s*$/,
  />\s*$/,
  /\([\w.-]+\)\s+\S+@\S+\s+\S+\s+[%$]\s*$/,
];

type StreamParserCallbacks = {
  onPromptDetected: (promptText: string) => void;
  onOutputChunk: (blockId: string, chunk: string) => void;
  onClearScreen: () => void;
};

class StreamParser {
  private lineBuffer = '';
  private activeBlockId: string | null = null;
  private callbacks: StreamParserCallbacks;
  /** After beginBlock(), skip data until first \n (PTY command echo) */
  private inEchoZone = false;

  constructor(callbacks: StreamParserCallbacks) {
    this.callbacks = callbacks;
  }

  beginBlock(blockId: string) {
    this.activeBlockId = blockId;
    this.lineBuffer = '';
    this.inEchoZone = true;
  }

  feed(data: string) {
    // Detect clear-screen before stripping escape codes
    if (CLEAR_SCREEN_RE.test(data)) {
      this.activeBlockId = null;
      this.lineBuffer = '';
      this.inEchoZone = false;
      this.callbacks.onClearScreen();
      // Continue processing data after the clear sequence —
      // the prompt that follows clear needs to be detected
    }

    // Strip cursor-movement codes, normalize \r\n → \n, strip lone \r
    let cleaned = data
      .replace(CURSOR_MOVEMENT_RE, '')
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '');

    // Echo suppression: skip everything until the first \n after beginBlock()
    if (this.inEchoZone) {
      const nlIndex = cleaned.indexOf('\n');
      if (nlIndex === -1) {
        // Still in echo zone — discard entire chunk
        return;
      }
      // Echo ends at the first newline; process the rest
      this.inEchoZone = false;
      cleaned = cleaned.slice(nlIndex + 1);
      if (!cleaned) return;
    }

    this.lineBuffer += cleaned;
    const lines = this.lineBuffer.split('\n');
    const lastLine = lines[lines.length - 1];

    if (this.matchesPrompt(lastLine)) {
      if (this.activeBlockId && lines.length > 1) {
        const output = lines.slice(0, -1).join('\n') + '\n';
        if (output.trim()) {
          this.callbacks.onOutputChunk(this.activeBlockId, output);
        }
      }
      // Strip ALL ANSI from prompt so InputBar gets clean text
      this.callbacks.onPromptDetected(this.stripAllAnsi(lastLine));
      this.activeBlockId = null;
      this.lineBuffer = '';
    } else if (this.activeBlockId) {
      if (lines.length > 1) {
        const completeLines = lines.slice(0, -1).join('\n') + '\n';
        this.callbacks.onOutputChunk(this.activeBlockId, completeLines);
        this.lineBuffer = lastLine;
      }
    }
  }

  private matchesPrompt(line: string): boolean {
    const stripped = this.stripAllAnsi(line);
    return PROMPT_PATTERNS.some((p) => p.test(stripped));
  }

  private stripAllAnsi(text: string): string {
    return text.replace(ALL_ANSI_RE, '');
  }
}

export { StreamParser, type StreamParserCallbacks };
