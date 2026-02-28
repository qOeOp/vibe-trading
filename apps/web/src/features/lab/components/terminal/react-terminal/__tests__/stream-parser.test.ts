import { describe, expect, it, beforeEach, vi } from 'vitest';
import { StreamParser } from '../stream-parser';

describe('StreamParser', () => {
  let parser: StreamParser;
  let callbacks: {
    onPromptDetected: ReturnType<typeof vi.fn>;
    onOutputChunk: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    callbacks = {
      onPromptDetected: vi.fn(),
      onOutputChunk: vi.fn(),
    };
    parser = new StreamParser(callbacks);
  });

  it('detects bash prompt ($ )', () => {
    parser.feed('(base) vx@ai vibe-editor $ ');
    expect(callbacks.onPromptDetected).toHaveBeenCalledWith(
      '(base) vx@ai vibe-editor $ ',
    );
  });

  it('detects zsh prompt (% )', () => {
    parser.feed('vx@ai ~ % ');
    expect(callbacks.onPromptDetected).toHaveBeenCalledWith('vx@ai ~ % ');
  });

  it('does not trigger on partial data', () => {
    parser.feed('installing pack');
    expect(callbacks.onPromptDetected).not.toHaveBeenCalled();
  });

  it('suppresses command echo after beginBlock', () => {
    parser.feed('$ ');
    callbacks.onPromptDetected.mockClear();
    parser.beginBlock('block-1');
    // PTY echoes "ls" then newline, then real output
    parser.feed('ls\n');
    // Echo should be suppressed — no output chunk for "ls"
    expect(callbacks.onOutputChunk).not.toHaveBeenCalled();
    // Now real output arrives
    parser.feed('file1.txt\nfile2.txt\n');
    expect(callbacks.onOutputChunk).toHaveBeenCalled();
    const chunks = callbacks.onOutputChunk.mock.calls
      .map(([, chunk]) => chunk)
      .join('');
    expect(chunks).toContain('file1.txt');
    expect(chunks).toContain('file2.txt');
    expect(chunks).not.toContain('ls');
  });

  it('suppresses echo even when split across multiple feed calls', () => {
    parser.feed('$ ');
    parser.beginBlock('b1');
    // PTY sends echo character by character
    parser.feed('l');
    parser.feed('s');
    parser.feed('\n');
    // Echo zone ends at \n — nothing emitted
    expect(callbacks.onOutputChunk).not.toHaveBeenCalled();
    // Real output
    parser.feed('output\n');
    expect(callbacks.onOutputChunk).toHaveBeenCalledWith('b1', 'output\n');
  });

  it('strips ANSI from prompt text', () => {
    parser.feed('\x1b[1m\x1b[7m%\x1b[27m \x1b[1m\x1b[0m');
    expect(callbacks.onPromptDetected).toHaveBeenCalledWith('% ');
  });

  it('normalizes \\r\\n to \\n in output', () => {
    parser.feed('$ ');
    parser.beginBlock('b1');
    parser.feed('echo\r\n'); // echo line (suppressed)
    parser.feed('hello\r\nworld\r\n');
    const chunks = callbacks.onOutputChunk.mock.calls
      .map(([, chunk]) => chunk)
      .join('');
    expect(chunks).not.toContain('\r');
    expect(chunks).toContain('hello\nworld\n');
  });

  it('strips ANSI cursor-movement codes but keeps colors', () => {
    parser.feed('$ ');
    parser.beginBlock('b1');
    parser.feed('echo\n'); // echo (suppressed)
    parser.feed('\x1b[H\x1b[32mgreen text\x1b[0m\n');
    expect(callbacks.onOutputChunk).toHaveBeenCalled();
    const chunk = callbacks.onOutputChunk.mock.calls[0][1];
    expect(chunk).not.toContain('\x1b[H');
    expect(chunk).toContain('\x1b[32m');
  });

  it('handles multiline output before next prompt', () => {
    parser.feed('$ ');
    parser.beginBlock('b1');
    parser.feed('cmd\n'); // echo (suppressed)
    parser.feed('line1\nline2\nline3\n');
    parser.feed('$ ');
    const allChunks = callbacks.onOutputChunk.mock.calls
      .filter(([id]) => id === 'b1')
      .map(([, chunk]) => chunk)
      .join('');
    expect(allChunks).toContain('line1');
    expect(allChunks).toContain('line2');
    expect(allChunks).toContain('line3');
  });

  it('handles conda env prompt pattern', () => {
    parser.feed('(myenv) user@host dir % ');
    expect(callbacks.onPromptDetected).toHaveBeenCalled();
  });
});
