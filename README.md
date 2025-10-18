```markdown
# 💼 Intervu – Mock Interview Platform

**Intervu** is a modern web platform that connects **Interviewers** and **Interviewees** for real-time **mock interviews**.  
It features **video calls, chat, live code editor, and real-time collaboration**, helping users practice interviews effectively with professionals or peers.

> 🚀 Built with **React + Vite + Redux Toolkit + Material UI**, powered by **.NET 8 Web API + SignalR** backend, and deployed with **Vercel + Azure CI/CD**.

## 🧱 Overview

- 🌐 **Frontend:** React + Vite + Redux Toolkit + TypeScript + Material UI  
- ⚙️ **Backend:** .NET 8 Web API with SignalR for realtime communication  
- 💾 **Database:** MongoDB Atlas  
- 📡 **Realtime:** WebRTC (video/audio calls), SignalR (chat, code sync)  
- ☁️ **Deployment:** Frontend (Vercel), Backend (Azure App Service)  
- 🔄 **CI/CD:** GitHub Actions + Vercel auto-deploy  

---

## 🎯 Core Features

### 👥 Matching System
- Smart matching between **interviewers** and **interviewees**
- Filters by tech stack (Frontend, Backend, DSA, System Design), level, and time

### 🎥 Real-time Mock Interview Room
- WebRTC-based **video/audio call**
- Real-time **chat** via SignalR
- **Live code editor** (Monaco / VSCode-style)
- Future support for **code execution** and **AI interviewer**

### 💬 Chat System
- Instant messaging with typing indicators
- Persistent chat history by session
- Emoji & file sharing (coming soon)

### 📅 Session Scheduling
- Interviewer availability calendar
- Booking system with confirmation
- Email notifications (SendGrid / Resend integration planned)

### 🧾 Profile & Review
- Public interviewer profiles with rating & experience
- Feedback & review system
- Resume and portfolio linking

---

## ⚙️ Tech Stack

| Layer | Technology |
|-------|-------------|
| **Framework** | React 18 + Vite |
| **State Management** | Redux Toolkit |
| **UI Library** | Material UI (MUI v6) |
| **Realtime** | SignalR + WebRTC |
| **Routing** | React Router v6 |
| **Code Editor** | Monaco Editor |
| **Charts** | Recharts |
| **Backend** | .NET 8 Web API (C#) |
| **Database** | MongoDB Atlas |
| **Deployment** | Vercel + Azure |
| **CI/CD** | GitHub Actions + Vercel Integration |

---

## 📂 Project Structure

```

intervu-frontend/
│
├── src/
│   ├── api/               # Axios API clients
│   ├── assets/            # Images, icons, etc.
│   ├── components/        # Reusable UI components
│   ├── features/          # Redux slices (auth, chat, call, etc.)
│   ├── hooks/             # Custom React hooks
│   ├── layouts/           # Shared layout components
│   ├── pages/             # Screens (Home, Dashboard, InterviewRoom, etc.)
│   ├── routes/            # Route definitions & guards
│   ├── services/          # SignalR, WebRTC, and editor services
│   ├── store/             # Redux store setup
│   └── utils/             # Helper functions & constants
│
├── public/                # Static files
├── .env.example           # Example environment variables
├── vite.config.ts         # Vite configuration
├── package.json
└── README.md

````

---

## 🔧 Environment Variables (`.env`)

Create a `.env` file in the project root and configure your backend endpoints:

```bash
VITE_API_BASE_URL=https://intervu-be.azurewebsites.net
VITE_SIGNALR_URL=wss://intervu-be.azurewebsites.net/hub
VITE_WEBRTC_ICE_SERVER_URL=stun:stun.l.google.com:19302
````

> ⚠️ If you deploy backend with custom domain, remember to update the URLs above.

---

## 💻 Local Development

```bash
# 1️⃣ Clone the repository
git clone https://github.com/your-username/intervu.git
cd intervu-frontend

# 2️⃣ Install dependencies
npm install

# 3️⃣ Create environment file
cp .env.example .env

# 4️⃣ Start the development server
npm run dev
```

Frontend runs at [http://localhost:5173](http://localhost:5173)

---

## 🚀 Deployment (Vercel)

The frontend is deployed to **Vercel** with automatic CI/CD via GitHub.

### ✅ Workflow

1. Push code to the `main` (or `master`) branch
2. Vercel auto-builds the project using your `VITE_` environment variables
3. Deployment URL (e.g. `https://intervu.vercel.app`) updates automatically

### 🔐 Required Environment Variables in Vercel

| Key                          | Example Value                            |
| ---------------------------- | ---------------------------------------- |
| `VITE_API_BASE_URL`          | `https://intervu-be.azurewebsites.net`   |
| `VITE_SIGNALR_URL`           | `wss://intervu-be.azurewebsites.net/hub` |
| `VITE_WEBRTC_ICE_SERVER_URL` | `stun:stun.l.google.com:19302`           |

---

## ⚙️ CI/CD Integration (Full Stack)

### 🔹 Backend (Azure)

Deployed via **GitHub Actions** to Azure App Service
→ Triggered on `push` to `master`

### 🔹 Frontend (Vercel)

Auto-deploys via **Vercel GitHub Integration**
→ Triggered on `push` or `PR merge` to `main`

Optional: If using monorepo, you can trigger both pipelines from a single GitHub workflow.

---

## 🧩 Roadmap

* [x] User Authentication & Role Management
* [x] Real-time Chat via SignalR
* [x] Live Video Call (WebRTC)
* [x] Basic Code Editor Integration
* [ ] Code Execution Sandbox
* [ ] AI Interviewer Assistant (GPT integration)
* [ ] Payment System for Premium Sessions
* [ ] Calendar & Booking Integration

---

## 🧑‍💻 Contributors

| Name                | Role                                         | Contact                                             |
| ------------------- | -------------------------------------------- | --------------------------------------------------- |
| **Nguyen Quoc Anh** | Fullstack Developer / Project Lead           | [LinkedIn](https://www.linkedin.com/in/yourprofile) |
| Team Members        | Frontend, Backend, and AI Feature Developers | –                                                   |

---

## 📜 License

This project is licensed under the **MIT License**.
You’re free to use, modify, and distribute it with attribution.

---

> 💬 *"Practice like it's real. Perform like you've practiced."*
> — The **Intervu Team**

---

### 🖼️ Project Banner Suggestion (Optional)

If you want your README to look more professional, create a simple banner (e.g. via [Canva](https://canva.com)):

> **Size:** 1200×400 px
> **Content:** Intervu logo + tagline “Mock Interviews. Real Growth.”
> Upload it and place it at the top:

```markdown
![Intervu Banner](./public/banner.png)
```

---

```
