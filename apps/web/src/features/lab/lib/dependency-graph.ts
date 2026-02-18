/**
 * dependency-graph.ts — Reactive DAG for cell-based notebook
 *
 * Builds a directed acyclic graph from cell definitions/uses,
 * provides topological sort for execution order,
 * and downstream propagation for reactive re-execution.
 */

type CellInfo = {
  id: string;
  defines: string[];
  uses: string[];
};

/**
 * Build a directed graph where an edge A → B means
 * "cell A defines a variable that cell B uses".
 *
 * Returns Map<cellId, Set<dependentCellIds>>.
 */
export function buildDependencyGraph(
  cells: CellInfo[],
): Map<string, Set<string>> {
  const graph = new Map<string, Set<string>>();

  // Initialize every cell with empty edge set
  for (const cell of cells) {
    graph.set(cell.id, new Set());
  }

  // Build a lookup: variableName → cellId that defines it
  const definedBy = new Map<string, string>();
  for (const cell of cells) {
    for (const varName of cell.defines) {
      definedBy.set(varName, cell.id);
    }
  }

  // For each cell, find which other cells define the variables it uses
  for (const cell of cells) {
    for (const varName of cell.uses) {
      const producerId = definedBy.get(varName);
      if (producerId !== undefined && producerId !== cell.id) {
        graph.get(producerId)!.add(cell.id);
      }
    }
  }

  return graph;
}

/**
 * Topological sort using Kahn's algorithm (BFS-based).
 *
 * Only sorts the subset of cellIds provided.
 * Throws if a circular dependency is detected.
 */
export function topologicalSort(
  graph: Map<string, Set<string>>,
  cellIds: string[],
): string[] {
  const subset = new Set(cellIds);

  // Build in-degree map for the subset
  const inDegree = new Map<string, number>();
  for (const id of subset) {
    inDegree.set(id, 0);
  }

  for (const id of subset) {
    const neighbors = graph.get(id);
    if (neighbors) {
      for (const neighbor of neighbors) {
        if (subset.has(neighbor)) {
          inDegree.set(neighbor, (inDegree.get(neighbor) ?? 0) + 1);
        }
      }
    }
  }

  // Seed queue with zero in-degree nodes
  const queue: string[] = [];
  for (const [id, deg] of inDegree) {
    if (deg === 0) {
      queue.push(id);
    }
  }

  const result: string[] = [];

  while (queue.length > 0) {
    const current = queue.shift()!;
    result.push(current);

    const neighbors = graph.get(current);
    if (neighbors) {
      for (const neighbor of neighbors) {
        if (subset.has(neighbor)) {
          const newDeg = (inDegree.get(neighbor) ?? 0) - 1;
          inDegree.set(neighbor, newDeg);
          if (newDeg === 0) {
            queue.push(neighbor);
          }
        }
      }
    }
  }

  if (result.length !== subset.size) {
    throw new Error(
      "Circular dependency detected: could not complete topological sort",
    );
  }

  return result;
}

/**
 * Find all downstream (transitive) dependents of a cell via BFS.
 * Does NOT include the source cell itself.
 */
export function getDownstreamCells(
  graph: Map<string, Set<string>>,
  cellId: string,
): Set<string> {
  const visited = new Set<string>();
  const queue: string[] = [];

  const directNeighbors = graph.get(cellId);
  if (!directNeighbors) {
    return visited;
  }

  for (const neighbor of directNeighbors) {
    if (!visited.has(neighbor)) {
      visited.add(neighbor);
      queue.push(neighbor);
    }
  }

  while (queue.length > 0) {
    const current = queue.shift()!;
    const neighbors = graph.get(current);
    if (neighbors) {
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push(neighbor);
        }
      }
    }
  }

  return visited;
}
