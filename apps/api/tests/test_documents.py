def test_documents_are_seeded(client) -> None:
    response = client.get("/api/v1/documents")
    assert response.status_code == 200
    documents = response.json()
    assert len(documents) >= 6
    assert any(document["status"] == "needs_review" for document in documents)
    assert any(document["doc_type"] == "invoice" for document in documents)


def test_invoice_fields_are_extracted(client) -> None:
    response = client.get("/api/v1/documents/doc-inv-014")
    body = response.json()
    assert body["supplier"] == "Island Packaging Ltd"
    assert body["total"] == 48875.0
    assert body["currency"] == "MUR"
    keys = {field["key"] for field in body["fields"]}
    assert {"supplier", "invoice_no", "total"} <= keys


def test_create_and_review_document(client) -> None:
    created = client.post(
        "/api/v1/documents",
        json={
            "filename": "invoice_test.pdf",
            "doc_type": "invoice",
            "language": "en",
            "text": (
                "INVOICE\nSupplier: Test Supplies Ltd\nInvoice No: INV-TEST-1\n"
                "Date: 01/11/2026\nCurrency: MUR\nSubtotal: 1,000.00\n"
                "VAT (15%): 150.00\nTotal: 1,150.00\n"
            ),
        },
    )
    assert created.status_code == 201
    body = created.json()
    assert body["status"] == "needs_review"
    assert body["total"] == 1150.0

    reviewed = client.post(
        f"/api/v1/documents/{body['id']}/review",
        json={"reviewer": "test.accountant", "fields": [{"key": "total", "value": "1,200.00"}]},
    )
    assert reviewed.status_code == 200
    assert reviewed.json()["status"] == "approved"
    assert reviewed.json()["total"] == 1200.0


def test_export_csv(client) -> None:
    response = client.get("/api/v1/documents/export")
    body = response.json()
    assert body["rows"] >= 6
    assert "document_id" in body["csv"]


def test_missing_document_returns_404(client) -> None:
    assert client.get("/api/v1/documents/nope").status_code == 404
