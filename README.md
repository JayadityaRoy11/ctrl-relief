# Ctrl+Relief 🚨

**AI-Powered Disaster Response & Volunteer Coordination Platform**

Ctrl+Relief is a smart platform designed to connect NGOs and volunteers during emergencies. It enables real-time coordination, intelligent volunteer matching, and efficient resource allocation.

---

## 🌍 Problem Statement

During disasters, NGOs struggle with:

* Lack of real-time visibility of volunteers
* Inefficient resource allocation
* Delayed response times
* Poor coordination across regions

---

## 💡 Solution

Ctrl+Relief provides:

* Intelligent volunteer matching based on skills, proximity, and availability
* Real-time task tracking and lifecycle management
* Dual dashboards for NGOs and volunteers
* Map-based coordination system
* AI-driven insights and recommendations

---

## 🚀 Key Features

### 🏢 NGO Dashboard

* Create emergency requests
* View incoming public requests
* Auto-assign best volunteers
* Track request lifecycle
* Rate volunteers

### 🙋 Volunteer Dashboard

* View matched requests
* Accept / reject tasks
* Track task progress
* Earn credits and ratings

### 🧠 AI Insights Engine

* Match confidence scoring
* Explainable AI reasoning
* Predictive demand insights

### 📍 Map Integration

* View nearby volunteers and NGOs
* Location-based coordination

### 🔔 Smart Notifications

* Simulated WhatsApp alerts
* Real-time task updates

---

## 🧱 Tech Stack

* **Frontend:** Next.js / React
* **Backend:** FastAPI
* **Maps:** Leaflet
* **Deployment:** Google Cloud Run + Vercel
* **State Management:** LocalStorage (simulation)

---

## 🧠 How It Works

1. NGO creates an emergency request
2. System matches best volunteers using scoring engine
3. Volunteers receive notifications and accept tasks
4. Task progresses through lifecycle
5. NGO tracks and rates completion

---

## ⚙️ Setup Instructions

### Clone repo

```bash
git clone https://github.com/your-username/ctrl-relief.git
cd ctrl-relief
```

### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## ☁️ Deployment

* Backend deployed on **Google Cloud Run**
* Frontend deployed on **Vercel**

---

## 🔮 Future Scope

* Real-time WhatsApp/SMS integration
* Machine Learning-based ranking models
* Offline-first support (PWA)
* Volunteer verification system

---

## 👥 Team

Built for Google Developer Hackathon 🚀

---

## 🏁 Final Note

Ctrl+Relief is designed not just as a demo, but as a **scalable, real-world disaster response platform**.
