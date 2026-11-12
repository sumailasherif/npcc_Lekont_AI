"""Synthetic SME back office: six documents and one year-to-date ledger.

Everything here is invented for the challenge. No real company, employee or
invoice is represented. The ledger exists so "ask your spreadsheet" has a
consistent dataset to answer from.
"""

from __future__ import annotations

from typing import Any

DOCUMENTS: list[dict[str, Any]] = [
    {
        "id": "doc-inv-014",
        "filename": "facture_island_packaging_2026-09.pdf",
        "doc_type": "invoice",
        "language": "fr",
        "text": (
            "FACTURE\n"
            "Fournisseur: Island Packaging Ltd\n"
            "Numero de facture: INV-2026-014\n"
            "Date: 12/09/2026\n"
            "Devise: MUR\n"
            "Sous-total: 42,500.00\n"
            "TVA (15%): 6,375.00\n"
            "Total: 48,875.00\n"
        ),
    },
    {
        "id": "doc-inv-019",
        "filename": "invoice_moka_paper_2026-10.pdf",
        "doc_type": "invoice",
        "language": "en",
        "text": (
            "INVOICE\n"
            "Supplier: Moka Paper & Print\n"
            "Invoice No: INV-2026-019\n"
            "Date: 03/10/2026\n"
            "Currency: MUR\n"
            "Subtotal: 18,200.00\n"
            "VAT (15%): 2,730.00\n"
            "Total: 20,930.00\n"
        ),
    },
    {
        "id": "doc-inv-021",
        "filename": "invoice_port_logistics_2026-10.pdf",
        "doc_type": "invoice",
        "language": "en",
        "text": (
            "INVOICE\n"
            "Supplier: Port Logistics Co.\n"
            "Invoice No: INV-2026-021\n"
            "Date: 18/10/2026\n"
            "Currency: MUR\n"
            "Subtotal: 31,400.00\n"
            "VAT (15%): 4,710.00\n"
            "Total: 36,110.00\n"
        ),
    },
    {
        "id": "doc-pay-10",
        "filename": "payslip_ramdhany_2026-10.pdf",
        "doc_type": "payslip",
        "language": "en",
        "text": (
            "PAYSLIP\n"
            "Employee: A. Ramdhany\n"
            "Period: October 2026\n"
            "Currency: MUR\n"
            "Gross: 28,000.00\n"
            "Deductions: 2,230.00\n"
            "Net: 25,770.00\n"
        ),
    },
    {
        "id": "doc-pay-11",
        "filename": "payslip_appadoo_2026-11.pdf",
        "doc_type": "payslip",
        "language": "en",
        "text": (
            "PAYSLIP\n"
            "Employee: M. Appadoo\n"
            "Period: November 2026\n"
            "Currency: MUR\n"
            "Gross: 32,500.00\n"
            "Deductions: 2,720.00\n"
            "Net: 29,780.00\n"
        ),
    },
    {
        "id": "doc-ctr-001",
        "filename": "contract_rogers_distribution_2026-11.pdf",
        "doc_type": "contract",
        "language": "en",
        "text": (
            "DISTRIBUTION CONTRACT\n"
            "Parties: Lekont Demo Ltd and Rogers Distribution Ltd\n"
            "Start: 01/11/2026\n"
            "End: 31/10/2027\n"
            "Value: 240,000.00 MUR\n"
        ),
    },
]

