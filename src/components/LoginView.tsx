import React, { useState } from 'react';
import { Activity, ShieldCheck, Zap, Lock, Mail, ArrowRight } from 'lucide-react';

interface LoginViewProps {
  onLoginSuccess: (email: string) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('trial@trip.com');
  const [password, setPassword] = useState('123456');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    setTimeout(() => {
      if (email.trim() && password.length >= 6) {
        onLoginSuccess(email.trim());
      } else {
        setErrorMsg('請確認帳號與密碼長度（密碼需至少 6 碼）');
        setIsLoading(false);
      }
    }, 400);
  };

  const handleQuickDemo = () => {
    setEmail('trial@trip.com');
    setPassword('123456');
    setIsLoading(true);
    setTimeout(() => {
      onLoginSuccess('trial@trip.com');
    }, 300);
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
            <span className="text-white italic">my</span>
            <span className="text-amber-200 ml-1 tracking-wider">SPORTS</span>
            <span className="text-white text-xl ml-1 font-semibold">/ Sportpal</span>
          </div>
          <p className="text-xs text-lime-100 font-medium tracking-wide">
            您的運動與體態好夥伴 ｜ 隨時掌握天氣、徽章與訓練計畫
          </p>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-5">
          <div className="flex items-center gap-2 p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-800 text-xs">
            <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              已預設試用帳號：<strong className="font-semibold text-amber-900">trial@trip.com</strong> / 密碼：<strong className="font-semibold text-amber-900">123456</strong>
            </span>
          </div>

          {errorMsg && (
            <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200">
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
                placeholder="例如: trial@trip.com"
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
                placeholder="請輸入密碼 (預設: 123456)"
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#5ea31b] to-[#70b828] hover:from-[#528f17] hover:to-[#5ea31b] text-white font-bold text-sm shadow-md shadow-lime-600/30 flex items-center justify-center gap-2 transition active:scale-[0.99] disabled:opacity-70"
            >
              {isLoading ? (
                <span className="inline-flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  驗證中...
                </span>
              ) : (
                <>
                  登入系統
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="relative flex items-center justify-center my-2">
            <div className="border-t border-slate-200 w-full" />
            <span className="bg-white px-3 text-[11px] text-slate-400 font-medium">或快速體驗</span>
          </div>

          <button
            type="button"
            onClick={handleQuickDemo}
            className="w-full py-2.5 rounded-xl bg-orange-50 hover:bg-orange-100 border border-orange-200 text-[#ea580c] font-bold text-xs flex items-center justify-center gap-1.5 transition active:scale-[0.99]"
          >
            <Zap className="w-4 h-4 text-orange-500 fill-orange-500" />
            一鍵登入試用帳號 (trial@trip.com)
          </button>
        </div>

        {/* Footer info */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 text-center text-[11px] text-slate-400">
          mySports 行動運動管理系統 • 支持即時天氣、圖表與徽章
        </div>
      </div>
    </div>
  );
};
