from flask import Flask, request, jsonify
from flask_cors import CORS
import random
import os
from database import get_db_connection, init_db, seed_vendor_demo_data
from calculations import calculate_financial_metrics

app = Flask(__name__)
# Enable CORS for all routes and origins
CORS(app, resources={r"/*": {"origins": "*"}})

# In-memory store for active OTPs (phone -> otp)
active_otps = {}

# Initialize SQLite database on startup
init_db()

# ============================================================
# HEALTH CHECK
# ============================================================
@app.route("/", methods=["GET"])
def health_check():
    return jsonify({
        "status": "online",
        "service": "CreditMesh API",
        "version": "2.0.0",
        "message": "CreditMesh Financial Readiness & Risk Assessment Engine is online"
    }), 200

# ============================================================
# AUTHENTICATION & ONBOARDING
# ============================================================
@app.route("/send-otp", methods=["POST"])
def send_otp():
    data = request.get_json() or {}
    phone = data.get("phone", "").strip()

    # Digits-only validation
    digits = "".join(filter(str.isdigit, phone))
    if len(digits) < 10:
        return jsonify({"success": False, "message": "Please provide a valid 10-digit mobile number"}), 400
    phone = digits[-10:]

    # Generate transparent demo code
    demo_otp = "123456"
    active_otps[phone] = demo_otp

    print(f"[AUTH] Generated OTP for +91 {phone}: {demo_otp}")

    return jsonify({
        "success": True,
        "message": f"Verification code sent to +91 {phone} (Demo Code: {demo_otp})",
        "otp": demo_otp
    }), 200

@app.route("/verify-otp", methods=["POST"])
def verify_otp():
    data = request.get_json() or {}
    phone = str(data.get("phone", "")).strip()
    otp = str(data.get("otp", "")).strip()

    digits = "".join(filter(str.isdigit, phone))
    if len(digits) < 10:
        return jsonify({"success": False, "message": "Valid 10-digit phone number is required"}), 400
    phone = digits[-10:]

    expected_otp = active_otps.get(phone, "123456")
    if otp != expected_otp and otp != "123456":
        return jsonify({"success": False, "message": "Invalid OTP code. Please enter 123456 for demo verification."}), 400

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE phone = ?", (phone,))
    user = cursor.fetchone()

    if not user:
        cursor.execute('''
            INSERT INTO users (phone, name, occupation, profile_type, business_type, approx_monthly_income, approx_monthly_expenses, consent_data_sharing)
            VALUES (?, 'New User', 'Independent Earner', 'gig', 'Micro-Enterprise', 25000, 15000, 1)
        ''', (phone,))
        conn.commit()
        user_id = cursor.lastrowid
    else:
        user_id = user["id"]

    conn.close()

    return jsonify({
        "success": True,
        "user_id": user_id,
        "phone": phone,
        "message": "Phone verified successfully"
    }), 200

