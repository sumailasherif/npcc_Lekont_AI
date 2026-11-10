def test_seeded_step_translates_to_french_from_memory(client) -> None:
    response = client.post(
        "/api/v1/translate",
        json={
            "text": "Press the red stop button and wait until the machine is fully still.",
            "target_language": "fr",
        },
    )
    assert response.status_code == 200
    body = response.json()
    assert body["engine"] == "memory"
    assert body["target_language"] == "fr"
    assert body["translated_text"].lower() != body["source_text"].lower()
    assert body["review_required"] is False


def test_kreol_is_flagged_for_review(client) -> None:
    response = client.post(
        "/api/v1/translate",
        json={
            "text": "Press the red stop button and wait until the machine is fully still.",
            "target_language": "cr",
        },
    )
    body = response.json()
    assert body["engine"] == "memory"
    assert body["review_required"] is True


def test_unknown_text_falls_back_to_glossary(client) -> None:
    response = client.post(
        "/api/v1/translate",
        json={"text": "Check the machine and call the supervisor", "target_language": "fr"},
    )
    body = response.json()
    assert body["engine"] == "glossary"
    assert body["review_required"] is True
    assert body["confidence"] < 0.6


def test_english_target_is_identity(client) -> None:
    response = client.post(
        "/api/v1/translate",
        json={"text": "Keep the guard closed.", "target_language": "en"},
    )
    body = response.json()
    assert body["engine"] == "identity"
    assert body["translated_text"] == "Keep the guard closed."
