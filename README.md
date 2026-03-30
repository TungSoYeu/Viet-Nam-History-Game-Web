#  Hành Trình Lịch Sử (Viet Nam History Game)

**Hành Trình Lịch Sử** (Vietnam History Game) is a comprehensive, gamified full-stack web application designed to make learning Vietnamese history engaging, interactive, and competitive. The platform combines rich educational resources (Wikis, Flashcards) with a wide variety of game mechanics (PvP, Map Unlocking, Survival, and Puzzles) to motivate students to learn and retain historical knowledge.

---

##  Features & Game Modes

###  Học Tập (Learning)

- **Thư Viện Triều Đại (Timeline/Library):** Learn about different dynasties and eras through detailed Markdown-supported wiki pages.
- **Thẻ Ghi Nhớ (Flashcards):** Interactive flip-cards for quick memorization of key historical figures, dates, and events.

###  Chế Độ Chơi (Game Modes)

1.  **Mở Mang Bờ Cõi (Territory Map):** A strategic mode featuring a map of Vietnam. Players answer location-specific questions (e.g., Dien Bien Phu, Bach Dang) to conquer and unlock territories, earning massive XP bonuses.
2.  **Thách Đấu (PvP Asynchronous):** Players create 10-question challenges and send them to opponents. Both play the exact same set of questions, and the system automatically determines the winner based on score and completion time.
3.  **Sinh Tồn (Survival):** A hardcore mode where perfection is required. Wrong answers cost lives, and the game ends when lives reach zero.
4.  **Tốc Chiến (Time Attack):** A fast-paced mode testing reflexes and quick recall under a strict time limit. Rewards higher XP per correct answer.
5.  **Ai Là Triệu Phú (Millionaire):** Classic 15-question progression system with increasing difficulty.
6.  **Giải Đố & Logic (Puzzle Modes):**
    - **Nối Cột (Matching):** Connect historical figures to their correct dynasties or achievements.
    - **Dòng Thời Gian (Chronological):** Drag and drop historical events into the correct chronological order.
    - **Đoán Nhân Vật (Guess Character):** Deduce the historical figure using text-based clues and aliases.
    - **Lật Mảnh Ghép (Reveal Picture):** Answer questions to slowly reveal a hidden historical image, then guess the picture.

###  Gamification & User Progression

- **Experience Points (XP):** Earn XP for playing games, answering correctly, and winning PvP matches.
- **Leaderboard:** Compete globally with other students for the top spot based on accumulated XP.
- **Streaks:** Encourages daily logins and continuous learning.
- **Authentication:** Supports standard username/password registration and **Google OAuth 2.0** One-Tap login.

###  Hệ Thống Quản Trị (Admin CMS)

A built-in secure dashboard (`/admin`) allowing administrators to dynamically perform CRUD operations on:

- Questions (Cơ bản, Sinh tồn, Tốc chiến, Triệu phú, Bờ cõi).
- Lessons, Wikis, and Flashcards.
- Content for all mini-games (Matching pairs, Chronological events, Characters, Pictures).

---

##  Technology Stack

**Frontend:**

- **React.js** (v19)
- **React Router Dom** for client-side routing and Route Guards.
- **Tailwind CSS** (via classNames) & Custom CSS for responsive, themed UI.
- **@react-oauth/google** for Google authentication.

**Backend:**

- **Node.js & Express.js**
- **MongoDB & Mongoose** (v9) for extensible data modeling.
- **JSON Web Tokens (JWT)** for stateless authentication.
- **Bcrypt** for secure password hashing.
- **Multer** for handling local avatar uploads.

---

##  Project Structure

```text
Project-game-NCKH/
├── backend/                  # Node.js/Express server
│   ├── config/               # Database connection (db.js)
│   ├── controller/           # Core game logic and XP calculation
│   ├── middleware/           # JWT Auth & Multer upload middleware
│   ├── models/               # MongoDB Schemas (User, Question, Challenge, Matching, etc.)
│   ├── routes/               # Express API endpoints
│   ├── scripts/              # Seeding scripts & Admin creation scripts
│   ├── uploads/              # Local storage for user avatars
│   └── server.js             # Backend entry point
│
├── frontend/                 # React client
│   ├── public/               # Static assets & index.html
│   └── src/
│       ├── assets/           # Images (e.g., Map of Vietnam)
│       ├── components/       # Reusable UI (Navbar, RouteGuards, Streak, Lives)
│       ├── config/           # API configuration (api.js)
│       ├── pages/            # View components (Login, Game Modes, Admin, Leaderboard)
│       └── App.js            # Main React application & Router setup
```

---

##  Installation & Setup

### Prerequisites

- Node.js (v18+ recommended)
- MongoDB (Local instance or MongoDB Atlas cluster)

### 1. Backend Setup

Navigate to the backend directory and install dependencies:

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory with the following variables:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/history_game   # Or your Atlas connection string
JWT_SECRET=your_super_secret_jwt_key
GOOGLE_CLIENT_ID=your_google_oauth_client_id
ADMIN_SECRET_CODE=HISTORY_ADMIN_2024               # Secret code used to register an admin account
```

Start the backend server:

```bash
npm run dev
# Server will run on http://localhost:5000
```

_(Optional)_ Create default admin accounts:

```bash
node scripts/create_admins.js
```

### 2. Frontend Setup

Navigate to the frontend directory and install dependencies:

```bash
cd frontend
npm install
```

Update `frontend/src/App.js` or `frontend/src/config/api.js` if your backend is hosted on a different URL (Defaults to `http://localhost:5000`).

Start the React development server:

```bash
npm start
# App will open at http://localhost:3000
```

---

##  Default Admin Access

If you ran the `create_admins.js` script, you can log in to the admin panel with:

- **Username:** `admin1` (or `admin2`, `admin3`)
- **Password:** `adminPassword123`

Alternatively, you can register a new account on the Login page and enter your `ADMIN_SECRET_CODE` into the "Mã Admin" field to instantly receive admin privileges.

---

##  License & Contact

This project is developed as an educational research initiative (Nghiên Cứu Khoa Học - NCKH) to preserve and promote Vietnamese History through modern web technology.
