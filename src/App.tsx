import React, { useState, useEffect } from 'react';
import { UserRecord, UserPlan, SurveyRecord } from './types';
import { INITIAL_RECORDS, INITIAL_PLANS } from './data/initialData';
import { INITIAL_SURVEY_RECORDS } from './data/initialSurveyData';
import { Header } from './components/Header';
import { NavigationFooter, TabType } from './components/NavigationFooter';
import { LoginView } from './components/LoginView';
import { HomeGrid } from './components/HomeGrid';
import { WeatherMapPage } from './components/WeatherMapPage';
import { MyProfilePage } from './components/MyProfilePage';
import { RecordInputPage } from './components/RecordInputPage';
import { PlanManagerPage } from './components/PlanManagerPage';
import { ChallengeResultsPage } from './components/ChallengeResultsPage';
import { SportsStatsPage } from './components/SportsStatsPage';
import { FeatureInputPage } from './components/FeatureInputPage';
import { AdviceComparePage } from './components/AdviceComparePage';
import { PromoPage } from './components/PromoPage';
import { InteractivePage } from './components/InteractivePage';
import { EventsPage } from './components/EventsPage';
import { ProfileModal } from './components/ProfileModal';
import { Smartphone, Monitor, ChevronLeft, ArrowLeft } from 'lucide-react';
import {
  auth,
  db,
  signOut,
  onAuthStateChanged,
  doc,
  setDoc,
  getDocs,
  collection,
} from './firebase';

const STORAGE_KEYS = {
  USER: 'sportpal_user_email',
  RECORDS: 'sportpal_records_v1',
  PLANS: 'sportpal_plans_v1',
  SURVEY: 'sportpal_survey_records_v1',
};

