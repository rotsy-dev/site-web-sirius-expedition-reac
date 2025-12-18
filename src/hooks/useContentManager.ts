// src/hooks/useContentManager.ts
import { useState, useEffect } from 'react';
import * as defaultContent from '../app/data/content';

const STORAGE_KEY = 'sirius_content';
const AUTH_KEY = 'sirius_admin_auth';
const DEFAULT_PASSWORD = 'admin123';

export function useContentManager() {
    const [content, setContent] = useState(defaultContent);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Charger le contenu depuis localStorage au démarrage
    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                setContent(JSON.parse(saved));
            } catch (error) {
                console.error('Error loading saved content:', error);
            }
        }

        // Vérifier l'authentification
        const auth = sessionStorage.getItem(AUTH_KEY);
        setIsAuthenticated(auth === 'true');
    }, []);

    // Sauvegarder le contenu
    const saveContent = (newContent: typeof defaultContent) => {
        setContent(newContent);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newContent));
    };

    // Mettre à jour une section spécifique
    const updateSection = (section: string, data: any) => {
        const newContent = {
            ...content,
            [section]: data,
        };
        saveContent(newContent);
    };

    // Réinitialiser aux valeurs par défaut
    const resetToDefaults = () => {
        setContent(defaultContent);
        localStorage.removeItem(STORAGE_KEY);
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
                    const imported = JSON.parse(e.target?.result as string);
                    saveContent(imported);
                    resolve();
                } catch (error) {
                    reject(error);
                }
            };
            reader.onerror = reject;
            reader.readAsText(file);
        });
    };

    // Authentification
    const login = (password: string) => {
        if (password === DEFAULT_PASSWORD) {
            sessionStorage.setItem(AUTH_KEY, 'true');
            setIsAuthenticated(true);
            return true;
        }
        return false;
    };

    const logout = () => {
        sessionStorage.removeItem(AUTH_KEY);
        setIsAuthenticated(false);
    };

    return {
        content,
        updateSection,
        saveContent,
        resetToDefaults,
        exportContent,
        importContent,
        isAuthenticated,
        login,
        logout,
    };
}