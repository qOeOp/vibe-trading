/* Copyright 2026 Marimo. All rights reserved. */

import { atom, useAtomValue, useSetAtom } from "jotai";
import React from "react";
import { useOpenSettingsToTab } from "@/features/lab/components/app-config/state";
import { GitHubCopilotIcon } from "@/features/lab/components/icons/github-copilot";
import { Spinner } from "@/features/lab/components/icons/spinner";
import { Button } from "@/features/lab/components/ui/button";
import { toast } from "@/features/lab/components/ui/use-toast";
import { getCopilotClient } from "@/features/lab/core/codemirror/copilot/client";
import {
  copilotSignedInState,
  copilotStatusState,
  githubCopilotLoadingVersion,
  isGitHubCopilotSignedInState,
} from "@/features/lab/core/codemirror/copilot/state";
import { resolvedMarimoConfigAtom } from "@/features/lab/core/config/config";
import { useOnMount } from "@/features/lab/hooks/useLifecycle";
import { cn } from "@/features/lab/utils/cn";
import { prettyError } from "@/features/lab/utils/errors";
import { Logger } from "@/features/lab/utils/Logger";
import { FooterItem } from "../footer-item";

const copilotAtom = atom((get) => {
  return get(resolvedMarimoConfigAtom).completion.copilot;
});

export const CopilotStatusIcon: React.FC = () => {
  const copilot = useAtomValue(copilotAtom);

  // We only show an icon for GitHub Copilot, but not for other copilot providers,
  // this can be extended in the future
  if (copilot === "github") {
    return <GitHubCopilotStatus />;
  }

  return null;
};

const logger = Logger.get("[copilot-status-bar]");

const GitHubCopilotStatus: React.FC = () => {
  const isGitHubCopilotSignedIn = useAtomValue(isGitHubCopilotSignedInState);
  const isLoading = useAtomValue(githubCopilotLoadingVersion) !== null;
  const status = useAtomValue(copilotStatusState);
  const { handleClick } = useOpenSettingsToTab();
  const openSettings = () => handleClick("ai");

  // Build label from status
  let label = isGitHubCopilotSignedIn ? "Ready" : "Not connected";
  if (status.message) {
    label = status.message;
  } else if (status.busy) {
    label = "Processing...";
  }

  const setCopilotSignedIn = useSetAtom(isGitHubCopilotSignedInState);
  const setStep = useSetAtom(copilotSignedInState);

  // Check connection on mount
  useOnMount(() => {
    const client = getCopilotClient();
    let mounted = true;

    const checkConnection = async () => {
      try {
        // If we fail to initialize, show connection error
        await client.initializePromise.catch((error) => {
          logger.error("Failed to initialize", error);
          client.close();
          throw error;
        });

        if (!mounted) {
          return;
        }

        const signedIn = await client.signedIn();
        if (!mounted) {
          return;
        }

        setCopilotSignedIn(signedIn);
        setStep(signedIn ? "signedIn" : "signedOut");
      } catch (error) {
        if (!mounted) {
          return;
        }
        logger.warn("Connection failed", error);
        setCopilotSignedIn(false);
        setStep("connectionError");
        toast({
          title: "GitHub Copilot Connection Error",
          description: (
            <>
              {" "}
              <div>
                Failed to connect to GitHub Copilot. Check settings and try
                again.
              </div>
              <br />
              <div className="text-sm font-mono whitespace-pre-wrap">
                {prettyError(error)}
              </div>
            </>
          ),
          variant: "danger",
          action: (
            <Button variant="link" onClick={openSettings}>
              Settings
            </Button>
          ),
        });
      }
    };

    checkConnection();

    return () => {
      mounted = false;
    };
  });

  // Determine icon color based on status
  const iconColorClass =
    status.kind === "Warning" || status.kind === "Error"
      ? "text-(--yellow-11)"
      : isGitHubCopilotSignedIn
        ? ""
        : "opacity-60";

  return (
    <FooterItem
      tooltip={
        <div className="max-w-[200px]">
          <b>GitHub Copilot:</b> {label}
          {status.kind && (
            <>
              <br />
              <span className="pt-1 text-xs">Status: {status.kind}</span>
            </>
          )}
        </div>
      }
      selected={false}
      onClick={openSettings}
      data-testid="footer-copilot-status"
    >
      <span>
        {isLoading || status.busy ? (
          <Spinner className="h-4 w-4" />
        ) : (
          <GitHubCopilotIcon className={cn("h-4 w-4", iconColorClass)} />
        )}
      </span>
    </FooterItem>
  );
};
