# HealthCRM - AI-First Healthcare CRM

An intelligent Customer Relationship Management (CRM) platform tailored for the healthcare industry. It empowers medical representatives to efficiently track interactions with doctors, manage medical products, and schedule follow-ups. The CRM is supercharged with a conversational AI agent that can summarize notes, answer specific queries about previous interactions, and provide actionable insights.

## Features
- **Dashboard:** Interactive overview of interactions and upcoming follow-ups.
- **Interaction Logging:** Comprehensive forms to record meetings with healthcare professionals (HCPs).
- **AI Agent (Chat):** Context-aware assistant powered by LangGraph and Groq LLMs. Can answer questions like "What did I discuss with Dr. Patel?" or "Who is interested in Metformin?".
- **Dynamic Database:** Reliable storage using MySQL and SQLAlchemy.

## Tech Stack
- **Frontend:** React, Vite, Redux Toolkit, Tailwind-like custom CSS UI components.
- **Backend:** FastAPI, Python, SQLAlchemy, PyMySQL.
- **AI Layer:** LangChain, LangGraph, Groq API (Llama 3 / Mixtral models).
- **Database:** MySQL.

---

## Prerequisites
Before you begin, ensure you have the following installed on your machine:
- **Node.js** (v16+)
- **Python** (v3.9+)
- **MySQL Server**
- **Groq API Key** (Get yours for free at [Groq Console](https://console.groq.com/keys))

---

## Getting Started

### 1. Database Setup
First, start your MySQL server and create an empty database for the CRM.
Log into your MySQL shell and run:
```sql
CREATE DATABASE crm_db;
```

### 2. Backend Setup
The backend handles API requests, database operations, and the AI agent logic.

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment (optional but recommended):
   ```bash
   python -m venv .venv
   # Windows:
   .venv\Scripts\activate
   # Mac/Linux:
   source .venv/bin/activate
   ```
3. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Configure Environment Variables:
   Open `backend/.env` (or create one) and update it with your actual MySQL credentials and Groq API key:
   ```env
   GROQ_API_KEY=your_groq_api_key_here

   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=crm_db
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   ```
5. Seed the Database:
   Populate the database with initial tables and dummy data so you have something to work with.
   ```bash
   python -m app.database.seed
   ```
6. Start the Backend Server:
   ```bash
   python main.py
   ```
   *The backend API will run on `http://localhost:8000`.*

### 3. Frontend Setup
The frontend is a modern React application powered by Vite.

1. Open a **new terminal** and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install Node dependencies:
   ```bash
   npm install
   ```
3. Start the Development Server:
   ```bash
   npm run dev
   ```
   *The frontend will run on `http://localhost:5173`.*

---

## Usage
1. Open your browser and go to `http://localhost:5173`.
2. Browse through your dashboard, interaction history, and analytics.
3. Click on the **Chat with AI** widget (usually in the bottom right corner or accessible from the History page).
4. Ask the AI agent things like:
   - *"What did I talk about with Dr. Sunita Reddy?"*
   - *"Which doctors are interested in Metformin XR?"*
   - *"Give me a summary of my interactions this week."*

---

## Troubleshooting
- **Database Connection Error (1045 Access Denied or 2003 Connection Refused):** Double-check your `DB_PASSWORD` and `DB_USER` in `backend/.env`. If your password has special characters like `@`, ensure the backend URL encoding in `config.py` is intact.
- **AI Agent Not Responding:** Ensure your `GROQ_API_KEY` is valid and hasn't exceeded its rate limit. Check the backend terminal logs for detailed error messages.
