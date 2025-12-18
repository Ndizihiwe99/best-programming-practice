// Format date to Rwanda standard
export const formatDate = (date, format = "full") => {
  if (!date) return "";

  const d = new Date(date);

  if (format === "short") {
    return d.toLocaleDateString("rw-RW", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  if (format === "time") {
    return d.toLocaleTimeString("rw-RW", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  if (format === "datetime") {
    return d.toLocaleDateString("rw-RW", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  // Full format
  return d.toLocaleDateString("rw-RW", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Format Rwanda phone number
export const formatPhoneNumber = (phone) => {
  if (!phone) return "";

  // Remove non-numeric characters
  const cleaned = phone.replace(/\D/g, "");

  // Check if it's a Rwanda number
  if (cleaned.length === 9) {
    return `+25${cleaned}`;
  }

  if (cleaned.length === 12 && cleaned.startsWith("250")) {
    return `+${cleaned}`;
  }

  if (cleaned.length === 10 && cleaned.startsWith("0")) {
    return `+25${cleaned.substring(1)}`;
  }

  return phone;
};

// Truncate text
export const truncateText = (text, length = 100) => {
  if (!text || text.length <= length) return text;
  return `${text.substring(0, length)}...`;
};

// Generate report ID
export const generateReportId = () => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `RP${timestamp}${random.toString().padStart(3, "0")}`;
};

// Calculate distance between coordinates (Haversine formula)
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
};

// Format file size
export const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

// Get initials from name
export const getInitials = (name) => {
  if (!name) return "U";

  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);
};

// Debounce function
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Deep clone object
export const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

// Get status color
export const getStatusColor = (status) => {
  const statusColors = {
    YATANZWE: "warning",
    IRI_MU_BISUZUMO: "info",
    IRI_MU_BURYO: "primary",
    YATEGEWE: "secondary",
    YARANGIYE: "success",
    YAHINJIRIJWE: "error",
    YAFUNGURWE: "default",
  };

  return statusColors[status] || "default";
};

// Generate random color from string
export const stringToColor = (string) => {
  let hash = 0;
  for (let i = 0; i < string.length; i++) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    color += ("00" + value.toString(16)).substr(-2);
  }

  return color;
};

// Validate email
export const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

// Validate Rwanda phone
export const isValidRwandaPhone = (phone) => {
  const re = /^(07[2-8]|073|078)\d{7}$/;
  return re.test(phone);
};

// Get age from birth date
export const getAge = (birthDate) => {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return age;
};

// Group array by key
export const groupBy = (array, key) => {
  return array.reduce((result, item) => {
    const groupKey = item[key];
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(item);
    return result;
  }, {});
};

// Sort array by key
export const sortBy = (array, key, order = "asc") => {
  return [...array].sort((a, b) => {
    if (a[key] < b[key]) return order === "asc" ? -1 : 1;
    if (a[key] > b[key]) return order === "asc" ? 1 : -1;
    return 0;
  });
};

// Filter array by search term
export const filterBySearch = (array, searchTerm, fields) => {
  if (!searchTerm) return array;

  const term = searchTerm.toLowerCase();
  return array.filter((item) =>
    fields.some((field) =>
      String(item[field] || "")
        .toLowerCase()
        .includes(term)
    )
  );
};

// Generate UUID
export const generateUUID = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

// Capitalize first letter
export const capitalize = (str) => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

// Format currency (RWF)
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat("rw-RW", {
    style: "currency",
    currency: "RWF",
    minimumFractionDigits: 0,
  }).format(amount);
};

// Get time ago
export const getTimeAgo = (date) => {
  const now = new Date();
  const past = new Date(date);
  const seconds = Math.floor((now - past) / 1000);

  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
    second: 1,
  };

  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / secondsInUnit);
    if (interval >= 1) {
      return `${interval} ${unit}${interval === 1 ? "" : "s"} ago`;
    }
  }

  return "Just now";
};

// Parse query string
export const parseQueryString = (queryString) => {
  const params = new URLSearchParams(queryString);
  const result = {};

  for (const [key, value] of params.entries()) {
    result[key] = value;
  }

  return result;
};

// Create query string
export const createQueryString = (params) => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.append(key, value);
    }
  });

  return searchParams.toString();
};

// Download file
export const downloadFile = (data, filename, type = "text/plain") => {
  const blob = new Blob([data], { type });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

// Copy to clipboard
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error("Failed to copy text: ", err);
    return false;
  }
};

// Sleep function
export const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export default {
  formatDate,
  formatPhoneNumber,
  truncateText,
  generateReportId,
  calculateDistance,
  formatFileSize,
  getInitials,
  debounce,
  deepClone,
  getStatusColor,
  stringToColor,
  isValidEmail,
  isValidRwandaPhone,
  getAge,
  groupBy,
  sortBy,
  filterBySearch,
  generateUUID,
  capitalize,
  formatCurrency,
  getTimeAgo,
  parseQueryString,
  createQueryString,
  downloadFile,
  copyToClipboard,
  sleep,
};
