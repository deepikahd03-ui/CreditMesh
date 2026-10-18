const API_URL = "http://127.0.0.1:5000";

async function apiRequest(endpoint, method = "GET", data = null) {
    let options = {
        method: method,
        headers: {
            "Content-Type": "application/json"
        }
    };

    if (data) {
        options.body = JSON.stringify(data);
    }

    try {
        const response = await fetch(API_URL + endpoint, options);
        if (!response.ok) {
            return { success: false, status: response.status, message: `Server error (${response.status})` };
        }
        return await response.json();
    } catch (err) {
        console.warn(`[CreditMesh API] Server unavailable at ${API_URL}${endpoint}. Operating in demo/offline mode.`);
        return { success: false, offline: true, message: "Backend offline" };
    }
}

// =============================
// GLOBAL USER SESSION SYNC
// =============================
function syncGlobalUserSession() {
    const storedName = localStorage.getItem("user_name");
    if (!storedName || !storedName.trim()) return;

    const fullName = storedName.trim();
    const firstName = fullName.split(" ")[0];
    const initials = fullName
        .split(" ")
        .filter(Boolean)
        .map(w => w[0].toUpperCase())
        .slice(0, 2)
        .join("") || fullName.slice(0, 2).toUpperCase();

    // 1. Greeting
    const greetingEl = document.getElementById("userGreeting");
    if (greetingEl) greetingEl.textContent = `Good morning, ${firstName} 👋`;

    // 2. Navbar names
    document.querySelectorAll(".user-name-text, #userNameDesktop, #navUserName").forEach(el => {
        el.textContent = fullName;
    });

    // 3. Navbar initials
    document.querySelectorAll(".user-avatar-text, #userAvatarDesktop, #userAvatarMobile, #navAvatarInitials, #headerAvatarInitials").forEach(el => {
        el.textContent = initials;
    });

    // 4. Profile page header name
    const headerUserName = document.getElementById("headerUserName");
    if (headerUserName) headerUserName.textContent = fullName;
}

document.addEventListener("DOMContentLoaded", syncGlobalUserSession);
syncGlobalUserSession();