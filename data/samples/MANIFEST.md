# Synthetic sample data

Everything in this folder is invented for the NPCC challenge. No real company,
employee, invoice or contract is represented.

| File | Rows | Purpose |
| --- | --- | --- |
| `ledger_100.csv` | 100 | Monthly ledger: 10 months × 10 entries, 12 suppliers, payroll included |
| `0001_documents.sql` (in `supabase/seed`) | 6 documents | Invoices (EN/FR), payslips, one contract, with extracted fields |
| `0002_ledger_100.sql` (in `supabase/seed`) | 100 | Same ledger as ready-to-run Postgres inserts |

## Shape

`ledger_100.csv` columns:

```
date, month, supplier, category, amount, vat, doc_id
```

- `category`: Packaging, Printing, Logistics, Office, Facilities, IT, Cold chain,
  Maintenance, Marketing, Professional services, Telecom, Payroll.
- `vat` is 15% for purchases and 0 for payroll.
- `doc_id` links a ledger line to a seeded document when one exists.

## Regenerate

```powershell
cd apps/api
python -m app.scripts.generate_seed
```

The generator is deterministic (`random.seed(42)`), so the 100 rows are stable.
