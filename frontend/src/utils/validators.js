import { REGEX } from "./constants";

// Required field validator
export const required = (value) => {
  if (!value || value.toString().trim() === "") {
    return "This field is required";
  }
  return null;
};

// Email validator
export const email = (value) => {
  if (value && !REGEX.EMAIL.test(value)) {
    return "Please enter a valid email address";
  }
  return null;
};

// Phone validator
export const phone = (value) => {
  if (value && !REGEX.RWANDA_PHONE.test(value)) {
    return "Please enter a valid Rwanda phone number (07X XXX XXXX)";
  }
  return null;
};

// Password validator
export const password = (value) => {
  if (value && !REGEX.PASSWORD.test(value)) {
    return "Password must be at least 8 characters with uppercase, lowercase, number, and special character";
  }
  return null;
};

// Confirm password validator
export const confirmPassword = (value, password) => {
  if (value !== password) {
    return "Passwords do not match";
  }
  return null;
};

// Minimum length validator
export const minLength = (value, min) => {
  if (value && value.length < min) {
    return `Must be at least ${min} characters`;
  }
  return null;
};

// Maximum length validator
export const maxLength = (value, max) => {
  if (value && value.length > max) {
    return `Must be less than ${max} characters`;
  }
  return null;
};

// Number validator
export const number = (value) => {
  if (value && isNaN(Number(value))) {
    return "Must be a valid number";
  }
  return null;
};

// Minimum value validator
export const minValue = (value, min) => {
  if (value && Number(value) < min) {
    return `Must be at least ${min}`;
  }
  return null;
};

// Maximum value validator
export const maxValue = (value, max) => {
  if (value && Number(value) > max) {
    return `Must be less than ${max}`;
  }
  return null;
};

// URL validator
export const url = (value) => {
  if (value) {
    try {
      new URL(value);
    } catch (_) {
      return "Please enter a valid URL";
    }
  }
  return null;
};

// Date validator
export const date = (value) => {
  if (value) {
    const date = new Date(value);
    if (isNaN(date.getTime())) {
      return "Please enter a valid date";
    }
  }
  return null;
};

// Future date validator
export const futureDate = (value) => {
  if (value) {
    const date = new Date(value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (date < today) {
      return "Date cannot be in the past";
    }
  }
  return null;
};

// Past date validator
export const pastDate = (value) => {
  if (value) {
    const date = new Date(value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (date > today) {
      return "Date cannot be in the future";
    }
  }
  return null;
};

// Array minimum length validator
export const minArrayLength = (value, min) => {
  if (value && value.length < min) {
    return `Please select at least ${min} item${min > 1 ? "s" : ""}`;
  }
  return null;
};

// Array maximum length validator
export const maxArrayLength = (value, max) => {
  if (value && value.length > max) {
    return `Please select at most ${max} item${max > 1 ? "s" : ""}`;
  }
  return null;
};

// Regex validator
export const regex = (value, pattern, message = "Invalid format") => {
  if (value && !pattern.test(value)) {
    return message;
  }
  return null;
};

// Custom validator
export const custom = (value, validator, message) => {
  if (value && !validator(value)) {
    return message || "Invalid value";
  }
  return null;
};

// Compose multiple validators
export const composeValidators = (...validators) => {
  return (value, allValues) => {
    for (const validator of validators) {
      const error =
        typeof validator === "function" ? validator(value, allValues) : null;

      if (error) {
        return error;
      }
    }
    return null;
  };
};

// Form validator
export const validateForm = (values, validations) => {
  const errors = {};

  Object.keys(validations).forEach((field) => {
    const fieldValidators = validations[field];

    if (Array.isArray(fieldValidators)) {
      for (const validator of fieldValidators) {
        const error = validator(values[field], values);
        if (error) {
          errors[field] = error;
          break;
        }
      }
    } else if (typeof fieldValidators === "function") {
      const error = fieldValidators(values[field], values);
      if (error) {
        errors[field] = error;
      }
    }
  });

  return errors;
};

// Report form validator
export const validateReportForm = (values) => {
  return validateForm(values, {
    title: [required, (v) => minLength(v, 5), (v) => maxLength(v, 200)],
    description: [required, (v) => minLength(v, 10), (v) => maxLength(v, 2000)],
    category: [required],
    province: [required],
    district: [required],
    sector: [required],
    incidentDate: [required, date, pastDate],
    latitude: [number, (v) => minValue(v, -90), (v) => maxValue(v, 90)],
    longitude: [number, (v) => minValue(v, -180), (v) => maxValue(v, 180)],
  });
};

// Registration form validator
export const validateRegistrationForm = (values) => {
  return validateForm(values, {
    firstName: [required, (v) => minLength(v, 2), (v) => maxLength(v, 50)],
    lastName: [required, (v) => minLength(v, 2), (v) => maxLength(v, 50)],
    phoneNumber: [required, phone],
    email: [email],
    password: [required, password],
    confirmPassword: [(v) => confirmPassword(v, values.password)],
    province: [required],
    district: [required],
    sector: [required],
  });
};

// Login form validator
export const validateLoginForm = (values) => {
  return validateForm(values, {
    phoneNumber: [required, phone],
    password: [required],
  });
};

// Profile form validator
export const validateProfileForm = (values) => {
  return validateForm(values, {
    firstName: [required, (v) => minLength(v, 2), (v) => maxLength(v, 50)],
    lastName: [required, (v) => minLength(v, 2), (v) => maxLength(v, 50)],
    email: [email],
    phoneNumber: [required, phone],
    province: [required],
    district: [required],
    sector: [required],
  });
};

// Password change validator
export const validatePasswordChange = (values) => {
  return validateForm(values, {
    currentPassword: [required],
    newPassword: [required, password],
    confirmPassword: [(v) => confirmPassword(v, values.newPassword)],
  });
};

export default {
  required,
  email,
  phone,
  password,
  confirmPassword,
  minLength,
  maxLength,
  number,
  minValue,
  maxValue,
  url,
  date,
  futureDate,
  pastDate,
  minArrayLength,
  maxArrayLength,
  regex,
  custom,
  composeValidators,
  validateForm,
  validateReportForm,
  validateRegistrationForm,
  validateLoginForm,
  validateProfileForm,
  validatePasswordChange,
};
