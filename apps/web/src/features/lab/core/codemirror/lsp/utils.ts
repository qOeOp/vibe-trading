/* Copyright 2026 Marimo. All rights reserved. */
import { getFilenameFromDOM } from "../../dom/htmlUtils";
import { Paths } from "../../../utils/paths";

export function getLSPDocument() {
  return `file://${getFilenameFromDOM() ?? "/__marimo_notebook__.py"}`;
}

export function getLSPDocumentRootUri() {
  return `file://${Paths.dirname(getFilenameFromDOM() ?? "/")}`;
}
