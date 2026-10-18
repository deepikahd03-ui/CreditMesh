"""
CreditMesh Financial Calculations Engine
Provides transparent, rule-based financial readiness and risk indicator calculations
for street vendors, gig workers, and micro-enterprises.
"""

import math

def calculate_financial_metrics(monthly_records, invoices=None):
    """
    Computes all core financial calculations, income consistency, repayment history,
    risk indicators, strengths, concerns, and actionable recommendations.
    
    monthly_records: list of dicts with keys: 'income', 'expenses', 'savings' (optional), 'month_label'
    invoices: list of dicts with keys: 'id', 'amount', 'status' ('paid', 'pending', 'overdue'), 'due_date'
    """
    invoices = invoices or []
    
    # 1. Monthly Records Sanitization
    valid_records = []
    for r in monthly_records:
        try:
            inc = float(r.get("income", 0) or 0)
            exp = float(r.get("expenses", 0) or 0)
            sav = float(r.get("savings", 0) or 0)
            label = str(r.get("month_label", "")).strip()
            if inc < 0 or exp < 0:
                continue
            valid_records.append({
                "income": inc,
                "expenses": exp,
                "savings": sav,
                "surplus": inc - exp,
                "month_label": label
            })
        except (ValueError, TypeError):
            continue

    months_count = len(valid_records)
    
    # 2. Income & Expense Totals
    total_income = sum(r["income"] for r in valid_records)
    total_expenses = sum(r["expenses"] for r in valid_records)
    total_savings = sum(r["savings"] for r in valid_records)
    
    avg_income = round(total_income / months_count, 2) if months_count > 0 else 0.0
    avg_expenses = round(total_expenses / months_count, 2) if months_count > 0 else 0.0
    avg_savings = round(total_savings / months_count, 2) if months_count > 0 else 0.0
    
    monthly_surplus = round(avg_income - avg_expenses, 2)
    surplus_margin_pct = round((monthly_surplus / avg_income * 100), 1) if avg_income > 0 else 0.0
    
    # 3. Invoice Metrics
    valid_invoices = []
    for inv in invoices:
        try:
            amt = float(inv.get("amount", 0) or 0)
            status = str(inv.get("status", "pending")).lower().strip()
            valid_invoices.append({
                "id": inv.get("id", ""),
                "customer": inv.get("customer", ""),
                "amount": amt,
                "status": status,
                "due_date": inv.get("due_date", "")
            })
        except (ValueError, TypeError):
            continue

    total_invoiced = sum(i["amount"] for i in valid_invoices)
    paid_invoices = [i for i in valid_invoices if i["status"] == "paid"]
    pending_invoices = [i for i in valid_invoices if i["status"] == "pending"]
    overdue_invoices = [i for i in valid_invoices if i["status"] == "overdue"]
    
    paid_amount = sum(i["amount"] for i in paid_invoices)
    pending_amount = sum(i["amount"] for i in pending_invoices)
    overdue_amount = sum(i["amount"] for i in overdue_invoices)
    outstanding_amount = round(pending_amount + overdue_amount, 2)
    
    total_invoices_count = len(valid_invoices)
    paid_count = len(paid_invoices)
    pending_count = len(pending_invoices)
    overdue_count = len(overdue_invoices)
    
    repayment_rate_pct = None
    if total_invoices_count > 0:
        repayment_rate_pct = round((paid_count / total_invoices_count) * 100, 1)

    # 4. Income Consistency & Stability (Standard Deviation / CV)
    consistency_score = None
    cv_value = None
    consistency_label = "Insufficient Data"
    
    if months_count >= 2 and avg_income > 0:
        variance = sum((r["income"] - avg_income) ** 2 for r in valid_records) / (months_count - 1)
        std_dev = math.sqrt(variance)
        cv_value = round(std_dev / avg_income, 3)
        
        # Lower CV means higher consistency
        if cv_value <= 0.10:
            consistency_score = 95
            consistency_label = "High Consistency"
        elif cv_value <= 0.20:
            consistency_score = round(95 - ((cv_value - 0.10) / 0.10) * 15)
            consistency_label = "Good Consistency"
        elif cv_value <= 0.35:
            consistency_score = round(80 - ((cv_value - 0.20) / 0.15) * 20)
            consistency_label = "Moderate Consistency"
        else:
            consistency_score = max(35, round(60 - ((cv_value - 0.35) / 0.35) * 25))
            consistency_label = "Variable / Seasonal"
    elif months_count == 1:
        consistency_label = "Single month provided (needs 2+ for stability)"

    # 5. Repayment Capacity Estimation
    # Safe conservative monthly repayment capacity: 40% of surplus
    safe_repayment_capacity = round(max(0.0, monthly_surplus * 0.40), 2)

    # 6. Check for Insufficient Data condition
    insufficient_data = (months_count < 2)
    
    if insufficient_data:
        readiness_score = None
        readiness_status = "Insufficient Data"
        assessment_summary = "Insufficient information for a reliable assessment. Please enter at least 2 to 6 months of financial records."
    else:
        # Transparent rule-based composite scoring (0 - 100)
        # Component 1: Income Stability (30%)
        comp_stability = (consistency_score or 50) * 0.30
        
        # Component 2: Monthly Surplus & Margin (25%)
        # > 30% margin is excellent (100), 20-30% is 85, 10-20% is 70, 0-10% is 50, negative is 20
        if surplus_margin_pct >= 30:
            comp_surplus_base = 100
        elif surplus_margin_pct >= 20:
            comp_surplus_base = 85
        elif surplus_margin_pct >= 10:
            comp_surplus_base = 70
        elif surplus_margin_pct > 0:
            comp_surplus_base = 55
        else:
            comp_surplus_base = 25
        comp_surplus = comp_surplus_base * 0.25
        
        # Component 3: Invoice Repayment Reliability (25%)
        if total_invoices_count > 0:
            comp_repay_base = repayment_rate_pct if repayment_rate_pct is not None else 75
        else:
            # Neutral credit record when user has no invoices recorded yet
            comp_repay_base = 75
        comp_repayment = comp_repay_base * 0.25
        
        # Component 4: Data Completeness & Vintage (20%)
        # 6 months = 100%, 5 = 90%, 4 = 80%, 3 = 70%, 2 = 60%
        completeness_pct = min(100, round((months_count / 6.0) * 100))
        comp_completeness = completeness_pct * 0.20
        
        # Raw score
        raw_score = comp_stability + comp_surplus + comp_repayment + comp_completeness
        
        # Penalty for overdue invoices: 8 points per overdue invoice up to 24 points
        overdue_penalty = min(24, overdue_count * 8)
        final_score = int(max(15, min(95, round(raw_score - overdue_penalty))))
        
        readiness_score = final_score
        if final_score >= 80:
            readiness_status = "Strong Financial Readiness"
        elif final_score >= 65:
            readiness_status = "Moderate Financial Readiness"
        elif final_score >= 50:
            readiness_status = "Developing Readiness"
        else:
            readiness_status = "Needs Improvement"
            
        assessment_summary = f"Financial reliability assessment computed using {months_count} months of verified records and {total_invoices_count} invoice signals."

    # 7. Transparent Indicators with Explanations
    indicators = [
        {
            "name": "Income Stability",
            "key": "income_stability",
            "value": f"{consistency_score}/100" if consistency_score is not None else "Insufficient Data",
            "score": consistency_score,
            "status": consistency_label,
            "explanation": "Evaluates month-to-month earning volatility using the coefficient of variation. High stability indicates predictable cash inflow for scheduled loan repayments."
        },
        {
            "name": "Monthly Cashflow Surplus",
            "key": "monthly_surplus",
            "value": f"₹{monthly_surplus:,.0f} ({surplus_margin_pct}%)",
            "score": int(surplus_margin_pct),
            "status": "Healthy" if surplus_margin_pct >= 20 else ("Moderate" if surplus_margin_pct > 0 else "Deficit"),
            "explanation": "Calculates remaining net income after all operational expenses. A positive surplus gives a buffer against unexpected costs and proves unallocated debt servicing capacity."
        },
        {
            "name": "Overdue Obligations",
            "key": "overdue_obligations",
            "value": f"{overdue_count} overdue (₹{overdue_amount:,.0f})",
            "score": 0 if overdue_count > 0 else 100,
            "status": "Warning" if overdue_count > 0 else "Clear",
            "explanation": "Tracks unpaid invoices past their due dates. Overdue obligations reduce liquidity and signal potential credit distress to lenders."
        },
        {
            "name": "Estimated Repayment Capacity",
            "key": "repayment_capacity",
            "value": f"₹{safe_repayment_capacity:,.0f} / month",
            "score": min(100, int((safe_repayment_capacity / max(1, avg_income)) * 200)),
            "status": "Available" if safe_repayment_capacity > 0 else "Constrained",
            "explanation": "Derived as 40% of sustainable monthly surplus, preserving a 60% emergency safety margin for personal and inventory requirements."
        },
        {
            "name": "Data Completeness",
            "key": "data_completeness",
            "value": f"{months_count}/6 months recorded",
            "score": min(100, int((months_count / 6.0) * 100)),
            "status": "Complete" if months_count >= 6 else f"{months_count} of 6 months",
            "explanation": "Lending risk models require at least 6 months of continuous history to distinguish temporary seasonal dips from structural insolvency."
        }
    ]

    # 8. Financial Strengths & Concerns
    strengths = []
    concerns = []
    recommendations = []

    if monthly_surplus > 0:
        strengths.append(f"Maintains a consistent average monthly surplus of ₹{monthly_surplus:,.0f} ({surplus_margin_pct}% profit margin).")
    else:
        concerns.append(f"Operating in monthly cash deficit (₹{abs(monthly_surplus):,.0f} average deficit). Expenses exceed earnings.")
        recommendations.append("Reduce operating overheads or increase working capital efficiency to turn monthly surplus positive.")

    if cv_value is not None and cv_value <= 0.20:
        strengths.append(f"Strong earning regularity with low month-to-month variation (CV: {cv_value}).")
    elif cv_value is not None and cv_value > 0.35:
        concerns.append(f"Noticeable month-to-month income swings (CV: {cv_value}), creating seasonal liquidity risk.")
        recommendations.append("Build a buffer reserve fund equal to 1 month of business expenses to smooth seasonal income fluctuations.")

    if overdue_count == 0 and total_invoices_count > 0:
        strengths.append(f"Flawless payment track record: all {paid_count} settled invoices completed without default.")
    elif overdue_count > 0:
        concerns.append(f"{overdue_count} overdue invoice(s) totalling ₹{overdue_amount:,.0f} awaiting resolution.")
        recommendations.append(f"Prioritize settling or recovering the ₹{overdue_amount:,.0f} in overdue invoices to immediately strengthen lender confidence.")

    if months_count >= 6:
        strengths.append("Full 6-month financial history recorded, providing strong statistical underwriting confidence.")
    elif months_count < 6:
        concerns.append(f"Incomplete record history ({months_count} months recorded; 6 months recommended for maximum loan eligibility).")
        recommendations.append(f"Continue logging income and business expenses for {6 - months_count} more month(s) to build an institutional-grade profile.")

    if outstanding_amount > avg_income * 0.5 and avg_income > 0:
        concerns.append(f"Outstanding receivables (₹{outstanding_amount:,.0f}) exceed 50% of monthly revenue.")
        recommendations.append("Implement advance payments or shorter payment cycles for customers to shorten receivables turnover.")

    if not recommendations:
        recommendations.append("Maintain existing disciplined records and continue keeping all customer invoice settlements on schedule.")

    return {
        "months_count": months_count,
        "total_income": round(total_income, 2),
        "avg_income": avg_income,
        "total_expenses": round(total_expenses, 2),
        "avg_expenses": avg_expenses,
        "monthly_surplus": monthly_surplus,
        "surplus_margin_pct": surplus_margin_pct,
        "total_savings": round(total_savings, 2),
        "avg_savings": avg_savings,
        "cv_value": cv_value,
        "consistency_score": consistency_score,
        "consistency_label": consistency_label,
        "safe_repayment_capacity": safe_repayment_capacity,
        "total_invoiced": round(total_invoiced, 2),
        "paid_amount": round(paid_amount, 2),
        "pending_amount": round(pending_amount, 2),
        "overdue_amount": round(overdue_amount, 2),
        "outstanding_amount": outstanding_amount,
        "total_invoices_count": total_invoices_count,
        "paid_count": paid_count,
        "pending_count": pending_count,
        "overdue_count": overdue_count,
        "repayment_rate_pct": repayment_rate_pct,
        "insufficient_data": insufficient_data,
        "readiness_score": readiness_score,
        "readiness_status": readiness_status,
        "assessment_summary": assessment_summary,
        "indicators": indicators,
        "strengths": strengths,
        "concerns": concerns,
        "recommendations": recommendations,
        "disclaimer": (
            "CreditMesh is an informational financial readiness and record platform. "
            "CreditMesh does not approve, reject, or guarantee loans or repayments. "
            "All underwriting and credit approval decisions rest solely with regulated banks and financial institutions."
        )
    }
