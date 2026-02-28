'use client';

type PromptSegment = {
  text: string;
  className: string;
};

/**
 * Parse a shell prompt string into colored segments.
 *
 * Recognizes patterns like:
 *   (base) vibe@lab ~/workspace $
 *   user@hostname /path/to/dir %
 *   $
 */
function parsePrompt(prompt: string): PromptSegment[] {
  const trimmed = prompt.trimEnd();
  const segments: PromptSegment[] = [];
  let remaining = trimmed;

  // 1. Match conda/venv env: (base), (myenv), etc.
  const envMatch = remaining.match(/^\([\w.-]+\)\s*/);
  if (envMatch) {
    segments.push({
      text: envMatch[0].trimEnd(),
      className: 'text-teal-400',
    });
    remaining = remaining.slice(envMatch[0].length);
  }

  // 2. Match user@host
  const userHostMatch = remaining.match(/^[\w.-]+@[\w.-]+\s*/);
  if (userHostMatch) {
    segments.push({
      text: userHostMatch[0].trimEnd(),
      className: 'text-green-400',
    });
    remaining = remaining.slice(userHostMatch[0].length);
  }

  // 3. Match path (~/... or /... or word before prompt char)
  const promptCharMatch = remaining.match(/^(.+?)\s*([%$❯>])\s*$/);
  if (promptCharMatch) {
    const path = promptCharMatch[1].trim();
    const promptChar = promptCharMatch[2];
    if (path) {
      segments.push({
        text: path,
        className: 'text-blue-400',
      });
    }
    segments.push({
      text: ' ' + promptChar,
      className: 'text-white font-semibold',
    });
  } else if (remaining.trim()) {
    // Fallback: just show remaining as-is
    segments.push({
      text: remaining.trim(),
      className: 'text-white',
    });
  }

  return segments.length > 0
    ? segments
    : [{ text: '$', className: 'text-white font-semibold' }];
}

function PromptDisplay({ prompt }: { prompt: string }) {
  const segments = parsePrompt(prompt);

  return (
    <span className="shrink-0 select-none font-mono text-[13px]">
      {segments.map((seg, i) => (
        <span key={i} className={seg.className}>
          {i > 0 && ' '}
          {seg.text}
        </span>
      ))}
    </span>
  );
}

export { PromptDisplay, parsePrompt };
