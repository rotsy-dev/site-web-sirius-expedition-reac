import { useState, useEffect } from 'react';
import { Users, Eye, TrendingUp } from 'lucide-react';
import { db } from '../../firebase/config';
import { doc, getDoc, setDoc, increment } from 'firebase/firestore';

const VISITOR_ID_KEY = 'visitor_id';
const LAST_VISIT_DATE_KEY = 'last_visit_date';
const LOCAL_TOTAL_KEY = 'local_visitor_total';
const LOCAL_TODAY_KEY = 'local_visitor_today';

export function VisitorCounter() {
  const [totalVisitors, setTotalVisitors] = useState(0);
  const [todayVisitors, setTodayVisitors] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isNewVisitor, setIsNewVisitor] = useState(false);

  useEffect(() => {
    const trackVisitor = async () => {
      try {
        // Générer un ID unique pour ce visiteur
        let visitorId = localStorage.getItem(VISITOR_ID_KEY);
        if (!visitorId) {
          visitorId = `visitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          localStorage.setItem(VISITOR_ID_KEY, visitorId);
        }

        const today = new Date().toISOString().split('T')[0];
        const lastVisitDate = localStorage.getItem(LAST_VISIT_DATE_KEY);
        const sessionKey = `session_${today}`;
        const isNewSession = !sessionStorage.getItem(sessionKey);

        const counterRef = doc(db, 'siteStats', 'visitors');

        try {
          // Récupérer les données actuelles de Firebase
          const counterDoc = await getDoc(counterRef);
          const data = counterDoc.exists() ? counterDoc.data() : null;
          const lastUpdateDate = data?.lastUpdated
            ? new Date(data.lastUpdated).toISOString().split('T')[0]
            : null;

          if (isNewSession) {
            // Nouvelle session détectée
            if (!counterDoc.exists()) {
              // Premier visiteur ever
              await setDoc(counterRef, {
                total: 1,
                today: 1,
                lastUpdated: new Date().toISOString(),
              });
              setIsNewVisitor(true);
            } else if (lastUpdateDate !== today) {
              // Nouveau jour : réinitialiser "today" à 1
              await setDoc(counterRef, {
                total: increment(1),
                today: 1, // ← RÉINITIALISATION au lieu d'increment
                lastUpdated: new Date().toISOString(),
              }, { merge: true });
              setIsNewVisitor(true);
            } else {
              // Même jour : incrémenter les deux
              await setDoc(counterRef, {
                total: increment(1),
                today: increment(1),
                lastUpdated: new Date().toISOString(),
              }, { merge: true });
            }

            // Marquer cette session comme comptée
            if (lastVisitDate !== today) {
              localStorage.setItem(LAST_VISIT_DATE_KEY, today);
            }
            sessionStorage.setItem(sessionKey, 'true');
          }

          // Récupérer les statistiques mises à jour
          const updatedDoc = await getDoc(counterRef);
          if (updatedDoc.exists()) {
            const updatedData = updatedDoc.data();
            setTotalVisitors(updatedData.total || 0);
            setTodayVisitors(updatedData.today || 0);

            // Sauvegarder aussi en local comme backup
            localStorage.setItem(LOCAL_TOTAL_KEY, (updatedData.total || 0).toString());
            localStorage.setItem(LOCAL_TODAY_KEY, (updatedData.today || 0).toString());
          }

        } catch (firebaseError) {
          // Si Firebase échoue, utiliser localStorage comme fallback
          console.warn('Firebase non disponible, utilisation de localStorage:', firebaseError);

          const localTotal = parseInt(localStorage.getItem(LOCAL_TOTAL_KEY) || '0', 10);
          const localToday = parseInt(localStorage.getItem(LOCAL_TODAY_KEY) || '0', 10);

          if (isNewSession) {
            const newTotal = localTotal + 1;
            const newToday = lastVisitDate !== today ? 1 : localToday + 1;

            localStorage.setItem(LOCAL_TOTAL_KEY, newTotal.toString());
            localStorage.setItem(LOCAL_TODAY_KEY, newToday.toString());

            if (lastVisitDate !== today) {
              localStorage.setItem(LAST_VISIT_DATE_KEY, today);
              setIsNewVisitor(true);
            }
            sessionStorage.setItem(sessionKey, 'true');

            setTotalVisitors(newTotal);
            setTodayVisitors(newToday);
          } else {
            setTotalVisitors(localTotal);
            setTodayVisitors(localToday);
          }
        }
      } catch (error) {
        console.error('Erreur lors du suivi des visiteurs:', error);
        // Fallback final
        const localTotal = parseInt(localStorage.getItem(LOCAL_TOTAL_KEY) || '0', 10);
        const localToday = parseInt(localStorage.getItem(LOCAL_TODAY_KEY) || '0', 10);
        setTotalVisitors(localTotal);
        setTodayVisitors(localToday);
      } finally {
        setIsLoading(false);
      }
    };

    trackVisitor();
  }, []);

  if (isLoading) {
    return (
      <div className="inline-flex bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl border border-white/30 rounded-3xl p-6 shadow-2xl">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-white/20 rounded-2xl animate-pulse"></div>
          <div className="space-y-2">
            <div className="w-24 h-4 bg-white/20 rounded animate-pulse"></div>
            <div className="w-16 h-6 bg-white/20 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative group">
      {/* New visitor badge */}
      {isNewVisitor && (
        <div className="absolute -top-3 -right-3 z-10">
          <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-bounce">
            New! 🎉
          </div>
        </div>
      )}

      <div className="relative bg-gradient-to-br from-white/15 via-white/10 to-white/5 backdrop-blur-2xl border border-white/30 rounded-3xl p-6 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-[1.02] overflow-hidden">
        {/* Animated shine effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

        <div className="relative z-10 flex items-center gap-6">
          {/* Total visitors */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[#D4A574] to-[#C4965F] blur-xl opacity-60 animate-pulse"></div>
              <div className="relative p-4 bg-gradient-to-br from-[#D4A574] to-[#C4965F] rounded-2xl shadow-lg transform group-hover:rotate-6 transition-transform duration-300">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-1">
                Total Visitors
              </p>
              <p className="text-3xl font-black bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                {totalVisitors.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Separator */}
          <div className="w-px h-16 bg-gradient-to-b from-transparent via-white/30 to-transparent"></div>

          {/* Visitors today */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 blur-xl opacity-60 animate-pulse"></div>
              <div className="relative p-4 bg-gradient-to-br from-blue-500/80 to-cyan-500/80 rounded-2xl shadow-lg transform group-hover:-rotate-6 transition-transform duration-300">
                <Eye className="w-6 h-6 text-white" />
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-1">
                Today
              </p>
              <div className="flex items-center gap-2">
                <p className="text-3xl font-black bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                  {todayVisitors.toLocaleString()}
                </p>
                <TrendingUp className="w-5 h-5 text-emerald-400 animate-pulse" />
              </div>
            </div>
          </div>
        </div>

        {/* Decorative progress bar */}
        <div className="mt-4 h-1 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#D4A574] via-blue-500 to-cyan-500 rounded-full transition-all duration-1000"
            style={{ width: `${Math.min((todayVisitors / totalVisitors) * 100, 100)}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}