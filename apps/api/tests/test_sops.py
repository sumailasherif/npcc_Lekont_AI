def test_published_sops_are_listed(client) -> None:
    response = client.get("/api/v1/sops")
    assert response.status_code == 200
    assert len(response.json()) >= 3


def test_sop_lifecycle(client) -> None:
    created = client.post(
        "/api/v1/sops",
        json={
            "title": "Change the needle on the overlock machine",
            "sector": "textile",
            "role_id": "senior_operator",
            "machine_id": "overlock-02",
        },
    )
    assert created.status_code == 201
    sop_id = created.json()["id"]

    generated = client.post(f"/api/v1/sops/{sop_id}/generate")
    assert generated.json()["status"] == "generated"

    reviewed = client.post(f"/api/v1/sops/{sop_id}/submit")
    assert reviewed.json()["status"] == "in_review"

    approved = client.post(
        f"/api/v1/sops/{sop_id}/approve",
        json={"reviewer": "test.supervisor"},
    )
    assert approved.status_code == 200
    body = approved.json()
    assert body["status"] == "published"
    assert body["version"] == 1
    assert body["approved_by"] == "test.supervisor"


def test_missing_sop_returns_404(client) -> None:
    assert client.get("/api/v1/sops/does-not-exist").status_code == 404


def test_gaps_are_listed(client) -> None:
    response = client.get("/api/v1/gaps")
    assert response.status_code == 200
    assert response.json()


def test_analytics_summary(client) -> None:
    response = client.get("/api/v1/analytics/summary")
    assert response.status_code == 200
    assert response.json()["sops_published"] >= 3
