# 🗕 Contest Alert

Site is live at: https://contest-alert.vercel.app/
A full-stack web application to help competitive programmers **never miss a contest**!
It integrates **Google Calendar** and **email reminders** for contests from **Codeforces** and **LeetCode**, filtered by user preferences.

---

## 🚀 Features

* 🔐 Google OAuth 2.0 login
* 📋 Choose contest types to follow (Div1, Div2, Weekly, Biweekly, etc.)
* 📬 Email reminders 20 minutes before the contest
* 🗓 Add upcoming contests to Google Calendar with one click
* 🌓 Sleek Glassmorphic interface featuring a **Dark/Light Mode toggle**
* ⚡ Glowing gradient outlines on card hovers
* 🌐 Platforms supported: **Codeforces**, **LeetCode**

---

## 🧰 Tech Stack

* **Frontend:** React, Axios (Encapsulated client services), Tailwind CSS
* **Backend:** Node.js, Express, Passport.js, MongoDB (Mongoose ODM)
* **Email:** Nodemailer + Gmail SMTP
* **Calendar Integration:** Google Calendar API (OAuth 2.0)

---

## 📂 Project Architecture (SOLID Principles)

### Backend:
* `backend/src/config/`: App configurations (database setup, Passport strategy).
* `backend/src/schemas/`: Mongoose schemas.
* `backend/src/services/`: Scraper strategies, Google Calendar helper, and Nodemailer dispatchers.
* `backend/src/controllers/`: Route handlers.
* `backend/src/routes/`: Express endpoint routing.
* `backend/src/cron/`: Scheduler cron tasks.

### Frontend:
* `frontend/src/services/`: API instance definitions (configured Axios client).
* `frontend/src/components/common/`: Global shell blocks (`Navbar`, `Footer`).
* `frontend/src/components/features/`: UI dashboard sections (`Header`, `Platforms`).
* `frontend/src/pages/`: Route views (`Home`, `Login`, `Preferences`, `Contests`, `Account`).

---

## 🧑‍💻 Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/AmbarSinha24/Contest-Alert.git
cd Contest-Alert
```

### 2. Environment Variables

Create a `.env` file in the `backend/` folder:

```env
PORT=5001
SESSION_SECRET=your_random_secret
REACT_APP_BACKEND_URL=http://localhost:5001
REACT_APP_FRONTEND_URL=http://localhost:3000

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# MongoDB Database (Atlas or Local)
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/contest_alert?retryWrites=true&w=majority

# Email
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

#Front end and Backend URLs
REACT_APP_BACKEND_URL=your_backend_url
REACT_APP_FRONTEND_URL=your_frontend_url
```

> 🔐 Ensure your Gmail account has "App Passwords" enabled if using 2FA.

Create another `.env` file in the `frontend/` folder:

```env
REACT_APP_BACKEND_URL=your_backend_url
REACT_APP_FRONTEND_URL=your_frontend_url
```

---

### 3. Database Setup

On starting the server, schemas are verified and default contest types (`Weekly`, `Biweekly`, `Div1`, etc.) are automatically seeded into your MongoDB Atlas database.

---

### 4. Start the Application

We have created a single command script to boot both frontend and backend servers together, manage logging, and handle graceful process terminations:

```bash
# Set executable permissions (first time only)
chmod +x ./open

# Start both servers
./open
```

You can view logs at `backend/backend.log` and `frontend/frontend.log`. Press `Ctrl+C` to cleanly shut down both servers.

---

## 🌟 Usage Flow

1. Visit the app and log in using Google.
2. Choose your preferred contest types (e.g., Weekly, Div2, etc.).
3. The app:
   * Automatically updates contest info.
   * Adds upcoming contests to your Google Calendar.
   * Sends reminder emails 20 minutes before contests.
4. You can also:
   * Click the "Add to Calendar" button on any upcoming contest (even outside your preferences).
   * See if it's already added.

---

## 🔄 Cron Jobs

The backend runs a cron job every minute to:
* Check for contests starting in ~20 minutes.
* Send reminder emails to users who opted in.

---

## 📌 To Do

* Add contest ratings filters
* Support more platforms (AtCoder, HackerRank)
* Calendar UI in frontend

---

## 🧑‍🎓 Author

**Ambar Sinha**
Feel free to ⭐ the repo or [connect on GitHub](https://github.com/AmbarSinha24)!

---

## 📄 License

MIT License
