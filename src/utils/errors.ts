// ═══════════════════════════════════════════════════════════════════════════
// 🛡️ GESTION D'ERREURS - SIRIUS EXPEDITION
// ═══════════════════════════════════════════════════════════════════════════

export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class ValidationError extends AppError {
  constructor(message: string, public field?: string) {
    super(message, 'VALIDATION_ERROR', 400);
    this.name = 'ValidationError';
  }
}

export class StorageError extends AppError {
  constructor(message: string) {
    super(message, 'STORAGE_ERROR', 500);
    this.name = 'StorageError';
  }
}

/**
 * Gère les erreurs de manière centralisée
 */
export function handleError(error: unknown): { message: string; code: string } {
  if (error instanceof AppError) {
    return { message: error.message, code: error.code };
  }

  if (error instanceof Error) {
    console.error('Erreur non gérée:', error);
    return { message: error.message, code: 'UNKNOWN_ERROR' };
  }

  return { message: 'Une erreur inattendue s\'est produite', code: 'UNKNOWN_ERROR' };
}

/**
 * Wrapper pour les fonctions async avec gestion d'erreur
 */
export async function safeAsync<T>(
  fn: () => Promise<T>,
  errorMessage: string = 'Une erreur s\'est produite'
): Promise<[T | null, Error | null]> {
  try {
    const result = await fn();
    return [result, null];
  } catch (error) {
    const appError = error instanceof Error ? error : new Error(errorMessage);
    return [null, appError];
  }
}
