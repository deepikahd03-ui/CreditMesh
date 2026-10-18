// ============================================================
// CreditMesh Multilingual Translation System
// Supported: English, Hindi (हिंदी), Kannada (ಕನ್ನಡ), Tamil (தமிழ்), Telugu (తెలుగు)
// ============================================================

const LANG_DISPLAY_MAP = {
  English: "English",
  Hindi: "Hindi (हिंदी)",
  Kannada: "Kannada (ಕನ್ನಡ)",
  Tamil: "Tamil (தமிழ்)",
  Telugu: "Telugu (తెలుగు)"
};

const TRANSLATIONS = {
  English: {
    // Navigation
    nav_profile: "Financial Profile",
    nav_finances: "Finances",
    nav_business: "Business",
    nav_options: "Financial Options",
    nav_help: "Help",
    
    // Page Header
    my_profile: "My Profile",
    profile_subtitle: "Manage your personal information, account settings, and security preferences.",
    last_updated: "Last updated: Today",
    
    // Overview Section
    edit_profile: "Edit Profile",
    verified_account: "Verified Account",
    member_since: "Member since Jan 2026",
    role_gig: "Gig Worker / Small Business Owner",
    
    // Personal Information
    sec_personal: "Personal Information",
    lbl_name: "Full Name",
    lbl_email: "Email Address",
    lbl_phone: "Mobile Number",
    lbl_dob: "Date of Birth",
    lbl_location: "Location",
    lbl_occupation: "Occupation",
    lbl_business: "Business Type",
    btn_cancel: "Cancel",
    btn_save: "Save Changes",
    
    // Verification Status
    sec_verification: "Verification Status",
    btn_manage_verification: "Manage Verification →",
    lbl_id_verify: "Identity Verification",
    lbl_phone_verify: "Mobile Verification",
    lbl_email_verify: "Email Verification",
    lbl_fin_data_verify: "Financial Data Connection",
    st_verified: "Verified",
    
    // Connected Accounts
    sec_connected: "Connected Accounts",
    connected_subtitle: "Manage connected financial signals and data sources.",
    btn_manage_connections: "Manage Connections →",
    acc_bank: "Bank Account",
    acc_upi: "UPI Account",
    acc_tx: "Transaction History",
    acc_invoice: "Invoice Records",
    st_connected: "Connected",
    st_synced: "Synced",
    btn_remove_access: "Remove Access →",
    
    // Preferences
    sec_preferences: "Preferences",
    lbl_language: "Language",
    lbl_currency: "Currency",
    lbl_email_notif: "Email Notifications",
    desc_email_notif: "Receive updates via email",
    lbl_sms_notif: "SMS Notifications",
    desc_sms_notif: "Receive alerts via SMS",
    lbl_ai_notif: "AI Insight Notifications",
    desc_ai_notif: "Get personalized AI suggestions",
    
    // Security
    sec_security: "Security",
    lbl_change_pwd: "Change Password",
    desc_change_pwd: "Update your account password regularly",
    btn_update_pwd: "Update Password",
    lbl_2fa: "Two-Factor Authentication",
    desc_2fa: "Add an extra layer of security",
    lbl_login_activity: "Login Activity",
    btn_view_activity: "View All Activity →",
    
    // Privacy & Data Control
    sec_privacy: "Privacy & Data Control",
    desc_privacy: "Control how CreditMesh uses your financial information.",
    btn_data_sharing: "Data Sharing Permissions",
    btn_connected_sources: "Connected Data Sources",
    btn_download_data: "Download My Data",
    btn_delete_data: "Delete My Data",
    lbl_manage: "Manage",
    lbl_view: "View",
    lbl_export: "Export",
    lbl_remove: "Remove",
    
    // Financial Profile
    sec_fin_profile: "Financial Profile",
    lbl_score_title: "Financial Reliability Score",
    lbl_strong_profile: "Strong Profile",
    lbl_visibility: "Profile Visibility",
    desc_visibility: "Control who sees your profile",
    lbl_private: "Private",
    lbl_allow_institutions: "Allow financial institutions to view my profile",
    desc_allow_institutions: "Enable profile discovery for suitable offers",
    
    // Danger Zone
    sec_danger: "Danger Zone",
    desc_danger: "These actions are permanent. Please proceed carefully.",
    btn_logout: "Logout",
    btn_delete_account: "Delete Account",
    
    // Modals
    modal_logout_title: "Are you sure you want to logout?",
    modal_delete_title: "Delete Your Account?",
    modal_delete_desc: "Deleting your account will permanently remove your CreditMesh profile, financial data, and account information.",
    lbl_confirm_pwd: "Confirm Password",
    ph_enter_pwd: "Enter your password",
    lbl_delete_agree: "I understand this action is permanent and cannot be undone.",
    modal_verify_title: "All Verifications Passed",
    modal_verify_desc: "Your identity, mobile, email, and financial data connections are fully verified and active.",
    btn_remove_access_modal: "Remove Access",
    toast_lang_updated: "Language updated to ",
    
    // Business & Invoices
    biz_title: "My Business",
    biz_subtitle: "Track your business activity, invoices and customer payments.",
    lbl_total_biz_income: "Total Business Income",
    lbl_total_invoiced: "Total Invoiced",
    lbl_paid: "Paid",
    lbl_pending: "Pending",
    lbl_overdue: "Overdue",
    btn_create_invoice: "Create Invoice",
    btn_mark_paid: "Mark as Paid",
    lbl_due_date: "Due Date",
    lbl_issue_date: "Issue Date",
    lbl_amount: "Amount",
    lbl_customer: "Customer Name",

    // Dashboard & Calculations
    lbl_readiness_score: "Financial Reliability Score",
    lbl_monthly_surplus: "Monthly Surplus",
    lbl_income_stability: "Income Stability",
    lbl_repayment_capacity: "Est. Repayment Capacity",
    lbl_overdue_obligations: "Overdue Obligations",
    lbl_data_completeness: "Data Completeness",
    btn_print_report: "Print / Download Report",
    btn_borrower_view: "Borrower View",
    btn_bank_view: "Bank / Institution View",
    btn_load_vendor_demo: "Load Street Vendor Demo Data",
    btn_reset_empty: "Test Insufficient Data State",
    lbl_disclaimer: "CreditMesh is an alternative financial readiness and record platform. Banks make all final lending decisions."
  },

  Hindi: {
    // Navigation
    nav_profile: "वित्तीय प्रोफ़ाइल",
    nav_finances: "वित्त",
    nav_business: "व्यवसाय",
    nav_options: "वित्तीय विकल्प",
    nav_help: "सहायता",
    
    // Page Header
    my_profile: "मेरी प्रोफ़ाइल",
    profile_subtitle: "अपनी व्यक्तिगत जानकारी, खाता सेटिंग्स और सुरक्षा प्राथमिकताएं प्रबंधित करें।",
    last_updated: "अंतिम अपडेट: आज",
    
    // Overview Section
    edit_profile: "प्रोफ़ाइल संपादित करें",
    verified_account: "सत्यापित खाता",
    member_since: "सदस्य: जनवरी 2026 से",
    role_gig: "गिग वर्कर / लघु व्यवसाय स्वामी",
    
    // Personal Information
    sec_personal: "व्यक्तिगत जानकारी",
    lbl_name: "पूरा नाम",
    lbl_email: "ईमेल पता",
    lbl_phone: "मोबाइल नंबर",
    lbl_dob: "जन्म तिथि",
    lbl_location: "स्थान",
    lbl_occupation: "व्यवसाय",
    lbl_business: "व्यवसाय प्रकार",
    btn_cancel: "रद्द करें",
    btn_save: "बदलाव सहेजें",
    
    // Verification Status
    sec_verification: "सत्यापन स्थिति",
    btn_manage_verification: "सत्यापन प्रबंधित करें →",
    lbl_id_verify: "पहचान सत्यापन",
    lbl_phone_verify: "मोबाइल सत्यापन",
    lbl_email_verify: "ईमेल सत्यापन",
    lbl_fin_data_verify: "वित्तीय डेटा कनेक्शन",
    st_verified: "सत्यापित",
    
    // Connected Accounts
    sec_connected: "जुड़े हुए खाते",
    connected_subtitle: "जुड़े हुए वित्तीय संकेतों और डेटा स्रोतों को प्रबंधित करें।",
    btn_manage_connections: "कनेक्शन प्रबंधित करें →",
    acc_bank: "बैंक खाता",
    acc_upi: "यूपीआई खाता",
    acc_tx: "लेन-देन इतिहास",
    acc_invoice: "चालान रिकॉर्ड",
    st_connected: "संबद्ध",
    st_synced: "सिंक किया गया",
    btn_remove_access: "एक्सेस हटाएं →",
    
    // Preferences
    sec_preferences: "प्राथमिकताएं",
    lbl_language: "भाषा",
    lbl_currency: "मुद्रा",
    lbl_email_notif: "ईमेल सूचनाएं",
    desc_email_notif: "ईमेल द्वारा अपडेट प्राप्त करें",
    lbl_sms_notif: "एसएमएस सूचनाएं",
    desc_sms_notif: "एसएमएस द्वारा अलर्ट प्राप्त करें",
    lbl_ai_notif: "एआई इनसाइट सूचनाएं",
    desc_ai_notif: "व्यक्तिगत एआई सुझाव प्राप्त करें",
    
    // Security
    sec_security: "सुरक्षा",
    lbl_change_pwd: "पासवर्ड बदलें",
    desc_change_pwd: "नियमित रूप से अपना खाता पासवर्ड अपडेट करें",
    btn_update_pwd: "पासवर्ड अपडेट करें",
    lbl_2fa: "दो-चरणीय प्रमाणीकरण (2FA)",
    desc_2fa: "सुरक्षा की एक अतिरिक्त परत जोड़ें",
    lbl_login_activity: "लॉगिन गतिविधि",
    btn_view_activity: "सभी गतिविधियां देखें →",
    
    // Privacy & Data Control
    sec_privacy: "गोपनीयता और डेटा नियंत्रण",
    desc_privacy: "नियंत्रित करें कि क्रेडिटमेश आपकी वित्तीय जानकारी का उपयोग कैसे करता है।",
    btn_data_sharing: "डेटा शेयरिंग अनुमतियां",
    btn_connected_sources: "जुड़े डेटा स्रोत",
    btn_download_data: "मेरा डेटा डाउनलोड करें",
    btn_delete_data: "मेरा डेटा हटाएं",
    lbl_manage: "प्रबंधित करें",
    lbl_view: "देखें",
    lbl_export: "निर्यात करें",
    lbl_remove: "हटाएं",
    
    // Financial Profile
    sec_fin_profile: "वित्तीय प्रोफ़ाइल",
    lbl_score_title: "वित्तीय विश्वसनीयता स्कोर",
    lbl_strong_profile: "मजबूत प्रोफ़ाइल",
    lbl_visibility: "प्रोफ़ाइल दृश्यता",
    desc_visibility: "नियंत्रित करें कि आपकी प्रोफ़ाइल कौन देखता है",
    lbl_private: "निजी",
    lbl_allow_institutions: "वित्तीय संस्थानों को मेरी प्रोफ़ाइल देखने की अनुमति दें",
    desc_allow_institutions: "उपयुक्त ऑफ़र के लिए प्रोफ़ाइल खोज सक्षम करें",
    
    // Danger Zone
    sec_danger: "खतरा क्षेत्र",
    desc_danger: "ये क्रियाएं स्थायी हैं। कृपया सावधानी से आगे बढ़ें।",
    btn_logout: "लॉगआउट",
    btn_delete_account: "खाता हटाएं",
    
    // Modals
    modal_logout_title: "क्या आप वाकई लॉगआउट करना चाहते हैं?",
    modal_delete_title: "क्या आप अपना खाता हटाना चाहते हैं?",
    modal_delete_desc: "खाता हटाने से आपकी क्रेडिटमेश प्रोफ़ाइल, वित्तीय डेटा और जानकारी हमेशा के लिए हटा दी जाएगी।",
    lbl_confirm_pwd: "पासवर्ड की पुष्टि करें",
    ph_enter_pwd: "अपना पासवर्ड दर्ज करें",
    lbl_delete_agree: "मैं समझता हूं कि यह कार्रवाई स्थायी है और इसे वापस नहीं लिया जा सकता।",
    modal_verify_title: "सभी सत्यापन सफल रहे",
    modal_verify_desc: "आपकी पहचान, मोबाइल, ईमेल और वित्तीय डेटा कनेक्शन पूरी तरह सत्यापित और सक्रिय हैं।",
    btn_got_it: "समझ गया",
    btn_close: "बंद करें",
    btn_remove_access_modal: "एक्सेस हटाएं",
    toast_lang_updated: "भाषा बदलकर यह कर दी गई: "
  },

  Kannada: {
    // Navigation
    nav_profile: "ಹಣಕಾಸು ಪ್ರೊಫೈಲ್",
    nav_finances: "ಹಣಕಾಸು",
    nav_business: "ವ್ಯವಹಾರ",
    nav_options: "ಹಣಕಾಸು ಆಯ್ಕೆಗಳು",
    nav_help: "ಸಹಾಯ",
    
    // Page Header
    my_profile: "ನನ್ನ ಪ್ರೊಫೈಲ್",
    profile_subtitle: "ನಿಮ್ಮ ವೈಯಕ್ತಿಕ ಮಾಹಿತಿ, ಖಾತೆ ಸೆಟ್ಟಿಂಗ್‌ಗಳು ಮತ್ತು ಭದ್ರತಾ ಆದ್ಯತೆಗಳನ್ನು ನಿರ್ವಹಿಸಿ.",
    last_updated: "ಕೊನೆಯ ನವೀಕರಣ: ಇಂದು",
    
    // Overview Section
    edit_profile: "ಪ್ರೊಫೈಲ್ ಸಂಪಾದಿಸಿ",
    verified_account: "ದೃಢೀಕರಿಸಿದ ಖಾತೆ",
    member_since: "ಜನವರಿ 2026 ರಿಂದ ಸದಸ್ಯರು",
    role_gig: "ಗಿಗ್ ವರ್ಕರ್ / ಸಣ್ಣ ವ್ಯಾಪಾರ ಮಾಲೀಕರು",
    
    // Personal Information
    sec_personal: "ವೈಯಕ್ತಿಕ ಮಾಹಿತಿ",
    lbl_name: "ಪೂರ್ಣ ಹೆಸರು",
    lbl_email: "ಇಮೇಲ್ ವಿಳಾಸ",
    lbl_phone: "ಮೊಬೈಲ್ ಸಂಖ್ಯೆ",
    lbl_dob: "ಹುಟ್ಟಿದ ದಿನಾಂಕ",
    lbl_location: "ಸ್ಥಳ",
    lbl_occupation: "ಉದ್ಯೋಗ",
    lbl_business: "ವ್ಯವಹಾರ ಪ್ರಕಾರ",
    btn_cancel: "ರದ್ದುಮಾಡಿ",
    btn_save: "ಬದಲಾವಣೆಗಳನ್ನು ಉಳಿಸಿ",
    
    // Verification Status
    sec_verification: "ದೃಢೀಕರಣ ಸ್ಥಿತಿ",
    btn_manage_verification: "ದೃಢೀಕರಣ ನಿರ್ವಹಿಸಿ →",
    lbl_id_verify: "ಗುರುತಿನ ದೃಢೀಕರಣ",
    lbl_phone_verify: "ಮೊಬೈಲ್ ದೃಢೀಕರಣ",
    lbl_email_verify: "ಇಮೇಲ್ ದೃಢೀಕರಣ",
    lbl_fin_data_verify: "ಹಣಕಾಸು ಡೇಟಾ ಸಂಪರ್ಕ",
    st_verified: "ದೃಢೀಕರಿಸಲಾಗಿದೆ",
    
    // Connected Accounts
    sec_connected: "ಸಂಪರ್ಕಿತ ಖಾತೆಗಳು",
    connected_subtitle: "ಸಂಪರ್ಕಿತ ಹಣಕಾಸು ಸಂಕೇತಗಳು ಮತ್ತು ಡೇಟಾ ಮೂಲಗಳನ್ನು ನಿರ್ವಹಿಸಿ.",
    btn_manage_connections: "ಸಂಪರ್ಕಗಳನ್ನು ನಿರ್ವಹಿಸಿ →",
    acc_bank: "ಬ್ಯಾಂಕ್ ಖಾತೆ",
    acc_upi: "UPI ಖಾತೆ",
    acc_tx: "ವಹಿವಾಟು ಇತಿಹಾಸ",
    acc_invoice: "ಇನ್‌ವಾಯ್ಸ್ ದಾಖಲೆಗಳು",
    st_connected: "ಸಂಪರ್ಕಗೊಂಡಿದೆ",
    st_synced: "ಸಿಂಕ್ ಮಾಡಲಾಗಿದೆ",
    btn_remove_access: "ಪ್ರವೇಶ ತೆಗೆದುಹಾಕಿ →",
    
    // Preferences
    sec_preferences: "ಆದ್ಯತೆಗಳು",
    lbl_language: "ಭಾಷೆ",
    lbl_currency: "ಕರೆನ್ಸಿ",
    lbl_email_notif: "ಇಮೇಲ್ ಅಧಿಸೂಚನೆಗಳು",
    desc_email_notif: "ಇಮೇಲ್ ಮೂಲಕ ನವೀಕರಣಗಳನ್ನು ಪಡೆಯಿರಿ",
    lbl_sms_notif: "SMS ಅಧಿಸೂಚನೆಗಳು",
    desc_sms_notif: "SMS ಮೂಲಕ ಎಚ್ಚರಿಕೆಗಳನ್ನು ಪಡೆಯಿರಿ",
    lbl_ai_notif: "AI ಒಳನೋಟ ಅಧಿಸೂಚನೆಗಳು",
    desc_ai_notif: "ವೈಯಕ್ತೀಕರಿಸಿದ AI ಸಲಹೆಗಳನ್ನು ಪಡೆಯಿರಿ",
    
    // Security
    sec_security: "ಭದ್ರತೆ",
    lbl_change_pwd: "ಪಾಸ್‌ವರ್ಡ್ ಬದಲಾಯಿಸಿ",
    desc_change_pwd: "ನಿಮ್ಮ ಖಾತೆಯ ಪಾಸ್‌ವರ್ಡ್ ಅನ್ನು ನಿಯಮಿತವಾಗಿ ನವೀಕರಿಸಿ",
    btn_update_pwd: "ಪಾಸ್‌ವರ್ಡ್ ನವೀಕರಿಸಿ",
    lbl_2fa: "ದ್ವಿ-ಅಂಶ ದೃಢೀಕರಣ (2FA)",
    desc_2fa: "ಭದ್ರತೆಯ ಹೆಚ್ಚುವರಿ ಪದರವನ್ನು ಸೇರಿಸಿ",
    lbl_login_activity: "ಲಾಗಿನ್ ಚಟುವಟಿಕೆ",
    btn_view_activity: "ಎಲ್ಲಾ ಚಟುವಟಿಕೆಗಳನ್ನು ವೀಕ್ಷಿಸಿ →",
    
    // Privacy & Data Control
    sec_privacy: "ಗೌಪ್ಯತೆ ಮತ್ತು ಡೇಟಾ ನಿಯಂತ್ರಣ",
    desc_privacy: "ಕ್ರೆಡಿಟ್‌ಮೆಶ್ ನಿಮ್ಮ ಹಣಕಾಸಿನ ಮಾಹಿತಿಯನ್ನು ಹೇಗೆ ಬಳಸುತ್ತದೆ ಎಂಬುದನ್ನು ನಿಯಂತ್ರಿಸಿ.",
    btn_data_sharing: "ಡೇಟಾ ಹಂಚಿಕೆ ಅನುಮತಿಗಳು",
    btn_connected_sources: "ಸಂಪರ್ಕಿತ ಡೇಟಾ ಮೂಲಗಳು",
    btn_download_data: "ನನ್ನ ಡೇಟಾ ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ",
    btn_delete_data: "ನನ್ನ ಡೇಟಾ ಅಳಿಸಿ",
    lbl_manage: "ನಿರ್ವಹಿಸಿ",
    lbl_view: "ವೀಕ್ಷಿಸಿ",
    lbl_export: "ರಫ್ತು ಮಾಡಿ",
    lbl_remove: "ತೆಗೆದುಹಾಕಿ",
    
    // Financial Profile
    sec_fin_profile: "ಹಣಕಾಸು ಪ್ರೊಫೈಲ್",
    lbl_score_title: "ಹಣಕಾಸು ವಿಶ್ವಾಸಾರ್ಹತೆ ಸ್ಕೋರ್",
    lbl_strong_profile: "ಬಲವಾದ ಪ್ರೊಫೈಲ್",
    lbl_visibility: "ಪ್ರೊಫೈಲ್ ಗೋಚರತೆ",
    desc_visibility: "ನಿಮ್ಮ ಪ್ರೊಫೈಲ್ ಅನ್ನು ಯಾರು ನೋಡಬಹುದು ಎಂಬುದನ್ನು ನಿಯಂತ್ರಿಸಿ",
    lbl_private: "ಖಾಸಗಿ",
    lbl_allow_institutions: "ಹಣಕಾಸು ಸಂಸ್ಥೆಗಳು ನನ್ನ ಪ್ರೊಫೈಲ್ ನೋಡಲು ಅನುಮತಿಸಿ",
    desc_allow_institutions: "ಸೂಕ್ತ ಕೊಡುಗೆಗಳಿಗಾಗಿ ಪ್ರೊಫೈಲ್ ಆವಿಷ್ಕಾರವನ್ನು ಸಕ್ರಿಯಗೊಳಿಸಿ",
    
    // Danger Zone
    sec_danger: "ಅಪಾಯ ವಲಯ",
    desc_danger: "ಈ ಕ್ರಿಯೆಗಳು ಶಾಶ್ವತವಾಗಿರುತ್ತವೆ. ದಯವಿಟ್ಟು ಎಚ್ಚರಿಕೆಯಿಂದ ಮುಂದುವರಿಯಿರಿ.",
    btn_logout: "ಲಾಗ್‌ಔಟ್",
    btn_delete_account: "ಖಾತೆ ಅಳಿಸಿ",
    
    // Modals
    modal_logout_title: "ನೀವು ಖಚಿತವಾಗಿ ಲಾಗ್‌ಔಟ್ ಮಾಡಲು ಬಯಸುವಿರಾ?",
    modal_delete_title: "ನಿಮ್ಮ ಖಾತೆಯನ್ನು ಅಳಿಸಬೇಕೇ?",
    modal_delete_desc: "ಖಾತೆಯನ್ನು ಅಳಿಸುವುದರಿಂದ ನಿಮ್ಮ ಕ್ರೆಡಿಟ್‌ಮೆಶ್ ಪ್ರೊಫೈಲ್, ಹಣಕಾಸು ಡೇಟಾ ಶಾಶ್ವತವಾಗಿ ತೆಗೆದುಹಾಕಲಾಗುತ್ತದೆ.",
    lbl_confirm_pwd: "ಪಾಸ್‌ವರ್ಡ್ ದೃಢೀಕರಿಸಿ",
    ph_enter_pwd: "ನಿಮ್ಮ ಪಾಸ್‌ವರ್ಡ್ ನಮೂದಿಸಿ",
    lbl_delete_agree: "ಈ ಕ್ರಮವು ಶಾಶ್ವತವಾಗಿದ್ದು ರದ್ದುಗೊಳಿಸಲಾಗುವುದಿಲ್ಲ ಎಂದು ನಾನು ಅರ್ಥಮಾಡಿಕೊಂಡಿದ್ದೇನೆ.",
    modal_verify_title: "ಎಲ್ಲಾ ದೃಢೀಕರಣಗಳು ಯಶಸ್ವಿಯಾಗಿವೆ",
    modal_verify_desc: "ನಿಮ್ಮ ಗುರುತು, ಮೊಬೈಲ್, ಇಮೇಲ್ ಮತ್ತು ಹಣಕಾಸು ಡೇಟಾ ಸಂಪರ್ಕಗಳು ಸಂಪೂರ್ಣವಾಗಿ ಪರಿಶೀಲಿಸಲ್ಪಟ್ಟಿವೆ ಮತ್ತು ಸಕ್ರಿಯವಾಗಿವೆ.",
    btn_remove_access_modal: "ಪ್ರವೇಶ ತೆಗೆದುಹಾಕಿ",
    toast_lang_updated: "ಭಾಷೆಯನ್ನು ಇದಕ್ಕೆ ನವೀಕರಿಸಲಾಗಿದೆ: ",

    // Business & Invoices
    biz_title: "ನನ್ನ ವ್ಯವಹಾರ",
    biz_subtitle: "ನಿಮ್ಮ ವ್ಯಾಪಾರ ಚಟುವಟಿಕೆ, ಇನ್‌ವಾಯ್ಸ್‌ಗಳು ಮತ್ತು ಪಾವತಿಗಳನ್ನು ಟ್ರ್ಯಾಕ್ ಮಾಡಿ.",
    lbl_total_biz_income: "ಒಟ್ಟು ವ್ಯಾಪಾರ ಆದಾಯ",
    lbl_total_invoiced: "ಒಟ್ಟು ಇನ್‌ವಾಯ್ಸ್ ಮಾಡಿದ್ದು",
    lbl_paid: "ಪಾವತಿಸಲಾಗಿದೆ",
    lbl_pending: "ಬಾಕಿ ಉಳಿದಿದೆ",
    lbl_overdue: "ಅವಧಿ ಮೀರಿದೆ",
    btn_create_invoice: "ಇನ್‌ವಾಯ್ಸ್ ರಚಿಸಿ",
    btn_mark_paid: "ಪಾವತಿಸಲಾಗಿದೆ ಎಂದು ಗುರುತಿಸಿ",
    lbl_due_date: "ಕೊನೆಯ ದಿನಾಂಕ",
    lbl_issue_date: "ನೀಡಿದ ದಿನಾಂಕ",
    lbl_amount: "ಮೊತ್ತ",
    lbl_customer: "ಗ್ರಾಹಕರ ಹೆಸರು",

    // Dashboard & Calculations
    lbl_readiness_score: "ಹಣಕಾಸು ವಿಶ್ವಾಸಾರ್ಹತೆ ಸ್ಕೋರ್",
    lbl_monthly_surplus: "ಮಾಸಿಕ ಉಳಿತಾಯ ಮೊತ್ತ",
    lbl_income_stability: "ಆದಾಯ ಸ್ಥಿರತೆ",
    lbl_repayment_capacity: "ಅಂದಾಜು ಮರುಪಾವತಿ ಸಾಮರ್ಥ್ಯ",
    lbl_overdue_obligations: "ಅವಧಿ ಮೀರಿದ ಬಾಕಿಗಳು",
    lbl_data_completeness: "ಮಾಹಿತಿ ಪೂರ್ಣತೆ",
    btn_print_report: "ವರದಿ ಮುದ್ರಿಸಿ / ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ",
    btn_borrower_view: "ಸಾಲಗಾರರ ನೋಟ",
    btn_bank_view: "ಬ್ಯಾಂಕ್ / ಸಂಸ್ಥೆಯ ನೋಟ",
    btn_load_vendor_demo: "ಡೆಮೊ ಡೇಟಾ ಲೋಡ್ ಮಾಡಿ",
    btn_reset_empty: "ಖಾಲಿ ಡೇಟಾ ಪರೀಕ್ಷಿಸಿ",
    lbl_disclaimer: "ಕ್ರೆಡಿಟ್‌ಮೆಶ್ ಮಾಹಿತಿಯನ್ನು ಒದಗಿಸುತ್ತದೆ, ಸಾಲ ನೀಡುವ ಅಂತಿಮ ನಿರ್ಧಾರವನ್ನು ಬ್ಯಾಂಕ್‌ಗಳೇ ತೆಗೆದುಕೊಳ್ಳುತ್ತವೆ."
  },

  Tamil: {
    // Navigation
    nav_profile: "நிதி சுயவிவரம்",
    nav_finances: "நிதிகள்",
    nav_business: "வணிகம்",
    nav_options: "நிதி விருப்பங்கள்",
    nav_help: "உதவி",
    
    // Page Header
    my_profile: "என் சுயவிவரம்",
    profile_subtitle: "உங்கள் தனிப்பட்ட தகவல், கணக்கு அமைப்புகள் மற்றும் பாதுகாப்பு விருப்பங்களை நிர்வகிக்கவும்.",
    last_updated: "கடைசி புதுப்பிப்பு: இன்று",
    
    // Overview Section
    edit_profile: "சுயவிவரத்தை திருத்து",
    verified_account: "சரிபார்க்கப்பட்ட கணக்கு",
    member_since: "ஜனவரி 2026 முதல் உறுப்பினர்",
    role_gig: "கிக் தொழிலாளி / சிறு வணிக உரிமையாளர்",
    
    // Personal Information
    sec_personal: "தனிப்பட்ட தகவல்",
    lbl_name: "முழு பெயர்",
    lbl_email: "மின்னஞ்சல் முகவரி",
    lbl_phone: "கைப்பேசி எண்",
    lbl_dob: "பிறந்த தேதி",
    lbl_location: "இடம்",
    lbl_occupation: "தொழில்",
    lbl_business: "வணிக வகை",
    btn_cancel: "ரத்துசெய்",
    btn_save: "மாற்றங்களைச் சேமி",
    
    // Verification Status
    sec_verification: "சரிபார்ப்பு நிலை",
    btn_manage_verification: "சரிபார்ப்பை நிர்வகிக்கவும் →",
    lbl_id_verify: "அடையாள சரிபார்ப்பு",
    lbl_phone_verify: "கைப்பேசி சரிபார்ப்பு",
    lbl_email_verify: "மின்னஞ்சல் சரிபார்ப்பு",
    lbl_fin_data_verify: "நிதித் தரவு இணைப்பு",
    st_verified: "சரிபார்க்கப்பட்டது",
    
    // Connected Accounts
    sec_connected: "இணைக்கப்பட்ட கணக்குகள்",
    connected_subtitle: "இணைக்கப்பட்ட நிதி சமிக்ஞைகள் மற்றும் தரவு மூலங்களை நிர்வகிக்கவும்.",
    btn_manage_connections: "இணைப்புகளை நிர்வகி →",
    acc_bank: "வங்கி கணக்கு",
    acc_upi: "UPI கணக்கு",
    acc_tx: "பரிவர்த்தனை வரலாறு",
    acc_invoice: "விலைப்பட்டியல் பதிவுகள்",
    st_connected: "இணைக்கப்பட்டது",
    st_synced: "ஒத்திசைக்கப்பட்டது",
    btn_remove_access: "அணுகலை அகற்று →",
    
    // Preferences
    sec_preferences: "விருப்பத்தேர்வுகள்",
    lbl_language: "மொழி",
    lbl_currency: "நாணயம்",
    lbl_email_notif: "மின்னஞ்சல் அறிவிப்புகள்",
    desc_email_notif: "மின்னஞ்சல் வழியாக அறிவிப்புகளைப் பெறுங்கள்",
    lbl_sms_notif: "SMS அறிவிப்புகள்",
    desc_sms_notif: "SMS மூலம் எச்சரிக்கைகளைப் பெறுங்கள்",
    lbl_ai_notif: "AI நுண்ணறிவு அறிவிப்புகள்",
    desc_ai_notif: "தனிப்பயனாக்கப்பட்ட AI பரிந்துரைகளைப் பெறுங்கள்",
    
    // Security
    sec_security: "பாதுகாப்பு",
    lbl_change_pwd: "கடவுச்சொல்லை மாற்றவும்",
    desc_change_pwd: "உங்கள் கணக்கு கடவுச்சொல்லை தவறாமல் புதுப்பிக்கவும்",
    btn_update_pwd: "கடவுச்சொல்லைப் புதுப்பிக்கவும்",
    lbl_2fa: "இரு காரணி அங்கீகாரம் (2FA)",
    desc_2fa: "கூடுதல் பாதுகாப்பு அடுக்கைச் சேர்க்கவும்",
    lbl_login_activity: "உள்நுழைவு செயல்பாடு",
    btn_view_activity: "அனைத்து செயல்பாடுகளையும் காண்க →",
    
    // Privacy & Data Control
    sec_privacy: "தனியுரிமை & தரவுக் கட்டுப்பாடு",
    desc_privacy: "உங்கள் நிதித் தகவலை கிரெடிட்மெஷ் எவ்வாறு பயன்படுத்துகிறது என்பதைக் கட்டுப்படுத்தவும்.",
    btn_data_sharing: "தரவு பகிர்வு அனுமதிகள்",
    btn_connected_sources: "இணைக்கப்பட்ட தரவு மூலங்கள்",
    btn_download_data: "என் தரவை பதிவிறக்கவும்",
    btn_delete_data: "என் தரவை நீக்கவும்",
    lbl_manage: "நிர்வகி",
    lbl_view: "பார்",
    lbl_export: "ஏற்றுமதி",
    lbl_remove: "நீக்கு",
    
    // Financial Profile
    sec_fin_profile: "நிதி சுயவிவரம்",
    lbl_score_title: "நிதி நம்பகத்தன்மை மதிப்பெண்",
    lbl_strong_profile: "வலுவான சுயவிவரம்",
    lbl_visibility: "சுயவிவர தெரிவுநிலை",
    desc_visibility: "உங்கள் சுயவிவரத்தை யார் பார்க்கிறார்கள் என்பதைக் கட்டுப்படுத்தவும்",
    lbl_private: "தனிப்பட்டது",
    lbl_allow_institutions: "நிதி நிறுவனங்கள் என் சுயவிவரத்தைப் பார்க்க அனுமதிக்கவும்",
    desc_allow_institutions: "பொருத்தமான சலுகைகளுக்கு சுயவிவர கண்டறிதலை இயக்கவும்",
    
    // Danger Zone
    sec_danger: "ஆபத்து மண்டலம்",
    desc_danger: "இந்த நடவடிக்கைகள் நிரந்தரமானவை. கவனமாக தொடரவும்.",
    btn_logout: "வெளியேறு",
    btn_delete_account: "கணக்கை நீக்கு",
    
    // Modals
    modal_logout_title: "நிச்சயமாக வெளியேற விரும்புகிறீர்களா?",
    modal_delete_title: "உங்கள் கணக்கை நீக்கவா?",
    modal_delete_desc: "கணக்கை நீக்குவது உங்கள் கிரெடிட்மெஷ் சுயவிவரம் மற்றும் நிதித் தரவை நிரந்தரமாக அகற்றும்.",
    lbl_confirm_pwd: "கடவுச்சொல்லை உறுதிப்படுத்தவும்",
    ph_enter_pwd: "உங்கள் கடவுச்சொல்லை உள்ளிடவும்",
    lbl_delete_agree: "இந்த செயல் நிரந்தரமானது என்பதை நான் புரிந்துகொள்கிறேன்.",
    modal_verify_title: "அனைத்து சரிபார்ப்புகளும் முடிவடைந்தன",
    modal_verify_desc: "உங்கள் அடையாளம், மொபைல், மின்னஞ்சல் மற்றும் நிதித் தரவு இணைப்புகள் முழுமையாக சரிபார்க்கப்பட்டு செயலில் உள்ளன.",
    btn_got_it: "புரிந்தது",
    btn_close: "மூடு",
    btn_remove_access_modal: "அணுகலை அகற்று",
    toast_lang_updated: "மொழி இதற்கு மாற்றப்பட்டது: "
  },

  Telugu: {
    // Navigation
    nav_profile: "ఆర్థిక ప్రొఫైల్",
    nav_finances: "ఆర్థిక వ్యవహారాలు",
    nav_business: "వ్యాపారం",
    nav_options: "ఆర్థిక ఎంపికలు",
    nav_help: "సహాయం",
    
    // Page Header
    my_profile: "నా ప్రొఫైల్",
    profile_subtitle: "మీ వ్యక్తిగత సమాచారం, ఖాతా సెట్టింగ్‌లు మరియు భద్రతా ప్రాధాన్యతలను నిర్వహించండి.",
    last_updated: "చివరి అప్‌డేట్: ఈ రోజు",
    
    // Overview Section
    edit_profile: "ప్రొఫైల్ సవరించండి",
    verified_account: "ధృవీకరించబడిన ఖాతా",
    member_since: "జనవరి 2026 నుండి సభ్యుడు",
    role_gig: "గిగ్ వర్కర్ / చిన్న వ్యాపార యజమాని",
    
    // Personal Information
    sec_personal: "వ్యక్తిగత సమాచారం",
    lbl_name: "పూర్తి పేరు",
    lbl_email: "ఇమెయిల్ చిరునామా",
    lbl_phone: "మొబైల్ నంబర్",
    lbl_dob: "పుట్టిన తేదీ",
    lbl_location: "ప్రదేశం",
    lbl_occupation: "వృత్తి",
    lbl_business: "వ్యాపార రకం",
    btn_cancel: "రద్దు చేయండి",
    btn_save: "మార్పులను సేవ్ చేయండి",
    
    // Verification Status
    sec_verification: "ధృవీకరణ స్థితి",
    btn_manage_verification: "ధృవీకరణను నిర్వహించండి →",
    lbl_id_verify: "గుర్తింపు ధృవీకరణ",
    lbl_phone_verify: "మొబైల్ ధృవీకరణ",
    lbl_email_verify: "ఇమెయిల్ ధృవీకరణ",
    lbl_fin_data_verify: "ఆర్థిక డేటా కనెక్షన్",
    st_verified: "ధృవీకరించబడింది",
    
    // Connected Accounts
    sec_connected: "కనెక్ట్ చేయబడిన ఖాతాలు",
    connected_subtitle: "కనెక్ట్ చేయబడిన ఆర్థిక సంకేతాలు మరియు డేటా మూలాలను నిర్వహించండి.",
    btn_manage_connections: "కనెక్షన్‌లను నిర్వహించండి →",
    acc_bank: "బ్యాంక్ ఖాతా",
    acc_upi: "UPI ఖాతా",
    acc_tx: "లావాదేవీల చరిత్ర",
    acc_invoice: "ఇన్‌వాయిస్ రికార్డులు",
    st_connected: "కనెక్ట్ చేయబడింది",
    st_synced: "సింక్ చేయబడింది",
    btn_remove_access: "యాక్సెస్ తొలగించండి →",
    
    // Preferences
    sec_preferences: "ప్రాధాన్యతలు",
    lbl_language: "భాష",
    lbl_currency: "కరెన్సీ",
    lbl_email_notif: "ఇమెయిల్ నోటిఫికేషన్‌లు",
    desc_email_notif: "ఇమెయిల్ ద్వారా అప్‌డేట్‌లను పొందండి",
    lbl_sms_notif: "SMS నోటిಫికేషన్‌లు",
    desc_sms_notif: "SMS ద్వారా హెచ్చరికలను పొందండి",
    lbl_ai_notif: "AI అంతర్దృష్టి నోటిఫికేషన్‌లు",
    desc_ai_notif: "వ్యక్తిగతీకరించిన AI సూచనలను పొందండి",
    
    // Security
    sec_security: "భద్రత",
    lbl_change_pwd: "పాస్‌వర్డ్ మార్చండి",
    desc_change_pwd: "మీ ఖాతా పాస్‌వర్డ్‌ను క్రమం తప్పకుండా నవీకరించండి",
    btn_update_pwd: "పాస్‌వర్డ్ నవీకరించండి",
    lbl_2fa: "రెండు-కారకాల ప్రమాణీకరణ (2FA)",
    desc_2fa: "అదనపు భద్రతా పొరను జోడించండి",
    lbl_login_activity: "లాగిన్ కార్యాచరణ",
    btn_view_activity: "అన్ని కార్యకలాపాలను చూడండి →",
    
    // Privacy & Data Control
    sec_privacy: "గోప్యత & డేటా నియంత్రణ",
    desc_privacy: "క్రెడిట్‌మెష్ మీ ఆర్థిక సమాచారాన్ని ఎలా ఉపయోగిస్తుందో నియంత్రించండి.",
    btn_data_sharing: "డేటా భాగస్వామ్య అనుమతులు",
    btn_connected_sources: "కనెక్ట్ చేయబడిన డేటా మూలాలు",
    btn_download_data: "నా డేటాను డౌన్‌లోడ్ చేయండి",
    btn_delete_data: "నా డేటాను తొలగించండి",
    lbl_manage: "నిర్వహించండి",
    lbl_view: "చూడండి",
    lbl_export: "ఎగుమతి చేయండి",
    lbl_remove: "తొలగించండి",
    
    // Financial Profile
    sec_fin_profile: "ఆర్థిక ప్రొఫైల్",
    lbl_score_title: "ఆర్థిక విశ్వసనీయత స్కోర్",
    lbl_strong_profile: "బలమైన ప్రొఫైల్",
    lbl_visibility: "ప్రొఫైల్ దృశ్యమానత",
    desc_visibility: "మీ ప్రొఫైల్‌ను ఎవరు చూస్తారో నియంత్రించండి",
    lbl_private: "ప్రైవేట్",
    lbl_allow_institutions: "ఆర్థిక సంస్థలు నా ప్రొఫైల్‌ను వీక్షించడానికి అనుమతించండి",
    desc_allow_institutions: "తగిన ఆఫర్‌ల కోసం ప్రొఫైల్ ఆవిష్కరణను ప్రారంభించండి",
    
    // Danger Zone
    sec_danger: "ప్రమాదకర ప్రాంతం",
    desc_danger: "ఈ చర్యలు శాశ్వతమైనవి. దಯచేసి జాగ్రత్తగా కొనసాగండి.",
    btn_logout: "లాగౌట్",
    btn_delete_account: "ఖాతాను తొలగించండి",
    
    // Modals
    modal_logout_title: "మీరు ఖచ్చితంగా లాగౌట్ చేయాలనుకుంటున్నారా?",
    modal_delete_title: "మీ ఖాతాను తొలగించాలా?",
    modal_delete_desc: "ఖాతాను తొలగిస్తే మీ క్రెడిట్‌మెష్ ప్రొಫైల్ మరియు ఆర్థిక డేటా శాశ్వతంగా తొలగించబడతాయి.",
    lbl_confirm_pwd: "పాస్‌వర్డ్‌ను నిర్ధారించండి",
    ph_enter_pwd: "మీ పాస్‌వర్డ్‌ను నమోదు చేయండి",
    lbl_delete_agree: "ఈ చర్య శాశ్వతమైనదని మరియు రద్దు చేయలేమని నేను అర్థం చేసుకున్నాను.",
    modal_verify_title: "అన్ని ధృవీకరణలు విజయవంతమయ్యాయి",
    modal_verify_desc: "మీ గుర్తింపు, మొబైల్, ఇమెయిల్ మరియు ఆర్థిక డేటా కనెక్షన్‌లు పూర్తిగా ధృవీకరించబడ్డాయి మరియు చురుకుగా ఉన్నాయి.",
    btn_got_it: "అర్థమైంది",
    btn_close: "మూసివేయి",
    btn_remove_access_modal: "యాక్సెస్ తొలగించండి",
    toast_lang_updated: "భాష దీనికి నవీకరించబడింది: "
  }
};

