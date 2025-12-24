// ═══════════════════════════════════════════════════════════════════════════
// 💾 GESTION DU STOCKAGE - SIRIUS EXPEDITION
// ═══════════════════════════════════════════════════════════════════════════

import { STORAGE_KEYS } from '../constants';
import { StorageError, safeAsync } from './errors';

/**
 * Sauvegarde des données dans localStorage avec gestion d'erreur
 */
export function saveToStorage<T>(key: string, data: T): void {
  try {
    const serialized = JSON.stringify(data);
    localStorage.setItem(key, serialized);
  } catch (error) {
    throw new StorageError(`Impossible de sauvegarder dans localStorage: ${error}`);
  }
}

/**
 * Charge des données depuis localStorage avec gestion d'erreur
 */
export function loadFromStorage<T>(key: string): T | null {
  try {
    const item = localStorage.getItem(key);
    if (!item) return null;
    return JSON.parse(item) as T;
  } catch (error) {
    console.error(`Erreur lors du chargement de ${key}:`, error);
    return null;
  }
}

/**
 * Supprime une clé du localStorage
 */
export function removeFromStorage(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Erreur lors de la suppression de ${key}:`, error);
  }
}

/**
 * Sauvegarde le contenu du site
 */
export function saveContent<T>(content: T): void {
  saveToStorage(STORAGE_KEYS.CONTENT, content);
}

/**
 * Charge le contenu du site
 */
export function loadContent<T>(): T | null {
  return loadFromStorage<T>(STORAGE_KEYS.CONTENT);
}

/**
 * Vérifie si l'utilisateur est authentifié
 */
export function isAuthenticated(): boolean {
  return sessionStorage.getItem(STORAGE_KEYS.AUTH) === 'true';
}

/**
 * Sauvegarde l'état d'authentification
 */
export function setAuthenticated(value: boolean): void {
  if (value) {
    sessionStorage.setItem(STORAGE_KEYS.AUTH, 'true');
  } else {
    sessionStorage.removeItem(STORAGE_KEYS.AUTH);
  }
}
