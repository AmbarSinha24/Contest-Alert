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
* ⚠ Prevents duplicate calendar entries
* 🌐 Platforms supported: **Codeforces**, **LeetCode**

---

## 🧰 Tech Stack

* **Frontend:** React, Axios
* **Backend:** Node.js, Express, Passport.js
* **Database:** MySQL (via Sequelize ORM)
* **Email:** Nodemailer + Gmail SMTP
* **Calendar Integration:** Google Calendar API (OAuth 2.0)

---

## 🧑‍💻 Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/AmbarSinha24/Contest-Alert.git
cd Contest-Alert
```

### 2. Install dependencies

**Backend:**

```bash
cd backend
npm install
```

**Frontend:**

```bash
cd ../frontend
npm install
```

---

### 3. Environment Variables

Create a `.env` file in the `backend/` folder:

```env
PORT=5001
SESSION_SECRET=your_random_secret

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# MySQL Database
DB_NAME=contest_alert
DB_USER=root
DB_PASS=yourpassword
DB_HOST=localhost
DB_PORT=3306

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

### 4. Create MySQL Database

Log into MySQL and run:

```sql
CREATE DATABASE contest_alert;
```

The Sequelize models will auto-sync tables on server start.

---

### 5. Start the Servers

**Backend:**

```bash
cd backend
npm run dev
```

**Frontend:**

```bash
cd frontend
npm start
```

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

* Check for contests starting in \~20 minutes.
* Send reminder emails to users who opted in.

---

## ⚠ Notes

* First-time users may trigger a full contest fetch and calendar insertion on login.
* The app avoids duplicate calendar entries using a `CalendarEvent` table.
* LeetCode contests are approximated based on known schedule patterns.

---

## 📌 To Do

* Add contest ratings filters
* Support more platforms (AtCoder, HackerRank)
* Calendar UI in frontend
* Dark mode toggle

---

## 🧑‍🎓 Author

**Ambar Sinha**
Feel free to ⭐ the repo or [connect on GitHub](https://github.com/AmbarSinha24)!

---

## 📄 License

MIT License

