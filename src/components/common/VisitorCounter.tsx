import { useState, useEffect } from 'react';
import { Users, Eye, TrendingUp } from 'lucide-react';
import { db } from '../../firebase/config';
import { doc, getDoc, setDoc, increment, serverTimestamp } from 'firebase/firestore';

const VISITOR_ID_KEY = 'visitor_id';
const LAST_VISIT_DATE_KEY = 'last_visit_date';
const LOCAL_TOTAL_KEY = 'local_visitor_total';
const LOCAL_TODAY_KEY = 'local_visitor_today';
const LOCAL_DATE_KEY = 'local_date';

export function VisitorCounter() {
  const [totalVisitors, setTotalVisitors] = useState(0);
  const [todayVisitors, setTodayVisitors] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isNewVisitor, setIsNewVisitor] = useState(false);
  const [useFirebase, setUseFirebase] = useState(true);

  useEffect(() => {
    const trackVisitor = async () => {
      try {
        const today = new Date().toISOString().split('T')[0];
        
        // Générer un ID unique pour ce visiteur
        let visitorId = localStorage.getItem(VISITOR_ID_KEY);
        if (!visitorId) {
          visitorId = `visitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          localStorage.setItem(VISITOR_ID_KEY, visitorId);
          console.log('🆕 Nouveau visiteur:', visitorId);
        }

        const lastVisitDate = localStorage.getItem(LAST_VISIT_DATE_KEY);
        const sessionKey = `session_${today}`;
        const isNewSession = !sessionStorage.getItem(sessionKey);

        console.log('📊 Session info:', { today, lastVisitDate, isNewSession });

        // Tentative avec Firebase
        const counterRef = doc(db, 'siteStats', 'visitors');

        try {
          // 1. LECTURE des données actuelles
          const counterDoc = await getDoc(counterRef);
          console.log('✅ Firebase accessible - Document exists:', counterDoc.exists());

          let currentTotal = 0;
          let currentToday = 0;
          let lastUpdateDate = null;

          if (counterDoc.exists()) {
            const data = counterDoc.data();
            currentTotal = data.total || 0;
            currentToday = data.today || 0;
            
            // Normaliser la date (gérer ISO ou format simple)
            if (data.lastUpdated) {
              const dateStr = typeof data.lastUpdated === 'string' 
                ? data.lastUpdated 
                : new Date(data.lastUpdated).toISOString();
              lastUpdateDate = dateStr.split('T')[0];
            }

            console.log('📊 Données Firebase:', { currentTotal, currentToday, lastUpdateDate });
          }

          // 2. MISE À JOUR seulement si nouvelle session
          if (isNewSession) {
            console.log('🔄 Nouvelle session détectée - Mise à jour...');

            if (!counterDoc.exists()) {
              // Premier visiteur ever
              await setDoc(counterRef, {
                total: 1,
                today: 1,
                lastUpdated: today,
              });
              currentTotal = 1;
              currentToday = 1;
              console.log('✅ Premier visiteur créé');
            } else if (lastUpdateDate !== today) {
              // Nouveau jour : reset "today"
              const newTotal = currentTotal + 1;
              await setDoc(counterRef, {
                total: newTotal,
                today: 1,
                lastUpdated: today,
              }, { merge: true });
              currentTotal = newTotal;
              currentToday = 1;
              console.log('🌅 Nouveau jour - Reset compteur journalier');
            } else {
              // Même jour : incrémenter les deux
              const newTotal = currentTotal + 1;
              const newToday = currentToday + 1;
              await setDoc(counterRef, {
                total: newTotal,
                today: newToday,
                lastUpdated: today,
              }, { merge: true });
              currentTotal = newTotal;
              currentToday = newToday;
              console.log('📈 Même jour - Incrémentation');
            }

            // Marquer la session comme comptée
            sessionStorage.setItem(sessionKey, 'true');
            
            if (lastVisitDate !== today) {
              localStorage.setItem(LAST_VISIT_DATE_KEY, today);
              setIsNewVisitor(true);
            }
          }

          // 3. AFFICHAGE des données
          setTotalVisitors(currentTotal);
          setTodayVisitors(currentToday);

          // Backup local
          localStorage.setItem(LOCAL_TOTAL_KEY, currentTotal.toString());
          localStorage.setItem(LOCAL_TODAY_KEY, currentToday.toString());
          localStorage.setItem(LOCAL_DATE_KEY, today);

          setUseFirebase(true);
          console.log('✅ Stats mises à jour:', { currentTotal, currentToday });

        } catch (firebaseError: any) {
          console.warn('⚠️ Firebase indisponible, fallback localStorage:', firebaseError.message);
          setUseFirebase(false);

          // FALLBACK: Utiliser localStorage
          const localTotal = parseInt(localStorage.getItem(LOCAL_TOTAL_KEY) || '0', 10);
          const localToday = parseInt(localStorage.getItem(LOCAL_TODAY_KEY) || '0', 10);
          const localDate = localStorage.getItem(LOCAL_DATE_KEY);

          let newTotal = localTotal;
          let newToday = localToday;

          if (isNewSession) {
            if (localDate !== today) {
              // Nouveau jour
              newTotal = localTotal + 1;
              newToday = 1;
            } else {
              // Même jour
              newTotal = localTotal + 1;
              newToday = localToday + 1;
            }

            localStorage.setItem(LOCAL_TOTAL_KEY, newTotal.toString());
            localStorage.setItem(LOCAL_TODAY_KEY, newToday.toString());
            localStorage.setItem(LOCAL_DATE_KEY, today);
            sessionStorage.setItem(sessionKey, 'true');

            if (lastVisitDate !== today) {
              localStorage.setItem(LAST_VISIT_DATE_KEY, today);
              setIsNewVisitor(true);
            }
          }

          setTotalVisitors(newTotal);
          setTodayVisitors(newToday);
          console.log('📦 Stats localStorage:', { newTotal, newToday });
        }

      } catch (error) {
        console.error('❌ Erreur critique:', error);
        
        // Fallback ultime
        const localTotal = parseInt(localStorage.getItem(LOCAL_TOTAL_KEY) || '1', 10);
        const localToday = parseInt(localStorage.getItem(LOCAL_TODAY_KEY) || '1', 10);
        setTotalVisitors(localTotal);
        setTodayVisitors(localToday);
        setUseFirebase(false);
      } finally {
        setIsLoading(false);
      }
    };

    // Délai pour animation
    const timer = setTimeout(trackVisitor, 300);
    return () => clearTimeout(timer);
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
      {isNewVisitor && (
        <div className="absolute -top-3 -right-3 z-10">
          <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-bounce">
            New! 🎉
          </div>
        </div>
      )}

      <div className="relative bg-gradient-to-br from-white/15 via-white/10 to-white/5 backdrop-blur-2xl border border-white/30 rounded-3xl p-6 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-[1.02] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

        {/* Indicateur de mode */}
        {!useFirebase && (
          <div className="absolute top-2 right-2 z-20">
            <div className="flex items-center gap-1 bg-amber-500/20 border border-amber-500/40 text-amber-200 text-xs px-2 py-1 rounded-full">
              <span>📦</span>
              <span>Local Mode</span>
            </div>
          </div>
        )}

        <div className="relative z-10 flex items-center gap-6">
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

          <div className="w-px h-16 bg-gradient-to-b from-transparent via-white/30 to-transparent"></div>

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

        <div className="mt-4 h-1 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#D4A574] via-blue-500 to-cyan-500 rounded-full transition-all duration-1000"
            style={{ 
              width: `${totalVisitors > 0 ? Math.min((todayVisitors / totalVisitors) * 100, 100) : 0}%` 
            }}
          ></div>
        </div>
      </div>
    </div>
  );
}