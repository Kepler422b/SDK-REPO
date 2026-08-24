# SDK-REPO

[![CI](https://github.com/Kepler422b/SDK-REPO/actions/workflows/ci.yml/badge.svg)](https://github.com/Kepler422b/SDK-REPO/actions/workflows/ci.yml)

# Smart Disaster Knowledge Repository
A full-stack platform for collecting, searching, and analyzing disaster response reports. NGOs and relief workers can upload field reports (PDFs or images), which are automatically processed with OCR and AI summarization, then stored in a searchable knowledge base with analytics dashboards.
## Features
- **Report Upload** — Upload PDF or image reports with metadata (disaster type, location, NGO details, volunteer count)
- **OCR Extraction** — Automatically extracts text from uploaded PDFs (`pdf-parse`) and images (`tesseract.js`)
- **AI Summarization** — Generates concise summaries and tags using OpenAI GPT-3.5
- **Smart Search** — Full-text search with filters by state, disaster type, and year
- **Report Comparison** — Side-by-side analysis of multiple disaster incidents
- **Analytics Dashboard** — Visualize disaster counts by type and state-wise distribution
- **Recommendations** — Suggests similar past reports based on disaster type and location
- **Firebase Authentication** — User auth with role-based access control (backend middleware ready)
## Tech Stack
| Layer      | Technologies                                      |
|------------|---------------------------------------------------|
| Frontend   | React 18, Vite, Tailwind CSS, Recharts, Firebase |
| Backend    | Node.js, Express, Mongoose                        |
| Database   | MongoDB                                           |
| Storage    | Cloudinary                                        |
| AI / OCR   | OpenAI API, Tesseract.js, pdf-parse               |
| Auth       | Firebase Admin SDK                                |
## Project Structure
```
smart-disaster-repo/
├── backend/
│   ├── config/          # Database & Firebase configuration
│   ├── middlewares/     # Auth & file upload middleware
│   ├── models/          # Mongoose schemas (Report, User)
│   ├── routes/          # API routes (reports, analytics)
│   ├── scripts/         # Database seeding script
│   └── server.js        # Express entry point
└── frontend/
    ├── src/
    │   ├── components/  # Shared UI components
    │   ├── context/     # React context (auth)
    │   ├── pages/     # Route pages
    │   └── firebase.js
    └── vite.config.js   # Dev server with API proxy
```
## Prerequisites
- Node.js 18+
- MongoDB instance (local or [MongoDB Atlas](https://www.mongodb.com/atlas))
- [Cloudinary](https://cloudinary.com/) account for file storage
- [OpenAI API](https://platform.openai.com/) key (optional — summarization is disabled without it)
- [Firebase](https://firebase.google.com/) project for authentication (optional)
## Getting Started
### 1. Clone the repository
```bash
git clone https://github.com/Kepler422b/SDK-REPO.git
cd SDK-REPO
```
### 2. Backend setup
```bash
cd smart-disaster-repo/backend
npm install
```
Create a `.env` file in the `backend/` directory:
```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/disaster-repo
# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
# OpenAI (optional)
OPENAI_API_KEY=sk-...
# Firebase Admin (optional)
FIREBASE_SERVICE_ACCOUNT_PATH=./config/serviceAccountKey.json
```
Start the backend:
```bash
npm run dev
```
The API runs at `http://localhost:5000`.
### 3. Frontend setup
```bash
cd smart-disaster-repo/frontend
npm install
```
Copy `.env.example` to `.env` and add your Firebase project credentials, then start the dev server:

```bash
cp .env.example .env
```
```bash
npm run dev
```
The frontend runs at `http://localhost:5173` and proxies `/api` requests to the backend.

## Continuous Integration

GitHub Actions runs on every push and pull request to `main`. It builds the frontend and checks the syntax of the backend entry point and report routes.
### 4. Seed sample data (optional)
```bash
cd smart-disaster-repo/backend
npm run seed
```
This populates the database with sample disaster reports across Indian states.
## API Endpoints
| Method | Endpoint                        | Description                          |
|--------|---------------------------------|--------------------------------------|
| GET    | `/api/reports`                  | Search reports (`?q`, `?state`, `?disasterType`, `?year`) |
| POST   | `/api/reports/upload`           | Upload a new report with file        |
| GET    | `/api/reports/:id`              | Get a single report by ID            |
| GET    | `/api/reports/compare?ids=`     | Compare multiple reports             |
| GET    | `/api/reports/recommendations/:id` | Get similar reports             |
| GET    | `/api/analytics/dashboard`      | Dashboard statistics                 |
## Disaster Types
Flood · Earthquake · Cyclone · Heatwave · Landslide · Other
## License
This project is for educational and humanitarian use.
