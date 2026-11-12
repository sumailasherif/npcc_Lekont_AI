-- Six synthetic documents with their extracted fields.
insert into documents (id, org_id, filename, doc_type, language, supplier, total, currency, status, confidence, reviewer, text_content)
values
('doc-inv-014', '00000000-0000-0000-0000-000000000001', 'facture_island_packaging_2026-09.pdf', 'invoice', 'fr', 'Island Packaging Ltd', 48875.0, 'MUR', 'approved', 0.96, 'demo.accountant', 'FACTURE
Fournisseur: Island Packaging Ltd
Numero de facture: INV-2026-014
Date: 12/09/2026
Devise: MUR
Sous-total: 42,500.00
TVA (15%): 6,375.00
Total: 48,875.00
'),
('doc-inv-019', '00000000-0000-0000-0000-000000000001', 'invoice_moka_paper_2026-10.pdf', 'invoice', 'en', 'Moka Paper & Print', 20930.0, 'MUR', 'approved', 0.96, 'demo.accountant', 'INVOICE
Supplier: Moka Paper & Print
Invoice No: INV-2026-019
Date: 03/10/2026
Currency: MUR
Subtotal: 18,200.00
VAT (15%): 2,730.00
Total: 20,930.00
'),
('doc-inv-021', '00000000-0000-0000-0000-000000000001', 'invoice_port_logistics_2026-10.pdf', 'invoice', 'en', 'Port Logistics Co.', 36110.0, 'MUR', 'needs_review', 0.96, null, 'INVOICE
Supplier: Port Logistics Co.
Invoice No: INV-2026-021
Date: 18/10/2026
Currency: MUR
Subtotal: 31,400.00
VAT (15%): 4,710.00
Total: 36,110.00
'),
('doc-pay-10', '00000000-0000-0000-0000-000000000001', 'payslip_ramdhany_2026-10.pdf', 'payslip', 'en', 'A. Ramdhany', 25770.0, 'MUR', 'approved', 0.96, 'demo.accountant', 'PAYSLIP
Employee: A. Ramdhany
Period: October 2026
Currency: MUR
Gross: 28,000.00
Deductions: 2,230.00
Net: 25,770.00
'),
('doc-pay-11', '00000000-0000-0000-0000-000000000001', 'payslip_appadoo_2026-11.pdf', 'payslip', 'en', 'M. Appadoo', 29780.0, 'MUR', 'needs_review', 0.96, null, 'PAYSLIP
Employee: M. Appadoo
Period: November 2026
Currency: MUR
Gross: 32,500.00
Deductions: 2,720.00
Net: 29,780.00
'),
('doc-ctr-001', '00000000-0000-0000-0000-000000000001', 'contract_rogers_distribution_2026-11.pdf', 'contract', 'en', 'Lekont Demo Ltd and Rogers Distribution Ltd', 240000.0, 'MUR', 'approved', 0.96, 'demo.accountant', 'DISTRIBUTION CONTRACT
Parties: Lekont Demo Ltd and Rogers Distribution Ltd
Start: 01/11/2026
End: 31/10/2027
Value: 240,000.00 MUR
')
on conflict (id) do nothing;

insert into document_fields (doc_id, key, label, value, confidence, page, corrected)
values
('doc-inv-014', 'supplier', 'Supplier', 'Island Packaging Ltd', 0.96, 1, false),
('doc-inv-014', 'invoice_no', 'Invoice number', 'INV-2026-014', 0.96, 1, false),
('doc-inv-014', 'date', 'Invoice date', '12/09/2026', 0.96, 1, false),
('doc-inv-014', 'currency', 'Currency', 'MUR', 0.96, 1, false),
('doc-inv-014', 'subtotal', 'Subtotal', '42,500.00', 0.96, 1, false),
('doc-inv-014', 'vat', 'VAT', '6,375.00', 0.96, 1, false),
('doc-inv-014', 'total', 'Total', '48,875.00', 0.96, 1, false),
('doc-inv-019', 'supplier', 'Supplier', 'Moka Paper & Print', 0.96, 1, false),
('doc-inv-019', 'invoice_no', 'Invoice number', 'INV-2026-019', 0.96, 1, false),
('doc-inv-019', 'date', 'Invoice date', '03/10/2026', 0.96, 1, false),
('doc-inv-019', 'currency', 'Currency', 'MUR', 0.96, 1, false),
('doc-inv-019', 'subtotal', 'Subtotal', '18,200.00', 0.96, 1, false),
('doc-inv-019', 'vat', 'VAT', '2,730.00', 0.96, 1, false),
('doc-inv-019', 'total', 'Total', '20,930.00', 0.96, 1, false),
('doc-inv-021', 'supplier', 'Supplier', 'Port Logistics Co.', 0.96, 1, false),
('doc-inv-021', 'invoice_no', 'Invoice number', 'INV-2026-021', 0.96, 1, false),
('doc-inv-021', 'date', 'Invoice date', '18/10/2026', 0.96, 1, false),
('doc-inv-021', 'currency', 'Currency', 'MUR', 0.96, 1, false),
('doc-inv-021', 'subtotal', 'Subtotal', '31,400.00', 0.96, 1, false),
('doc-inv-021', 'vat', 'VAT', '4,710.00', 0.96, 1, false),
('doc-inv-021', 'total', 'Total', '36,110.00', 0.96, 1, false),
('doc-pay-10', 'employee', 'Employee', 'A. Ramdhany', 0.96, 1, false),
('doc-pay-10', 'period', 'Period', 'October 2026', 0.96, 1, false),
('doc-pay-10', 'currency', 'Currency', 'MUR', 0.96, 1, false),
('doc-pay-10', 'gross', 'Gross pay', '28,000.00', 0.96, 1, false),
('doc-pay-10', 'deductions', 'Deductions', '2,230.00', 0.96, 1, false),
('doc-pay-10', 'net', 'Net pay', '25,770.00', 0.96, 1, false),
('doc-pay-11', 'employee', 'Employee', 'M. Appadoo', 0.96, 1, false),
('doc-pay-11', 'period', 'Period', 'November 2026', 0.96, 1, false),
('doc-pay-11', 'currency', 'Currency', 'MUR', 0.96, 1, false),
('doc-pay-11', 'gross', 'Gross pay', '32,500.00', 0.96, 1, false),
('doc-pay-11', 'deductions', 'Deductions', '2,720.00', 0.96, 1, false),
('doc-pay-11', 'net', 'Net pay', '29,780.00', 0.96, 1, false),
('doc-ctr-001', 'parties', 'Parties', 'Lekont Demo Ltd and Rogers Distribution Ltd', 0.96, 1, false),
('doc-ctr-001', 'start', 'Start date', '01/11/2026', 0.96, 1, false),
('doc-ctr-001', 'end', 'End date', '31/10/2027', 0.96, 1, false),
('doc-ctr-001', 'value', 'Contract value', '240,000.00', 0.96, 1, false)
on conflict (doc_id, key) do nothing;
