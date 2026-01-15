import { useEffect, useState } from "react";
import { Eye, Users, TrendingUp } from "lucide-react";
import { useTranslation } from 'react-i18next'
import { dbR } from "../../firebase/config";
import { ref, increment, set, get } from "firebase/database";

// ========== GÉNÉRATION DU FINGERPRINT ==========
const generateFingerprint = async (): Promise<string> => {
  const components = [
    navigator.userAgent,
    navigator.language,
    navigator.hardwareConcurrency,
    screen.width,
    screen.height,
    screen.colorDepth,
    new Date().getTimezoneOffset(),
    navigator.platform,
    navigator.maxTouchPoints
  ];

  // Canvas fingerprinting
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.fillText('fingerprint', 2, 2);
    components.push(canvas.toDataURL());
  }

  const data = components.join('|||');
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

// ========== GESTION DES COOKIES ==========
const setCookie = (name: string, value: string, days: number = 365 * 10) => {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Strict`;
};

const getCookie = (name: string): string | null => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
};

// ========== COMPOSANT ==========
export function VisitorCounter() {
  const { t } = useTranslation();
  const [totalCount, setTotalCount] = useState<number>(0);
  const [todayCount, setTodayCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const updateVisitorCount = async () => {
      try {
        const today = new Date().toISOString().slice(0, 10);

        // 🔹 Générer le fingerprint unique de l'appareil
        const fingerprint = await generateFingerprint();

        // 🔹 Vérifier dans Firebase si ce fingerprint a déjà visité
        const fingerprintRef = ref(dbR, `siteStats/fingerprints/${fingerprint}`);
        const lastVisitRef = ref(dbR, `siteStats/lastVisits/${fingerprint}`);

        const [fingerprintSnapshot, lastVisitSnapshot] = await Promise.all([
          get(fingerprintRef),
          get(lastVisitRef)
        ]);

        const hasVisitedEver = fingerprintSnapshot.exists();
        const lastVisitDate = lastVisitSnapshot.val();
        const hasVisitedToday = lastVisitDate === today;

        const totalRef = ref(dbR, "siteStats/visitors");
        const todayRef = ref(dbR, `siteStats/visitorsToday/${today}`);

        // 🔹 Compteur total - incrémenter seulement si première visite absolue
        if (!hasVisitedEver) {
          await Promise.all([
            set(totalRef, increment(1)),
            set(fingerprintRef, true), // Marquer ce fingerprint comme ayant visité
          ]);
        }

        // 🔹 Compteur quotidien - incrémenter seulement si pas encore visité aujourd'hui
        if (!hasVisitedToday) {
          await Promise.all([
            set(todayRef, increment(1)),
            set(lastVisitRef, today), // Enregistrer la dernière date de visite
          ]);
        }

        // 🔹 Récupérer les valeurs actuelles
        const [totalSnapshot, todaySnapshot] = await Promise.all([
          get(totalRef),
          get(todayRef)
        ]);

        setTotalCount(totalSnapshot.val() || 0);
        setTodayCount(todaySnapshot.val() || 0);
        setIsLoading(false);
      } catch (err) {
        console.error("Erreur compteur visiteurs :", err);
        setError("Impossible de charger le compteur");
        setIsLoading(false);
      }
    };

    updateVisitorCount();
  }, []);

  if (error) {
    return (
      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs text-white/60">
        <Eye className="size-3" />
        <span>{error}</span>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="inline-flex items-center gap-4 px-4 py-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl">
        <div className="animate-pulse flex items-center gap-2">
          <Eye className="size-4 text-white/40" />
          <div className="h-3 w-24 bg-white/20 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-6 px-5 py-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-lg hover:bg-white/10 transition-all duration-300">
      {/* Compteur total */}
      <div className="flex items-center gap-2.5 group">
        <div className="p-1.5 bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-400/30 rounded-lg group-hover:scale-110 transition-transform duration-200">
          <Users className="size-4 text-blue-300" />
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-lg font-bold text-white tabular-nums">
            {totalCount.toLocaleString("fr-FR")}
          </span>
          <span className="text-xs text-white/50 font-medium">
            {t('footer.visitorTotal')}
          </span>
        </div>
      </div>

      {/* Séparateur */}
      <div className="h-8 w-px bg-gradient-to-b from-transparent via-white/20 to-transparent"></div>

      {/* Compteur quotidien */}
      <div className="flex items-center gap-2.5 group">
        <div className="p-1.5 bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 border border-emerald-400/30 rounded-lg group-hover:scale-110 transition-transform duration-200">
          <TrendingUp className="size-4 text-emerald-300" />
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-lg font-bold text-white tabular-nums">
            {todayCount.toLocaleString("fr-FR")}
          </span>
          <span className="text-xs text-white/50 font-medium">
            {t('footer.visitorToday')}
          </span>
        </div>
      </div>
    </div>
  );
}