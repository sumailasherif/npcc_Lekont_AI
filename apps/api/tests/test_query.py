def test_covered_question_returns_citations(client) -> None:
    response = client.post(
        "/api/v1/query",
        json={"question": "How do I clear a thread jam on the overlock machine?"},
    )
    assert response.status_code == 200
    body = response.json()
    assert body["covered"] is True
    assert body["citations"]
    assert body["confidence"] > 0


def test_uncovered_question_becomes_a_gap(client) -> None:
    response = client.post(
        "/api/v1/query",
        json={"question": "What is the canteen menu for the night shift?"},
    )
    assert response.status_code == 200
    body = response.json()
    assert body["covered"] is False
    assert body["citations"] == []
    assert body["gap_id"]


def test_translation_is_returned_in_requested_language(client) -> None:
    response = client.post(
        "/api/v1/query",
        json={
            "question": "How do I stop the overlock machine before clearing a jam?",
            "language": "fr",
        },
    )
    body = response.json()
    assert body["language"] == "fr"
    assert body["covered"] is True
