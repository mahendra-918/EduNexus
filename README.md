# EduNexus - A Mini Learning Management System (LMS)

EduNexus is a full-stack MERN application built as a mini-LMS. It allows instructors to create courses and add assignments, while students can enroll in those courses, submit their work, and communicate in a real-time chat.

## 🚀 Core Features Implemented

* **Authentication:** JWT-based authentication for user registration and login.
* **User Roles:** Three distinct roles: Student, Instructor, and Admin.
* **Course Management:**
    * Instructors can create new courses with a title and description.
    * Logged-in users can see a list of all available courses.
    * Students can view course details and enroll in courses.
* **Assignment System:**
    * Instructors can add assignments (title, description, due date) to their courses.
    * Enrolled students can view assignments.
    * Students can submit assignments by providing a URL (e.g., Google Doc or GitHub link).
* **Real-time Chat:**
    * A global chat room for all logged-in users, built with Socket.io.
    * Users can send and receive messages in real-time.

## 🛠️ Tech Stack

* **Frontend:** React (with Vite), React Router, Axios, Socket.io-client
* **Backend:** Node.js, Express
* **Database:** MongoDB (with Mongoose)
* **Authentication:** JSON Web Tokens (JWT) & bcryptjs
* **Real-time:** Socket.io

---

## 🏁 Getting Started

### Prerequisites

* [Node.js](https://nodejs.org/en/)
* [MongoDB](https://www.mongodb.com/try/download/community) (or a free MongoDB Atlas account)

### 1. Server Setup (Backend)

1.  Navigate to the `/server` directory:
    ```sh
    cd server
    ```
2.  Install the dependencies:
    ```sh
    npm install
    ```
3.  Create a `.env` file in the `/server` directory and add the following variables:
    ```
    PORT=5001
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_super_secret_key
    ```
4.  Run the server:
    ```sh
    npm run server
    ```
    The server will be running on `http://localhost:5001`.

### 2. Client Setup (Frontend)

1.  Open a new terminal and navigate to the `/client` directory:
    ```sh
    cd client
    ```
2.  Install the dependencies:
    ```sh
    npm install
    ```
3.  Run the client:
    ```sh
    npm run dev
    ```
    The React app will be running on `http://localhost:5173`.

###  Demo Credentials (for your `README.md`)

You can provide sample login credentials for anyone testing your project.

* **Role:** Instructor
    * **Email:** `instructor@example.com`
    * **Password:** `123456`
* **Role:** Student
    * **Email:** `student@example.com`
    * **Password:** `123456`