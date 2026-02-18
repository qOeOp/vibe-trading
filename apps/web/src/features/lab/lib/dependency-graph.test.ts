/**
 * dependency-graph.ts — TDD tests
 * DAG construction, topological sort, downstream propagation
 */

import {
  buildDependencyGraph,
  topologicalSort,
  getDownstreamCells,
} from "./dependency-graph";

// --- buildDependencyGraph ---

describe("buildDependencyGraph", () => {
  it("returns empty graph for no cells", () => {
    const graph = buildDependencyGraph([]);
    expect(graph.size).toBe(0);
  });

  it("returns graph with no edges for independent cells", () => {
    const cells = [
      { id: "a", defines: ["x"], uses: [] },
      { id: "b", defines: ["y"], uses: [] },
    ];
    const graph = buildDependencyGraph(cells);
    expect(graph.get("a")).toEqual(new Set());
    expect(graph.get("b")).toEqual(new Set());
  });

  it("creates edge when cell B uses variable defined by cell A", () => {
    const cells = [
      { id: "a", defines: ["close"], uses: [] },
      { id: "b", defines: ["factor"], uses: ["close"] },
    ];
    const graph = buildDependencyGraph(cells);
    // a → b (b depends on a's output)
    expect(graph.get("a")).toEqual(new Set(["b"]));
    expect(graph.get("b")).toEqual(new Set());
  });

  it("creates multiple edges for multi-step pipeline", () => {
    // a defines close → b uses close, defines factor → c uses factor
    const cells = [
      { id: "a", defines: ["close"], uses: [] },
      { id: "b", defines: ["factor"], uses: ["close"] },
      { id: "c", defines: ["result"], uses: ["factor"] },
    ];
    const graph = buildDependencyGraph(cells);
    expect(graph.get("a")).toEqual(new Set(["b"]));
    expect(graph.get("b")).toEqual(new Set(["c"]));
    expect(graph.get("c")).toEqual(new Set());
  });

  it("handles diamond dependency pattern", () => {
    // a → b, a → c, b → d, c → d
    const cells = [
      { id: "a", defines: ["data"], uses: [] },
      { id: "b", defines: ["x"], uses: ["data"] },
      { id: "c", defines: ["y"], uses: ["data"] },
      { id: "d", defines: ["z"], uses: ["x", "y"] },
    ];
    const graph = buildDependencyGraph(cells);
    expect(graph.get("a")).toEqual(new Set(["b", "c"]));
    expect(graph.get("b")).toEqual(new Set(["d"]));
    expect(graph.get("c")).toEqual(new Set(["d"]));
    expect(graph.get("d")).toEqual(new Set());
  });

  it("does not create self-edges when cell defines and uses same variable", () => {
    const cells = [{ id: "a", defines: ["x"], uses: ["x"] }];
    const graph = buildDependencyGraph(cells);
    expect(graph.get("a")).toEqual(new Set());
  });

  it("ignores uses that no cell defines (external imports)", () => {
    const cells = [
      { id: "a", defines: ["factor"], uses: ["np", "pd", "close"] },
    ];
    const graph = buildDependencyGraph(cells);
    expect(graph.get("a")).toEqual(new Set());
  });
});

// --- topologicalSort ---

