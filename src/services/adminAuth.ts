import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc, collection, getDocs, query } from "firebase/firestore";
import { auth, db } from "../firebase/config";

/**
 * Vérifie le nombre d'administrateurs dans la base
 * @returns true si on peut créer un nouvel admin (< 3)
 */
export async function canCreateAdmin(): Promise<boolean> {
  try {
    const usersRef = collection(db, "users");
    const q = query(usersRef);
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.size < 3;
  } catch (error) {
    console.error("Error checking admin count:", error);
    throw new Error("Impossible de vérifier le nombre d'administrateurs");
  }
}

/**
 * Obtient le nombre actuel d'administrateurs
 * @returns Le nombre d'admins enregistrés
 */
export async function getAdminCount(): Promise<number> {
  try {
    const usersRef = collection(db, "users");
    const q = query(usersRef);
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.size;
  } catch (error) {
    console.error("Error getting admin count:", error);
    return 0;
  }
}

/**
 * Connexion admin via Firebase (version originale améliorée)
 * @param password Le mot de passe admin
 * @returns true si la connexion réussit
 */
export async function adminLogin(password: string): Promise<boolean> {
  try {
    const email = "admin@sirius-expedition.com";

    // Auth Firebase
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    const uid = userCredential.user.uid;

    // Vérification admin dans la collection "users" (ou "admins" si vous préférez)
    const adminRef = doc(db, "users", uid);
    const adminSnap = await getDoc(adminRef);

    if (!adminSnap.exists()) {
      throw new Error("Accès refusé");
    }

    const adminData = adminSnap.data();

    // Vérification du statut actif
    if (!adminData.active) {
      throw new Error("Compte admin désactivé");
    }

    // Vérification du rôle admin (optionnel mais recommandé)
    if (adminData.role !== 'admin') {
      throw new Error("Accès refusé : rôle insuffisant");
    }

    return true;
  } catch (error) {
    console.error("Admin login error:", error);
    return false;
  }
}

/**
 * Connexion admin avec email personnalisé
 * @param email L'email de l'admin
 * @param password Le mot de passe
 * @returns true si la connexion réussit
 */
export async function adminLoginWithEmail(
  email: string,
  password: string
): Promise<boolean> {
  try {
    // Auth Firebase
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    const uid = userCredential.user.uid;

    // Vérification admin
    const adminRef = doc(db, "users", uid);
    const adminSnap = await getDoc(adminRef);

    if (!adminSnap.exists()) {
      throw new Error("Accès refusé");
    }

    const adminData = adminSnap.data();

    if (!adminData.active) {
      throw new Error("Compte admin désactivé");
    }

    if (adminData.role !== 'admin') {
      throw new Error("Accès refusé : rôle insuffisant");
    }

    return true;
  } catch (error) {
    console.error("Admin login error:", error);
    return false;
  }
}