# date, month, supplier, category, amount, vat, doc_id
LEDGER: list[dict[str, Any]] = [
    {
        "date": "2026-07-05",
        "month": "2026-07",
        "supplier": "Island Packaging Ltd",
        "category": "Packaging",
        "amount": 12400.00,
        "vat": 1860.00,
        "doc_id": None,
    },
    {
        "date": "2026-07-11",
        "month": "2026-07",
        "supplier": "Moka Paper & Print",
        "category": "Printing",
        "amount": 8100.00,
        "vat": 1215.00,
        "doc_id": None,
    },
    {
        "date": "2026-07-18",
        "month": "2026-07",
        "supplier": "Port Logistics Co.",
        "category": "Logistics",
        "amount": 14200.00,
        "vat": 2130.00,
        "doc_id": None,
    },
    {
        "date": "2026-07-28",
        "month": "2026-07",
        "supplier": "Payroll",
        "category": "Payroll",
        "amount": 54000.00,
        "vat": 0.00,
        "doc_id": None,
    },
    {
        "date": "2026-08-06",
        "month": "2026-08",
        "supplier": "Island Packaging Ltd",
        "category": "Packaging",
        "amount": 15600.00,
        "vat": 2340.00,
        "doc_id": None,
    },
    {
        "date": "2026-08-12",
        "month": "2026-08",
        "supplier": "Moka Paper & Print",
        "category": "Printing",
        "amount": 9300.00,
        "vat": 1395.00,
        "doc_id": None,
    },
    {
        "date": "2026-08-20",
        "month": "2026-08",
        "supplier": "Port Logistics Co.",
        "category": "Logistics",
        "amount": 12800.00,
        "vat": 1920.00,
        "doc_id": None,
    },
    {
        "date": "2026-08-28",
        "month": "2026-08",
        "supplier": "Payroll",
        "category": "Payroll",
        "amount": 54000.00,
        "vat": 0.00,
        "doc_id": None,
    },
    {
        "date": "2026-09-12",
        "month": "2026-09",
        "supplier": "Island Packaging Ltd",
        "category": "Packaging",
        "amount": 42500.00,
        "vat": 6375.00,
        "doc_id": "doc-inv-014",
    },
    {
        "date": "2026-09-16",
        "month": "2026-09",
        "supplier": "Moka Paper & Print",
        "category": "Printing",
        "amount": 7900.00,
        "vat": 1185.00,
        "doc_id": None,
    },
    {
        "date": "2026-09-22",
        "month": "2026-09",
        "supplier": "Port Logistics Co.",
        "category": "Logistics",
        "amount": 11500.00,
        "vat": 1725.00,
        "doc_id": None,
    },
    {
        "date": "2026-09-28",
        "month": "2026-09",
        "supplier": "Payroll",
        "category": "Payroll",
        "amount": 55000.00,
        "vat": 0.00,
        "doc_id": None,
    },
    {
        "date": "2026-10-03",
        "month": "2026-10",
        "supplier": "Moka Paper & Print",
        "category": "Printing",
        "amount": 18200.00,
        "vat": 2730.00,
        "doc_id": "doc-inv-019",
    },
    {
        "date": "2026-10-09",
        "month": "2026-10",
        "supplier": "Island Packaging Ltd",
        "category": "Packaging",
        "amount": 16800.00,
        "vat": 2520.00,
        "doc_id": None,
    },
    {
        "date": "2026-10-18",
        "month": "2026-10",
        "supplier": "Port Logistics Co.",
        "category": "Logistics",
        "amount": 31400.00,
        "vat": 4710.00,
        "doc_id": "doc-inv-021",
    },
    {
        "date": "2026-10-28",
        "month": "2026-10",
        "supplier": "Payroll",
        "category": "Payroll",
        "amount": 56200.00,
        "vat": 0.00,
        "doc_id": "doc-pay-10",
    },
    {
        "date": "2026-11-04",
        "month": "2026-11",
        "supplier": "Island Packaging Ltd",
        "category": "Packaging",
        "amount": 13700.00,
        "vat": 2055.00,
        "doc_id": None,
    },
    {
        "date": "2026-11-08",
        "month": "2026-11",
        "supplier": "Moka Paper & Print",
        "category": "Printing",
        "amount": 10400.00,
        "vat": 1560.00,
        "doc_id": None,
    },
    {
        "date": "2026-11-10",
        "month": "2026-11",
        "supplier": "Port Logistics Co.",
        "category": "Logistics",
        "amount": 9800.00,
        "vat": 1470.00,
        "doc_id": None,
    },
    {
        "date": "2026-11-12",
        "month": "2026-11",
        "supplier": "Payroll",
        "category": "Payroll",
        "amount": 58000.00,
        "vat": 0.00,
        "doc_id": "doc-pay-11",
    },
]

CURRENCY = "MUR"
