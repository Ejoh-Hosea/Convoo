# Full Stack Realtime Chat App

![Demo App](https://convoo-8yk5.onrender.com/)

A modern **full-stack real-time chat application** built with the **MERN stack**, featuring authentication, real-time messaging, online status, and theme customization.

---

## 🚀 Highlights

- 🌟 **Tech Stack:** MERN (MongoDB, Express, React, Node.js)
- ⚡ **Real-time messaging** with Socket.io
- 🔐 **Authentication & Authorization** using JWT + Cookies
- 🟢 **Online / Offline user status**
- 🎨 **Theme switching** with DaisyUI + Zustand
- 🧠 **Global state management** using Zustand
- ☁️ **Image uploads** via Cloudinary
- 🐞 Robust **error handling** (client & server)
- 🚀 **Production-ready deployment** for FREE

---

## 🗂️ Project Structure

### Frontend (`/frontend`)

```
src/
 ┣ constants/
 ┣ lib/
 ┣ pages/
 ┃ ┣ HomePage.jsx
 ┃ ┣ LoginPage.jsx
 ┃ ┣ ProfilePage.jsx
 ┃ ┣ SettingsPage.jsx
 ┃ ┗ SignUpPage.jsx
 ┣ store/
 ┃ ┣ useAuthStore.js
 ┃ ┣ useChatStore.js
 ┃ ┗ useThemeStore.js
 ┣ App.jsx
 ┣ main.jsx
 ┣ index.css
```

### Backend (`/backend`)

- REST API with Express
- JWT-based auth
- MongoDB with Mongoose
- Socket.io real-time layer

---

## 🛠️ Tech Stack

### Frontend

- React (Vite)
- TailwindCSS + DaisyUI
- Zustand
- Axios
- Socket.io Client
- React Router
- Lucide Icons

### Backend

- Node.js
- Express
- MongoDB + Mongoose
- Socket.io
- JWT
- bcryptjs
- Cloudinary

---

## 🔑 Environment Variables

Create a `.env` file in the **backend** directory:

```env
MONGODB_URI=your_mongodb_uri
PORT=5001
JWT_SECRET=your_jwt_secret

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

NODE_ENV=development
```

---

## 📦 Installation

### 1️⃣ Clone the repository

```bash
git clone https://github.com/your-username/chat-app.git
cd chat-app
```

### 2️⃣ Install dependencies

**Backend**

```bash
cd backend
npm install
```

**Frontend**

```bash
cd frontend
npm install
```

---

## 🧪 Development

**Run backend**

```bash
cd backend
npm run dev
```

**Run frontend**

```bash
cd frontend
npm run dev
```

---

## 🏗️ Build for Production

```bash
cd frontend
npm run build
```

---

## ▶️ Start Production Server

```bash
cd backend
npm start
```

---

## ⚙️ Features Overview

- 💬 Real-time 1-on-1 chat
- 🟢 Live online presence
- 🖼️ Profile image upload
- 🎨 Theme preview & switching
- 🔐 Secure authentication flow
- 🍪 HTTP-only cookies for auth
- 📱 Fully responsive UI

---

## 📸 Screenshots

_Add screenshots here to showcase features._

---

## 🧑‍💻 Author

**Ejoh Hosea Nwongwe**  
Full-Stack Developer

- GitHub: https://github.com/Ejoh-Hosea
- Portfolio: https://ejoh-hosea-portfolio.netlify.app/

---

## ⭐ Support

If you like this project, give it a ⭐ and feel free to fork it!  
Happy coding 🚀
