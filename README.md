
---

# 🌍 Smart Travel Companion

**A full-stack web app that helps users track their location, monitor network status, and view nearby places using modern Web APIs.**

🔗 [Live Demo](https://smart-travel-companion.vercel.app)
📂 [Source Code](https://github.com/shibbu04/smart-travel-companion)

---

## ⚙️ Features

* Real-time geolocation tracking with map
* Network type and speed monitoring
* Lazy-loaded nearby places with animations
* Canvas-based path visualization
* Fully responsive UI (mobile-first)

---

## 🔗 Web APIs Used

* **Geolocation API** – Real-time location tracking
* **Network Information API** – Detect connection type & quality
* **Intersection Observer API** – Lazy-loading and scroll animations
* *(Optional: Canvas API, Background Tasks API for enhanced UX)*

---

## 🛠️ Tech Stack

**Frontend:**

* React + TypeScript
* Tailwind CSS
* Leaflet (Maps)
* Vite

**Backend:**

* Node.js + Express
* MongoDB (for storing location history)

---

## 🗂️ Project Structure

```
smart-travel-companion/
├── client/   # React Frontend
└── server/   # Node.js Backend
```

---

## 💻 Local Setup

### Prerequisites:

* Node.js (v18+)
* npm or yarn

### Steps:

```bash
git clone https://github.com/shibbu04/smart-travel-companion.git
cd smart-travel-companion
```

**Start Frontend:**

```bash
cd client
npm install
npm run dev
```

**Start Backend:**

```bash
cd server
npm install
npm start
```

Backend runs at `http://localhost:5000`
Frontend at `http://localhost:3000`

---

## 🔌 API Endpoints

**Base URL:** `http://localhost:5000/api`

* `GET /locations` – Get all saved locations
* `POST /locations` – Add new location
* `DELETE /locations` – Delete all locations
* `GET /health` – API status check

---

## 📎 License & Author

* **License**: MIT
* **Author**: [Shivam Singh](https://shivam04.tech/)

---
