#!/usr/bin/env python3
"""Export ConsultAI OS playbook stages to Excel for sharing."""

from __future__ import annotations

import json
from pathlib import Path

from openpyxl import Workbook
from openpyxl.styles import Alignment, Font

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "app" / "src" / "data" / "consultingOs.ts"
OUT = ROOT / "ConsultAI OS Playbook.xlsx"


def parse_stages_from_typescript(source: str) -> list[dict[str, object]]:
    """Minimal extraction is brittle; prefer JSON sidecar when present."""
    sidecar = ROOT / "app" / "src" / "data" / "consultingOs.stages.json"
    if sidecar.exists():
        return json.loads(sidecar.read_text(encoding="utf-8"))
    raise FileNotFoundError(
        f"Missing {sidecar}. Run: node scripts/dump_consulting_stages.mjs"
    )


def write_workbook(stages: list[dict[str, object]], destination: Path) -> None:
    workbook = Workbook()
    sheet = workbook.active
    sheet.title = "Consulting Stages"
    headers = [
        "Stage Number",
        "Short Label",
        "Title",
        "Purpose",
        "Gate",
        "Gate Criteria",
        "Frameworks",
        "Actions",
        "Deliverables",
        "Questions Answered",
        "Journey Label",
    ]
    sheet.append(headers)
    for cell in sheet[1]:
        cell.font = Font(bold=True)
        cell.alignment = Alignment(wrap_text=True, vertical="top")

    for stage in stages:
        sheet.append(
            [
                stage.get("number"),
                stage.get("shortLabel"),
                stage.get("title"),
                stage.get("purpose"),
                stage.get("gate"),
                " | ".join(stage.get("gateCriteria", [])),  # type: ignore[arg-type]
                " | ".join(stage.get("frameworks", [])),  # type: ignore[arg-type]
                " | ".join(stage.get("actions", [])),  # type: ignore[arg-type]
                " | ".join(stage.get("deliverables", [])),  # type: ignore[arg-type]
                " | ".join(stage.get("questionsAnswered", [])),  # type: ignore[arg-type]
                stage.get("journeyLabel"),
            ]
        )

    for column in sheet.columns:
        max_length = 12
        column_letter = column[0].column_letter
        for cell in column:
            cell.alignment = Alignment(wrap_text=True, vertical="top")
            value = str(cell.value or "")
            max_length = max(max_length, min(len(value), 60))
        sheet.column_dimensions[column_letter].width = max_length

    situations = workbook.create_sheet("Business Situations")
    situations.append(["Situation ID", "Label", "Recommended Stages", "Recommended Frameworks"])
    for cell in situations[1]:
        cell.font = Font(bold=True)

    situations_path = ROOT / "app" / "src" / "data" / "consultingOs.situations.json"
    if situations_path.exists():
        for situation in json.loads(situations_path.read_text(encoding="utf-8")):
            situations.append(
                [
                    situation.get("id"),
                    situation.get("label"),
                    " | ".join(situation.get("recommendedStageIds", [])),
                    " | ".join(situation.get("recommendedFrameworks", [])),
                ]
            )

    workbook.save(destination)


def main() -> None:
    stages = parse_stages_from_typescript(DATA.read_text(encoding="utf-8"))
    write_workbook(stages, OUT)
    print(f"Wrote {OUT}")


if __name__ == "__main__":
    main()
