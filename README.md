# 🧠 Simple Quiz - Teal Edition 🚀

## 🎯 Quick Start
```
# Backend (recommended - API + scores)
cd backend
npm install
npm start
```
→ Open **http://localhost:3000**

**OR Frontend-only (offline fallback)**
```
# Just open in browser (uses 7 hardcoded questions)
index.html
```

**✅ Backend auto-inits DB** (`backend/quiz.db`)

**✅ Backend running** - DB auto-init (`backend/quiz.db`)

## ✨ New Teal Theme Features
- **Colors:** Teal gradients (#14b8a6 → #0f766e), glassmorphism
- **Animations:** Fade-in, hover scales, bounce/shake feedback, **confetti** on score!
- **Ripple buttons**, progress bar, 30px rounded glass cards
- **Simplified code:** Vanilla JS, ~250 lines, ultra-smooth UX
- Responsive + accessible

## 🎮 Play
1. Open **http://localhost:3000**
2. Answer 5 DB questions → **Finish** → score + name → **saved forever**
3. 🎉 Confetti + leaderboard eligible
4. **Play Again** anytime

## 🛠 Tech Stack
```
Backend: Node/Express + SQLite (persistent scores)
Frontend: Single HTML (CSS-in-JS animations)
APIs: /questions (GET), /scores (POST/GET)
```

## 🔍 Test
```
http://localhost:3000/api/questions    # JSON quiz data
http://localhost:3000/api/scores       # Top 10 scores
```

**Stop:** Ctrl+C

**Windows-ready** - Node.js LTS required. Fully functional! 🎉
