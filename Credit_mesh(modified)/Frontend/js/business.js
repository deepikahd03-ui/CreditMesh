// ============================================================
// CreditMesh - Business & Invoices API Integration
// Handles persistent invoice operations, status updates, and calculations
// ============================================================

const DEFAULT_DEMO_INVOICES = [
    { id: 'INV-1021', cust: 'Blinkit Quick Hub', amt: 8400, issue: 'Oct 01', due: 'Oct 15', status: 'paid', service: 'Wholesale Fruit Supply', method: 'UPI', notes: 'Weekly fleet supply settled' },
    { id: 'INV-1022', cust: 'Sri Krishna Sweets', amt: 12500, issue: 'Oct 04', due: 'Oct 18', status: 'paid', service: 'Festival Garlands', method: 'Bank', notes: 'Diwali pre-booking batch settled' },
    { id: 'INV-1023', cust: 'Meena Kirana Stores', amt: 3200, issue: 'Oct 07', due: 'Oct 21', status: 'pending', service: 'Daily Lemon Supply', method: 'UPI', notes: 'Ongoing weekly supply' },
    { id: 'INV-1024', cust: 'Local Tea Stall Co', amt: 1200, issue: 'Sep 25', due: 'Oct 05', status: 'overdue', service: 'Fresh Ginger Batch', method: 'Cash', notes: 'Follow-up call completed' }
];

async function loadInvoicesFromBackend(userId) {
    userId = userId || localStorage.getItem("user_id") || "101";
    try {
        const res = await apiRequest(`/invoices/?user_id=${userId}`);
        if (res && res.success && Array.isArray(res.invoices) && res.invoices.length > 0) {
            localStorage.setItem("creditmesh_invoices", JSON.stringify(res.invoices));
            return res.invoices;
        }
    } catch (err) {
        console.warn("[Business] API unavailable, using local storage:", err);
    }

    // Fallback to local storage or defaults
    const local = localStorage.getItem("creditmesh_invoices");
    if (local) {
        try {
            return JSON.parse(local);
        } catch (e) {}
    }
    localStorage.setItem("creditmesh_invoices", JSON.stringify(DEFAULT_DEMO_INVOICES));
    return DEFAULT_DEMO_INVOICES;
}

async function addInvoiceToBackend(invData) {
    const userId = localStorage.getItem("user_id") || "101";
    invData.user_id = parseInt(userId) || 101;

    try {
        const res = await apiRequest("/invoices/", "POST", invData);
        if (res && res.success && res.invoice) {
            // Update local storage
            let local = [];
            try {
                local = JSON.parse(localStorage.getItem("creditmesh_invoices") || "[]");
            } catch (e) {}
            local.unshift(res.invoice);
            localStorage.setItem("creditmesh_invoices", JSON.stringify(local));
            return { success: true, invoice: res.invoice, message: res.message };
        }
    } catch (err) {
        console.warn("[Business] Offline creation:", err);
    }

    // Offline / fallback creation
    let local = [];
    try {
        local = JSON.parse(localStorage.getItem("creditmesh_invoices") || "[]");
    } catch (e) {}
    const newId = invData.id || `INV-${1025 + local.length}`;
    const newInv = {
        id: newId,
        cust: invData.customer || invData.cust,
        customer: invData.customer || invData.cust,
        amt: parseFloat(invData.amount || invData.amt || 0),
        amount: parseFloat(invData.amount || invData.amt || 0),
        service: invData.service || "Service",
        issue: invData.issue_date || invData.issue || "Today",
        due: invData.due_date || invData.due || "In 7 Days",
        status: invData.status || "pending",
        method: invData.payment_method || invData.method || "UPI",
        notes: invData.notes || ""
    };
    local.unshift(newInv);
    localStorage.setItem("creditmesh_invoices", JSON.stringify(local));
    return { success: true, invoice: newInv, message: `Invoice ${newId} saved locally` };
}

async function updateInvoiceStatusInBackend(invId, newStatus) {
    try {
        const res = await apiRequest(`/invoices/${invId}/status`, "PATCH", { status: newStatus });
        if (res && res.success) {
            // Update local cache
            updateLocalInvoiceStatus(invId, newStatus);
            return { success: true, message: res.message };
        }
    } catch (err) {
        console.warn("[Business] Status sync deferred:", err);
    }

    updateLocalInvoiceStatus(invId, newStatus);
    return { success: true, message: `Status updated to ${newStatus}` };
}

function updateLocalInvoiceStatus(invId, newStatus) {
    try {
        let local = JSON.parse(localStorage.getItem("creditmesh_invoices") || "[]");
        const idx = local.findIndex(i => i.id === invId);
        if (idx !== -1) {
            local[idx].status = newStatus;
            localStorage.setItem("creditmesh_invoices", JSON.stringify(local));
        }
    } catch (e) {}
}