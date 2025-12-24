// src/hooks/useContentManager.ts
import { useState, useEffect } from 'react';
import * as defaultContent from '../app/data/content';
import type { ContentData, ContentSection } from '../types/content';
import { STORAGE_KEYS, DEFAULT_CONFIG, MESSAGES } from '../constants';
import { saveContent, loadContent, isAuthenticated as checkAuth, setAuthenticated } from '../utils/storage';
import { handleError } from '../utils/errors';

export function useContentManager() {
    const [content, setContent] = useState<ContentData>(defaultContent as unknown as ContentData);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Charger le contenu depuis localStorage au démarrage
    useEffect(() => {
        const saved = loadContent<ContentData>();
        if (saved) {
            try {
                setContent(saved);
            } catch (error) {
                const { message } = handleError(error);
                console.error('Error loading saved content:', message);
            }
        }

        // Vérifier l'authentification
        setIsAuthenticated(checkAuth());
    }, []);

    // Sauvegarder le contenu
    const saveContentData = (newContent: ContentData) => {
        try {
            setContent(newContent);
            saveContent(newContent);
        } catch (error) {
            const { message } = handleError(error);
            console.error('Error saving content:', message);
            throw error;
        }
    };

    // Mettre à jour une section spécifique
    const updateSection = <T extends ContentSection>(section: T, data: ContentData[T]) => {
        const newContent = {
            ...content,
            [section]: data,
        };
        saveContentData(newContent);
    };

    // Réinitialiser aux valeurs par défaut
    const resetToDefaults = () => {
        try {
            setContent(defaultContent as unknown as ContentData);
            localStorage.removeItem(STORAGE_KEYS.CONTENT);
        } catch (error) {
            const { message } = handleError(error);
            console.error('Error resetting content:', message);
            throw error;
        }
    };

    // Exporter le contenu en JSON
    const exportContent = () => {
        const dataStr = JSON.stringify(content, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `sirius-content-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        URL.revokeObjectURL(url);
    };

    // Importer du contenu
    const importContent = async (file: File): Promise<void> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const imported = JSON.parse(e.target?.result as string) as ContentData;
                    // Validation basique de la structure
                    if (!imported || typeof imported !== 'object') {
                        throw new Error('Format de fichier invalide');
                    }
                    saveContentData(imported);
                    resolve();
                } catch (error) {
                    const { message } = handleError(error);
                    reject(new Error(message || MESSAGES.ERROR.IMPORT_FAILED));
                }
            };
            reader.onerror = () => reject(new Error(MESSAGES.ERROR.IMPORT_FAILED));
            reader.readAsText(file);
        });
    };

    // Authentification
    const login = (password: string) => {
        if (password === DEFAULT_CONFIG.ADMIN_PASSWORD) {
            setAuthenticated(true);
            setIsAuthenticated(true);
            return true;
        }
        return false;
    };

    const logout = () => {
        setAuthenticated(false);
        setIsAuthenticated(false);
    };

    return {
        content,
        updateSection,
        saveContent: saveContentData,
        resetToDefaults,
        exportContent,
        importContent,
        isAuthenticated,
        login,
        logout,
    };
}