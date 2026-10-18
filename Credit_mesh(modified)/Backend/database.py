import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(__file__), "creditmesh.db")

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()

    # Users table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            phone TEXT UNIQUE,
            name TEXT DEFAULT 'Ravi Kumar',
            email TEXT DEFAULT 'ravi.kumar@gmail.com',
            dob TEXT DEFAULT '15 March 2000',
            location TEXT DEFAULT 'Bangalore, Karnataka',
            occupation TEXT DEFAULT 'Delivery Partner',
            profile_type TEXT DEFAULT 'gig',
            business_type TEXT DEFAULT 'Delivery Partner',
            approx_monthly_income REAL DEFAULT 28500,
            approx_monthly_expenses REAL DEFAULT 17200,
            consent_data_sharing INTEGER DEFAULT 1,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')

    # Safe migrations for users table if existing db has older schema
    existing_user_cols = [c[1] for c in cursor.execute("PRAGMA table_info(users)").fetchall()]
    new_cols = [
        ("business_type", "TEXT DEFAULT 'Delivery Partner'"),
        ("approx_monthly_income", "REAL DEFAULT 28500"),
        ("approx_monthly_expenses", "REAL DEFAULT 17200"),
        ("consent_data_sharing", "INTEGER DEFAULT 1")
    ]
    for col_name, col_def in new_cols:
        if col_name not in existing_user_cols:
            cursor.execute(f"ALTER TABLE users ADD COLUMN {col_name} {col_def}")

    # Invoices table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS invoices (
            id TEXT PRIMARY KEY,
            user_id INTEGER,
            customer TEXT NOT NULL,
            amount REAL NOT NULL,
            service TEXT,
            issue_date TEXT,
            due_date TEXT,
            status TEXT DEFAULT 'pending',
            payment_method TEXT DEFAULT 'UPI',
            notes TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
    ''')

    # Transactions table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS transactions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            title TEXT NOT NULL,
            type TEXT NOT NULL, -- 'income' or 'expense'
            category TEXT,
            amount REAL NOT NULL,
            method TEXT DEFAULT 'UPI',
            utr TEXT,
            date TEXT,
            status TEXT DEFAULT 'completed',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
    ''')

    # 6-Month Financial Records table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS monthly_records (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            month_label TEXT NOT NULL,
            month_index INTEGER NOT NULL,
            income REAL NOT NULL,
            expenses REAL NOT NULL,
            savings REAL DEFAULT 0,
            notes TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
    ''')

    # Seed default user if not exists
    cursor.execute("SELECT * FROM users WHERE id = 101 OR phone = '9876543210'")
    user = cursor.fetchone()
    if not user:
        cursor.execute('''
            INSERT INTO users (id, phone, name, email, dob, location, occupation, profile_type, business_type, approx_monthly_income, approx_monthly_expenses, consent_data_sharing)
            VALUES (101, '9876543210', 'Ramesh Kumar', 'ramesh.vendor@gmail.com', '15 March 1992', 'KR Market, Bangalore', 'Street Vendor', 'vendor', 'Flower & Fruit Stall', 32000, 19500, 1)
        ''')

    # Seed initial monthly records if empty
    cursor.execute("SELECT COUNT(*) as count FROM monthly_records WHERE user_id = 101")
    if cursor.fetchone()['count'] == 0:
        cursor.executemany('''
            INSERT INTO monthly_records (user_id, month_label, month_index, income, expenses, savings, notes)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', [
            (101, 'May', 1, 28500, 17200, 4500, 'Regular city vendor sales'),
            (101, 'Jun', 2, 30200, 18100, 5000, 'Festival bump and bulk orders'),
            (101, 'Jul', 3, 29800, 17900, 4800, 'Stable monthly operations'),
            (101, 'Aug', 4, 33500, 19400, 6200, 'Independence Day weekend surge'),
            (101, 'Sep', 5, 31200, 18600, 5100, 'Regular retail & catering supply'),
            (101, 'Oct', 6, 34000, 19800, 6500, 'Navratri festive peak')
        ])

    # Seed initial invoices if empty
    cursor.execute("SELECT COUNT(*) as count FROM invoices")
    if cursor.fetchone()['count'] == 0:
        cursor.executemany('''
            INSERT INTO invoices (id, user_id, customer, amount, service, issue_date, due_date, status, payment_method, notes)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', [
            ('INV-1021', 101, 'Blinkit Local Hub', 8400, 'Bulk Produce Supply', '2026-10-01', '2026-10-15', 'paid', 'UPI', 'Weekly supply settlement'),
            ('INV-1022', 101, 'Sri Krishna Sweets', 12500, 'Festival Flower Garlands', '2026-10-04', '2026-10-18', 'paid', 'Bank', 'Diwali pre-booking batch'),
            ('INV-1023', 101, 'Meena Stores', 3200, 'Daily Fruit Supply', '2026-10-07', '2026-10-21', 'pending', 'UPI', 'Supply cycle #4'),
            ('INV-1024', 101, 'Local Tea Stall', 1200, 'Fresh Lemon & Ginger Batch', '2026-09-25', '2026-10-05', 'overdue', 'Cash', 'Follow-up requested')
        ])

    # Seed initial transactions if empty
    cursor.execute("SELECT COUNT(*) as count FROM transactions")
    if cursor.fetchone()['count'] == 0:
        cursor.executemany('''
            INSERT INTO transactions (user_id, title, type, category, amount, method, utr, date, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', [
            (101, 'UPI Daily QR Collection', 'income', 'Business Sale', 3850, 'UPI', 'UPI/4281920192', 'Oct 09', 'completed'),
            (101, 'Wholesale Mandi Purchase', 'expense', 'Inventory', 1850, 'UPI', 'UPI/4281920193', 'Oct 09', 'completed'),
            (101, 'Catering Advance Received', 'income', 'Advance', 2500, 'UPI', 'UPI/4281920194', 'Oct 08', 'completed'),
            (101, 'Pushcart Repair & Paint', 'expense', 'Maintenance', 650, 'Cash', 'CASH/REF001', 'Oct 07', 'completed'),
            (101, 'Bulk Fruit Order Settlement', 'income', 'Wholesale', 4200, 'Bank', 'NEFT/59201920', 'Oct 06', 'completed'),
            (101, 'Shop Stall Rent', 'expense', 'Rent', 1200, 'UPI', 'UPI/4281920196', 'Oct 05', 'completed')
        ])

    conn.commit()
    conn.close()
    print("[Database] SQLite database initialized successfully at", DB_PATH)

