/* Copyright 2026 Marimo. All rights reserved. */

import type { JSX } from "react";
import type { OutputChannel } from "@/features/lab/core/kernel/messages";
import { cn } from "@/features/lab/utils/cn";
import { RenderTextWithLinks } from "./console/text-rendering";

interface Props {
  text: string;
  channel?: OutputChannel;
  wrapText?: boolean;
}

export const TextOutput = ({ text, channel, wrapText }: Props): JSX.Element => {
  const shouldRenderAnsi = channel === "stdout" || channel === "stderr";

  const renderAnsiText = (text: string) => {
    return (
      <span
        className={
          wrapText ? "whitespace-pre-wrap break-words" : "whitespace-pre"
        }
      >
        <RenderTextWithLinks text={text} />
      </span>
    );
  };

  return (
    <span
      className={cn(
        !shouldRenderAnsi &&
          (wrapText ? "whitespace-pre-wrap break-words" : "whitespace-pre"),
        channel === "output" && "font-prose",
        channel,
      )}
    >
      {shouldRenderAnsi ? renderAnsiText(text) : text}
    </span>
  );
};
