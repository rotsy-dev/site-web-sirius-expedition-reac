import * as React from 'react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Lock, Eye, EyeOff, Shield, Mail, User, Check, X, AlertCircle, XCircle, Info 
} from 'lucide-react';
import { auth, db } from '../../../firebase/config';
import { 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword 
} from 'firebase/auth';
import { doc, setDoc, collection, getDocs, query } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { 
    validatePassword, 
    getPasswordStrength, 
    getStrengthColor, 
    getStrengthLabel 
} from '../../../utils/passwordValidation';

import { AdminDashboard } from './AdminDashboard';
import { bestSellers, faqs, heroSlides, reviews, siteConfig, tourSpecialties } from '@/app/data/content';

const mockContent = { heroSlides: [], bestSellers: [], tourSpecialties: [], reviews: [], blogPosts: [], faqs: [], siteConfig: {} };
const mockOnUpdateSection = () => {};
const mockOnLogout = () => {};
const mockOnExport = () => {};
const mockOnImport = async () => {};
const mockOnReset = () => {};


// const [content, setContent] = useState({
//     heroSlides: [],
//     bestSellers: [],
//     tourSpecialties: [],
//     reviews: [],
//     blogPosts: [],
//     faqs: [],
//     siteConfig: {},
// })


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
export function AdminLogin() {
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

    const navigate = useNavigate();

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
            {/* Toast erreur */}
            <AnimatePresence>
                {error && <ErrorToast message={error} onClose={closeError} />}
            </AnimatePresence>

            <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background flex items-center justify-center p-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-md"
                >
                    <div className="bg-card/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-border/50 p-8">
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl mb-4 shadow-lg">
                                <Shield className="text-primary-foreground" size={32} />
                            </div>
                            <h1 className="text-3xl font-bold">
                                {mode === 'login' ? 'Connexion Admin' : 'Inscription Admin'}
                            </h1>
                            <p className="text-muted-foreground">Sirius Expedition Dashboard</p>
                        </div>



                        <div className="space-y-5">
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

                                {/* Règle mot de passe en une ligne */}
                                {mode === 'register' && (
                                    <div className="mt-2 flex items-center gap-2 text-xs">
                                        {passwordValidation.isValid ? (
                                            <Check size={16} className="text-green-600 flex-shrink-0" />
                                        ) : password ? (
                                            <X size={16} className="text-red-600 flex-shrink-0" />
                                        ) : null}

                                        <span className={passwordValidation.isValid ? 'text-green-600 font-medium' : 'text-muted-foreground'}>
                                            Au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial
                                        </span>
                                    </div>
                                )}

                                {/* Barre de force (optionnelle) */}
                                {mode === 'register' && password && (
                                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-3">
                                        <div className="flex items-center justify-between text-xs mb-1">
                                            <span className="text-muted-foreground">Force du mot de passe</span>
                                            <span className={`font-semibold ${
                                                passwordStrength < 40 ? 'text-red-500' :
                                                passwordStrength < 70 ? 'text-yellow-500' :
                                                'text-green-500'
                                            }`}>
                                                {getStrengthLabel(passwordStrength)}
                                            </span>
                                        </div>
                                        <div className="w-full bg-muted rounded-full h-1.5">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${passwordStrength}%` }}
                                                className={`h-full rounded-full transition-all ${getStrengthColor(passwordStrength)}`}
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
                                className="w-full py-3 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-xl font-semibold shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? 'Veuillez patienter...' : mode === 'login' ? 'Se connecter' : 'Créer le compte admin'}
                            </motion.button>
                        </div>

                        <div className="mt-6 text-center">
                            <button
                                onClick={() => {
                                    setMode(mode === 'login' ? 'register' : 'login');
                                    resetForm();
                                }}
                                className="text-sm text-primary hover:underline"
                            >
                                {mode === 'login' ? 'Créer un compte admin' : 'Déjà un compte ? Se connecter'}
                            </button>
                        </div>
                    </div>

                    <p className="text-center text-sm text-muted-foreground mt-6">
                        Protégé • Sirius Expedition © 2024
                    </p>
                </motion.div>
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