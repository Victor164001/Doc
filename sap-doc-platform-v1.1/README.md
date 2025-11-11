
# SAP Documentation Platform (Frontend) - v1.1

This bundle adds user authentication pages (Login/Register) and a Dashboard with two tabs:
- Create Document (save to backend `/api/docs` or local fallback)
- My Documents (list of previously saved docs with download)

Authentication:
- Frontend attempts to use `/api/auth/register` and `/api/auth/login`. If the backend is unavailable, it falls back to localStorage-based accounts.
- Successful login stores `sap_jwt` in localStorage (token or local placeholder).

Backend API contract (same as earlier, plus auth):
- POST /api/auth/register  { email, password } -> 201
- POST /api/auth/login     { email, password } -> { token }
- POST /api/upload         multipart/form-data file -> { url }
- POST /api/docs           JSON doc -> saved doc returned

Next steps:
- I can scaffold a minimal Node/Express backend (auth, uploads, docs) that matches these endpoints and include it in the repo. Reply if you want that (I'll add server code + SQLite and update zip).
