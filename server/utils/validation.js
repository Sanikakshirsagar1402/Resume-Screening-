
/**
 * Validation utility for email, password, and phone number
 */

const validateEmail = (email) => {
  // RFC 5322 compliant regex for email
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  
  if (!emailRegex.test(email)) {
    return { valid: false, message: "Invalid email format" };
  }

  // Domain check - for example, only allowing common domains or specific corporate ones
  // In a real application, you might want to allow all but filter out burner/spam domains
  const allowedDomains = ["gmail.com", "yahoo.com", "outlook.com", "hotmail.com", "icloud.com", "protonmail.com"];
  const domain = email.split("@")[1].toLowerCase();
  
  // Example of how to handle corporate domains: 
  // if (!allowedDomains.includes(domain) && !domain.endsWith(".edu") && !domain.endsWith(".gov")) {
  //   return { valid: false, message: "Only common or educational domains are allowed" };
  // }

  return { valid: true };
};

const validatePassword = (password) => {
  // Minimum 8 characters, at least one uppercase letter, one lowercase letter, one number and one special character
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  
  if (password.length < 8) {
    return { valid: false, message: "Password must be at least 8 characters long" };
  }
  
  if (!passwordRegex.test(password)) {
    return { valid: false, message: "Password must contain at least one uppercase, one lowercase, one number, and one special character (@$!%*?&)" };
  }
  
  return { valid: true };
};

const validatePhone = (phone) => {
  // Exactly 10 digits
  const phoneRegex = /^\d{10}$/;
  
  if (!phoneRegex.test(phone)) {
    return { valid: false, message: "Phone number must be exactly 10 digits" };
  }
  
  return { valid: true };
};

module.exports = {
  validateEmail,
  validatePassword,
  validatePhone
};