describe("topologicalSort", () => {
  it("returns empty array for empty graph", () => {
    const graph = new Map<string, Set<string>>();
    expect(topologicalSort(graph, [])).toEqual([]);
  });

  it("returns cells in order for linear chain", () => {
    const graph = new Map<string, Set<string>>([
      ["a", new Set(["b"])],
      ["b", new Set(["c"])],
      ["c", new Set()],
    ]);
    const result = topologicalSort(graph, ["a", "b", "c"]);
    expect(result.indexOf("a")).toBeLessThan(result.indexOf("b"));
    expect(result.indexOf("b")).toBeLessThan(result.indexOf("c"));
  });

  it("returns valid order for diamond pattern", () => {
    const graph = new Map<string, Set<string>>([
      ["a", new Set(["b", "c"])],
      ["b", new Set(["d"])],
      ["c", new Set(["d"])],
      ["d", new Set()],
    ]);
    const result = topologicalSort(graph, ["a", "b", "c", "d"]);
    expect(result.indexOf("a")).toBeLessThan(result.indexOf("b"));
    expect(result.indexOf("a")).toBeLessThan(result.indexOf("c"));
    expect(result.indexOf("b")).toBeLessThan(result.indexOf("d"));
    expect(result.indexOf("c")).toBeLessThan(result.indexOf("d"));
  });

  it("handles independent cells (no edges)", () => {
    const graph = new Map<string, Set<string>>([
      ["a", new Set()],
      ["b", new Set()],
      ["c", new Set()],
    ]);
    const result = topologicalSort(graph, ["a", "b", "c"]);
    expect(result).toHaveLength(3);
    expect(new Set(result)).toEqual(new Set(["a", "b", "c"]));
  });

  it("throws on circular dependency", () => {
    const graph = new Map<string, Set<string>>([
      ["a", new Set(["b"])],
      ["b", new Set(["a"])],
    ]);
    expect(() => topologicalSort(graph, ["a", "b"])).toThrow(/circular/i);
  });

  it("throws on indirect circular dependency", () => {
    const graph = new Map<string, Set<string>>([
      ["a", new Set(["b"])],
      ["b", new Set(["c"])],
      ["c", new Set(["a"])],
    ]);
    expect(() => topologicalSort(graph, ["a", "b", "c"])).toThrow(/circular/i);
  });

  it("sorts only the subset of cellIds provided", () => {
    const graph = new Map<string, Set<string>>([
      ["a", new Set(["b"])],
      ["b", new Set(["c"])],
      ["c", new Set()],
    ]);
    const result = topologicalSort(graph, ["b", "c"]);
    expect(result).toHaveLength(2);
    expect(result.indexOf("b")).toBeLessThan(result.indexOf("c"));
  });
});

// --- getDownstreamCells ---

describe("getDownstreamCells", () => {
  it("returns empty set for cell with no dependents", () => {
    const graph = new Map<string, Set<string>>([
      ["a", new Set()],
      ["b", new Set()],
    ]);
    const result = getDownstreamCells(graph, "a");
    expect(result).toEqual(new Set());
  });

  it("returns direct dependents", () => {
    const graph = new Map<string, Set<string>>([
      ["a", new Set(["b", "c"])],
      ["b", new Set()],
      ["c", new Set()],
    ]);
    const result = getDownstreamCells(graph, "a");
    expect(result).toEqual(new Set(["b", "c"]));
  });

  it("returns transitive dependents (BFS propagation)", () => {
    const graph = new Map<string, Set<string>>([
      ["a", new Set(["b"])],
      ["b", new Set(["c"])],
      ["c", new Set(["d"])],
      ["d", new Set()],
    ]);
    const result = getDownstreamCells(graph, "a");
    expect(result).toEqual(new Set(["b", "c", "d"]));
  });

  it("does not include the source cell itself", () => {
    const graph = new Map<string, Set<string>>([
      ["a", new Set(["b"])],
      ["b", new Set()],
    ]);
    const result = getDownstreamCells(graph, "a");
    expect(result).not.toContain("a");
  });

  it("handles diamond pattern without duplicates", () => {
    const graph = new Map<string, Set<string>>([
      ["a", new Set(["b", "c"])],
      ["b", new Set(["d"])],
      ["c", new Set(["d"])],
      ["d", new Set()],
    ]);
    const result = getDownstreamCells(graph, "a");
    expect(result).toEqual(new Set(["b", "c", "d"]));
  });

  it("returns empty set for unknown cell", () => {
    const graph = new Map<string, Set<string>>([["a", new Set(["b"])]]);
    const result = getDownstreamCells(graph, "unknown");
    expect(result).toEqual(new Set());
  });
});
