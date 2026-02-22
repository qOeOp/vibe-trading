/* Copyright 2026 Marimo. All rights reserved. */

import { useAtomValue } from "jotai";
import React from "react";
import { documentationAtom } from "@/features/lab/core/documentation/state";
import { renderHTML } from "@/features/lab/plugins/core/RenderHTML";
import "@/features/lab/components/editor/documentation.css";
import { TextSearchIcon } from "lucide-react";
import { PanelEmptyState } from "./empty-state";

const DocumentationPanel: React.FC = () => {
  const { documentation } = useAtomValue(documentationAtom);

  if (!documentation) {
    return (
      <PanelEmptyState
        title="View docs as you type"
        description="Move your text cursor over a symbol to see its documentation."
        icon={<TextSearchIcon />}
      />
    );
  }

  return (
    <div className="p-3 overflow-y-auto overflow-x-hidden h-full docs-documentation flex flex-col gap-4">
      {renderHTML({ html: documentation })}
    </div>
  );
};

export default DocumentationPanel;
