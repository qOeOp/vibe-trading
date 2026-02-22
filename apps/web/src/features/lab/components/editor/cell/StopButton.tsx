/* Copyright 2026 Marimo. All rights reserved. */
import { SquareIcon } from "lucide-react";
import type { JSX } from "react";
import { useRequestClient } from "@/features/lab/core/network/requests";
import type { RuntimeState } from "@/features/lab/core/network/types";
import { isAppInteractionDisabled } from "@/features/lab/core/websocket/connection-utils";
import type { WebSocketState } from "@/features/lab/core/websocket/types";
import { Functions } from "@/features/lab/utils/functions";
import { renderShortcut } from "@/features/lab/components/shortcuts/renderShortcut";
import { ToolbarItem } from "./toolbar";
import { useShouldShowInterrupt } from "./useShouldShowInterrupt";

export const StopButton = (props: {
  status: RuntimeState;
  connectionState: WebSocketState;
}): JSX.Element => {
  const { connectionState, status } = props;
  const { sendInterrupt } = useRequestClient();

  const running = status === "running";

  // Show the interrupt button after 200ms to avoid flickering.
  const showInterrupt = useShouldShowInterrupt(running);

  return (
    <ToolbarItem
      tooltip={renderShortcut("global.interrupt")}
      disabled={isAppInteractionDisabled(connectionState) || !showInterrupt}
      onClick={showInterrupt ? sendInterrupt : Functions.NOOP}
      variant={showInterrupt ? "stale" : "disabled"}
      data-testid="run-button"
    >
      <SquareIcon strokeWidth={1.5} />
    </ToolbarItem>
  );
};
