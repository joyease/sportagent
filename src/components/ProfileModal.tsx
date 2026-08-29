import React from 'react';
import { User, Mail, Shield, Smartphone, RefreshCw, X, LogOut, CheckCircle2, Tag } from 'lucide-react';
import { getUserNickname } from '../utils/user';

interface ProfileModalProps {
  userEmail: string;
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
  onResetDemoData: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  userEmail,
  isOpen,
  onClose,
  onLogout,
  onResetDemoData,
}) => {
  if (!isOpen) return null;

  const nickname = getUserNickname(userEmail);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl space-y-4 border border-lime-200 relative overflow-hidden">
        {/* Header decoration */}
        <div className="absolute -top-12 -right-12 w-28 h-28 rounded-full bg-lime-100/60 blur-lg pointer-events-none" />

        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#5ea31b] to-lime-400 flex items-center justify-center text-white font-black text-sm shadow">
              {nickname.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-900">{nickname} 的帳號管理</h3>
              <p className="text-[10px] text-slate-400">mySports 運動好夥伴系統</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Account Details */}
        <div className="space-y-2.5 text-xs">
          <div className="p-3 bg-slate-50 rounded-2xl space-y-1.5 border border-slate-100">
            <div className="flex items-center justify-between text-slate-500 text-[11px]">
              <span className="flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-lime-600" /> 使用者暱稱
              </span>
              <span className="font-bold text-slate-800">{nickname}</span>
            </div>

            <div className="flex items-center justify-between text-slate-500 text-[11px]">
              <span className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-lime-600" /> 登入帳號
              </span>
              <span className="font-bold text-slate-800">{userEmail}</span>
            </div>

            <div className="flex items-center justify-between text-slate-500 text-[11px]">
              <span className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-orange-500" /> 會員身份
              </span>
              <span className="font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full text-[10px]">
                認證運動員 (VIP)
              </span>
            </div>

            <div className="flex items-center justify-between text-slate-500 text-[11px]">
              <span className="flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5 text-sky-500" /> 裝置最佳化
              </span>
              <span className="font-semibold text-slate-700">手機端響應式介面</span>
            </div>
          </div>
        </div>

        {/* Reset / Actions */}
        <div className="space-y-2 pt-1">
          <button
            type="button"
            onClick={() => {
              if (window.confirm('確定要重置為預設運動紀錄與計畫範例資料嗎？')) {
                onResetDemoData();
                onClose();
              }
            }}
            className="w-full py-2.5 px-3 bg-slate-100 hover:bg-amber-50 hover:text-amber-900 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition"
          >
            <RefreshCw className="w-3.5 h-3.5 text-amber-600" />
            重置為系統示範資料
          </button>

          <button
            type="button"
            onClick={() => {
              onLogout();
              onClose();
            }}
            className="w-full py-2.5 px-3 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition"
          >
            <LogOut className="w-3.5 h-3.5" />
            登出系統
          </button>
        </div>

        <div className="text-center text-[10px] text-slate-400 pt-1">
          Sportpal 雲端本地混合持久化已啟用
        </div>
      </div>
    </div>
  );
};
