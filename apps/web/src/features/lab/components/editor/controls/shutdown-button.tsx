/* Copyright 2026 Marimo. All rights reserved. */

import { XIcon } from "lucide-react";
import { useRequestClient } from "@/features/lab/core/network/requests";
import { isWasm } from "@/features/lab/core/wasm/utils";
import { useImperativeModal } from "@/features/lab/components/modal/ImperativeModal";
import { AlertDialogDestructiveAction } from "@/features/lab/components/ui/alert-dialog";
import { Tooltip } from "@/features/lab/components/ui/tooltip";
import { Button } from "../inputs/Inputs";

interface Props {
  description: string;
  disabled?: boolean;
  tooltip?: string;
}

export const ShutdownButton: React.FC<Props> = ({
  description,
  disabled = false,
  tooltip = "Shutdown",
}) => {
  const { openConfirm, closeModal } = useImperativeModal();
  const { sendShutdown } = useRequestClient();
  const handleShutdown = () => {
    sendShutdown();
    // Let the shutdown process start before closing the window.
    setTimeout(() => {
      window.close();
    }, 200);
  };

  if (isWasm()) {
    return null;
  }

  return (
    <Tooltip content={tooltip}>
      <Button
        aria-label="Shutdown"
        data-testid="shutdown-button"
        shape="circle"
        size="small"
        color={disabled ? "disabled" : "red"}
        className="h-[27px] w-[27px]"
        disabled={disabled}
        onClick={(e) => {
          e.stopPropagation();
          openConfirm({
            title: "Shutdown",
            description: description,
            variant: "destructive",
            confirmAction: (
              <AlertDialogDestructiveAction
                onClick={() => {
                  handleShutdown();
                  closeModal();
                }}
                aria-label="Confirm Shutdown"
              >
                Shutdown
              </AlertDialogDestructiveAction>
            ),
          });
        }}
      >
        <XIcon strokeWidth={1} />
      </Button>
    </Tooltip>
  );
};