@app.route("/register", methods=["POST"])
def register_user():
    data = request.get_json() or {}
    name = str(data.get("name", "")).strip()
    phone = str(data.get("phone", "")).strip()
    email = str(data.get("email", "")).strip()
    location = str(data.get("location", "Bangalore, Karnataka")).strip()
    profile_type = str(data.get("profile_type", "vendor")).strip()
    business_type = str(data.get("business_type", "Street Vendor / Small Business")).strip()
    consent = 1 if data.get("consent_data_sharing", True) else 0

    if not name:
        return jsonify({"success": False, "message": "Full name is required"}), 400

    digits = "".join(filter(str.isdigit, phone))
    phone = digits[-10:] if len(digits) >= 10 else f"98{random.randint(10000000, 99999999)}"

    try:
        monthly_income = float(data.get("approx_monthly_income", 28000) or 28000)
        monthly_expenses = float(data.get("approx_monthly_expenses", 17000) or 17000)
    except (ValueError, TypeError):
        monthly_income = 28000
        monthly_expenses = 17000

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE phone = ?", (phone,))
    user = cursor.fetchone()

    if user:
        cursor.execute('''
            UPDATE users
            SET name = ?, email = COALESCE(NULLIF(?, ''), email),
                location = ?, profile_type = ?, occupation = ?, business_type = ?,
                approx_monthly_income = ?, approx_monthly_expenses = ?, consent_data_sharing = ?
            WHERE phone = ?
        ''', (name, email, location, profile_type, business_type, business_type, monthly_income, monthly_expenses, consent, phone))
        user_id = user["id"]
    else:
        cursor.execute('''
            INSERT INTO users (name, phone, email, location, profile_type, occupation, business_type, approx_monthly_income, approx_monthly_expenses, consent_data_sharing)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (name, phone, email or f"{name.lower().replace(' ', '.')}@example.com", location, profile_type, business_type, business_type, monthly_income, monthly_expenses, consent))
        user_id = cursor.lastrowid

    # If user has no monthly records, seed initial baseline using their stated income/expenses
    cursor.execute("SELECT COUNT(*) as cnt FROM monthly_records WHERE user_id = ?", (user_id,))
    if cursor.fetchone()["cnt"] == 0:
        months = [("May", 1, 0.95), ("Jun", 2, 1.0), ("Jul", 3, 0.98), ("Aug", 4, 1.05), ("Sep", 5, 1.02), ("Oct", 6, 1.08)]
        for m_name, idx, factor in months:
            inc = round(monthly_income * factor)
            exp = round(monthly_expenses * factor)
            sav = round(max(0, (inc - exp) * 0.4))
            cursor.execute('''
                INSERT INTO monthly_records (user_id, month_label, month_index, income, expenses, savings, notes)
                VALUES (?, ?, ?, ?, ?, ?, 'Initial estimated baseline')
            ''', (user_id, m_name, idx, inc, exp, sav))

    conn.commit()
    conn.close()

    return jsonify({
        "success": True,
        "user_id": user_id,
        "name": name,
        "phone": phone,
        "profile_type": profile_type,
        "business_type": business_type,
        "message": "User registered and profile initialized successfully"
    }), 201

# ============================================================
# USER PROFILE MANAGEMENT
# ============================================================
@app.route("/profile/<user_id>", methods=["GET"])
def get_profile(user_id):
    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        uid = int(user_id)
        cursor.execute("SELECT * FROM users WHERE id = ?", (uid,))
    except ValueError:
        cursor.execute("SELECT * FROM users WHERE phone = ? LIMIT 1", (user_id,))

    user = cursor.fetchone()
    if not user:
        cursor.execute("SELECT * FROM users WHERE id = 101 LIMIT 1")
        user = cursor.fetchone()

    conn.close()

    if not user:
        return jsonify({"success": False, "message": "User profile not found"}), 404

    return jsonify({
        "success": True,
        "id": user["id"],
        "name": user["name"],
        "email": user["email"],
        "phone": user["phone"],
        "dob": user["dob"],
        "location": user["location"],
        "occupation": user["occupation"],
        "profile_type": user["profile_type"],
        "business_type": user["business_type"] or user["occupation"],
        "approx_monthly_income": user["approx_monthly_income"],
        "approx_monthly_expenses": user["approx_monthly_expenses"],
        "consent_data_sharing": bool(user["consent_data_sharing"])
    }), 200

@app.route("/profile/<user_id>", methods=["PUT"])
def update_profile(user_id):
    data = request.get_json() or {}
    name = data.get("name")
    email = data.get("email")
    phone = data.get("phone")
    location = data.get("location")
    occupation = data.get("occupation")
    business_type = data.get("business_type") or occupation
    approx_income = data.get("approx_monthly_income")
    approx_expenses = data.get("approx_monthly_expenses")
    consent = data.get("consent_data_sharing")

    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        uid = int(user_id)
        cursor.execute('''
            UPDATE users 
            SET name = COALESCE(?, name),
                email = COALESCE(?, email),
                phone = COALESCE(?, phone),
                location = COALESCE(?, location),
                occupation = COALESCE(?, occupation),
                business_type = COALESCE(?, business_type),
                approx_monthly_income = COALESCE(?, approx_monthly_income),
                approx_monthly_expenses = COALESCE(?, approx_monthly_expenses),
                consent_data_sharing = COALESCE(?, consent_data_sharing)
            WHERE id = ?
        ''', (name, email, phone, location, occupation, business_type, approx_income, approx_expenses, consent, uid))
    except ValueError:
        cursor.execute('''
            UPDATE users 
            SET name = COALESCE(?, name),
                email = COALESCE(?, email),
                location = COALESCE(?, location),
                occupation = COALESCE(?, occupation),
                business_type = COALESCE(?, business_type),
                approx_monthly_income = COALESCE(?, approx_monthly_income),
                approx_monthly_expenses = COALESCE(?, approx_monthly_expenses),
                consent_data_sharing = COALESCE(?, consent_data_sharing)
            WHERE phone = ?
        ''', (name, email, location, occupation, business_type, approx_income, approx_expenses, consent, user_id))

    conn.commit()
    conn.close()

    return jsonify({
        "success": True,
        "message": "Profile updated successfully"
    }), 200

@app.route("/profile/<user_id>", methods=["DELETE"])
def delete_profile(user_id):
    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        uid = int(user_id)
        cursor.execute("DELETE FROM invoices WHERE user_id = ?", (uid,))
        cursor.execute("DELETE FROM transactions WHERE user_id = ?", (uid,))
        cursor.execute("DELETE FROM monthly_records WHERE user_id = ?", (uid,))
        cursor.execute("DELETE FROM users WHERE id = ?", (uid,))
    except ValueError:
        cursor.execute("DELETE FROM users WHERE phone = ?", (user_id,))

    conn.commit()
    conn.close()

    return jsonify({
        "success": True,
        "message": "User profile and all associated data permanently deleted"
    }), 200

# ============================================================
# MONTHLY FINANCIAL RECORDS (6-Month History)
# ============================================================
@app.route("/financial-records/<user_id>", methods=["GET"])
def get_financial_records(user_id):
    try:
        uid = int(user_id)
    except ValueError:
        uid = 101

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''
        SELECT * FROM monthly_records 
        WHERE user_id = ? 
        ORDER BY month_index ASC, id ASC
    ''', (uid,))
    rows = cursor.fetchall()
    conn.close()

    records = []
    for r in rows:
        records.append({
            "id": r["id"],
            "month_label": r["month_label"],
            "month_index": r["month_index"],
            "income": float(r["income"]),
            "expenses": float(r["expenses"]),
            "savings": float(r["savings"] or 0),
            "surplus": round(float(r["income"]) - float(r["expenses"]), 2),
            "notes": r["notes"] or ""
        })

    return jsonify({
        "success": True,
        "user_id": uid,
        "count": len(records),
        "records": records
    }), 200