def seed_vendor_demo_data(user_id=101):
    """Resets user data to full Street Vendor demo profile for evaluators."""
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute('''
        UPDATE users
        SET name = 'Ramesh Kumar',
            occupation = 'Street Vendor / Small Business',
            profile_type = 'vendor',
            business_type = 'Flower & Fresh Produce Stall',
            location = 'KR Market, Bangalore',
            approx_monthly_income = 32000,
            approx_monthly_expenses = 19500,
            consent_data_sharing = 1
        WHERE id = ?
    ''', (user_id,))

    cursor.execute("DELETE FROM monthly_records WHERE user_id = ?", (user_id,))
    cursor.executemany('''
        INSERT INTO monthly_records (user_id, month_label, month_index, income, expenses, savings, notes)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    ''', [
        (user_id, 'May', 1, 28500, 17200, 4500, 'Summer regular street sales'),
        (user_id, 'Jun', 2, 30200, 18100, 5000, 'Flower market morning orders'),
        (user_id, 'Jul', 3, 29800, 17900, 4800, 'Stable retail footfall'),
        (user_id, 'Aug', 4, 33500, 19400, 6200, 'Varamahalakshmi festival sales bump'),
        (user_id, 'Sep', 5, 31200, 18600, 5100, 'Ganesh festival orders'),
        (user_id, 'Oct', 6, 34000, 19800, 6500, 'Navratri peak festive demand')
    ])

    cursor.execute("DELETE FROM invoices WHERE user_id = ?", (user_id,))
    cursor.executemany('''
        INSERT INTO invoices (id, user_id, customer, amount, service, issue_date, due_date, status, payment_method, notes)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', [
        ('INV-1021', user_id, 'Blinkit Quick Hub', 8400, 'Wholesale Fruit Supply', '2026-10-01', '2026-10-15', 'paid', 'UPI', 'Weekly fleet supply settled'),
        ('INV-1022', user_id, 'Sri Krishna Sweets', 12500, 'Festival Garlands', '2026-10-04', '2026-10-18', 'paid', 'Bank', 'Diwali pre-booking batch settled'),
        ('INV-1023', user_id, 'Meena Kirana Stores', 3200, 'Daily Lemon Supply', '2026-10-07', '2026-10-21', 'pending', 'UPI', 'Ongoing weekly supply'),
        ('INV-1024', user_id, 'Local Tea Stall Co', 1200, 'Fresh Ginger Batch', '2026-09-25', '2026-10-05', 'overdue', 'Cash', 'Follow-up call completed')
    ])

    conn.commit()
    conn.close()
    return True

if __name__ == "__main__":
    init_db()
