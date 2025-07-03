# How to Run This Application

This document provides instructions on how to set up and run this project for development purposes.

## Prerequisites

- Node.js and npm
- Docker

## 1. Set up the Database with Docker

This project uses a MySQL database. You can easily run one using Docker with the following command:

```bash
docker run --name mysql-aicv -e MYSQL_ROOT_PASSWORD=password -e MYSQL_DATABASE=aicvmakeroauth -p 3306:3306 -d mysql:8
```

This command will:
- Create a new Docker container named `mysql-aicv`.
- Set the root password to `password`.
- Create a database named `aicvmakeroauth`.
- Map port `3306` on your local machine to port `3306` in the container.
- Run the official `mysql:8` image in detached mode.

## 2. Set up the Backend

1.  **Navigate to the `backend` directory:**
    ```bash
    cd backend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up your `.env` file:**
    Create a `.env` file in the root of the project and add the following content. These are placeholder values and should be replaced with your actual credentials for a production environment.

    ```dotenv
    # AI Service API Key (e.g., for Google Gemini)
    API_KEY=AIzaSyCZhzUxZJFGsqi7uK_NErThQKGb8mTtC3k

    # Google OAuth Client ID (for user Google Sign-In on frontend & backend verification)
    GOOGLE_CLIENT_ID=956644034092-s7c2h9ickfuh5ajd21ecbevocujn6rcd.apps.googleusercontent.com

    # Admin Email (for assigning admin role on login/signup)
    ADMIN_EMAIL=admin@example.com 

    # MySQL Database Configuration
    DB_HOST=localhost
    DB_USER=root
    DB_PASSWORD=password
    DB_NAME=aicvmakeroauth
    DB_PORT=3306

    # Backend Server Port (Optional, defaults to 3001 if not set)
    PORT=3001 

    # Google Analytics Data API Configuration
    GOOGLE_APPLICATION_CREDENTIALS=./service-account-key.json 
    GA_PROPERTY_ID=494200561 

    # Email (Nodemailer SMTP) Configuration
    SMTP_HOST=mail.onlinecvgenius.com
    SMTP_PORT=465 
    SMTP_SECURE=true 
    SMTP_USER=admin@onlinecvgenius.com 
    SMTP_PASS=Fb3bbc2cDDR 
    SMTP_FROM_EMAIL=admin@onlinecvgenius.com
    SMTP_FROM_NAME="AI CV Maker"

    # Frontend Base URL (for generating links in emails by the backend)
    FRONTEND_BASE_URL=http://localhost:5173 

    # --- Vite Environment Variables (Prefix with VITE_) ---
    # Google OAuth Client ID (for frontend Google Sign-In button)
    VITE_GOOGLE_CLIENT_ID=956644034092-s7c2h9ickfuh5ajd21ecbevocujn6rcd.apps.googleusercontent.com

    # Google Analytics Measurement ID (for gtag.js in index.html)
    VITE_GA_MEASUREMENT_ID=G-75BCGGH6CB
    ```

4.  **Start the backend server:**
    From the `backend` directory, run:
    ```bash
    npm start
    ```
    The server will start on the port specified in your `.env` file (defaulting to `3001`).

## 3. Set up the Frontend

1.  **Navigate to the `frontend` directory:**
    ```bash
    cd frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Start the frontend development server:**
    ```bash
    npm run dev
    ```
    The frontend will be available at `http://localhost:5173` (or another port if `5173` is in use). The Vite development server will proxy API requests to the backend.
