import * as React from 'react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Lock, Eye, EyeOff, Shield, Mail, User, Check, X, AlertCircle, XCircle, ArrowLeft
} from 'lucide-react';
import { auth, db } from '../../../firebase/config';
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword
} from 'firebase/auth';
import { doc, setDoc, collection, getDocs, query } from 'firebase/firestore';
import {
    validatePassword,
    getPasswordStrength,
    getStrengthColor,
    getStrengthLabel
} from '../../../utils/passwordValidation';

const backgroundImageUrl = '/images/fond.jpeg';

import { AdminDashboard } from './AdminDashboard';

const mockContent = { heroSlides: [], bestSellers: [], tourSpecialties: [], reviews: [], blogPosts: [], faqs: [], siteConfig: {} };
const mockOnUpdateSection = () => { };
const mockOnLogout = () => { };
const mockOnExport = () => { };
const mockOnImport = async () => { };
const mockOnReset = () => { };

// ========== TOAST ERREUR ==========
function ErrorToast({ message, onClose }: { message: string; onClose: () => void }) {
    useEffect(() => {
        const timer = setTimeout(onClose, 8000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="fixed top-6 right-6 z-50 max-w-md"
        >
            <div className="bg-red-500/95 backdrop-blur-xl text-white rounded-2xl shadow-2xl border border-red-400/50 p-4 flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <AlertCircle size={20} />
                </div>
                <div className="flex-1 min-w-0">
                    <h4 className="font-semibold mb-1">Erreur</h4>
                    <p className="text-sm text-red-50">{message}</p>
                </div>
                <button
                    onClick={onClose}
                    className="flex-shrink-0 text-white/80 hover:text-white transition-colors"
                >
                    <XCircle size={20} />
                </button>
            </div>
        </motion.div>
    );
}

// ========== COMPOSANT PRINCIPAL ==========
export function AdminLogin({ onBack }: { onBack?: () => void }) {
    const [mode, setMode] = useState<'login' | 'register'>('login');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Validation mot de passe
    const [passwordValidation, setPasswordValidation] = useState({ isValid: false, errors: [] as string[] });
    const [passwordStrength, setPasswordStrength] = useState(0);

    useEffect(() => {
        if (mode === 'register' && password) {
            const validation = validatePassword(password);
            setPasswordValidation(validation);
            setPasswordStrength(getPasswordStrength(password));
        } else {
            setPasswordValidation({ isValid: false, errors: [] });
            setPasswordStrength(0);
        }
    }, [password, mode]);

    const resetForm = () => {
        setUsername('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setError('');
        setPasswordValidation({ isValid: false, errors: [] });
        setPasswordStrength(0);
    };

    const checkAdminCount = async (): Promise<boolean> => {
        try {
            const usersRef = collection(db, 'users');
            const q = query(usersRef);
            const querySnapshot = await getDocs(q);
            return querySnapshot.size < 3;
        } catch (err) {
            console.error('Erreur vérification admins:', err);
            throw new Error('Impossible de vérifier le nombre d\'administrateurs');
        }
    };

    const handleSubmit = async () => {
        setError('');
        setIsLoading(true);

        try {
            if (mode === 'login') {
                if (!email || !password) throw new Error('Veuillez remplir tous les champs');
                await signInWithEmailAndPassword(auth, email, password);
                setIsAuthenticated(true);
            } else {
                // Register
                if (!username || !email || !password || !confirmPassword) {
                    throw new Error('Tous les champs sont obligatoires');
                }
                if (!passwordValidation.isValid) {
                    throw new Error('Le mot de passe ne respecte pas les critères de sécurité');
                }
                if (password !== confirmPassword) {
                    throw new Error('Les mots de passe ne correspondent pas');
                }

                const canCreate = await checkAdminCount();
                if (!canCreate) {
                    throw new Error('Limite atteinte : 3 comptes administrateurs maximum autorisés');
                }

                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;

                await setDoc(doc(db, 'users', user.uid), {
                    username,
                    email,
                    role: 'admin',
                    active: true,
                    createdAt: new Date(),
                });

                setIsAuthenticated(true);
            }
        } catch (err: any) {
            console.error(err);

            let message = 'Une erreur est survenue';
            if (err.code) {
                switch (err.code) {
                    case 'auth/invalid-email':
                        message = 'Adresse email invalide';
                        break;
                    case 'auth/invalid-credential':
                    case 'auth/user-not-found':
                    case 'auth/wrong-password':
                        message = 'Email ou mot de passe incorrect';
                        break;
                    case 'auth/email-already-in-use':
                        message = 'Cet email est déjà utilisé';
                        break;
                    case 'auth/weak-password':
                        message = 'Le mot de passe doit faire au moins 6 caractères';
                        break;
                    case 'auth/too-many-requests':
                        message = 'Trop de tentatives. Réessayez plus tard';
                        break;
                    case 'auth/network-request-failed':
                        message = 'Problème de connexion réseau';
                        break;
                    default:
                        message = err.message || 'Erreur inconnue';
                }
            } else {
                message = err.message || message;
            }

            setError(message);
        } finally {
            setIsLoading(false);
        }
    };

    const closeError = () => setError('');

    if (isAuthenticated) {
        return (
            <AdminDashboard
                onLogout={() => {
                    auth.signOut();
                    setIsAuthenticated(false);
                    resetForm();
                }}
                onExport={mockOnExport}
                onImport={mockOnImport}
                onReset={mockOnReset}
                content={mockContent}
                onUpdateSection={mockOnUpdateSection}
            />
        );
    }

    return (
        <>
            <AnimatePresence>
                {error && <ErrorToast message={error} onClose={closeError} />}
            </AnimatePresence>

            {/* === FOND GLOBAL + FORMULAIRE À GAUCHE + TEXTE À DROITE === */}
            <div 
                className="min-h-screen relative flex items-center bg-cover bg-center bg-no-repeat overflow-x-hidden"
                style={{ backgroundImage: `url(${backgroundImageUrl})` }}
            >
                {/* Overlay sombre pour lisibilité */}
                <div className="absolute inset-0 bg-black/50" />

                {/* Contenu principal */}
                <div className="relative z-10 w-full flex flex-col lg:flex-row items-center justify-center lg:gap-12 xl:gap-16 px-4 sm:px-6 lg:px-12 py-8 lg:py-0">
                    {/* === FORMULAIRE À GAUCHE === */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="w-full max-w-md lg:max-w-lg mb-12 lg:mb-0"
                    >
                        {/* Bouton Retour */}
                        <motion.button
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => onBack?.()}
                            className="mb-8 flex items-center gap-2 text-white/80 hover:text-white transition-all group"
                        >
                            <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
                            <span className="text-sm font-medium">Retour</span>
                        </motion.button>

                        <div className="bg-card/90 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl border border-border/50 p-6 sm:p-8 lg:p-10">
                            <div className="text-center mb-8 sm:mb-10">
                                <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-primary to-accent rounded-2xl mb-4 sm:mb-6 shadow-xl">
                                    <Shield className="text-primary-foreground" size={32} />
                                </div>
                                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">
                                    {mode === 'login' ? 'Connexion Admin' : 'Inscription Admin'}
                                </h1>
                                <p className="text-muted-foreground text-base sm:text-lg">Sirius Expedition Dashboard</p>
                            </div>

                            <div className="space-y-6">
                                {mode === 'register' && (
                                    <Input icon={<User size={20} />} label="Nom d'utilisateur" value={username} onChange={setUsername} placeholder="Admin principal" />
                                )}

                                <Input icon={<Mail size={20} />} label="Email" value={email} onChange={setEmail} placeholder="admin@sirius.com" />

                                <div>
                                    <PasswordInput
                                        label="Mot de passe"
                                        value={password}
                                        onChange={setPassword}
                                        show={showPassword}
                                        toggleShow={() => setShowPassword(!showPassword)}
                                    />

                                    {mode === 'register' && (
                                        <div className="mt-3 flex items-center gap-2 text-xs">
                                            {passwordValidation.isValid ? (
                                                <Check size={16} className="text-green-600" />
                                            ) : password ? (
                                                <X size={16} className="text-red-600" />
                                            ) : null}
                                            <span className={passwordValidation.isValid ? 'text-green-600 font-medium' : 'text-muted-foreground'}>
                                                Au moins 8 caractères, majuscule, minuscule, chiffre et caractère spécial
                                            </span>
                                        </div>
                                    )}

                                    {mode === 'register' && password && (
                                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4">
                                            <div className="flex items-center justify-center gap-16 xl:gap-24 text-xs mb-2">
                                                <span className="text-muted-foreground">Force du mot de passe</span>
                                                <span className={`font-semibold ${passwordStrength < 40 ? 'text-red-500' : passwordStrength < 70 ? 'text-yellow-500' : 'text-green-500'}`}>
                                                    {getStrengthLabel(passwordStrength)}
                                                </span>
                                            </div>
                                            <div className="w-full bg-muted rounded-full h-2">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${passwordStrength}%` }}
                                                    className={`h-full rounded-full ${getStrengthColor(passwordStrength)}`}
                                                />
                                            </div>
                                        </motion.div>
                                    )}
                                </div>

                                {mode === 'register' && (
                                    <PasswordInput
                                        label="Confirmer le mot de passe"
                                        value={confirmPassword}
                                        onChange={setConfirmPassword}
                                        show={showPassword}
                                        toggleShow={() => setShowPassword(!showPassword)}
                                    />
                                )}

                                <motion.button
                                    onClick={handleSubmit}
                                    disabled={isLoading || (mode === 'register' && !passwordValidation.isValid)}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full py-3 sm:py-4 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-xl font-bold text-base sm:text-lg shadow-lg transition-all disabled:opacity-60"
                                >
                                    {isLoading ? 'Patientez...' : mode === 'login' ? 'Se connecter' : 'Créer le compte'}
                                </motion.button>
                            </div>

                            <div className="mt-8 text-center">
                                <button
                                    onClick={() => {
                                        setMode(mode === 'login' ? 'register' : 'login');
                                        resetForm();
                                    }}
                                    className="text-primary hover:underline font-medium"
                                >
                                    {mode === 'login' ? 'Créer un compte admin' : 'Déjà un compte ? Se connecter'}
                                </button>
                            </div>
                        </div>
                    </motion.div>

                    {/* === TEXTE BRANDING À DROITE === */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="hidden lg:block text-white max-w-md xl:max-w-lg"
                    >
                        <h2 className="text-4xl xl:text-5xl 2xl:text-6xl font-bold mb-4 leading-tight drop-shadow-lg">
                            Sirius Expedition
                        </h2>
                        <p className="text-xl xl:text-2xl 2xl:text-3xl opacity-90 drop-shadow-md">
                            Aventures authentiques à Madagascar
                        </p>
                    </motion.div>

                    {/* Texte branding en bas sur mobile */}
                    <div className="lg:hidden absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 text-center text-white px-4 w-full">
                        <h2 className="text-3xl sm:text-4xl font-bold mb-2 drop-shadow-lg">Sirius Expedition</h2>
                        <p className="text-lg sm:text-xl opacity-90 drop-shadow-md">Aventures authentiques à Madagascar</p>
                    </div>
                </div>
            </div>
        </>
    );
}

/* ========== COMPOSANTS INTERNES ========== */
function Input({ icon, label, value, onChange, placeholder }: any) {
    return (
        <div>
            <label className="block text-sm mb-2">{label}</label>
            <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">{icon}</div>
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className="w-full pl-12 py-3 bg-muted/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                />
            </div>
        </div>
    );
}

function PasswordInput({ label, value, onChange, show, toggleShow }: any) {
    return (
        <div>
            <label className="block text-sm mb-2">{label}</label>
            <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                    <Lock size={20} />
                </div>
                <input
                    type={show ? 'text' : 'password'}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full pl-12 pr-12 py-3 bg-muted/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                />
                <button
                    type="button"
                    onClick={toggleShow}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                    {show ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
            </div>
        </div>
    );
}