// Function to apply translation across the page
function applyLanguage(lang) {
  if (!TRANSLATIONS[lang]) lang = "English";
  localStorage.setItem("user_language", lang);

  const dict = TRANSLATIONS[lang];
  const displayName = LANG_DISPLAY_MAP[lang] || lang;

  // 1. Update dropdown button and display labels
  const langVal = document.getElementById("langVal");
  if (langVal) langVal.textContent = displayName;
  const langDisplay = document.getElementById("langDisplay");
  if (langDisplay) langDisplay.textContent = displayName;

  // 2. Elements with data-i18n
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (dict[key]) {
      el.textContent = dict[key];
    }
  });

  // 3. Inputs with data-i18n-placeholder
  document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
    const key = el.getAttribute("data-i18n-placeholder");
    if (dict[key]) {
      el.setAttribute("placeholder", dict[key]);
    }
  });

  // 5. Update global navbar indicator if present
  const navLangLabel = document.getElementById("navLangLabel");
  if (navLangLabel) {
    const compactMap = { English: "EN", Kannada: "ಕನ್ನಡ", Hindi: "हिं", Tamil: "தமி", Telugu: "తెలు" };
    navLangLabel.textContent = compactMap[lang] || displayName;
  }
}

// Function triggered by global nav dropdown
function changeGlobalLang(lang) {
  applyLanguage(lang);
  const menu = document.getElementById("navLangMenu");
  if (menu) menu.classList.add("hidden");
  const menuMob = document.getElementById("navLangMenuMobile");
  if (menuMob) menuMob.classList.add("hidden");
  if (typeof showToast === "function") {
    const dict = TRANSLATIONS[lang] || TRANSLATIONS.English;
    showToast((dict.toast_lang_updated || "Language updated to: ") + (LANG_DISPLAY_MAP[lang] || lang));
  }
}

