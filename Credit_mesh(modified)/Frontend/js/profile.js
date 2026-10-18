// =============================
// USER PROFILE MANAGEMENT
// =============================

let userId = localStorage.getItem("user_id") || "101";

async function loadProfile() {
    const nameEl = document.getElementById("name") || document.querySelector('[data-field="name"]');
    const emailEl = document.getElementById("email") || document.querySelector('[data-field="email"]');
    const phoneEl = document.getElementById("phone") || document.querySelector('[data-field="phone"]');
    const locEl = document.getElementById("location") || document.querySelector('[data-field="location"]');
    const occEl = document.getElementById("occupation") || document.querySelector('[data-field="occupation"]');

    // 1. Immediately hydrate from localStorage
    const localName = localStorage.getItem("user_name");
    const localEmail = localStorage.getItem("user_email");
    const localPhone = localStorage.getItem("user_phone");
    const localCity = localStorage.getItem("user_city");
    const localOcc = localStorage.getItem("user_occupation");

    if (nameEl && localName) nameEl.value = localName;
    if (emailEl && localEmail) emailEl.value = localEmail;
    if (phoneEl && localPhone) phoneEl.value = localPhone.startsWith("+91") ? localPhone : "+91 " + localPhone;
    if (locEl && localCity) locEl.value = localCity;
    if (occEl && localOcc) occEl.value = localOcc;

    if (typeof syncGlobalUserSession === "function") {
        syncGlobalUserSession();
    }

    // 2. Fetch from backend API
    try {
        const user = await apiRequest("/profile/" + userId);

        if (user && user.success !== false) {
            if (nameEl && user.name) {
                nameEl.value = user.name;
                localStorage.setItem("user_name", user.name);
            }
            if (emailEl && user.email) {
                emailEl.value = user.email;
                localStorage.setItem("user_email", user.email);
            }
            if (phoneEl && user.phone) {
                phoneEl.value = user.phone;
                localStorage.setItem("user_phone", user.phone);
            }
            if (locEl && user.location) {
                locEl.value = user.location;
                localStorage.setItem("user_city", user.location);
            }
            if (occEl && user.occupation) {
                occEl.value = user.occupation;
                localStorage.setItem("user_occupation", user.occupation);
            }

            if (typeof syncGlobalUserSession === "function") {
                syncGlobalUserSession();
            }
        }
    } catch (err) {
        console.warn("[Profile] Could not load profile from backend:", err);
    }
}

async function updateProfile() {
    const nameEl = document.getElementById("name") || document.querySelector('[data-field="name"]');
    const emailEl = document.getElementById("email") || document.querySelector('[data-field="email"]');
    const phoneEl = document.getElementById("phone") || document.querySelector('[data-field="phone"]');
    const locEl = document.getElementById("location") || document.querySelector('[data-field="location"]');
    const occEl = document.getElementById("occupation") || document.querySelector('[data-field="occupation"]');

    const data = {
        name: nameEl ? nameEl.value : "",
        email: emailEl ? emailEl.value : "",
        phone: phoneEl ? phoneEl.value : "",
        location: locEl ? locEl.value : "",
        occupation: occEl ? occEl.value : ""
    };

    if (data.name) localStorage.setItem("user_name", data.name);
    if (data.email) localStorage.setItem("user_email", data.email);
    if (data.phone) localStorage.setItem("user_phone", data.phone);
    if (data.location) localStorage.setItem("user_city", data.location);
    if (data.occupation) localStorage.setItem("user_occupation", data.occupation);

    if (typeof syncGlobalUserSession === "function") {
        syncGlobalUserSession();
    }

    const result = await apiRequest("/profile/" + userId, "PUT", data);

    if (typeof showToast === "function") {
        showToast(result.message || "Profile updated successfully!");
    } else {
        alert(result.message || "Profile updated successfully!");
    }
}

async function deleteAccount() {
    const result = await apiRequest("/profile/" + userId, "DELETE");

    if (typeof showToast === "function") {
        showToast(result.message || "Account deleted successfully");
    }

    localStorage.clear();

    setTimeout(() => {
        window.location.href = "alandingpage.html";
    }, 700);
}

// Auto-run loadProfile on DOM ready if on profile page
document.addEventListener("DOMContentLoaded", () => {
    loadProfile();
});