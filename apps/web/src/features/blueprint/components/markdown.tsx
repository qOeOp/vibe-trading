"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

interface MarkdownProps {
  content: string;
  className?: string;
}

export function Markdown({ content, className }: MarkdownProps) {
  return (
    <div className={cn("blueprint-markdown", className)}>
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h1: ({ children }) => (
          <h1 className="text-lg font-bold text-mine-text mt-4 mb-2">
            {children}
          </h1>
        ),
        h2: ({ children }) => (
          <h2 className="text-base font-semibold text-mine-text mt-3 mb-1.5">
            {children}
          </h2>
        ),
        h3: ({ children }) => (
          <h3 className="text-sm font-semibold text-mine-text mt-2 mb-1">
            {children}
          </h3>
        ),
        p: ({ children }) => (
          <p className="text-xs text-mine-text leading-[1.6] mb-2">
            {children}
          </p>
        ),
        ul: ({ children }) => (
          <ul className="text-xs text-mine-text leading-[1.6] mb-2 ml-4 list-disc">
            {children}
          </ul>
        ),
        ol: ({ children }) => (
          <ol className="text-xs text-mine-text leading-[1.6] mb-2 ml-4 list-decimal">
            {children}
          </ol>
        ),
        li: ({ children }) => <li className="mb-0.5">{children}</li>,
        strong: ({ children }) => (
          <strong className="font-semibold text-mine-text">{children}</strong>
        ),
        em: ({ children }) => (
          <em className="text-mine-muted italic">{children}</em>
        ),
        code: ({ children, className: codeClassName }) => {
          const isBlock = codeClassName?.startsWith("language-");
          if (isBlock) {
            return (
              <code
                className={cn(
                  "block rounded-lg bg-mine-bg p-3 text-[10px] font-mono text-mine-text overflow-x-auto mb-2",
                  codeClassName,
                )}
              >
                {children}
              </code>
            );
          }
          return (
            <code className="px-1 py-0.5 rounded bg-mine-bg text-[10px] font-mono text-mine-accent-teal">
              {children}
            </code>
          );
        },
        pre: ({ children }) => <pre className="mb-2">{children}</pre>,
        table: ({ children }) => (
          <div className="overflow-x-auto mb-2">
            <table className="w-full text-[10px] border-collapse">
              {children}
            </table>
          </div>
        ),
        thead: ({ children }) => (
          <thead className="bg-mine-bg">{children}</thead>
        ),
        th: ({ children }) => (
          <th className="px-2 py-1.5 text-left font-semibold text-mine-text border-b border-mine-border/50">
            {children}
          </th>
        ),
        td: ({ children }) => (
          <td className="px-2 py-1.5 text-mine-muted border-b border-mine-border/30">
            {children}
          </td>
        ),
        blockquote: ({ children }) => (
          <blockquote className="border-l-2 border-mine-accent-teal pl-3 py-0.5 mb-2 text-xs text-mine-muted italic">
            {children}
          </blockquote>
        ),
        hr: () => <hr className="border-mine-border my-3" />,
        a: ({ children, href }) => (
          <a
            href={href}
            className="text-mine-accent-teal underline hover:text-mine-accent-teal/80"
          >
            {children}
          </a>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
    </div>
  );
}
