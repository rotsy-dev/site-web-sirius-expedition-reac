import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Eye } from 'lucide-react';
import { db } from '../../firebase/config';
import { doc, getDoc, setDoc, increment } from 'firebase/firestore';

const VISITOR_COUNTER_KEY = 'visitor_counter';
const VISITOR_ID_KEY = 'visitor_id';

export function VisitorCounter() {
  const [totalVisitors, setTotalVisitors] = useState<number>(0);
  const [todayVisitors, setTodayVisitors] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const trackVisitor = async () => {
      try {
        // Générer un ID unique pour ce visiteur
        let visitorId = localStorage.getItem(VISITOR_ID_KEY);
        if (!visitorId) {
          visitorId = `visitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          localStorage.setItem(VISITOR_ID_KEY, visitorId);
        }

        // Vérifier si ce visiteur a déjà été compté aujourd'hui
        const today = new Date().toISOString().split('T')[0];
        const lastVisitDate = localStorage.getItem('last_visit_date');
        const sessionKey = `session_${today}`;
        const isNewSession = !sessionStorage.getItem(sessionKey);
        
        // Référence au document de compteur
        const counterRef = doc(db, 'siteStats', 'visitors');
        
        // Essayer de mettre à jour Firebase
        try {
          if (lastVisitDate !== today && isNewSession) {
            // Nouveau visiteur aujourd'hui
            const counterDoc = await getDoc(counterRef);
            
            if (counterDoc.exists()) {
              await setDoc(counterRef, {
                total: increment(1),
                today: increment(1),
                lastUpdated: new Date().toISOString(),
              }, { merge: true });
            } else {
              await setDoc(counterRef, {
                total: 1,
                today: 1,
                lastUpdated: new Date().toISOString(),
              });
            }
            
            localStorage.setItem('last_visit_date', today);
            sessionStorage.setItem(sessionKey, 'true');
          } else if (isNewSession) {
            // Nouvelle session mais même jour
            const counterDoc = await getDoc(counterRef);
            if (!counterDoc.exists()) {
              await setDoc(counterRef, {
                total: 1,
                today: 1,
                lastUpdated: new Date().toISOString(),
              });
            } else {
              await setDoc(counterRef, {
                total: increment(1),
                lastUpdated: new Date().toISOString(),
              }, { merge: true });
            }
            sessionStorage.setItem(sessionKey, 'true');
          }

          // Récupérer les statistiques
          const statsDoc = await getDoc(counterRef);
          if (statsDoc.exists()) {
            const data = statsDoc.data();
            setTotalVisitors(data.total || 0);
            setTodayVisitors(data.today || 0);
          } else {
            // Fallback sur localStorage si Firebase n'a pas de données
            const localTotal = parseInt(localStorage.getItem('local_visitor_total') || '0', 10);
            const localToday = parseInt(localStorage.getItem('local_visitor_today') || '0', 10);
            setTotalVisitors(localTotal);
            setTodayVisitors(localToday);
          }
        } catch (firebaseError: any) {
          // Si erreur de permissions, utiliser localStorage
          console.warn('Firebase non disponible, utilisation de localStorage:', firebaseError);
          
          if (isNewSession) {
            const localTotal = parseInt(localStorage.getItem('local_visitor_total') || '0', 10) + 1;
            const localToday = lastVisitDate !== today 
              ? parseInt(localStorage.getItem('local_visitor_today') || '0', 10) + 1
              : parseInt(localStorage.getItem('local_visitor_today') || '0', 10);
            
            localStorage.setItem('local_visitor_total', localTotal.toString());
            localStorage.setItem('local_visitor_today', localToday.toString());
            if (lastVisitDate !== today) {
              localStorage.setItem('last_visit_date', today);
            }
            sessionStorage.setItem(sessionKey, 'true');
            
            setTotalVisitors(localTotal);
            setTodayVisitors(localToday);
          } else {
            const localTotal = parseInt(localStorage.getItem('local_visitor_total') || '0', 10);
            const localToday = parseInt(localStorage.getItem('local_visitor_today') || '0', 10);
            setTotalVisitors(localTotal);
            setTodayVisitors(localToday);
          }
        }
      } catch (error) {
        console.error('Erreur lors du suivi des visiteurs:', error);
        // Valeurs par défaut en cas d'erreur
        const localTotal = parseInt(localStorage.getItem('local_visitor_total') || '0', 10);
        const localToday = parseInt(localStorage.getItem('local_visitor_today') || '0', 10);
        setTotalVisitors(localTotal);
        setTodayVisitors(localToday);
      } finally {
        setIsLoading(false);
      }
    };

    trackVisitor();
  }, []);

  if (isLoading) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-4 left-4 z-40 bg-white/90 dark:bg-[#1a1410]/90 backdrop-blur-xl border-2 border-[#4B3935]/20 dark:border-[#F0E7D5]/20 rounded-2xl p-4 shadow-2xl"
    >
      <div className="flex items-center gap-4">
        {/* Total visiteurs */}
        <div className="flex items-center gap-2">
          <div className="p-2 bg-gradient-to-r from-[#D4A574] to-[#C4965F] rounded-xl">
            <Users className="w-4 h-4 text-[#4B3935]" />
          </div>
          <div>
            <p className="text-xs text-[#4B3935]/60 dark:text-[#F0E7D5]/60 font-medium">
              Total
            </p>
            <p className="text-lg font-black text-[#4B3935] dark:text-[#F0E7D5]">
              {totalVisitors.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Visiteurs aujourd'hui */}
        <div className="flex items-center gap-2">
          <div className="p-2 bg-gradient-to-r from-[#4B3935] to-[#3D2F2B] rounded-xl">
            <Eye className="w-4 h-4 text-[#F0E7D5]" />
          </div>
          <div>
            <p className="text-xs text-[#4B3935]/60 dark:text-[#F0E7D5]/60 font-medium">
              Aujourd'hui
            </p>
            <p className="text-lg font-black text-[#4B3935] dark:text-[#F0E7D5]">
              {todayVisitors.toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
