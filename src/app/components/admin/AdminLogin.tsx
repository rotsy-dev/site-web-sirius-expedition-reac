import * as React from 'react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Eye, EyeOff, Shield, Mail, User } from 'lucide-react';
import { auth, db } from '../../../firebase/config';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom'; // Important pour la redirection

// Import du dashboard
import { AdminDashboard } from './AdminDashboard'; // Ajuste le chemin selon ta structure

// Tu devras passer ces props depuis ton App.tsx ou un contexte
// Pour l'exemple, on les mock temporairement si besoin
const mockContent = {
    heroSlides: [],
    bestSellers: [],
    tourSpecialties: [],
    reviews: [],
    blogPosts: [],
    faqs: [],
    siteConfig: {}
};

const mockOnUpdateSection = () => {};
const mockOnLogout = () => {};
const mockOnExport = () => {};
const mockOnImport = async () => {};
const mockOnReset = () => {};

export function AdminLogin() {
    const [mode, setMode] = useState<'login' | 'register'>('login');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false); // Pour afficher le dashboard

    const navigate = useNavigate();

    const resetForm = () => {
        setUsername('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setError('');
    };

    const handleSubmit = async () => {
        setError('');
        setIsLoading(true);

        try {
            if (mode === 'login') {
                if (!email || !password) {
                    throw new Error('Veuillez remplir tous les champs');
                }

                await signInWithEmailAndPassword(auth, email, password);
                setIsAuthenticated(true); // Affiche le dashboard directement
            } else {
                // Mode register
                if (!username || !email || !password || !confirmPassword) {
                    throw new Error('Tous les champs sont obligatoires');
                }
                if (password !== confirmPassword) {
                    throw new Error('Les mots de passe ne correspondent pas');
                }

                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;

                // Stockage du username
                await setDoc(doc(db, 'users', user.uid), {
                    username,
                    email,
                    createdAt: new Date(),
                });

                setIsAuthenticated(true); // Affiche le dashboard après inscription
            }
        } catch (err: any) {
            console.error(err);

            let message = 'Une erreur est survenue';
            if (err.code) {
                switch (err.code) {
                    case 'auth/invalid-email':
                        message = 'Adresse email invalide';
                        break;
                    case 'auth/user-not-found':
                        message = 'Aucun compte trouvé avec cet email';
                        break;
                    case 'auth/wrong-password':
                        message = 'Mot de passe incorrect';
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

    // Si connecté → affiche le dashboard
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

    // Sinon → affiche le formulaire de login/register
    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background flex items-center justify-center p-6">
            <AnimatePresence mode="wait">
                <motion.div
                    key={mode}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4 }}
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

                            <PasswordInput label="Mot de passe" value={password} onChange={setPassword} show={showPassword} toggleShow={() => setShowPassword(!showPassword)} />

                            {mode === 'register' && (
                                <PasswordInput label="Confirmer le mot de passe" value={confirmPassword} onChange={setConfirmPassword} show={showPassword} toggleShow={() => setShowPassword(!showPassword)} />
                            )}

                            {error && (
                                <div className="bg-destructive/10 border border-destructive/30 text-destructive px-4 py-3 rounded-xl text-sm">
                                    {error}
                                </div>
                            )}

                            <motion.button
                                onClick={handleSubmit}
                                disabled={isLoading}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full py-3 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-xl font-semibold shadow-lg transition-all"
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
            </AnimatePresence>
        </div>
    );
}

/* Composants internes (inchangés) */
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