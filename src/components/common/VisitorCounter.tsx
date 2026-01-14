import { useEffect, useState } from "react";
import { Eye, Users, TrendingUp } from "lucide-react";
import { useTranslation } from 'react-i18next'
import { dbR } from "../../firebase/config";
import { ref, runTransaction, get } from "firebase/database";

export function VisitorCounter() {
  const { t } = useTranslation();
  const [totalCount, setTotalCount] = useState<number>(0);
  const [todayCount, setTodayCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    const hasVisitedToday = localStorage.getItem("hasVisitedToday") === today;
    const hasVisitedEver = localStorage.getItem("hasVisitedEver") === "true";

    const updateVisitorCount = async () => {
      try {
        const totalRef = ref(dbR, "siteStats/visitors");
        const todayRef = ref(dbR, `siteStats/visitorsToday/${today}`);

        // 🔹 Compteur total - incrémenter seulement si première visite absolue
        if (!hasVisitedEver) {
          const totalResult = await runTransaction(totalRef, (current) => (current || 0) + 1);
          
          if (totalResult.committed) {
            setTotalCount(totalResult.snapshot.val() || 0);
            localStorage.setItem("hasVisitedEver", "true");
          } else {
            throw new Error("Transaction totale annulée");
          }
        } else {
          // Juste récupérer la valeur actuelle
          const totalSnapshot = await get(totalRef);
          setTotalCount(totalSnapshot.val() || 0);
        }

        // 🔹 Compteur quotidien - incrémenter seulement si pas encore visité aujourd'hui
        if (!hasVisitedToday) {
          const todayResult = await runTransaction(todayRef, (current) => (current || 0) + 1);
          
          if (todayResult.committed) {
            setTodayCount(todayResult.snapshot.val() || 0);
            localStorage.setItem("hasVisitedToday", today);
          } else {
            throw new Error("Transaction quotidienne annulée");
          }
        } else {
          // Juste récupérer la valeur actuelle
          const todaySnapshot = await get(todayRef);
          setTodayCount(todaySnapshot.val() || 0);
        }

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