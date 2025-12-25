import * as React from 'react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Eye, EyeOff, Shield, Mail, User, Check, X } from 'lucide-react';
import { auth, db } from '../../../firebase/config';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, collection, getDocs, query } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { 
    validatePassword, 
    getPasswordStrength, 
    getStrengthColor, 
    getStrengthLabel 
} from '../../../utils/passwordValidation';

// Import du dashboard
import { AdminDashboard } from './AdminDashboard';

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
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    
    // États pour la validation du mot de passe
    const [passwordValidation, setPasswordValidation] = useState({
        isValid: false,
        errors: [] as string[]
    });
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [showPasswordRules, setShowPasswordRules] = useState(false);

    const navigate = useNavigate();

    // Validation en temps réel du mot de passe
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
        setShowPasswordRules(false);
    };

    const checkAdminCount = async (): Promise<boolean> => {
        try {
            const usersRef = collection(db, 'users');
            const q = query(usersRef);
            const querySnapshot = await getDocs(q);
            
            const adminCount = querySnapshot.size;
            
            if (adminCount >= 3) {
                return false;
            }
            return true;
        } catch (err) {
            console.error('Erreur lors de la vérification des admins:', err);
            throw new Error('Impossible de vérifier le nombre d\'administrateurs');
        }
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
                setIsAuthenticated(true);
            } else {
                // Mode register
                if (!username || !email || !password || !confirmPassword) {
                    throw new Error('Tous les champs sont obligatoires');
                }

                // ✨ VALIDATION DU MOT DE PASSE
                if (!passwordValidation.isValid) {
                    throw new Error('Le mot de passe ne respecte pas les critères de sécurité');
                }

                if (password !== confirmPassword) {
                    throw new Error('Les mots de passe ne correspondent pas');
                }

                // Vérification de la limite de 3 admins
                const canCreateAdmin = await checkAdminCount();
                if (!canCreateAdmin) {
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

                        {mode === 'register' && (
                            <div className="mb-6 bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-400 px-4 py-3 rounded-xl text-sm">
                                ⚠️ <strong>Limite :</strong> Maximum 3 comptes administrateurs autorisés
                            </div>
                        )}

                        <div className="space-y-5">
                            {mode === 'register' && (
                                <Input 
                                    icon={<User size={20} />} 
                                    label="Nom d'utilisateur" 
                                    value={username} 
                                    onChange={setUsername} 
                                    placeholder="Admin principal" 
                                />
                            )}

                            <Input 
                                icon={<Mail size={20} />} 
                                label="Email" 
                                value={email} 
                                onChange={setEmail} 
                                placeholder="admin@sirius.com" 
                            />

                            <div>
                                <PasswordInput 
                                    label="Mot de passe" 
                                    value={password} 
                                    onChange={setPassword} 
                                    show={showPassword} 
                                    toggleShow={() => setShowPassword(!showPassword)}
                                    onFocus={() => mode === 'register' && setShowPasswordRules(true)}
                                />
                                
                                {/* ✨ Indicateur de force du mot de passe */}
                                {mode === 'register' && password && (
                                    <motion.div 
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        className="mt-2"
                                    >
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

                                {/* ✨ Règles de validation */}
                                {mode === 'register' && showPasswordRules && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="mt-3 bg-muted/50 rounded-xl p-3 space-y-2"
                                    >
                                        <p className="text-xs font-semibold text-muted-foreground mb-2">
                                            Le mot de passe doit contenir :
                                        </p>
                                        <PasswordRule 
                                            met={password.length >= 8} 
                                            text="Au moins 8 caractères" 
                                        />
                                        <PasswordRule 
                                            met={/[A-Z]/.test(password)} 
                                            text="Une lettre majuscule (A-Z)" 
                                        />
                                        <PasswordRule 
                                            met={/[a-z]/.test(password)} 
                                            text="Une lettre minuscule (a-z)" 
                                        />
                                        <PasswordRule 
                                            met={/[0-9]/.test(password)} 
                                            text="Un chiffre (0-9)" 
                                        />
                                        <PasswordRule 
                                            met={/[!@#$%^&*(),.?":{}|<>_\-+=\[\]\\\/;'`~]/.test(password)} 
                                            text="Un caractère spécial (!@#$%...)" 
                                        />
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

                            {error && (
                                <div className="bg-destructive/10 border border-destructive/30 text-destructive px-4 py-3 rounded-xl text-sm">
                                    {error}
                                </div>
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
            </AnimatePresence>
        </div>
    );
}

/* Composant pour afficher une règle de validation */
function PasswordRule({ met, text }: { met: boolean; text: string }) {
    return (
        <div className={`flex items-center gap-2 text-xs transition-colors ${
            met ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'
        }`}>
            {met ? (
                <Check size={14} className="flex-shrink-0" />
            ) : (
                <X size={14} className="flex-shrink-0" />
            )}
            <span>{text}</span>
        </div>
    );
}

/* Composants internes */
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

function PasswordInput({ label, value, onChange, show, toggleShow, onFocus }: any) {
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
                    onFocus={onFocus}
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