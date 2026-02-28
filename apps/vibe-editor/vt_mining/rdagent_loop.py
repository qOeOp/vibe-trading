"""vt_mining/rdagent_loop.py — VT-customized FactorRDLoop.

Subclasses upstream FactorRDLoop to inject structured callbacks at each
step of the R&D loop, replacing the previous approach of parsing ANSI-coloured
log files after the fact.

Data flow:
  direct_exp_gen → hypothesis captured → rounds.json updated
  running        → factor code + task metadata captured → factors.jsonl appended
  feedback       → progress.json updated with loop counters

This module is only imported inside the rdagent conda env subprocess.
"""
from __future__ import annotations

import csv
import json
import logging
import os
import time
from pathlib import Path
from typing import Any

logger = logging.getLogger(__name__)


class VTFactorRDLoop:
    """Mixin applied on top of FactorRDLoop to add structured data capture.

    Usage (imported lazily inside worker subprocess after rdagent is available):

        from rdagent.app.qlib_rd_loop.factor import FactorRDLoop
        from vt_mining.rdagent_loop import VTFactorRDLoop

        class _Loop(VTFactorRDLoop, FactorRDLoop):
            pass

        loop = _Loop(FACTOR_PROP_SETTING, result_dir=config.result_dir, max_loops=config.max_loops)
        asyncio.run(loop.run(loop_n=config.max_loops))

    The MRO ensures VTFactorRDLoop overrides run before FactorRDLoop.
    """

    def __init__(self, *args, result_dir: str = "", max_loops: int = 10, **kwargs):
        self._vt_result_dir = result_dir
        self._vt_max_loops = max_loops
        self._vt_rounds: list[dict] = []
        self._vt_loop_idx = 0
        self._vt_factors_accepted = 0
        self._vt_factors_rejected = 0
        super().__init__(*args, **kwargs)

    # ── Step overrides ──────────────────────────────────────────────────────

    async def direct_exp_gen(self, prev_out: dict[str, Any]) -> dict[str, Any]:
        """Override: capture hypothesis immediately after LLM generates it."""
        result = await super().direct_exp_gen(prev_out)

        hypo = result.get("propose")
        if hypo is not None:
            entry = {
                "roundIndex": self._vt_loop_idx,
                "hypothesis": getattr(hypo, "hypothesis", ""),
                "reason": getattr(hypo, "reason", ""),
                "conciseReason": getattr(hypo, "concise_reason", ""),
                "conciseObservation": getattr(hypo, "concise_observation", ""),
                "conciseJustification": getattr(hypo, "concise_justification", ""),
                "conciseKnowledge": getattr(hypo, "concise_knowledge", ""),
                "timestamp": time.time(),
            }
            self._vt_rounds.append(entry)
            self._write_rounds()
            logger.info(
                "VT: Captured hypothesis for round %d: %.80s...",
                self._vt_loop_idx,
                entry["hypothesis"],
            )

        self._write_progress(currentStep="coding")
        return result

    def coding(self, prev_out: dict[str, Any]) -> Any:
        """Override: pass through, update progress."""
        self._write_progress(currentStep="coding")
        return super().coding(prev_out)

    def running(self, prev_out: dict[str, Any]) -> Any:
        """Override: capture per-factor metadata + code after qlib evaluation."""
        self._write_progress(currentStep="evaluating")
        exp = super().running(prev_out)

        if exp is None:
            return exp

        # Extract factors from experiment object
        self._extract_factors_from_exp(exp)
        self._vt_loop_idx += 1
        self._write_progress(currentStep="feedback")
        return exp

    def feedback(self, prev_out: dict[str, Any]) -> Any:
        """Override: update progress after feedback generation."""
        result = super().feedback(prev_out)
        self._write_progress(currentStep="proposing")
        return result

    # ── Internal helpers ─────────────────────────────────────────────────────

    def _extract_factors_from_exp(self, exp: Any) -> None:
        """Extract factor code, metadata, and IC metrics from a completed Experiment.

        exp.sub_tasks:          list[FactorTask] — task metadata (name, desc, formulation)
        exp.sub_workspace_list: list[FactorFBWorkspace | None] — generated code
        exp.experiment_workspace: QlibFBWorkspace — combined qlib backtest results
        """
        sub_tasks = getattr(exp, "sub_tasks", []) or []
        sub_ws = getattr(exp, "sub_workspace_list", []) or []

        # Read combined IC metrics from qlib backtest
        combined_metrics = self._read_combined_metrics(exp)

        # Round-level hypothesis (from rounds list, matching current loop index)
        current_round = self._vt_rounds[-1] if self._vt_rounds else {}
        hypothesis = current_round.get("hypothesis", "")
        reason = current_round.get("reason", "")

        for i, task in enumerate(sub_tasks):
            name = getattr(task, "factor_name", None) or getattr(task, "name", f"factor_{i}")
            description = getattr(task, "factor_description", "") or getattr(task, "description", "")
            formulation = getattr(task, "factor_formulation", "")
            variables = getattr(task, "variables", {})

            # Get generated code from workspace
            code = ""
            if i < len(sub_ws) and sub_ws[i] is not None:
                file_dict = getattr(sub_ws[i], "file_dict", {}) or {}
                code = file_dict.get("factor.py", "")

            ic = combined_metrics.get("IC", 0.0)
            accepted = ic > 0.01

            if accepted:
                self._vt_factors_accepted += 1
            else:
                self._vt_factors_rejected += 1

            self._append_factor(
                name=name,
                code=code,
                description=description,
                formulation=formulation,
                variables=str(variables) if isinstance(variables, dict) else (variables or ""),
                hypothesis=hypothesis,
                reason=reason,
                metrics={
                    "ic": ic,
                    "icir": combined_metrics.get("ICIR", 0.0),
                    "rankIc": combined_metrics.get("Rank IC", 0.0),
                    "rankIcir": combined_metrics.get("Rank ICIR", 0.0),
                    "annualizedReturn": combined_metrics.get(
                        "1day.excess_return_without_cost.annualized_return", 0.0
                    ),
                    "maxDrawdown": combined_metrics.get(
                        "1day.excess_return_without_cost.max_drawdown", 0.0
                    ),
                    "sharpe": combined_metrics.get(
                        "1day.excess_return_without_cost.information_ratio", 0.0
                    ),
                },
                accepted=accepted,
                generation=self._vt_loop_idx,
            )
            logger.info(
                "VT: Captured factor %r (IC=%.4f accepted=%s)",
                name, ic, accepted,
            )

    def _read_combined_metrics(self, exp: Any) -> dict[str, float]:
        """Read IC metrics from qlib_res.csv in the experiment workspace.

        Falls back to scanning the result_dir subtree for any qlib_res.csv.
        """
        metrics: dict[str, float] = {}

        # Try experiment_workspace first
        ew = getattr(exp, "experiment_workspace", None)
        if ew is not None:
            ws_path = getattr(ew, "workspace_path", None)
            if ws_path:
                csv_path = Path(ws_path) / "qlib_res.csv"
                if csv_path.exists():
                    return self._parse_qlib_res_csv(csv_path)

        # Fallback: scan workspace dir for any qlib_res.csv with non-zero IC
        ws_root = Path(os.environ.get("WORKSPACE_PATH", self._vt_result_dir))
        for csv_path in ws_root.rglob("qlib_res.csv"):
            m = self._parse_qlib_res_csv(csv_path)
            if m.get("IC", 0.0) != 0.0:
                return m

        return metrics

    @staticmethod
    def _parse_qlib_res_csv(csv_path: Path) -> dict[str, float]:
        """Parse rdagent's qlib_res.csv into {metric_name: value}."""
        metrics: dict[str, float] = {}
        try:
            with open(csv_path) as f:
                reader = csv.reader(f)
                next(reader, None)  # skip header ",0"
                for row in reader:
                    if len(row) >= 2:
                        try:
                            metrics[row[0].strip()] = float(row[1].strip())
                        except ValueError:
                            pass
        except Exception as exc:
            logger.warning("Could not parse qlib_res.csv at %s: %s", csv_path, exc)
        return metrics

    def _append_factor(self, **kwargs: Any) -> None:
        path = os.path.join(self._vt_result_dir, "factors.jsonl")
        with open(path, "a") as f:
            f.write(json.dumps(kwargs) + "\n")

    def _write_rounds(self) -> None:
        path = os.path.join(self._vt_result_dir, "rounds.json")
        try:
            with open(path, "w") as f:
                json.dump(self._vt_rounds, f)
        except OSError as exc:
            logger.warning("Could not write rounds.json: %s", exc)

    def _write_progress(self, currentStep: str = "") -> None:
        path = os.path.join(self._vt_result_dir, "progress.json")
        n_factors = self._vt_factors_accepted + self._vt_factors_rejected
        try:
            with open(path, "w") as f:
                json.dump(
                    {
                        "currentLoop": self._vt_loop_idx,
                        "maxLoops": self._vt_max_loops,
                        "currentStep": currentStep,
                        "factorsDiscovered": n_factors,
                        "factorsAccepted": self._vt_factors_accepted,
                        "factorsRejected": self._vt_factors_rejected,
                        "timestamp": time.time(),
                    },
                    f,
                )
        except OSError as exc:
            logger.warning("Could not write progress.json: %s", exc)


# Module-level placeholder — populated by _make_loop_class() at runtime.
# Must be at module level for pickle to resolve the class by qualified name.
VTFactorLoop = None


def _make_loop_class(FactorRDLoop):
    """Create VTFactorLoop at module level so pickle can serialize it.

    FactorRDLoop is only importable inside the rdagent conda env, so we
    can't define the combined class at import time. Instead, we create it
    here and bind it to the module global so pickle finds it by name:
      vt_mining.rdagent_loop.VTFactorLoop
    """
    global VTFactorLoop
    if VTFactorLoop is not None:
        return  # already created

    class VTFactorLoop(VTFactorRDLoop, FactorRDLoop):  # noqa: F811
        """VTFactorRDLoop + FactorRDLoop combined.

        Defined at module level so pickle can serialize it for LoopBase checkpointing.
        MRO: VTFactorLoop → VTFactorRDLoop → FactorRDLoop → RDLoop → LoopBase
        """

    # Bind to module-level name so pickle resolves "vt_mining.rdagent_loop.VTFactorLoop"
    import vt_mining.rdagent_loop as _self
    _self.VTFactorLoop = VTFactorLoop
