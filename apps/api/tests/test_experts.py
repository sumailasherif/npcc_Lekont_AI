def test_experts_are_listed(client) -> None:
    response = client.get("/api/v1/experts")
    assert response.status_code == 200
    experts = response.json()
    assert len(experts) >= 8
    assert any(expert["mauritian"] for expert in experts)
    assert any(not expert["mauritian"] for expert in experts)


def test_mauritian_experts_come_first(client) -> None:
    experts = client.get("/api/v1/experts").json()
    assert experts[0]["mauritian"] is True


def test_search_filters_experts(client) -> None:
    response = client.get("/api/v1/experts", params={"q": "textile"})
    experts = response.json()
    assert experts
    assert all(
        "textile"
        in " ".join(
            [expert["name"], expert["role"], expert["organisation"], *expert["topics"]]
        ).lower()
        for expert in experts
    )


def test_expert_chat_is_grounded(client) -> None:
    response = client.post(
        "/api/v1/experts/textile-ops-veteran/chat",
        json={"message": "How do I clear a thread jam on an overlock machine?"},
    )
    assert response.status_code == 200
    body = response.json()
    assert body["citations"]
    assert "thread" in body["answer"].lower() or "fil" in body["answer"].lower()
    assert body["engine"] in {"knowledge", "llm"}


def test_expert_chat_translates_live(client) -> None:
    response = client.post(
        "/api/v1/experts/textile-ops-veteran/chat",
        json={
            "message": "How do I clear a thread jam on an overlock machine?",
            "language": "fr",
        },
    )
    body = response.json()
    assert body["language"] == "fr"
    assert body["answer"]


def test_unknown_expert_returns_404(client) -> None:
    assert client.get("/api/v1/experts/nobody").status_code == 404
