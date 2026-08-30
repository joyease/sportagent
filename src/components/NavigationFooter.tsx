import React from 'react';
import { Home, Edit3, User, ClipboardList } from 'lucide-react';

export type TabType =
  | 'home'
  | 'input'
  | 'plan'
  | 'survey'
  | 'badges'
  | 'weather'
  | 'promo'
  | 'interactive'
  | 'news'
  | 'challenge_results'
  | 'stats'
  | 'advice';

interface NavigationFooterProps {
  currentTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export const NavigationFooter: React.FC<NavigationFooterProps> = ({ currentTab, onTabChange }) => {
  const tabs = [
    {
      id: 'home' as TabType,
      label: '首頁',
      icon: Home,
      highlight: currentTab === 'home',
    },
    {
      id: 'input' as TabType,
      label: '輸入記錄',
      icon: Edit3,
      highlight: currentTab === 'input',
    },
    {
      id: 'survey' as TabType,
      label: '輸入特徵',
      icon: ClipboardList,
      highlight: currentTab === 'survey',
    },
    {
      id: 'badges' as TabType,
      label: '留言分享',
      icon: User,
      highlight: currentTab === 'badges',
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200 shadow-[0_-4px_12px_rgba(0,0,0,0.06)] max-w-md mx-auto">
      <div className="flex items-center justify-around py-1.5 px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = tab.highlight;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center flex-1 py-1 px-0.5 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'text-[#5ea31b] font-bold scale-105'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
              }`}
            >
              <div
                className={`relative p-1 rounded-full transition ${
                  isActive ? 'bg-lime-100 text-[#5ea31b]' : 'text-slate-500'
                }`}
              >
                <Icon className="w-4.5 h-4.5 stroke-[2.2]" />
                {isActive && (
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#ff6d00]" />
                )}
              </div>
              <span
                className={`text-[10px] mt-0.5 tracking-tight truncate ${
                  isActive ? 'text-[#5ea31b] font-bold' : 'font-medium'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

