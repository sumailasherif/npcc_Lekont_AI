# Synthetic sample data

**Everything in this folder is synthetic.** It was written for the NPCC
challenge demo. It does not come from a real company, and it must not be
presented as real plant data.

The three packs share one schema:

| Pack | Folder / file | Contents |
| --- | --- | --- |
| Textile and apparel | `sops/textile_overlock_jam.md` | Overlock jam procedure, 5 steps, EN/FR/Kreol |
| Food manufacturing | `sops/food_traceability_log.md` | Batch traceability, 5 steps, EN/FR/Kreol |
| Light engineering | `sops/light_engineering_spindle_vibration.md` | CNC spindle vibration, 5 steps, EN/FR/Kreol |

Cross-pack files:

- `fault_codes.csv` - 12 codes with likely causes and severity.
- `voice_transcripts/` - three expert voice-note transcripts, one per sector.
- `skills_matrix.csv` - role skill requirements (levels 1-4).
- `operator_questions.csv` - 20 questions, 15 answerable and 5 deliberate gaps.
- `users.csv` - ten synthetic users across the three sites.

Production data belongs in the `data/raw/` folder, which is git-ignored.