@app.route("/financial-records/<user_id>", methods=["POST"])
def save_financial_records(user_id):
    try:
        uid = int(user_id)
    except ValueError:
        uid = 101

    data = request.get_json() or {}
    records = data.get("records", [])

    if not isinstance(records, list) or len(records) == 0:
        return jsonify({"success": False, "message": "A non-empty list of monthly records is required"}), 400

    conn = get_db_connection()
    cursor = conn.cursor()

    # Clear existing records and replace with new set
    cursor.execute("DELETE FROM monthly_records WHERE user_id = ?", (uid,))

    for idx, r in enumerate(records, 1):
        month_label = str(r.get("month_label") or f"Month {idx}").strip()
        income = float(r.get("income", 0) or 0)
        expenses = float(r.get("expenses", 0) or 0)
        savings = float(r.get("savings", 0) or 0)
        notes = str(r.get("notes", "")).strip()

        cursor.execute('''
            INSERT INTO monthly_records (user_id, month_label, month_index, income, expenses, savings, notes)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', (uid, month_label, idx, income, expenses, savings, notes))

    conn.commit()
    conn.close()

    return jsonify({
        "success": True,
        "message": f"{len(records)} monthly financial records saved successfully"
    }), 200

# ============================================================
# INVOICE MANAGEMENT
# ============================================================
@app.route("/invoices/", methods=["GET"])
def get_invoices():
    user_id = request.args.get("user_id", "101")
    try:
        uid = int(user_id)
    except ValueError:
        uid = 101

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM invoices WHERE user_id = ? ORDER BY created_at DESC", (uid,))
    rows = cursor.fetchall()
    
    # If empty for this specific user, fetch all to be friendly in demo
    if not rows:
        cursor.execute("SELECT * FROM invoices ORDER BY created_at DESC")
        rows = cursor.fetchall()

    conn.close()

    invoices = []
    for r in rows:
        invoices.append({
            "id": r["id"],
            "cust": r["customer"],
            "customer": r["customer"],
            "amt": float(r["amount"]),
            "amount": float(r["amount"]),
            "service": r["service"] or "Service",
            "issue": r["issue_date"] or "Today",
            "issue_date": r["issue_date"] or "Today",
            "due": r["due_date"] or "In 7 Days",
            "due_date": r["due_date"] or "In 7 Days",
            "status": r["status"] or "pending",
            "method": r["payment_method"] or "UPI",
            "notes": r["notes"] or ""
        })

    return jsonify({
        "success": True,
        "count": len(invoices),
        "invoices": invoices
    }), 200

@app.route("/invoices/", methods=["POST"])
def create_invoice():
    data = request.get_json() or {}
    customer = str(data.get("customer") or data.get("cust", "")).strip()
    amount_raw = data.get("amount") if data.get("amount") is not None else data.get("amt")
    service = str(data.get("service") or "General Business Service").strip()
    issue_date = str(data.get("issue_date") or data.get("issue") or "Today").strip()
    due_date = str(data.get("due_date") or data.get("due") or "In 7 Days").strip()
    status = str(data.get("status", "pending")).lower().strip()
    method = str(data.get("payment_method") or data.get("method") or "UPI").strip()
    notes = str(data.get("notes", "")).strip()
    user_id = data.get("user_id", 101)

    if not customer:
        return jsonify({"success": False, "message": "Customer name is required"}), 400

    try:
        amount = float(amount_raw)
        if amount <= 0:
            return jsonify({"success": False, "message": "Invoice amount must be greater than zero"}), 400
    except (ValueError, TypeError):
        return jsonify({"success": False, "message": "Valid numerical amount is required"}), 400

    conn = get_db_connection()
    cursor = conn.cursor()

    # Generate custom Invoice ID if not supplied
    inv_id = data.get("id")
    if not inv_id:
        cursor.execute("SELECT COUNT(*) as cnt FROM invoices")
        cnt = cursor.fetchone()["cnt"] + 1025
        inv_id = f"INV-{cnt}"

    cursor.execute('''
        INSERT OR REPLACE INTO invoices (id, user_id, customer, amount, service, issue_date, due_date, status, payment_method, notes)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (inv_id, user_id, customer, amount, service, issue_date, due_date, status, method, notes))

    conn.commit()
    conn.close()

    return jsonify({
        "success": True,
        "message": f"Invoice {inv_id} created successfully",
        "invoice": {
            "id": inv_id,
            "customer": customer,
            "cust": customer,
            "amount": amount,
            "amt": amount,
            "service": service,
            "issue_date": issue_date,
            "issue": issue_date,
            "due_date": due_date,
            "due": due_date,
            "status": status,
            "method": method,
            "notes": notes
        }
    }), 201

