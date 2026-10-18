# CreditMesh Backend Server

A Flask REST API backend providing authentication, profile management, invoicing, and financial transaction tracking for the CreditMesh frontend.

---

## 🛠️ How to Run in VS Code

### 1. Open Terminal in VS Code
Open the integrated terminal in VS Code:
```bash
Ctrl + `
```

### 2. Navigate to the Backend folder
```bash
cd Backend
```

### 3. Install Requirements
Install Flask and Flask-CORS:
```bash
pip install -r requirements.txt
```

### 4. Run the Server
```bash
python app.py
```

The server will start on:
```
http://127.0.0.1:5000
```

---

## 📡 API Endpoints Overview

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/` | Health check & API status |
| `POST` | `/send-otp` | Generates 6-digit OTP code (Demo: `123456`) |
| `POST` | `/verify-otp` | Verifies OTP and registers user session |
| `POST` | `/create-profile` | Updates selected occupation profile |
| `GET` | `/profile/<id>` | Retrieves user profile details |
| `PUT` | `/profile/<id>` | Updates name, email, or phone number |
| `DELETE` | `/profile/<id>` | Clears user and deletes account |
| `GET` | `/invoices/` | Lists business invoices |
| `POST` | `/invoices/` | Creates a new invoice with status & customer |
| `GET` | `/finance/` | Returns transactions and income/expense totals |
| `POST` | `/finance/` | Adds a new income or expense transaction |

---

## 💾 Database
* Automatically creates and manages a local **SQLite** database (`creditmesh.db`) on startup.
* Pre-seeded with realistic gig-economy demo records (Swiggy, Zomato, Blinkit).
* Zero external database setup needed.
