import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase/config";

/**
 * Connexion admin via Firebase
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

    // Vérification admin Firestore
    const adminRef = doc(db, "admins", uid);
    const adminSnap = await getDoc(adminRef);

    if (!adminSnap.exists()) {
      throw new Error("Accès refusé");
    }

    const adminData = adminSnap.data();

    if (!adminData.active) {
      throw new Error("Compte admin désactivé");
    }

    return true;
  } catch (error) {
    console.error("Admin login error:", error);
    return false;
  }
}
