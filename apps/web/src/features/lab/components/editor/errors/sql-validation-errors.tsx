/* Copyright 2026 Marimo. All rights reserved. */

import { AlertCircleIcon } from "lucide-react";
import type { CellId } from "@/features/lab/core/cells/ids";
import { useSqlValidationErrorsForCell } from "@/features/lab/core/codemirror/language/languages/sql/banner-validation-errors";

export const SqlValidationErrorBanner = ({
  cellId,
  hide,
}: {
  cellId: CellId;
  hide: boolean;
}) => {
  const error = useSqlValidationErrorsForCell(cellId);

  if (!error || hide) {
    return;
  }

  return (
    <div className="p-3 text-sm flex flex-col text-mine-muted gap-1.5 bg-destructive/4">
      <div className="flex items-start gap-1.5">
        <AlertCircleIcon size={13} className="mt-[3px] text-destructive" />
        <p>
          <span className="font-bold text-destructive">{error.errorType}:</span>{" "}
          <span className="whitespace-pre-wrap">{error.errorMessage}</span>
        </p>
      </div>

      {error.codeblock && (
        <pre
          lang="sql"
          className="text-xs bg-mine-hover/80 rounded p-2 pb-0 mx-3 font-medium whitespace-pre-wrap"
        >
          {error.codeblock}
        </pre>
      )}
    </div>
  );
};
