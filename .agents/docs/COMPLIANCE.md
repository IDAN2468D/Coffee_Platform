# Israeli Privacy Protection Law & Data Safeguards

## Compliance Checklist
1. **Explicit Opt-In:** All checkout forms include an explicit opt-in checkbox for promotional communications.
2. **Data Encryption:** Customer phone numbers and addresses are encrypted at rest in MongoDB using AES-256.
3. **Data Retention:** Customer order logs are retained for 24 months, after which PII is anonymized.
4. **Deletion Requests:** "Right to be Forgotten" endpoint available at `/api/user/delete-data`.
