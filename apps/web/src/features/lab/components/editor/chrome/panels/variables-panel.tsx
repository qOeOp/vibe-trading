/* Copyright 2026 Marimo. All rights reserved. */

import React from 'react';
import { VariableTable } from '@/features/lab/components/variables/variables-table';
import { useCellIds } from '@/features/lab/core/cells/cells';
import { useVariables } from '@/features/lab/core/variables/state';

const VariablesPanel: React.FC = () => {
  const variables = useVariables();
  const cellIds = useCellIds();

  if (Object.keys(variables).length === 0) {
    return (
      <div className="px-3 py-4 text-sm text-muted-foreground">
        No variables defined
      </div>
    );
  }

  return <VariableTable cellIds={cellIds.inOrderIds} variables={variables} />;
};

export default VariablesPanel;
