// ═══════════════════════════════════════════════════════════════════════════
// ✅ VALIDATION - SIRIUS EXPEDITION
// ═══════════════════════════════════════════════════════════════════════════

import { VALIDATION } from '../constants';
import { ValidationError } from './errors';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Valide une adresse email
 */
export function validateEmail(email: string): ValidationResult {
  const errors: string[] = [];

  if (!email.trim()) {
    errors.push('L\'email est requis');
  } else if (!VALIDATION.EMAIL_REGEX.test(email)) {
    errors.push('Format d\'email invalide');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Valide un numéro de téléphone
 */
export function validatePhone(phone: string): ValidationResult {
  const errors: string[] = [];

  if (phone && !VALIDATION.PHONE_REGEX.test(phone)) {
    errors.push('Format de téléphone invalide');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Valide un nom
 */
export function validateName(name: string): ValidationResult {
  const errors: string[] = [];

  if (!name.trim()) {
    errors.push('Le nom est requis');
  } else if (name.length > VALIDATION.MAX_NAME_LENGTH) {
    errors.push(`Le nom ne doit pas dépasser ${VALIDATION.MAX_NAME_LENGTH} caractères`);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Valide un message
 */
export function validateMessage(message: string): ValidationResult {
  const errors: string[] = [];

  if (!message.trim()) {
    errors.push('Le message est requis');
  } else if (message.length > VALIDATION.MAX_MESSAGE_LENGTH) {
    errors.push(`Le message ne doit pas dépasser ${VALIDATION.MAX_MESSAGE_LENGTH} caractères`);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Valide un formulaire de contact
 */
export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

export function validateContactForm(data: ContactFormData): ValidationResult {
  const errors: string[] = [];

  const nameResult = validateName(data.name);
  const emailResult = validateEmail(data.email);
  const messageResult = validateMessage(data.message);

  if (data.phone) {
    const phoneResult = validatePhone(data.phone);
    errors.push(...phoneResult.errors);
  }

  errors.push(...nameResult.errors);
  errors.push(...emailResult.errors);
  errors.push(...messageResult.errors);

  return {
    isValid: errors.length === 0,
    errors,
  };
}
