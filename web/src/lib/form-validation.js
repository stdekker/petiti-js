// Validation rules
const rules = {
  email: {
    pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    message: 'Voer een geldig e-mailadres in'
  },
  naam: {
    minLength: 2,
    maxLength: 50,
    pattern: /^[a-zA-Z\s-']+$/,
    message: 'Naam mag alleen letters, spaties, streepjes en apostrofs bevatten'
  },
  telefoonnummer: {
    pattern: /^[0-9+-]+$/,
    minLength: 10,
    maxLength: 15,
    message: 'Voer een geldig telefoonnummer in (bijvoorbeeld: 0612345678 of +31612345678)'
  },
  postcode: {
    pattern: /^[1-9][0-9]{3}[a-zA-Z]{2}$/,
    message: 'Voer een geldige postcode in (bijvoorbeeld: 1234AB)',
    required: false
  },
  privacyAgreed: {
    required: true,
    message: 'U moet akkoord gaan met de voorwaarden'
  }
};

// Validation functions
export const validateField = (name, value) => {
  const rule = rules[name];
  if (!rule) return { isValid: true, message: '' };

  // Required field check
  if (rule.required && !value) {
    return { isValid: false, message: rule.message };
  }

  // Clean up spaces for specific fields
  let cleanedValue = value;
  if (name === 'telefoonnummer' || name === 'postcode') {
    cleanedValue = value.replace(/\s+/g, '');
  } else if (name === 'naam') {
    cleanedValue = value.replace(/\s+/g, ' ').trim();
  }

  // Pattern validation
  if (rule.pattern && cleanedValue && !rule.pattern.test(cleanedValue)) {
    return { isValid: false, message: rule.message };
  }

  // Length validation
  if (cleanedValue) {
    if (rule.minLength && cleanedValue.length < rule.minLength) {
      return { 
        isValid: false, 
        message: `Minimaal ${rule.minLength} tekens vereist` 
      };
    }
    if (rule.maxLength && cleanedValue.length > rule.maxLength) {
      return { 
        isValid: false, 
        message: `Maximaal ${rule.maxLength} tekens toegestaan` 
      };
    }
  }

  return { isValid: true, message: '' };
};

export const validateForm = (formData) => {
  const errors = {};
  let isValid = true;

  Object.entries(formData).forEach(([field, value]) => {
    const validation = validateField(field, value);
    if (!validation.isValid) {
      errors[field] = validation.message;
      isValid = false;
    }
  });

  return { isValid, errors };
};

// Format phone number as user types
export function formatPhoneNumber(phoneNumber) {
  // Remove all non-digits and + sign
  const cleaned = phoneNumber.replace(/[^\d+]/g, '');
  
  // Check if it's an international format
  if (cleaned.startsWith('+')) {
    // For international numbers, preserve the + and group in blocks of 3 after country code
    const countryCode = cleaned.slice(0, 3); // +31
    let rest = cleaned.slice(3);
    
    if (rest.length <= 3) {
      return `${countryCode} ${rest}`;
    } else if (rest.length <= 6) {
      return `${countryCode} ${rest.slice(0, 3)} ${rest.slice(3)}`;
    } else {
      return `${countryCode} ${rest.slice(0, 3)} ${rest.slice(3, 6)} ${rest.slice(6, 10)}`;
    }
  } else {
    // Handle Dutch format (starting with 0)
    if (cleaned.length <= 4) {
      return cleaned;
    } else if (cleaned.length <= 7) {
      return `${cleaned.slice(0, 4)}-${cleaned.slice(4)}`;
    } else {
      return `${cleaned.slice(0, 4)}-${cleaned.slice(4, 7)}-${cleaned.slice(7, 11)}`;
    }
  }
} 