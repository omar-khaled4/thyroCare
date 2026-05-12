# 🚀 Backend API Layer - ThyroidCare

This is the backend service for the **ThyroidCare** project, built with **Node.js**, **Express**, and **MongoDB**. It provides the API endpoints for user authentication, data management, and integration with OpenAI.

---

## 🛠️ Prerequisites

Before you begin, ensure you have the following installed on your local machine:

- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- [npm](https://www.npmjs.com/) (usually comes with Node.js)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) 
    -> you should have an account on it , and add your current ip address to the whitelist

---

## ⚙️ Setup & Installation

Follow these steps to get the backend running locally:

### 1. Install Dependencies
Navigate to the `BackEndLayer` directory and run:
```bash
npm install
```

### 2. Environment Configuration ⚠️
You **must** set up your environment variables for the server to connect to the database and handle authentication.

1. Create a new file named `.env` in the root of the `BackEndLayer` directory.
2. Copy the contents of `.env.example` and paste them into your new `.env` file.
3. Update the values if necessary (e.g., if you want to use a different port or a local MongoDB URI).

**Example Command (Bash):**
```bash
cp .env.example .env
```

---

## 🚀 Running the Server

To start the server, use the following command:

```bash
node src/server.js
```

Once started, you should see a message in your terminal:
`🚀 Server running on http://localhost:5000/`

---

## 🔑 Key Environment Variables

| Variable | Description |
| :--- | :--- |
| `PORT` | The port the server will listen on (Default: `5000`). |
| `MONGODB_URI` | Your MongoDB connection string. |
| `JWT_SECRET` | Secret key used for signing JSON Web Tokens. |
| `JWT_EXPIRES_IN` | Expiration time for tokens (e.g., `7d`). |
| `OPENAI_API_KEY` | Your OpenAI API key for AI-related features. |

---

## 📁 Project Structure

```text
BackEndLayer/
├── src/
│   ├── config/      # Database and other configurations
│   ├── controllers/ # Request handlers
│   ├── middlewares/ # Express middlewares (Auth, etc.)
│   ├── models/      # Mongoose schemas
│   ├── routes/      # API route definitions
│   ├── utils/       # Helper functions
│   ├── app.js       # Express app setup
│   └── server.js    # Entry point
├── .env.example     # Template for environment variables
└── package.json     # Project dependencies and scripts
```

---

## 🧪 API Documentation
The backend API documentation will be accessible at this file:
`ThyroCare.postman_collection.json`provided as a json file. if you have antigravity, you can let him explore the file to understand the API.

## 🧪 API Base URL
The backend API will be accessible at:
`http://localhost:5000/api` (Verify routes in `src/routes`)
