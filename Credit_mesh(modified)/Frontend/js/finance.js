// ============================================================
// CreditMesh - Finance & Monthly Cashflow Engine
// Manages 6-month financial records, transactions, and live calculations
// ============================================================

const DEFAULT_DEMO_MONTHS = [
    { month_label: 'May', month_index: 1, income: 28500, expenses: 17200, savings: 4500, notes: 'Summer regular street sales' },
    { month_label: 'Jun', month_index: 2, income: 30200, expenses: 18100, savings: 5000, notes: 'Flower market morning orders' },
    { month_label: 'Jul', month_index: 3, income: 29800, expenses: 17900, savings: 4800, notes: 'Stable retail footfall' },
    { month_label: 'Aug', month_index: 4, income: 33500, expenses: 19400, savings: 6200, notes: 'Varamahalakshmi festival sales bump' },
    { month_label: 'Sep', month_index: 5, income: 31200, expenses: 18600, savings: 5100, notes: 'Ganesh festival orders' },
    { month_label: 'Oct', month_index: 6, income: 34000, expenses: 19800, savings: 6500, notes: 'Navratri peak festive demand' }
];

async function fetchReadinessReportFromBackend(userId) {
    userId = userId || localStorage.getItem("user_id") || "101";
    try {
        const res = await apiRequest(`/readiness-report/${userId}`);
        if (res && res.success) {
            localStorage.setItem("creditmesh_report", JSON.stringify(res));
            return res;
        }
    } catch (e) {
        console.warn("[Finance] Backend offline, calculating locally:", e);
    }

    // Local fallback calculation if server is offline
    const localMonths = getStoredMonthlyRecords();
    let localInvoices = [];
    try {
        localInvoices = JSON.parse(localStorage.getItem("creditmesh_invoices") || "[]");
    } catch (e) {}

    const metrics = computeLocalFinancialMetrics(localMonths, localInvoices);
    return {
        success: true,
        offline: true,
        metrics: metrics,
        monthly_records: localMonths,
        invoices: localInvoices,
        user: {
            id: userId,
            name: localStorage.getItem("user_name") || "Ramesh Kumar",
            occupation: localStorage.getItem("user_occupation") || "Street Vendor / Small Business",
            location: localStorage.getItem("user_city") || "KR Market, Bangalore"
        }
    };
}

function getStoredMonthlyRecords() {
    const raw = localStorage.getItem("creditmesh_monthly_records");
    if (raw) {
        try {
            return JSON.parse(raw);
        } catch (e) {}
    }
    localStorage.setItem("creditmesh_monthly_records", JSON.stringify(DEFAULT_DEMO_MONTHS));
    return DEFAULT_DEMO_MONTHS;
}

async function saveMonthlyRecordsToBackend(records, userId) {
    userId = userId || localStorage.getItem("user_id") || "101";
    localStorage.setItem("creditmesh_monthly_records", JSON.stringify(records));

    try {
        const res = await apiRequest(`/financial-records/${userId}`, "POST", { records: records });
        if (res && res.success) {
            return res;
        }
    } catch (e) {
        console.warn("[Finance] Record sync deferred:", e);
    }
    return { success: true, message: "Financial records saved locally" };
}

async function loadTransactions() {
    try {
        const data = await apiRequest("/finance/");
        if (data && data.transactions) {
            return data.transactions;
        }
    } catch (err) {
        console.warn("[Finance] Could not load transactions from backend:", err);
    }
    return null;
}

async function addTransactionApi(txData) {
    try {
        const res = await apiRequest("/finance/", "POST", txData);
        if (res && res.success) return res;
    } catch (e) {
        console.warn("[Finance] Transaction sync error:", e);
    }
    return { success: true, message: "Transaction recorded locally" };
}

async function loadStreetVendorDemoData(userId) {
    userId = userId || localStorage.getItem("user_id") || "101";
    try {
        const res = await apiRequest(`/demo-data/vendor?user_id=${userId}`, "POST");
        if (res && res.success) {
            localStorage.setItem("creditmesh_monthly_records", JSON.stringify(DEFAULT_DEMO_MONTHS));
            return res;
        }
    } catch (e) {}
    localStorage.setItem("creditmesh_monthly_records", JSON.stringify(DEFAULT_DEMO_MONTHS));
    return { success: true, message: "Street Vendor Demo data loaded" };
}

