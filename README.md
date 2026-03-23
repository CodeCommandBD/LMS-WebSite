<div align="center">

![React](https://img.shields.io/badge/React_18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_3-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socket.io&logoColor=white)
![Stripe](https://img.shields.io/badge/Stripe-008CDD?style=for-the-badge&logo=stripe&logoColor=white)

# 🎓 EduHub LMS Platform

### Next-Generation E-Learning Experience

<div align="center">
  <a href="https://lms-eduhub.vercel.app/">
    <img src="https://img.shields.io/badge/Deployed_on-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Deployed on Vercel" />
  </a>
  <a href="https://lms-eduhub.vercel.app/">
    <img src="https://img.shields.io/badge/🚀_Live_Demo-Visit_Site-7c3aed?style=for-the-badge" alt="Live Demo" />
  </a>
</div>

<p align="center">
  A comprehensive, full-stack Learning Management System connecting passionate educators with eager learners around the globe.
</p>

</div>

---

## 📋 Table of Contents

- [📖 Introduction](#-introduction)
- [✨ Key Features](#-key-features)
- [🎯 Feature Showcase](#-feature-showcase)
- [📊 System Architecture](#-system-architecture)
- [⚙️ Tech Stack](#️-tech-stack)
- [📁 Project Structure](#-project-structure)
- [🚀 Getting Started](#-getting-started)
- [🔐 Environment Configuration](#-environment-configuration)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

---

## 📖 Introduction

**EduHub LMS** is a modern, production-ready full-stack learning platform designed to revolutionize digital education. Built with **React Native (Vite)** and a robust **Node.js/Express** backend, it offers:

- 🎥 **HD Video Streaming** with progress tracking
- 💯 **Gamification** via leaderboards and points systems
- 💳 **Secure Payments** via Stripe
- 📝 **Interactive Quizzes & Notes** for active learning
- 💬 **Real-time Notifications & Q&A** powered by Socket.io
- 📜 **Dynamic Certificates** that are publicly verifiable
- 👥 **Advanced Role Management** (Admin, Teacher, Student)

---

## ✨ Key Features

### For Students (Learners)
- 🔍 **Smart Course Search** - Find courses with dynamic filters (level, category).
- 📅 **Interactive Dashboard** - Track enrolled courses and learning progress.
- 🎓 **Dynamic Certifications** - Earn and share verifiable certificates upon completion.
- 💬 **Course Q&A & Notes** - Engage with teachers directly and store private lecture notes.
- 💰 **Secure Checkout** - Seamless course purchases using Stripe.
- 🏆 **Gamified Learning** - Earn points for quizzes/completions and climb the Leaderboard.
- 📱 **Real-time Alerts** - Get instant notifications for replies, announcements, and more.

### For Instructors (Teachers)
- 📊 **Earnings Dashboard** - Track course sales, enrollments, and revenue metrics.
- 🛠️ **Course Builder** - Upload videos, add descriptions, and manage curriculum modules.
- 📝 **Quiz Maker** - Create graded assessments for students.
- 💬 **Student Engagement** - Answer Q&A threads and interact via blog comments.
- 🌐 **Instructor Profile** - Showcase expertise with social links and published courses.

### For Admins
- 🎛️ **Super Dashboard** - Complete system oversight, user analytics, and revenue tracking.
- 👤 **Role Management** - Promote users, ban accounts, and manage system permissions.
- 🏪 **Content Moderation** - Manage course categories, blog posts, and reviews.
- 💸 **Site Settings** - Customize branding, modify AdSense integration, and control site-wide features.
- 📢 **Broadcast Notifications** - Send real-time global messages to all active users.

---

## 🎯 Feature Showcase

We have carefully designed the interface to be responsive, intuitive, and visually stunning. Below are key highlights of the platform.

### 🏠 Platform Gateway & Discovery

| User Interface | Feature Details |
| :---: | :--- |
| <div align="center"><img src="./client/src/assets/Lms%207%20Home%20page.webp" width="90%" /></div> | **Dynamic Homepage**<br><br>A visually engaging landing page featuring top-rated courses, category filters, and immediate access to the learning catalog. |
| <div align="center"><img src="./client/src/assets/LMS%205%20All%20Course%20page.webp" width="90%" /></div> | **Course Exploration**<br><br>Advanced course catalog with infinite scrolling, dynamic searching, and comprehensive category filtering. |
| <div align="center"><img src="./client/src/assets/LMS%204%20course%20Details%20page.webp" width="90%" /></div> | **Course Details & Checkout**<br><br>Detailed presentation showing curriculum, instructor info, requirements, and secure Stripe checkout integration. |

### 🎓 Learning & Student Experience

| User Interface | Feature Details |
| :---: | :--- |
| <div align="center"><img src="./client/src/assets/LMS%202%20student%20Profile%20page.webp" width="90%" /></div> | **Student Profile & Dashboard**<br><br>Centralized learning hub for students to track enrolled courses, view certificates, and manage their points history. |

### 📰 Community & Blog

| User Interface | Feature Details |
| :---: | :--- |
| <div align="center"><img src="./client/src/assets/LMS%206%20All%20Blog%20page.webp" width="90%" /></div> | **Community Blog Hub**<br><br>A space for instructors to share knowledge and for students to read articles related to their tech stacks. |
| <div align="center"><img src="./client/src/assets/LMS%203%20Blog%20Details%20page.webp" width="90%" /></div> | **Article & Interactions**<br><br>Immersive reading experience featuring rich-text formatting, comment sections, and social sharing capabilities. |

### 👮 Platform Administration

| User Interface | Feature Details |
| :---: | :--- |
| <div align="center"><img src="./client/src/assets/LMS%201%20Dashboard%20Home.webp" width="90%" /></div> | **Admin Mission Control**<br><br>Comprehensive admin dashboard showing real-time revenue, enrollment stats, user growth, and actionable analytics. |


---

## 📊 System Architecture

Our platform uses a distinct separation of concerns, ensuring high performance and ease of maintenance. Below are the detailed flows of our core systems.

### 1. High-Level Data Flow

```mermaid
graph TB
    Client[Frontend<br/>React + Vite]
    API[Backend API<br/>Node.js + Express]
    DB[(MongoDB<br/>Primary Database)]
    Socket[WebSocket<br/>Socket.io]

    Client <-->|REST HTTP| API
    Client <-->|Real-time| Socket
    API <--> DB
    Socket <--> API

    External[External Services<br/>Stripe, Cloudinary, NodeMailer]
    API --> External
```

### 2. Course Purchase & Enrollment Flow

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Server
    participant Stripe
    participant DB

    User->>Frontend: Clicks "Buy Course"
    Frontend->>Server: POST /purchase/checkout
    Server->>Stripe: Create Stripe Checkout Session
    Stripe-->>Server: Return Session URL
    Server-->>Frontend: Send Session URL
    Frontend->>User: Redirect to Stripe
    User->>Stripe: Complete Payment
    Stripe->>Server: Webhook (checkout.session.completed)
    Server->>DB: Add Course to User's Enrolled List
    Server->>DB: Record Purchase Analytics
    Server-->>Frontend: Payment Success Confirmed
    Frontend->>User: Show Success & Unlock Course
```

### 3. Gamification & Gamified Learning Flow

```mermaid
graph TD
    A[Student Takes Quiz] -->|Scores Passed| B(Grade Evaluated)
    B -->|Passed| C{Is 100%?}
    C -->|Yes| D[Award Full Points]
    C -->|No| E[Award Partial Points]
    D --> F[Update User Document]
    E --> F
    F --> G[Generate Point History Record]
    G --> H[Update Student Leaderboard]
    H --> I[Socket.io Broadcast to Leaderboard Clients]
```

---

## ⚙️ Tech Stack

### Frontend
- **Framework**: React 18, Vite
- **Styling**: Tailwind CSS, Shadcn UI (Radix)
- **State Management**: Redux Toolkit
- **Data Fetching**: React Query (TanStack)
- **Routing**: React Router DOM

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Authentication**: JWT (JSON Web Tokens), bcryptjs
- **Real-time**: Socket.io

### Third-Party Services
- **Payments**: Stripe Checkout
- **Media Storage**: Cloudinary (Video & Image hosting)
- **Email Delivery**: Nodemailer (SMTP)

---

## 📁 Project Structure

```bash
LMS-WebSite/
├── client/                     # Frontend Application (Vite + React)
│   ├── src/
│   │   ├── assets/             # Images and static assets
│   │   ├── components/         # Reusable React components (UI, Admin, etc.)
│   │   ├── features/           # Redux slices (auth, course, etc.)
│   │   ├── lib/                # API configurations, Socket connection
│   │   ├── Pages/              # Page components (Home, Course, Dashboard)
│   │   └── App.jsx             # Main Router configuration
│
├── server/                     # Backend API (Node.js + Express)
│   ├── Controller/             # Business logic (User, Course, Auth, etc.)
│   ├── middleware/             # Auth & Role verification (Admin/Teacher)
│   ├── models/                 # Mongoose DB Schemas
│   ├── Routers/                # API Route definitions
│   ├── utils/                  # Cloudinary, Stripe, Email helpers
│   └── index.js                # Server entry point
│
├── .env                        # Server Environment Variables
└── client/.env                 # Client Environment Variables
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: 18.x or higher
- **MongoDB**: Atlas account or local instance
- **Cloudinary**: Account for course media
- **Stripe**: Developer account for payments

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/CodeCommandBD/LMS-WebSite.git
   cd LMS-WebSite
   ```

2. **Install Server Dependencies**
   ```bash
   npm install
   ```

3. **Install Client Dependencies**
   ```bash
   cd client
   npm install
   ```

4. **Run Development Servers (Concurrently)**
   Open two terminals:

   *Terminal 1 (Backend):*
   ```bash
   # From root directory
   npm run dev
   ```

   *Terminal 2 (Frontend):*
   ```bash
   # From client directory
   npm run dev
   ```

   Visit `http://localhost:5173`

---

## 🔐 Environment Configuration

Create a `.env` file in the **root (`server`) directory**:

```env
# Server
PORT=4000
NODE_ENV=development

# Database
MONGO_URL=mongodb+srv://...

# Security
JWT_SECRET=your_super_secret_key

# Cloudinary (Media)
CLOUD_NAME=your_cloud_name
CLOUD_API_KEY=your_api_key
CLOUD_API_SECRET=your_api_secret

# Stripe (Payments)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Email (Nodemailer)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EMAIL_FROM="LMS Platform <noreply@lms.com>"

# Frontend URL
CLIENT_URL=http://localhost:5173
```

Create a `.env` file in the **`client` directory**:

```env
VITE_API_URL=http://localhost:4000/api/v1
VITE_SERVER_URL=http://localhost:4000
```

---

## 🤝 Contributing
Contributions are always welcome! Feel free to open issues or submit Pull Requests to help improve the platform.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License
This project is licensed under the ISC License. 

---

<div align="center">
  <b>Built for modern education. Enjoy learning! 🚀</b>
</div>
