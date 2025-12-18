// Application Constants

export const APP_CONFIG = {
  NAME: "Rwanda Citizen Security Platform",
  VERSION: "1.0.0",
  API_URL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  CONTACT: {
    EMERGENCY: "112",
    POLICE: "0788 831 000",
    EMAIL: "support@rwandasecurity.gov.rw",
  },
};

// User Roles
export const USER_ROLES = {
  CITIZEN: "citizen",
  POLICE_OFFICER: "police_officer",
  POLICE_ADMIN: "police_admin",
  SUPER_ADMIN: "super_admin",
};

// Report Status
export const REPORT_STATUS = {
  SUBMITTED: {
    code: "YATANZWE",
    en: "Submitted",
    rw: "Yatanzwe",
    fr: "Soumis",
    color: "warning",
    icon: "⏳",
  },
  UNDER_REVIEW: {
    code: "IRI_MU_BISUZUMO",
    en: "Under Review",
    rw: "Iri mu bisuzumo",
    fr: "En Cours d'Examen",
    color: "info",
    icon: "🔍",
  },
  IN_PROGRESS: {
    code: "IRI_MU_BURYO",
    en: "In Progress",
    rw: "Iri mu Buryo",
    fr: "En Cours",
    color: "primary",
    icon: "⚡",
  },
  ASSIGNED: {
    code: "YATEGEWE",
    en: "Assigned",
    rw: "Yateguwe",
    fr: "Assigné",
    color: "secondary",
    icon: "👮",
  },
  RESOLVED: {
    code: "YARANGIYE",
    en: "Resolved",
    rw: "Yarangiye",
    fr: "Résolu",
    color: "success",
    icon: "✅",
  },
  REJECTED: {
    code: "YAHINJIRIJWE",
    en: "Rejected",
    rw: "Yahinjiriwe",
    fr: "Rejeté",
    color: "error",
    icon: "❌",
  },
  CLOSED: {
    code: "YAFUNGURWE",
    en: "Closed",
    rw: "Yafunguwe",
    fr: "Fermé",
    color: "default",
    icon: "🔒",
  },
};

// Crime Categories
export const CRIME_CATEGORIES = [
  {
    code: "THEFT",
    en: "Theft",
    rw: "Ubujura",
    fr: "Vol",
    icon: "💰",
    severity: "MEDIUM",
  },
  {
    code: "ASSAULT",
    en: "Assault",
    rw: "Gutera",
    fr: "Agression",
    icon: "👊",
    severity: "HIGH",
  },
  {
    code: "DOMESTIC_VIOLENCE",
    en: "Domestic Violence",
    rw: "Ibikorwa by'ubugizi bwa nabi mu muryango",
    fr: "Violence Domestique",
    icon: "🏠",
    severity: "HIGH",
  },
  {
    code: "VANDALISM",
    en: "Vandalism",
    rw: "Kwangiza ibikoresho",
    fr: "Vandalisme",
    icon: "🔨",
    severity: "MEDIUM",
  },
  {
    code: "FRAUD",
    en: "Fraud",
    rw: "Uburyarya",
    fr: "Fraude",
    icon: "🎭",
    severity: "MEDIUM",
  },
  {
    code: "TRAFFIC_VIOLATION",
    en: "Traffic Violation",
    rw: "Guhugura amategeko y'umuhanda",
    fr: "Infraction Routière",
    icon: "🚗",
    severity: "LOW",
  },
  {
    code: "PUBLIC_DISTURBANCE",
    en: "Public Disturbance",
    rw: "Guhangayikisha rubanda",
    fr: "Trouble à l'Ordre Public",
    icon: "🔊",
    severity: "MEDIUM",
  },
  {
    code: "DRUG_RELATED",
    en: "Drug Related",
    rw: "Ibirego",
    fr: "Lié à la Drogue",
    icon: "💊",
    severity: "HIGH",
  },
  {
    code: "CYBER_CRIME",
    en: "Cyber Crime",
    rw: "Ubujura bw'ikoranabuhanga",
    fr: "Cybercriminalité",
    icon: "💻",
    severity: "HIGH",
  },
  {
    code: "SEXUAL_HARASSMENT",
    en: "Sexual Harassment",
    rw: "Kwikiza mu buryo bw'imyambarire",
    fr: "Harcèlement Sexuel",
    icon: "🚫",
    severity: "HIGH",
  },
];

