import React, { useState } from 'react';
import { Activity, Lock, Mail, ArrowRight } from 'lucide-react';
import {
  auth,
  signInWithEmailAndPassword,
} from '../firebase';

interface LoginViewProps {
  onLoginSuccess: (email: string) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('trial@trip.com');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setErrorMsg('請輸入帳號與密碼');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    try {
      const userCred = await signInWithEmailAndPassword(auth, email.trim(), password);
      if (userCred.user?.email) {
        onLoginSuccess(userCred.user.email);
      }
    } catch (err: any) {
      console.warn('Firebase Auth login error:', err);
      if (
        err.code === 'auth/wrong-password' ||
        err.code === 'auth/invalid-credential' ||
        err.code === 'auth/user-not-found'
      ) {
        setErrorMsg('帳號或密碼錯誤，請確認後重新輸入');
      } else if (err.code === 'auth/invalid-email') {
        setErrorMsg('Email 格式不正確');
      } else if (err.code === 'auth/too-many-requests') {
        setErrorMsg('嘗試登入次數過多，請稍後再試');
      } else {
        setErrorMsg(err.message || '登入失敗，請確認網路連線');
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
            您的運動與體態好夥伴 ｜ 隨時掌握天氣、徽章與訓練計畫
          </p>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-5">
          {errorMsg && (
            <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200 leading-relaxed">
              {errorMsg}
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
                placeholder="請輸入密碼"
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
                  Firebase 認證中...
                </span>
              ) : (
                <>
                  登入系統
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer info */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 text-center text-[11px] text-slate-400">
          SportAgent 行動運動管理系統 • 支持 Firebase 認證、即時天氣與徽章
        </div>
      </div>
    </div>
  );
};
