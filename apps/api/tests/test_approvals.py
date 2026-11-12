def test_invoice_creates_a_pending_approval(client) -> None:
    body = client.post(
        "/api/v1/whatsapp/simulate",
        json={"from_number": "23050000020", "text": "invoice Aisha 2500"},
    ).json()
    assert body["intent"] == "invoice"
    approval_id = body["data"]["approval_id"]
    assert approval_id

    approvals = client.get("/api/v1/approvals").json()
    assert any(item["id"] == approval_id and item["status"] == "pending" for item in approvals)


def test_head_of_finance_approves_invoice(client) -> None:
    body = client.post(
        "/api/v1/whatsapp/simulate",
        json={"from_number": "23050000020", "text": "invoice Dev 4200"},
    ).json()
    approval_id = body["data"]["approval_id"]
    document_id = body["data"]["document_id"]

    decided = client.post(
        f"/api/v1/approvals/{approval_id}/approve",
        json={"reviewer": "A. Runghen (Head of Finance)", "comment": "Checked the PO"},
    )
    assert decided.status_code == 200
    assert decided.json()["status"] == "approved"
    assert decided.json()["reviewer"].startswith("A. Runghen")

    document = client.get(f"/api/v1/documents/{document_id}").json()
    assert document["status"] == "approved"


def test_reject_leaves_the_document_in_review(client) -> None:
    body = client.post(
        "/api/v1/whatsapp/simulate",
        json={"from_number": "23050000020", "text": "invoice Nisha 1800"},
    ).json()
    approval_id = body["data"]["approval_id"]
    document_id = body["data"]["document_id"]

    decided = client.post(
        f"/api/v1/approvals/{approval_id}/reject",
        json={"reviewer": "A. Runghen (Head of Finance)", "comment": "Missing PO"},
    )
    assert decided.status_code == 200
    assert decided.json()["status"] == "rejected"

    document = client.get(f"/api/v1/documents/{document_id}").json()
    assert document["status"] == "needs_review"


def test_large_sale_needs_approval_and_is_not_recorded(client) -> None:
    body = client.post(
        "/api/v1/whatsapp/simulate",
        json={"from_number": "23050000021", "text": "sold 1 machine at 9000"},
    ).json()
    assert body["intent"] == "sale"
    assert body["data"]["approval_status"] == "pending"
    assert body["data"]["approval_id"]


def test_notebook_over_threshold_needs_approval(client) -> None:
    body = client.post(
        "/api/v1/whatsapp/simulate",
        json={"from_number": "23050000022", "text": "", "kind": "image"},
    ).json()
    assert body["intent"] == "notebook"

    posted = client.post(
        "/api/v1/whatsapp/simulate",
        json={"from_number": "23050000022", "text": "post"},
    ).json()
    assert posted["intent"] == "notebook_post"
    assert posted["data"]["approval_status"] == "pending"