export default function App() {
  // Auth state
  const [userEmail, setUserEmail] = useState<string | null>(() => {
    return localStorage.getItem(STORAGE_KEYS.USER) || null;
  });
  const [userId, setUserId] = useState<string | null>(null);

  // Current Active Tab
  const [currentTab, setCurrentTab] = useState<TabType>('home');
  const [planInitialTab, setPlanInitialTab] = useState<'create' | 'active' | 'completed'>('active');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isDesktopFrameMode, setIsDesktopFrameMode] = useState(true);

  // Data state
  const [records, setRecords] = useState<Record<string, UserRecord>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.RECORDS);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to parse saved records, falling back to initial data');
    }
    return INITIAL_RECORDS;
  });

  const [plans, setPlans] = useState<UserPlan[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PLANS);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to parse saved plans, falling back to initial data');
    }
    return INITIAL_PLANS;
  });

  const [surveyRecords, setSurveyRecords] = useState<Record<string, SurveyRecord>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SURVEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to parse saved survey records, falling back to initial data');
    }
    return INITIAL_SURVEY_RECORDS;
  });

  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'synced' | 'error'>('idle');
  const [syncErrorMsg, setSyncErrorMsg] = useState<string | null>(null);

  // Sync entire dataset to Firestore helper
  const syncAllDataToFirestore = async (uid: string, email: string) => {
    setSyncStatus('syncing');
    setSyncErrorMsg(null);
    try {
      // 1. Write user profile
      await setDoc(
        doc(db, 'users', uid),
        {
          email,
          uid,
          lastSyncAt: new Date().toISOString(),
        },
        { merge: true }
      );

      // 2. Write all records
      const currentRecords: Record<string, UserRecord> = records;
      for (const [m, rec] of Object.entries(currentRecords)) {
        const r = rec as UserRecord;
        if (r) {
          await setDoc(doc(db, 'users', uid, 'records', m), {
            month: r.month,
            distance: r.distance,
            minutes: r.minutes,
            calories: r.calories,
            weight: r.weight,
            notes: r.notes || '',
            updatedAt: new Date().toISOString(),
          });
        }
      }

      // 3. Write all plans
      const currentPlans = plans;
      for (const pl of currentPlans) {
        if (pl) {
          await setDoc(doc(db, 'users', uid, 'plans', pl.id), pl);
        }
      }

      // 4. Write all survey records
      const currentSurveys: Record<string, SurveyRecord> = surveyRecords;
      for (const [period, sRec] of Object.entries(currentSurveys)) {
        const s = sRec as SurveyRecord;
        if (s) {
          await setDoc(doc(db, 'users', uid, 'survey_records', period), {
            ...s,
            email,
            updatedAt: new Date().toISOString(),
          });
        }
      }

      setSyncStatus('synced');
      console.log('✅ Firestore sync completed successfully');
    } catch (err: any) {
      console.error('❌ Firestore sync error:', err);
      setSyncStatus('error');
      setSyncErrorMsg(err.message || String(err));
    }
  };

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user && user.email) {
        setUserEmail(user.email);
        setUserId(user.uid);
        localStorage.setItem(STORAGE_KEYS.USER, user.email);

        // Fetch records from Firestore or auto-seed initial data
        try {
          setSyncStatus('syncing');
          setSyncErrorMsg(null);

          // 1. Ensure user profile doc exists
          await setDoc(
            doc(db, 'users', user.uid),
            {
              email: user.email,
              uid: user.uid,
              lastLoginAt: new Date().toISOString(),
            },
            { merge: true }
          );

          // 2. Check / fetch records
          const recordsSnap = await getDocs(collection(db, 'users', user.uid, 'records'));
          if (!recordsSnap.empty) {
            const fetchedRecords: Record<string, UserRecord> = {};
            recordsSnap.forEach((docSnap) => {
              fetchedRecords[docSnap.id] = docSnap.data() as UserRecord;
            });
            setRecords(fetchedRecords);
          } else {
            // First time login - seed initial records to Firestore
            for (const [m, rec] of Object.entries(INITIAL_RECORDS)) {
              await setDoc(doc(db, 'users', user.uid, 'records', m), {
                ...rec,
                updatedAt: new Date().toISOString(),
              });
            }
          }

          // 3. Check / fetch plans
          const plansSnap = await getDocs(collection(db, 'users', user.uid, 'plans'));
          if (!plansSnap.empty) {
            const fetchedPlans: UserPlan[] = [];
            plansSnap.forEach((docSnap) => {
              fetchedPlans.push(docSnap.data() as UserPlan);
            });
            setPlans(fetchedPlans);
          } else {
            // Seed initial plans to Firestore
            for (const pl of INITIAL_PLANS) {
              await setDoc(doc(db, 'users', user.uid, 'plans', pl.id), pl);
            }
          }

          // 4. Check / fetch survey records
          const surveySnap = await getDocs(collection(db, 'users', user.uid, 'survey_records'));
          if (!surveySnap.empty) {
            const fetchedSurvey: Record<string, SurveyRecord> = {};
            surveySnap.forEach((docSnap) => {
              fetchedSurvey[docSnap.id] = docSnap.data() as SurveyRecord;
            });
            setSurveyRecords(fetchedSurvey);
          } else {
            // Seed initial survey records to Firestore
            for (const [period, sRec] of Object.entries(INITIAL_SURVEY_RECORDS)) {
              await setDoc(doc(db, 'users', user.uid, 'survey_records', period), {
                ...sRec,
                email: user.email,
                updatedAt: new Date().toISOString(),
              });
            }
          }

          setSyncStatus('synced');
        } catch (err: any) {
          console.warn('Firestore initial sync notice:', err);
          setSyncStatus('error');
          setSyncErrorMsg(err.message || String(err));
        }
      } else {
        setSyncStatus('idle');
      }
    });

    return () => unsubscribe();
  }, []);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(records));
  }, [records]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PLANS, JSON.stringify(plans));
  }, [plans]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SURVEY, JSON.stringify(surveyRecords));
  }, [surveyRecords]);

  // Auth actions
  const handleLogin = (email: string) => {
    setUserEmail(email);
    localStorage.setItem(STORAGE_KEYS.USER, email);
    setCurrentTab('home');
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      // ignore
    }
    setUserEmail(null);
    setUserId(null);
    localStorage.removeItem(STORAGE_KEYS.USER);
  };

  // Record actions (setDoc overwrite by month)
  const handleSaveRecord = async (newRecord: UserRecord) => {
    setRecords((prev) => ({
      ...prev,
      [newRecord.month]: newRecord,
    }));

    // If authenticated to Firebase, persist to Firestore
    if (auth.currentUser) {
      try {
        setSyncStatus('syncing');
        await setDoc(doc(db, 'users', auth.currentUser.uid, 'records', newRecord.month), {
          ...newRecord,
          updatedAt: new Date().toISOString(),
        });
        setSyncStatus('synced');
        setSyncErrorMsg(null);
      } catch (err: any) {
        console.error('Firestore write record error:', err);
        setSyncStatus('error');
        setSyncErrorMsg(err.message || String(err));
      }
    }
  };

  // Survey record action
  const handleSaveSurveyRecord = async (surveyRec: SurveyRecord) => {
    setSurveyRecords((prev) => ({
      ...prev,
      [surveyRec.period]: surveyRec,
    }));

    if (auth.currentUser) {
      try {
        setSyncStatus('syncing');
        await setDoc(
          doc(db, 'users', auth.currentUser.uid, 'survey_records', surveyRec.period),
          {
            ...surveyRec,
            updatedAt: new Date().toISOString(),
          }
        );
        setSyncStatus('synced');
        setSyncErrorMsg(null);
      } catch (err: any) {
        console.error('Firestore write survey record error:', err);
        setSyncStatus('error');
        setSyncErrorMsg(err.message || String(err));
      }
    }
  };

  // Plan actions
  const handleAddPlan = async (newPlanData: Omit<UserPlan, 'id' | 'createdAt'>) => {
    const newPlan: UserPlan = {
      ...newPlanData,
      id: `plan-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setPlans((prev) => [newPlan, ...prev]);

    if (auth.currentUser) {
      try {
        setSyncStatus('syncing');
        await setDoc(doc(db, 'users', auth.currentUser.uid, 'plans', newPlan.id), newPlan);
        setSyncStatus('synced');
        setSyncErrorMsg(null);
      } catch (err: any) {
        console.error('Firestore write plan error:', err);
        setSyncStatus('error');
        setSyncErrorMsg(err.message || String(err));
      }
    }
  };

  const handleUpdatePlan = async (updatedPlan: UserPlan) => {
    setPlans((prev) => prev.map((p) => (p.id === updatedPlan.id ? updatedPlan : p)));

    if (auth.currentUser) {
      try {
        setSyncStatus('syncing');
        await setDoc(doc(db, 'users', auth.currentUser.uid, 'plans', updatedPlan.id), updatedPlan);
        setSyncStatus('synced');
        setSyncErrorMsg(null);
      } catch (err: any) {
        console.error('Firestore update plan error:', err);
        setSyncStatus('error');
        setSyncErrorMsg(err.message || String(err));
      }
    }
  };

  const handleDeletePlan = (id: string) => {
    setPlans((prev) => prev.filter((p) => p.id !== id));
  };

  const handleResetDemoData = () => {
    setRecords(INITIAL_RECORDS);
    setPlans(INITIAL_PLANS);
    setSurveyRecords(INITIAL_SURVEY_RECORDS);
  };

  // If user is not logged in, show Login Screen
  if (!userEmail) {
    return <LoginView onLoginSuccess={handleLogin} />;
  }

  const latestMonthRecord = records['2026-08'] || Object.values(records).pop();
  const activePlans = plans.filter((p) => p.status === 'active');

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-start text-slate-800">
      {/* Device Viewport Frame Switcher (Desktop helper) */}
      <aside className="hidden lg:flex items-center justify-between w-full max-w-5xl px-6 py-2 text-xs text-slate-400 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-lime-500" />
          <span className="font-semibold text-slate-300">SportAgent • 手機端預覽模式</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsDesktopFrameMode(true)}
            className={`px-3 py-1 rounded-lg flex items-center gap-1.5 font-bold transition ${
              isDesktopFrameMode
                ? 'bg-lime-600 text-white shadow-sm'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            手機模擬視窗 (390px)
          </button>
          <button
            onClick={() => setIsDesktopFrameMode(false)}
            className={`px-3 py-1 rounded-lg flex items-center gap-1.5 font-bold transition ${
              !isDesktopFrameMode
                ? 'bg-lime-600 text-white shadow-sm'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            寬螢幕擴展模式
          </button>
        </div>
      </aside>

      {/* Main App Container */}
      <main
        className={`w-full bg-white shadow-2xl min-h-screen relative flex flex-col transition-all duration-300 ${
          isDesktopFrameMode
            ? 'max-w-md my-0 lg:my-4 lg:min-h-[844px] lg:max-h-[92vh] lg:rounded-3xl lg:overflow-hidden lg:border-[6px] lg:border-slate-800 lg:shadow-[0_20px_50px_rgba(0,0,0,0.5)]'
            : 'max-w-4xl min-h-screen'
        }`}
      >
        {/* Top Header */}
        <Header
          userEmail={userEmail}
          onLogout={handleLogout}
          onProfileClick={() => setIsProfileOpen(true)}
        />

        {/* Scrollable Main Content */}
        <div className="flex-1 overflow-y-auto px-4 py-2 bg-slate-50/50">
          {currentTab === 'home' && (
            <HomeGrid
              onNavigate={(tab) => setCurrentTab(tab)}
              latestRecord={latestMonthRecord}
              activePlans={activePlans}
              allRecords={records}
            />
          )}

          {currentTab === 'weather' && (
            <WeatherMapPage onBackHome={() => setCurrentTab('home')} />
          )}

          {currentTab === 'badges' && (
            <MyProfilePage
              userEmail={userEmail}
              syncStatus={syncStatus}
              syncErrorMsg={syncErrorMsg}
              onForceSync={() => {
                if (auth.currentUser) {
                  syncAllDataToFirestore(auth.currentUser.uid, auth.currentUser.email || '');
                }
              }}
            />
          )}

          {currentTab === 'stats' && (
            <SportsStatsPage
              records={records}
              userEmail={userEmail}
              onNavigateToProfile={() => setCurrentTab('badges')}
            />
          )}

          {currentTab === 'input' && (
            <RecordInputPage
              records={records}
              onSaveRecord={handleSaveRecord}
              onNavigateToBadges={() => setCurrentTab('badges')}
            />
          )}

          {currentTab === 'survey' && (
            <FeatureInputPage
              userEmail={userEmail}
              surveyRecords={surveyRecords}
              onSaveSurveyRecord={handleSaveSurveyRecord}
              onNavigateToAdvice={() => setCurrentTab('advice')}
            />
          )}

          {currentTab === 'advice' && (
            <AdviceComparePage
              userEmail={userEmail}
              surveyRecords={surveyRecords}
              onNavigateToFeatureInput={() => setCurrentTab('survey')}
            />
          )}

          {currentTab === 'plan' && (
            <PlanManagerPage
              plans={plans}
              records={records}
              onAddPlan={handleAddPlan}
              onUpdatePlan={handleUpdatePlan}
              onDeletePlan={handleDeletePlan}
              initialTab={planInitialTab}
            />
          )}

          {currentTab === 'challenge_results' && (
            <ChallengeResultsPage
              plans={plans}
              records={records}
              userEmail={userEmail}
              onNavigateToCompletedPlans={() => {
                setPlanInitialTab('completed');
                setCurrentTab('plan');
              }}
              onNavigateToProfile={() => {
                setCurrentTab('badges');
              }}
            />
          )}

          {currentTab === 'promo' && (
            <PromoPage onBackHome={() => setCurrentTab('home')} />
          )}

          {currentTab === 'interactive' && <InteractivePage />}

          {currentTab === 'news' && <EventsPage />}
        </div>

        {/* Fixed Mobile Bottom Navigation Bar */}
        <NavigationFooter
          currentTab={currentTab}
          onTabChange={(tab) => setCurrentTab(tab)}
        />
      </main>

      {/* Account Profile Dialog Modal */}
      <ProfileModal
        userEmail={userEmail}
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        onLogout={handleLogout}
        onResetDemoData={handleResetDemoData}
      />
    </div>
  );
}
