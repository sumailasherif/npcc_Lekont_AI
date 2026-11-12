def test_top_suppliers(client) -> None:
    response = client.post(
        "/api/v1/insights/ask",
        json={"question": "Who are my top 5 suppliers by spend?"},
    )
    assert response.status_code == 200
    body = response.json()
    assert body["intent"] == "suppliers"
    assert body["rows"]
    assert body["chart"]["type"] == "bar"
    assert "calculation" in body


def test_monthly_spend(client) -> None:
    body = client.post(
        "/api/v1/insights/ask",
        json={"question": "How has my monthly spend changed?"},
    ).json()
    assert body["intent"] == "monthly"
    assert len(body["rows"]) >= 4
    assert body["chart"]["type"] == "line"


def test_vat_question(client) -> None:
    body = client.post(
        "/api/v1/insights/ask",
        json={"question": "How much VAT did I pay in October?"},
    ).json()
    assert body["intent"] in {"vat", "month"}
    assert body["rows"]


def test_unknown_question_is_scoped(client) -> None:
    body = client.post(
        "/api/v1/insights/ask",
        json={"question": "What is the weather in Port Louis?"},
    ).json()
    assert body["intent"] == "unknown"
    assert body["suggested"]


def test_readiness_recommends_a_first_process(client) -> None:
    body = client.post(
        "/api/v1/insights/readiness",
        json={
            "sector": "Distribution",
            "employees": 12,
            "monthly_invoices": 45,
            "monthly_payslips": 6,
            "admin_hours": 22,
            "tools": ["excel", "whatsapp"],
            "pain_points": ["invoices", "reporting"],
        },
    ).json()
    assert 0 <= body["readiness_score"] <= 100
    assert body["scores"]
    assert body["recommended_first"]
    assert body["next_steps"]


def test_dashboard_summary(client) -> None:
    body = client.get("/api/v1/dashboard/summary").json()
    assert body["documents_total"] >= 6
    assert body["monthly_spend"] > 0
    assert body["top_supplier"]
