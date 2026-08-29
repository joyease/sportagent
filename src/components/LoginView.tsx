import React, { useState } from 'react';
import { Activity, Lock, Mail, ArrowRight, UserPlus, LogIn } from 'lucide-react';
import {
  auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from '../firebase';

interface LoginViewProps {
  onLoginSuccess: (email: string) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess }) => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('hermann@trip.com');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setErrorMsg('請輸入帳號與密碼');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      if (mode === 'signin') {
        const userCred = await signInWithEmailAndPassword(auth, email.trim(), password);
        if (userCred.user?.email) {
          onLoginSuccess(userCred.user.email);
        }
      } else {
        const userCred = await createUserWithEmailAndPassword(auth, email.trim(), password);
        if (userCred.user?.email) {
          setSuccessMsg('帳號註冊成功！正在進入系統...');
          setTimeout(() => {
            onLoginSuccess(userCred.user.email!);
          }, 800);
        }
      }
    } catch (err: any) {
      console.warn('Firebase Auth error:', err);
      if (
        err.code === 'auth/wrong-password' ||
        err.code === 'auth/invalid-credential' ||
        err.code === 'auth/user-not-found'
      ) {
        setErrorMsg('帳號或密碼錯誤。若尚未建立此帳號，請切換至「註冊帳號」分頁建立。');
      } else if (err.code === 'auth/email-already-in-use') {
        setErrorMsg('此 Email 已被註冊，請切換至「登入」分頁輸入密碼登入。');
      } else if (err.code === 'auth/weak-password') {
        setErrorMsg('密碼強度不足，長度至少需 6 個字元以上。');
      } else if (err.code === 'auth/invalid-email') {
        setErrorMsg('Email 格式不正確');
      } else if (err.code === 'auth/too-many-requests') {
        setErrorMsg('嘗試登入次數過多，請稍後再試');
      } else {
        setErrorMsg(err.message || '認證失敗，請確認網路連線');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-lime-100 flex flex-col">
        {/* Brand Banner */}
        <div className="bg-gradient-to-r from-[#5ea31b] via-[#70b828] to-[#ff6d00] p-6 text-white text-center relative overflow-hidden">
          <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-white/10 blur-xl pointer-events-none" />
          <div className="absolute -left-6 -bottom-6 w-28 h-28 rounded-full bg-orange-400/20 blur-lg pointer-events-none" />

          <div className="inline-flex p-3 rounded-2xl bg-white/20 backdrop-blur-md shadow-inner mb-3">
            <Activity className="w-10 h-10 text-white" />
          </div>

          <div className="flex items-baseline justify-center font-black tracking-tight text-3xl mb-1 drop-shadow">
            <span className="text-white font-black">Sport</span>
            <span className="text-amber-200 ml-1 tracking-wider font-black">Agent</span>
          </div>
          <p className="text-xs text-lime-100 font-medium tracking-wide">
            運動與健康的好夥伴
          </p>
        </div>

        {/* Mode Toggle Tabs */}
        <div className="flex border-b border-slate-100 bg-slate-50/70 p-1.5 gap-1">
          <button
            type="button"
            onClick={() => {
              setMode('signin');
              setErrorMsg('');
              setSuccessMsg('');
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition ${
              mode === 'signin'
                ? 'bg-white text-slate-800 shadow-sm border border-slate-200/80'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            已有帳號登入
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setErrorMsg('');
              setSuccessMsg('');
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition ${
              mode === 'signup'
                ? 'bg-white text-slate-800 shadow-sm border border-slate-200/80'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            註冊新帳號
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-5">
          {errorMsg && (
            <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200 leading-relaxed">
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-50 text-emerald-700 text-xs rounded-xl border border-emerald-200 leading-relaxed">
              {successMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-lime-600" />
                帳號信箱 (Email)
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="請輸入帳號 Email"
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-lime-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-orange-600" />
                密碼 (Password)
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={mode === 'signup' ? '請設定 6 位數以上密碼' : '請輸入密碼'}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#5ea31b] to-[#70b828] hover:from-[#528f17] hover:to-[#5ea31b] text-white font-bold text-sm shadow-md shadow-lime-600/30 flex items-center justify-center gap-2 transition active:scale-[0.99] disabled:opacity-70 cursor-pointer"
            >
              {isLoading ? (
                <span className="inline-flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {mode === 'signin' ? 'Firebase 認證中...' : '帳號建立中...'}
                </span>
              ) : (
                <>
                  {mode === 'signin' ? '登入系統' : '立即註冊並進入'}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