// Rwanda Administrative Divisions
export const PROVINCES = [
  "Kigali City",
  "Eastern Province",
  "Western Province",
  "Northern Province",
  "Southern Province",
];

export const DISTRICTS = {
  "Kigali City": ["Gasabo", "Kicukiro", "Nyarugenge"],
  "Eastern Province": [
    "Bugesera",
    "Gatsibo",
    "Kayonza",
    "Kirehe",
    "Ngoma",
    "Nyagatare",
    "Rwamagana",
  ],
  "Western Province": [
    "Karongi",
    "Ngororero",
    "Nyabihu",
    "Nyamasheke",
    "Rubavu",
    "Rusizi",
    "Rutsiro",
  ],
  "Northern Province": ["Burera", "Gakenke", "Gicumbi", "Musanze", "Rulindo"],
  "Southern Province": [
    "Gisagara",
    "Huye",
    "Kamonyi",
    "Muhanga",
    "Nyamagabe",
    "Nyanza",
    "Nyaruguru",
    "Ruhango",
  ],
};

// Priority Levels
export const PRIORITY_LEVELS = {
  LOW: { label: "Low", color: "success", icon: "🟢" },
  MEDIUM: { label: "Medium", color: "warning", icon: "🟡" },
  HIGH: { label: "High", color: "error", icon: "🔴" },
  URGENT: { label: "Urgent", color: "error", icon: "🚨" },
};

// Police Ranks
export const POLICE_RANKS = [
  "Commissioner General",
  "Commissioner",
  "Assistant Commissioner",
  "Senior Superintendent",
  "Superintendent",
  "Assistant Superintendent",
  "Chief Inspector",
  "Inspector",
  "Assistant Inspector",
  "Sergeant",
  "Corporal",
  "Constable",
];

// Validation Regex
export const REGEX = {
  RWANDA_PHONE: /^(07[2-8]|073|078)\d{7}$/,
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  NATIONAL_ID: /^\d{16}$/,
  PASSWORD:
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
};

// SMS Templates
export const SMS_TEMPLATES = {
  REGISTRATION_SUCCESS: {
    rw: "Murakaza neza! Konti yawe yashyizweho neza kuri Rwanda Citizen Security Platform.",
    en: "Welcome! Your account has been created successfully on Rwanda Citizen Security Platform.",
  },
  REPORT_SUBMITTED: {
    rw: "Raporo yawe yatanzwe neza. Tuzakurikirana kuri telefone: 0788 831 000.",
    en: "Your report has been submitted successfully. We will follow up via phone: 0788 831 000.",
  },
  STATUS_UPDATED: {
    rw: "Amakuru: Raporo yawe yahinduye imimerere. Reba kuri dashboard yawe.",
    en: "Update: Your report status has changed. Check your dashboard.",
  },
  PASSWORD_RESET: {
    rw: "Kode yo guhindura ijambo ryibanga: {CODE}. Irizima mu minota 10.",
    en: "Password reset code: {CODE}. Valid for 10 minutes.",
  },
};

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",
    ME: "/auth/me",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password",
  },
  REPORTS: {
    BASE: "/reports",
    MY_REPORTS: "/reports/my",
    STATISTICS: "/reports/statistics",
    NEARBY: "/reports/nearby",
  },
  ADMIN: {
    STATIONS: "/admin/stations",
    OFFICERS: "/admin/officers",
    USERS: "/admin/users",
  },
};

// Local Storage Keys
export const STORAGE_KEYS = {
  TOKEN: "rsp_token",
  USER: "rsp_user",
  THEME: "rsp_theme",
  LANGUAGE: "rsp_language",
};

// Languages
export const LANGUAGES = [
  { code: "rw", name: "Kinyarwanda", flag: "🇷🇼" },
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "fr", name: "French", flag: "🇫🇷" },
];

export default {
  APP_CONFIG,
  USER_ROLES,
  REPORT_STATUS,
  CRIME_CATEGORIES,
  PROVINCES,
  DISTRICTS,
  PRIORITY_LEVELS,
  POLICE_RANKS,
  REGEX,
  SMS_TEMPLATES,
  API_ENDPOINTS,
  STORAGE_KEYS,
  LANGUAGES,
};
