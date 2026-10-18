"""
Unit & Integration Test Suite for CreditMesh Backend Engine
Tests:
1. Financial Calculations: normal 6-month data, 1-month data, 0 records, zero income, negative values.
2. Invoices: calculation of outstanding/overdue, status changes.
3. Repayment Risk Indicators & Explanations.
4. API Endpoints: readiness report, invoices, live calculate, demo data seeding.
"""

import unittest
import json
from calculations import calculate_financial_metrics
from app import app
from database import init_db, seed_vendor_demo_data

class TestCreditMeshCalculations(unittest.TestCase):

    def test_normal_six_months_records(self):
        records = [
            {"income": 30000, "expenses": 18000, "savings": 4000, "month_label": "May"},
            {"income": 32000, "expenses": 19000, "savings": 4500, "month_label": "Jun"},
            {"income": 31000, "expenses": 18500, "savings": 4200, "month_label": "Jul"},
            {"income": 33000, "expenses": 19500, "savings": 5000, "month_label": "Aug"},
            {"income": 29000, "expenses": 17500, "savings": 3800, "month_label": "Sep"},
            {"income": 35000, "expenses": 20000, "savings": 5500, "month_label": "Oct"}
        ]
        invoices = [
            {"id": "INV-1", "amount": 5000, "status": "paid"},
            {"id": "INV-2", "amount": 3000, "status": "pending"},
            {"id": "INV-3", "amount": 1500, "status": "overdue"}
        ]
        metrics = calculate_financial_metrics(records, invoices)
        
        self.assertEqual(metrics["months_count"], 6)
        self.assertEqual(metrics["total_income"], 190000.0)
        self.assertAlmostEqual(metrics["avg_income"], 31666.67, places=2)
        self.assertAlmostEqual(metrics["avg_expenses"], 18750.0, places=2)
        self.assertGreater(metrics["monthly_surplus"], 0)
        self.assertFalse(metrics["insufficient_data"])
        self.assertIsNotNone(metrics["readiness_score"])
        self.assertGreater(metrics["readiness_score"], 60)
        self.assertEqual(metrics["outstanding_amount"], 4500.0)
        self.assertEqual(metrics["overdue_count"], 1)
        self.assertEqual(metrics["paid_count"], 1)
        self.assertEqual(metrics["pending_count"], 1)
        self.assertEqual(len(metrics["indicators"]), 5)
        self.assertIn("CreditMesh is an informational", metrics["disclaimer"])

    def test_insufficient_data_handling(self):
        # Empty records
        empty_metrics = calculate_financial_metrics([], [])
        self.assertTrue(empty_metrics["insufficient_data"])
        self.assertIsNone(empty_metrics["readiness_score"])
        self.assertIn("Insufficient information", empty_metrics["assessment_summary"])

        # Single month only
        single_metrics = calculate_financial_metrics([{"income": 20000, "expenses": 12000}], [])
        self.assertTrue(single_metrics["insufficient_data"])
        self.assertIsNone(single_metrics["readiness_score"])

    def test_overdue_invoices_impact(self):
        records = [
            {"income": 25000, "expenses": 15000},
            {"income": 25000, "expenses": 15000}
        ]
        invoices_clear = [
            {"amount": 2000, "status": "paid"},
            {"amount": 3000, "status": "paid"}
        ]
        invoices_with_overdue = [
            {"amount": 2000, "status": "paid"},
            {"amount": 3000, "status": "overdue"},
            {"amount": 4000, "status": "overdue"}
        ]
        res_clear = calculate_financial_metrics(records, invoices_clear)
        res_overdue = calculate_financial_metrics(records, invoices_with_overdue)
        
        # Score with overdue invoices must be penalized
        self.assertGreater(res_clear["readiness_score"], res_overdue["readiness_score"])
        self.assertEqual(res_overdue["overdue_count"], 2)
        self.assertEqual(res_overdue["overdue_amount"], 7000.0)

    def test_zero_and_negative_input_safety(self):
        records = [
            {"income": 0, "expenses": 0},
            {"income": -500, "expenses": 1000}, # should be ignored
            {"income": "invalid", "expenses": "none"}, # should be handled gracefully
            {"income": 10000, "expenses": 8000}
        ]
        res = calculate_financial_metrics(records, [])
        # Should not throw zero-division error
        self.assertIsNotNone(res)
        self.assertEqual(res["months_count"], 2)


class TestCreditMeshAPI(unittest.TestCase):

    def setUp(self):
        self.client = app.test_client()
        init_db()

    def test_health_check(self):
        response = self.client.get("/")
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertEqual(data["status"], "online")

    def test_demo_data_seeding_and_readiness_report(self):
        # 1. Seed demo data
        resp = self.client.post("/demo-data/vendor?user_id=101")
        self.assertEqual(resp.status_code, 200)

        # 2. Fetch readiness report
        report_resp = self.client.get("/readiness-report/101")
        self.assertEqual(report_resp.status_code, 200)
        report = report_resp.get_json()
        self.assertTrue(report["success"])
        self.assertIn("metrics", report)
        metrics = report["metrics"]
        self.assertFalse(metrics["insufficient_data"])
        self.assertGreater(metrics["readiness_score"], 60)
        self.assertEqual(len(report["monthly_records"]), 6)
        self.assertGreater(len(report["invoices"]), 0)

    def test_invoice_creation_and_status_update(self):
        new_inv = {
            "customer": "Test Supermarket",
            "amount": 4250,
            "service": "Produce Supply",
            "issue_date": "2026-10-10",
            "due_date": "2026-10-24",
            "status": "pending",
            "payment_method": "UPI"
        }
        create_resp = self.client.post("/invoices/", data=json.dumps(new_inv), content_type="application/json")
        self.assertEqual(create_resp.status_code, 201)
        created = create_resp.get_json()
        inv_id = created["invoice"]["id"]

        # Update to paid
        patch_resp = self.client.patch(f"/invoices/{inv_id}/status", data=json.dumps({"status": "paid"}), content_type="application/json")
        self.assertEqual(patch_resp.status_code, 200)
        updated = patch_resp.get_json()
        self.assertEqual(updated["status"], "paid")

    def test_institution_view_consent_protection(self):
        # 1. Update user to revoke consent
        self.client.put("/profile/101", data=json.dumps({"consent_data_sharing": 0}), content_type="application/json")

        # 2. Institution request should be blocked
        blocked_resp = self.client.get("/institution-view/101")
        self.assertEqual(blocked_resp.status_code, 403)

        # 3. Restore consent
        self.client.put("/profile/101", data=json.dumps({"consent_data_sharing": 1}), content_type="application/json")
        allowed_resp = self.client.get("/institution-view/101")
        self.assertEqual(allowed_resp.status_code, 200)
        data = allowed_resp.get_json()
        self.assertTrue(data["consented"])
        self.assertIn("underwriting_indicators", data)
        self.assertIn("institutional_disclaimer", data)

if __name__ == "__main__":
    unittest.main()
