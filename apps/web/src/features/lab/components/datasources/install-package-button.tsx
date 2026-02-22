/* Copyright 2026 Marimo. All rights reserved. */

import React from "react";
import { Button } from "../ui/button";
import { useInstallPackages } from "@/features/lab/core/packages/useInstallPackage";
import { cn } from "@/features/lab/utils/cn";

interface InstallPackageButtonProps {
  packages: string[] | undefined;
  showMaxPackages?: number;
  className?: string;
  onInstall?: () => void;
}

/**
 * Button to install missing packages
 * Opens the packages panel and focuses the input
 */
export const InstallPackageButton: React.FC<InstallPackageButtonProps> = ({
  packages,
  showMaxPackages,
  className,
  onInstall,
}) => {
  const { handleInstallPackages } = useInstallPackages();

  if (!packages || packages.length === 0) {
    return null;
  }

  return (
    <Button
      variant="outline"
      size="xs"
      onClick={() => {
        handleInstallPackages(packages, onInstall);
      }}
      className={cn("ml-2", className)}
    >
      Install{" "}
      {showMaxPackages
        ? packages.slice(0, showMaxPackages).join(", ")
        : packages.join(", ")}
    </Button>
  );
};
