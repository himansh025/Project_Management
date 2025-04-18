# 📁 Project Management App

A simple and efficient project management system with separate **Admin** and **User** roles.

---

## 🚀 Key Features

- **Admin:**
  - Create/edit/delete projects and tasks
  - Assign tasks with priority & status
  - Add comments to tasks
  - View all users and their task/project info

- **User:**
  - View assigned projects and tasks
  - Comment on tasks
  - Access dashboard and task list

- **Both:**
  - Login system with role-based access
  - Task comment section (visible to all involved)

---

## 📄 Pages Overview

- **Dashboard:** Projects & tasks overview
- **Project Details:** All tasks under a project
- **Task List:** Tasks from all projects
- **Users Page (Admin):** All users and their assignments

---

## 🧪 Test Credentials

**Admin**  
- Email: `himanshu@gmail.com`  
- Password: `123456`

**User**  
- Email: `john@example.com`  
- Password: `123456`

---

## 🛠️ Tech Stack

- **Frontend:** React, Axios, Tailwind
- **Backend:** Node.js, Express
- **DB:** MongoDB
- **Auth:** JWT

---

## ▶️ Getting Started

```bash
# Clone the repo
git clone https://github.com/himansh025/Project_Management-app.git

# Install frontend and backend dependencies
cd client && npm install
cd ../server && npm install

# Run backend
cd server && npm run dev

# Run frontend
cd ../client && npm start
