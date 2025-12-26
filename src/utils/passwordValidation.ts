/**
 * Interface pour le résultat de validation
 */
export interface PasswordValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Règles de validation du mot de passe
 */
export const PASSWORD_RULES = {
  minLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumber: true,
  requireSpecialChar: true,
};

/**
 * Valide un mot de passe selon les règles définies
 * @param password Le mot de passe à valider
 * @returns Objet contenant isValid et la liste des erreurs
 */
export function validatePassword(password: string): PasswordValidationResult {
  const errors: string[] = [];

  // Vérification longueur minimale
  if (password.length < PASSWORD_RULES.minLength) {
    errors.push(`Au moins ${PASSWORD_RULES.minLength} caractères`);
  }

  // Vérification lettre majuscule
  if (PASSWORD_RULES.requireUppercase && !/[A-Z]/.test(password)) {
    errors.push('Au moins une lettre majuscule (A-Z)');
  }

  // Vérification lettre minuscule
  if (PASSWORD_RULES.requireLowercase && !/[a-z]/.test(password)) {
    errors.push('Au moins une lettre minuscule (a-z)');
  }

  // Vérification chiffre
  if (PASSWORD_RULES.requireNumber && !/[0-9]/.test(password)) {
    errors.push('Au moins un chiffre (0-9)');
  }

  // Vérification caractère spécial
  if (PASSWORD_RULES.requireSpecialChar && !/[!@#$%^&*(),.?":{}|<>_\-+=\[\]\\\/;'`~]/.test(password)) {
    errors.push('Au moins un caractère spécial (!@#$%^&*...)');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Calcule la force du mot de passe (0-100)
 * @param password Le mot de passe à évaluer
 * @returns Score de 0 à 100
 */
export function getPasswordStrength(password: string): number {
  let strength = 0;

  if (password.length >= 8) strength += 20;
  if (password.length >= 12) strength += 10;
  if (password.length >= 16) strength += 10;
  
  if (/[a-z]/.test(password)) strength += 15;
  if (/[A-Z]/.test(password)) strength += 15;
  if (/[0-9]/.test(password)) strength += 15;
  if (/[!@#$%^&*(),.?":{}|<>_\-+=\[\]\\\/;'`~]/.test(password)) strength += 15;

  return Math.min(strength, 100);
}

/**
 * Obtient la couleur selon la force du mot de passe
 * @param strength Score de force (0-100)
 * @returns Classe CSS de couleur
 */
export function getStrengthColor(strength: number): string {
  if (strength < 40) return 'bg-red-500';
  if (strength < 70) return 'bg-yellow-500';
  return 'bg-green-500';
}

/**
 * Obtient le label selon la force du mot de passe
 * @param strength Score de force (0-100)
 * @returns Label descriptif
 */
export function getStrengthLabel(strength: number): string {
  if (strength < 40) return 'Faible';
  if (strength < 70) return 'Moyen';
  return 'Fort';
}