@app.route("/invoices/<inv_id>/status", methods=["PATCH", "PUT"])
def update_invoice_status(inv_id):
    data = request.get_json() or {}
    new_status = str(data.get("status", "")).lower().strip()

    if new_status not in ["paid", "pending", "overdue"]:
        return jsonify({"success": False, "message": "Invalid status. Must be 'paid', 'pending', or 'overdue'"}), 400

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM invoices WHERE id = ?", (inv_id,))
    inv = cursor.fetchone()

    if not inv:
        conn.close()
        return jsonify({"success": False, "message": f"Invoice {inv_id} not found"}), 404

    cursor.execute("UPDATE invoices SET status = ? WHERE id = ?", (new_status, inv_id))
    conn.commit()
    conn.close()

    return jsonify({
        "success": True,
        "id": inv_id,
        "status": new_status,
        "message": f"Invoice {inv_id} status updated to {new_status.capitalize()}"
    }), 200

@app.route("/invoices/<inv_id>", methods=["DELETE"])
def delete_invoice(inv_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM invoices WHERE id = ?", (inv_id,))
    deleted = cursor.rowcount > 0
    conn.commit()
    conn.close()

    if not deleted:
        return jsonify({"success": False, "message": "Invoice not found"}), 404

    return jsonify({
        "success": True,
        "message": f"Invoice {inv_id} deleted successfully"
    }), 200

# ============================================================
# FINANCIAL READINESS REPORT & RISK INDICATORS
# ============================================================
@app.route("/readiness-report/<user_id>", methods=["GET"])
def get_readiness_report(user_id):
    try:
        uid = int(user_id)
    except ValueError:
        uid = 101

    conn = get_db_connection()
    cursor = conn.cursor()

    # 1. Fetch user
    cursor.execute("SELECT * FROM users WHERE id = ?", (uid,))
    user = cursor.fetchone()
    if not user:
        cursor.execute("SELECT * FROM users WHERE id = 101 LIMIT 1")
        user = cursor.fetchone()

    # 2. Fetch monthly records
    cursor.execute("SELECT * FROM monthly_records WHERE user_id = ? ORDER BY month_index ASC", (uid,))
    records = cursor.fetchall()

    # 3. Fetch invoices
    cursor.execute("SELECT * FROM invoices WHERE user_id = ?", (uid,))
    invoices = cursor.fetchall()
    conn.close()

    monthly_data = [dict(r) for r in records]
    invoice_data = [dict(i) for i in invoices]

    # Calculate metrics with real Python calculation engine
    metrics = calculate_financial_metrics(monthly_data, invoice_data)

    user_summary = {
        "id": user["id"] if user else uid,
        "name": user["name"] if user else "Borrower",
        "occupation": user["occupation"] if user else "Independent Earner",
        "business_type": user["business_type"] if user else "Micro-Business",
        "location": user["location"] if user else "Bangalore, Karnataka",
        "phone": user["phone"] if user else ""
    }

    return jsonify({
        "success": True,
        "user": user_summary,
        "metrics": metrics,
        "monthly_records": monthly_data,
        "invoices": invoice_data
    }), 200

@app.route("/calculate", methods=["POST"])
def live_calculate():
    """Live calculation endpoint for arbitrary input (what-if scenarios)."""
    data = request.get_json() or {}
    monthly_records = data.get("monthly_records", [])
    invoices = data.get("invoices", [])

    metrics = calculate_financial_metrics(monthly_records, invoices)
    return jsonify({
        "success": True,
        "metrics": metrics
    }), 200

# ============================================================
# BANK / INSTITUTION VIEW (Access-Controlled)
# ============================================================
@app.route("/institution-view/<user_id>", methods=["GET"])
def get_institution_view(user_id):
    try:
        uid = int(user_id)
    except ValueError:
        uid = 101

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE id = ?", (uid,))
    user = cursor.fetchone()

    if not user:
        conn.close()
        return jsonify({"success": False, "message": "Borrower record not found"}), 404

    # Verify borrower consent
    if not user["consent_data_sharing"]:
        conn.close()
        return jsonify({
            "success": False,
            "consented": False,
            "message": "Access Restricted: Borrower has not granted consent to share financial data with institutions."
        }), 403

    cursor.execute("SELECT * FROM monthly_records WHERE user_id = ? ORDER BY month_index ASC", (uid,))
    records = cursor.fetchall()
    cursor.execute("SELECT * FROM invoices WHERE user_id = ?", (uid,))
    invoices = cursor.fetchall()
    conn.close()

    metrics = calculate_financial_metrics([dict(r) for r in records], [dict(i) for i in invoices])

    # Institutional assessment payload
    return jsonify({
        "success": True,
        "consented": True,
        "borrower_summary": {
            "name": user["name"],
            "business_type": user["business_type"] or user["occupation"],
            "location": user["location"],
            "verification_status": "Consented Digital Signals"
        },
        "underwriting_indicators": metrics["indicators"],
        "cashflow_summary": {
            "avg_monthly_income": metrics["avg_income"],
            "avg_monthly_expenses": metrics["avg_expenses"],
            "monthly_surplus": metrics["monthly_surplus"],
            "surplus_margin_pct": metrics["surplus_margin_pct"],
            "income_stability_cv": metrics["cv_value"],
            "stability_label": metrics["consistency_label"]
        },
        "obligations_summary": {
            "total_outstanding_invoices": metrics["outstanding_amount"],
            "overdue_invoices_count": metrics["overdue_count"],
            "overdue_amount": metrics["overdue_amount"],
            "on_time_repayment_rate": f"{metrics['repayment_rate_pct']}%" if metrics['repayment_rate_pct'] else "N/A"
        },
        "estimated_safe_emi_capacity": metrics["safe_repayment_capacity"],
        "institutional_disclaimer": (
            "CreditMesh provides transparent alternative financial readiness indicators based on consented records. "
            "CreditMesh does not approve or reject loans. All lending terms, interest rates, and approval decisions "
            "are made solely by the evaluating financial institution in compliance with RBI guidelines."
        )
    }), 200

# ============================================================
# DEMO DATA SEEDER FOR JUDGES / EVALUATORS
# ============================================================
@app.route("/demo-data/vendor", methods=["POST"])
@app.route("/demo-data/vendor/<int:uid>", methods=["POST"])
def load_vendor_demo(uid=None):
    """Loads realistic Street Vendor demo data for seamless judge evaluation."""
    if uid is None:
        user_id = request.args.get("user_id", 101)
        try:
            uid = int(user_id)
        except ValueError:
            uid = 101

    success = seed_vendor_demo_data(uid)
    return jsonify({
        "success": success,
        "message": "Street Vendor demo data successfully loaded (6 months of sales, expenses, and invoices)."
    }), 200

@app.route("/demo-data/reset-empty", methods=["POST"])
@app.route("/demo-data/reset-empty/<int:uid>", methods=["POST"])
def reset_to_empty(uid=None):
    """Clears monthly records to demonstrate 'Insufficient Data' handling."""
    if uid is None:
        user_id = request.args.get("user_id", 101)
        try:
            uid = int(user_id)
        except ValueError:
            uid = 101

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM monthly_records WHERE user_id = ?", (uid,))
    conn.commit()
    conn.close()

    return jsonify({
        "success": True,
        "message": "User records cleared. Platform will now display 'Insufficient Data' state."
    }), 200

# ============================================================
# FINANCE TRANSACTIONS (Legacy compatibility)
# ============================================================
@app.route("/finance/", methods=["GET"])
def get_finance():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM transactions ORDER BY id DESC")
    rows = cursor.fetchall()
    conn.close()

    transactions = []
    total_income = 0
    total_expense = 0

    for r in rows:
        amt = float(r["amount"])
        if r["type"] == "income":
            total_income += amt
        else:
            total_expense += amt

        transactions.append({
            "id": r["id"],
            "title": r["title"],
            "type": r["type"],
            "category": r["category"],
            "amount": amt,
            "method": r["method"],
            "utr": r["utr"],
            "date": r["date"],
            "status": r["status"]
        })

    return jsonify({
        "success": True,
        "summary": {
            "total_income": total_income,
            "total_expense": total_expense,
            "net_cashflow": total_income - total_expense
        },
        "transactions": transactions
    }), 200

@app.route("/finance/", methods=["POST"])
def add_transaction():
    data = request.get_json() or {}
    title = data.get("title")
    tx_type = data.get("type", "income")
    amount = data.get("amount")
    category = data.get("category", "General")
    method = data.get("method", "UPI")
    utr = data.get("utr", f"UPI/{random.randint(1000000000, 9999999999)}")
    date_str = data.get("date", "Today")

    if not title or not amount:
        return jsonify({"success": False, "message": "Title and amount are required"}), 400

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO transactions (user_id, title, type, category, amount, method, utr, date, status)
        VALUES (101, ?, ?, ?, ?, ?, ?, ?, 'completed')
    ''', (title, tx_type, category, float(amount), method, utr, date_str))

    tx_id = cursor.lastrowid
    conn.commit()
    conn.close()

    return jsonify({
        "success": True,
        "message": "Transaction added successfully",
        "id": tx_id
    }), 201

# ============================================================
# MAIN ENTRYPOINT
# ============================================================
if __name__ == "__main__":
    print("=" * 60)
    print("[SERVER] CreditMesh Backend Server")
    print("   Running locally on: http://127.0.0.1:5000")
    print("   CORS enabled for all frontend origins")
    print("=" * 60)
    app.run(host="127.0.0.1", port=5000, debug=False)
