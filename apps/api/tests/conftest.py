import os

# Keep tests offline and deterministic: never call a real LLM from the suite.
os.environ["OPENCODE_GO_API_KEY"] = ""

from collections.abc import Iterator

import pytest
from app.main import app
from fastapi.testclient import TestClient


@pytest.fixture(scope="session")
def client() -> Iterator[TestClient]:
    with TestClient(app) as test_client:
        yield test_client