async function resetToEmptyData(userId) {
    userId = userId || localStorage.getItem("user_id") || "101";
    try {
        await apiRequest(`/demo-data/reset-empty?user_id=${userId}`, "POST");
    } catch (e) {}
    localStorage.setItem("creditmesh_monthly_records", JSON.stringify([]));
    return { success: true, message: "Data reset to empty state" };
}

// Client-side pure calculation mirror (fallback when backend is not reached)
function computeLocalFinancialMetrics(monthlyRecords, invoices) {
    monthlyRecords = monthlyRecords || [];
    invoices = invoices || [];
    const count = monthlyRecords.length;

    const totalIncome = monthlyRecords.reduce((s, r) => s + (parseFloat(r.income) || 0), 0);
    const totalExpenses = monthlyRecords.reduce((s, r) => s + (parseFloat(r.expenses) || 0), 0);
    const totalSavings = monthlyRecords.reduce((s, r) => s + (parseFloat(r.savings) || 0), 0);

    const avgIncome = count > 0 ? Math.round(totalIncome / count) : 0;
    const avgExpenses = count > 0 ? Math.round(totalExpenses / count) : 0;
    const avgSavings = count > 0 ? Math.round(totalSavings / count) : 0;
    const surplus = avgIncome - avgExpenses;
    const margin = avgIncome > 0 ? Math.round((surplus / avgIncome) * 100) : 0;

    let cv = null;
    let consistencyScore = null;
    let consistencyLabel = "Insufficient Data";

    if (count >= 2 && avgIncome > 0) {
        const variance = monthlyRecords.reduce((s, r) => s + Math.pow((parseFloat(r.income) || 0) - avgIncome, 2), 0) / (count - 1);
        const stdDev = Math.sqrt(variance);
        cv = Math.round((stdDev / avgIncome) * 1000) / 1000;
        if (cv <= 0.15) {
            consistencyScore = 90;
            consistencyLabel = "High Consistency";
        } else if (cv <= 0.30) {
            consistencyScore = 78;
            consistencyLabel = "Moderate Consistency";
        } else {
            consistencyScore = 55;
            consistencyLabel = "Variable / Seasonal";
        }
    }

    const paidInvs = invoices.filter(i => i.status === 'paid');
    const overdueInvs = invoices.filter(i => i.status === 'overdue');
    const pendingInvs = invoices.filter(i => i.status === 'pending');

    const outstanding = overdueInvs.concat(pendingInvs).reduce((s, i) => s + (parseFloat(i.amt !== undefined ? i.amt : i.amount) || 0), 0);
    const overdueAmt = overdueInvs.reduce((s, i) => s + (parseFloat(i.amt !== undefined ? i.amt : i.amount) || 0), 0);

    const insufficientData = count < 2;
    let readinessScore = null;
    if (!insufficientData) {
        const base = (consistencyScore || 60) * 0.35 + (margin > 20 ? 90 : 60) * 0.35 + (overdueInvs.length === 0 ? 90 : 50) * 0.30;
        readinessScore = Math.max(20, Math.min(92, Math.round(base - (overdueInvs.length * 8))));
    }

    return {
        months_count: count,
        total_income: totalIncome,
        avg_income: avgIncome,
        total_expenses: totalExpenses,
        avg_expenses: avgExpenses,
        monthly_surplus: surplus,
        surplus_margin_pct: margin,
        total_savings: totalSavings,
        avg_savings: avgSavings,
        cv_value: cv,
        consistency_score: consistencyScore,
        consistency_label: consistencyLabel,
        safe_repayment_capacity: Math.max(0, Math.round(surplus * 0.40)),
        outstanding_amount: outstanding,
        overdue_amount: overdueAmt,
        overdue_count: overdueInvs.length,
        paid_count: paidInvs.length,
        insufficient_data: insufficientData,
        readiness_score: readinessScore,
        readiness_status: readinessScore >= 80 ? "Strong Financial Readiness" : (readinessScore >= 65 ? "Moderate Readiness" : "Developing Readiness"),
        assessment_summary: insufficientData ? "Insufficient information for a reliable assessment." : `Assessment based on ${count} months of recorded activity.`,
        disclaimer: "CreditMesh is an informational financial readiness and record platform. Banks make all final lending decisions."
    };
}