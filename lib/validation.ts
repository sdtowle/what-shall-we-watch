export interface ValidationResult {
  valid: boolean;
  error?: string;
}

export function validateEmail(email: string): ValidationResult {
  const trimmed = email.trim();

  if (!trimmed) {
    return { valid: false, error: 'Email is required' };
  }

  if (trimmed.length > 254) {
    return { valid: false, error: 'Email is too long' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmed)) {
    return { valid: false, error: 'Please enter a valid email address' };
  }

  return { valid: true };
}

export function validateName(name: string, fieldName: string = 'Name'): ValidationResult {
  const trimmed = name.trim();

  if (!trimmed) {
    return { valid: false, error: `${fieldName} is required` };
  }

  if (trimmed.length > 50) {
    return { valid: false, error: `${fieldName} must be 50 characters or less` };
  }

  const nameRegex = /^[a-zA-Z\s\-']+$/;
  if (!nameRegex.test(trimmed)) {
    return { valid: false, error: `${fieldName} can only contain letters, spaces, hyphens, and apostrophes` };
  }

  return { valid: true };
}

export function validatePassword(password: string): ValidationResult {
  if (!password) {
    return { valid: false, error: 'Password is required' };
  }

  if (password.length < 8) {
    return { valid: false, error: 'Password must be at least 8 characters' };
  }

  return { valid: true };
}

export function sanitizeInput(input: string, maxLength: number = 254): string {
  return input
    .trim()
    .replace(/[<>]/g, '')
    .slice(0, maxLength);
}
