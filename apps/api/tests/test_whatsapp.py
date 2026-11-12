def test_help_menu(client) -> None:
    response = client.post(
        "/api/v1/whatsapp/simulate",
        json={"from_number": "23050000001", "text": "help"},
    )
    assert response.status_code == 200
    body = response.json()
    assert "sold 3 bags" in body["reply"]
    assert body["intent"] == "help"


def test_record_a_sale(client) -> None:
    response = client.post(
        "/api/v1/whatsapp/simulate",
        json={"from_number": "23050000001", "text": "sold 3 bags at 250"},
    )
    body = response.json()
    assert body["intent"] == "sale"
    assert body["data"]["sale"]["total"] == 750.0
    assert "750" in body["reply"]


def test_stock_lists_low_items(client) -> None:
    body = client.post(
        "/api/v1/whatsapp/simulate",
        json={"from_number": "23050000002", "text": "stock"},
    ).json()
    assert body["intent"] == "stock"
    assert "Stock" in body["reply"]
    assert body["data"]["stock"]


def test_invoice_creates_a_document(client) -> None:
    body = client.post(
        "/api/v1/whatsapp/simulate",
        json={"from_number": "23050000003", "text": "invoice Ramesh 2500"},
    ).json()
    assert body["intent"] == "invoice"
    document_id = body["data"]["document_id"]
    document = client.get(f"/api/v1/documents/{document_id}").json()
    assert document["total"] == 2500.0
    assert document["status"] == "needs_review"


def test_report_returns_totals(client) -> None:
    body = client.post(
        "/api/v1/whatsapp/simulate",
        json={"from_number": "23050000004", "text": "report"},
    ).json()
    assert body["intent"] == "report"
    assert body["data"]["month_total"] >= 0


def test_notebook_photo_is_review_only(client) -> None:
    body = client.post(
        "/api/v1/whatsapp/simulate",
        json={"from_number": "23050000005", "text": "", "kind": "image"},
    ).json()
    assert body["intent"] == "notebook"
    assert body["data"]["notebook"]["status"] == "needs_review"


def test_webhook_verification(client) -> None:
    response = client.get(
        "/api/v1/whatsapp/webhook",
        params={
            "hub.mode": "subscribe",
            "hub.verify_token": "lekont-demo",
            "hub.challenge": "12345",
        },
    )
    assert response.status_code == 200
    assert response.text == "12345"


def test_greeting(client) -> None:
    body = client.post(
        "/api/v1/whatsapp/simulate", json={"from_number": "23050000009", "text": "hi"}
    ).json()
    assert body["intent"] == "greeting"
    assert "Lekont" in body["reply"]


def test_ledger_question_falls_through(client) -> None:
    body = client.post(
        "/api/v1/whatsapp/simulate",
        json={"from_number": "23050000009", "text": "who are my top suppliers by spend?"},
    ).json()
    assert body["intent"] == "insight"
    assert body["data"]["insight"]["intent"] == "suppliers"


def test_webhook_accepts_meta_payload(client) -> None:
    payload = {
        "entry": [
            {
                "changes": [
                    {
                        "value": {
                            "messages": [
                                {
                                    "from": "23050000010",
                                    "type": "text",
                                    "text": {"body": "sold 1 pen at 10"},
                                }
                            ]
                        }
                    }
                ]
            }
        ]
    }
    response = client.post("/api/v1/whatsapp/webhook", json=payload)
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_board_brief(client) -> None:
    body = client.post(
        "/api/v1/whatsapp/simulate",
        json={"from_number": "23050000011", "text": "board brief"},
    ).json()
    assert body["intent"] == "brief"
    assert body["data"]["brief"]["spend"] > 0
    assert "Board brief" in body["reply"]


def test_supplier_concentration(client) -> None:
    body = client.post(
        "/api/v1/whatsapp/simulate",
        json={"from_number": "23050000011", "text": "supplier concentration risk"},
    ).json()
    assert body["intent"] == "concentration"
    assert body["data"]["concentration"]["hhi"] > 0
    assert body["data"]["concentration"]["risk"] in {"low", "medium", "high"}


def test_vat_quarter(client) -> None:
    body = client.post(
        "/api/v1/whatsapp/simulate",
        json={"from_number": "23050000011", "text": "VAT this quarter"},
    ).json()
    assert body["intent"] == "vat"
    assert body["data"]["vat"]["total"] > 0


def test_payroll_ratio(client) -> None:
    body = client.post(
        "/api/v1/whatsapp/simulate",
        json={"from_number": "23050000011", "text": "payroll as a share of spend"},
    ).json()
    assert body["intent"] == "payroll"
    assert body["data"]["payroll"]["share"] > 0


def test_automation_recommendation(client) -> None:
    body = client.post(
        "/api/v1/whatsapp/simulate",
        json={"from_number": "23050000011", "text": "where should we automate first?"},
    ).json()
    assert body["intent"] == "automation"
    assert "readiness" in body["data"]["automation"]