function toggleLangNav() {
  const menu = document.getElementById("navLangMenu");
  if (menu) menu.classList.toggle("hidden");
}

function toggleLangNavMobile() {
  const menu = document.getElementById("navLangMenuMobile");
  if (menu) menu.classList.toggle("hidden");
}

// Close language dropdown when clicking outside
document.addEventListener("click", (e) => {
  const btn = document.getElementById("navLangBtn");
  const menu = document.getElementById("navLangMenu");
  if (btn && menu && !btn.contains(e.target) && !menu.contains(e.target)) {
    menu.classList.add("hidden");
  }
  const btnMob = document.getElementById("navLangBtnMobile");
  const menuMob = document.getElementById("navLangMenuMobile");
  if (btnMob && menuMob && !btnMob.contains(e.target) && !menuMob.contains(e.target)) {
    menuMob.classList.add("hidden");
  }
});

// Auto-run on DOM ready
document.addEventListener("DOMContentLoaded", () => {
  const savedLang = localStorage.getItem("user_language") || "English";
  applyLanguage(savedLang);
});

if (typeof window !== "undefined") {
  window.TRANSLATIONS = TRANSLATIONS;
  window.applyLanguage = applyLanguage;
  window.changeGlobalLang = changeGlobalLang;
  window.toggleLangNav = toggleLangNav;
  window.toggleLangNavMobile = toggleLangNavMobile;
  window.LANG_DISPLAY_MAP = LANG_DISPLAY_MAP;
}

