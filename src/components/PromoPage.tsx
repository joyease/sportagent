import React from 'react';
import { PROMO_DEALS } from '../data/initialData';
import { Gift, ExternalLink, ShoppingBag, Plane, Headphones, ArrowRight, Sparkles } from 'lucide-react';

interface PromoPageProps {
  onBackHome?: () => void;
}

export const PromoPage: React.FC<PromoPageProps> = () => {
  const getIcon = (category: string) => {
    switch (category) {
      case 'shopping':
        return <ShoppingBag className="w-5 h-5 text-pink-400" />;
      case 'travel':
        return <Plane className="w-5 h-5 text-sky-400" />;
      case 'music':
        return <Headphones className="w-5 h-5 text-purple-400" />;
      default:
        return <Gift className="w-5 h-5 text-amber-400" />;
    }
  };

  const getIconBg = (category: string) => {
    switch (category) {
      case 'shopping':
        return 'bg-pink-500/20 border-pink-500/30';
      case 'travel':
        return 'bg-sky-500/20 border-sky-500/30';
      case 'music':
        return 'bg-purple-500/20 border-purple-500/30';
      default:
        return 'bg-amber-500/20 border-amber-500/30';
    }
  };

  const getButtonGradient = (category: string) => {
    switch (category) {
      case 'shopping':
        return 'from-pink-700 to-rose-700 hover:from-pink-600 hover:to-rose-600 shadow-pink-950/50';
      case 'travel':
        return 'from-sky-700 to-blue-700 hover:from-sky-600 hover:to-blue-600 shadow-blue-950/50';
      case 'music':
        return 'from-purple-700 to-indigo-700 hover:from-purple-600 hover:to-indigo-600 shadow-purple-950/50';
      default:
        return 'from-purple-700 to-indigo-700 hover:from-purple-600 hover:to-indigo-600 shadow-purple-950/50';
    }
  };

  return (
    <div className="space-y-4 pb-20 pt-2">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30">
            <Gift className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900">運動商品區</h1>
          </div>
        </div>
      </div>

      {/* Featured Banner - Dark Tech Theme */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 border border-slate-800 p-4 text-white shadow-xl relative overflow-hidden">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-medium uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded-md">
            mySports 會員推薦
          </span>
          <span className="text-xs font-medium text-slate-400">精選優質夥伴</span>
        </div>
        <h2 className="text-base font-bold text-white mt-2">出門運動、跑馬旅遊與隨行音樂專區！</h2>
        <p className="text-xs text-slate-300 mt-1 leading-relaxed">
          精選運動裝備購物、國外馬拉松行程以及專屬運動歌單，豐富你的活力生活。
        </p>
      </div>

      {/* Cards List - Dark Theme */}
      <div className="space-y-4">
        {PROMO_DEALS.map((deal) => {
          return (
            <div
              key={deal.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl p-5 text-white space-y-3.5 transition hover:border-slate-700"
            >
              {/* Card Header */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl border ${getIconBg(deal.category)} flex items-center justify-center`}>
                    {getIcon(deal.category)}
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-white tracking-wide">
                      {deal.title}
                    </h3>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="bg-slate-800/70 p-3 rounded-xl border border-slate-700/70">
                <p className="text-xs text-slate-200 leading-relaxed font-normal">
                  {deal.description}
                </p>
              </div>

              {/* Action Button */}
              <a
                href={deal.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-full py-3 bg-gradient-to-r ${getButtonGradient(deal.category)} text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition active:scale-[0.99]`}
              >
                <span>前往專屬專區</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
};

