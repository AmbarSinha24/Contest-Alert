# Contest Alert

A full-stack aggregator that helps competitive programmers **never miss a contest**. It pulls upcoming rounds from **Codeforces** and **LeetCode**, lets you filter by the types you actually care about, and keeps you notified two ways: an email reminder 20 minutes before start, and a one-click (or automatic) push to your **Google Calendar**.

![Node](https://img.shields.io/badge/Node.js-18%2B-339933?logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)
![Express](https://img.shields.io/badge/Express-4-000000?logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-blue)

---

## Features

- **Google OAuth 2.0 login** — sign in with Google, nothing else to set up
- **Per-type preferences** — follow only what you care about (LeetCode Weekly/Biweekly, Codeforces Div 1–4, etc.), grouped by cadence and division
- **Email reminders** — sent 20 minutes before a contest you've opted into starts
- **Google Calendar sync** — preferred contests are added automatically right after login; anything else can be added manually with one click from the Contests page
- **Manual sync** — pull the latest contest list from every platform on demand, which also clears out contests that have already elapsed
- **Dark/light mode** with a persisted preference
- **Codeforces + LeetCode** supported today

---

## Tech Stack

| Layer | Stack |
|---|---|
| Frontend | React 18, React Router, Axios, Tailwind CSS |
| Backend | Node.js, Express, Passport.js (Google OAuth 2.0) |
| Database | MongoDB Atlas (Mongoose ODM), session store backed by `connect-mongo` |
| Email | Nodemailer over Gmail SMTP |
| Calendar | Google Calendar API |
| Scheduling | `node-cron` (reminder dispatch) |

---

## Project Architecture

```
backend/
├── server.js                    # App entry point: middleware, session, routing, cron bootstrap
├── src/
│   ├── config/                  # DB connection, Passport strategy
│   ├── schemas/                 # Mongoose models (User, Contest, Platform, ContestType, CalendarEvent)
│   ├── services/
│   │   ├── scrapers/            # Codeforces + LeetCode contest fetchers
│   │   ├── calendarService.js   # Google Calendar event creation
│   │   └── emailService.js      # Nodemailer dispatch
│   ├── controllers/             # Route handlers (auth, contests, user)
│   ├── routes/                  # Express routers
│   └── cron/                    # Reminder cron job
└── migrate-to-mongo.js          # One-off migration script (legacy Sequelize -> Mongo)

frontend/
└── src/
    ├── services/api.js          # Configured Axios client
    ├── components/
    │   ├── common/               # Navbar, Footer
    │   └── features/             # Header, Platforms (home page sections)
    ├── pages/                    # Home, Login, Preferences, Contests, Account
    └── assets/                   # Platform icons, logos
```

---

## Setup

### 1. Clone

```bash
git clone https://github.com/AmbarSinha24/Contest-Alert.git
cd Contest-Alert
```

### 2. Configure environment variables

Both `backend/` and `frontend/` ship a `.env.example` — copy each and fill in the values:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

**`backend/.env`**

| Variable | Description |
|---|---|
| `PORT` | Backend port (defaults to `5001`) |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | From a [Google Cloud OAuth client](https://console.cloud.google.com/apis/credentials) |
| `SESSION_SECRET` | Random string, e.g. `openssl rand -hex 32` |
| `EMAIL_USER` / `EMAIL_PASS` | Gmail address + [App Password](https://myaccount.google.com/apppasswords) (requires 2FA enabled) |
| `MONGODB_URI` | Connection string for a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster (or local instance) |
| `REACT_APP_BACKEND_URL` / `REACT_APP_FRONTEND_URL` | Local dev defaults: `http://localhost:5001` / `http://localhost:3000` |
| `NODE_ENV` | Leave unset for local dev. Set to `production` when deploying — this disables the dev-only utility routes below |

**`frontend/.env`** just needs `REACT_APP_BACKEND_URL` and `REACT_APP_FRONTEND_URL`.

### 3. Install dependencies

```bash
cd backend && npm install
cd ../frontend && npm install
```

### 4. Database

Nothing to run manually — on boot, the backend connects to MongoDB and seeds the fixed set of contest types (`Weekly`, `Biweekly`, `Div1`–`Div4`, `Other`) if they don't already exist.

### 5. Run it

A single script boots both servers, logs them separately, and shuts both down cleanly on `Ctrl+C`:

```bash
chmod +x ./open   # first time only
./open
```

- Backend: `http://localhost:5001` (logs at `backend/backend.log`)
- Frontend: `http://localhost:3000` (logs at `frontend/frontend.log`)

Or run them individually with `npm start` in each of `backend/` and `frontend/`.

---

## Usage Flow

1. Open the app and sign in with Google.
2. Pick the contest types you want to follow under **Preferences**.
3. From there the app runs itself:
   - Contests matching your preferences are pushed to your Google Calendar right after you log in.
   - You get an email 20 minutes before each one starts.
4. From the **Contests** page you can also:
   - Hit **Sync Platforms** to pull the latest contests from Codeforces/LeetCode and prune ones that have already elapsed.
   - Add any individual contest to your calendar, even ones outside your saved preferences.

---

## API Reference

| Method | Route | Purpose |
|---|---|---|
| `GET` | `/auth/google` | Start Google OAuth flow |
| `GET` | `/auth/google/callback` | OAuth callback; syncs preferred contests to Calendar on first login |
| `GET` | `/auth/logout` | Sign out and destroy the session |
| `GET` | `/api/user/info` | Current user's profile + resolved preferences |
| `GET` | `/api/contest-types` | List all contest types |
| `GET` / `POST` | `/api/user/preferences` | Read/update the signed-in user's followed contest types |
| `GET` | `/api/contests` | List all known upcoming contests |
| `POST` | `/api/updateContests` | Re-scrape Codeforces/LeetCode and prune elapsed contests |
| `POST` | `/api/add-to-calendar/:contestId` | Add a single contest to the signed-in user's calendar |

`/dev/clear-calendar-events`, `/test-send-emails`, and `/manual-send-emails` are dev-only utility routes, gated to 404 whenever `NODE_ENV=production`.

---

## To Do

- Contest rating/difficulty filters
- Support more platforms (AtCoder, HackerRank)
- In-app calendar view

---

## Author

**Ambar Sinha** — feel free to ⭐ the repo or [connect on GitHub](https://github.com/AmbarSinha24).

## License

MIT
