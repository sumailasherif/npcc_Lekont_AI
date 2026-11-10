"""Write api-spec/openapi.json from the running FastAPI app."""

import json
from pathlib import Path

from app.main import app


def main() -> None:
    repo_root = Path(__file__).resolve().parents[4]
    target = repo_root / "api-spec" / "openapi.json"
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(json.dumps(app.openapi(), indent=2) + "\n", encoding="utf-8")
    print(f"wrote {target}")


if __name__ == "__main__":
    main()
