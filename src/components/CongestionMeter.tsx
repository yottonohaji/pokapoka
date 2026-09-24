import React from 'react';
import { useApp } from '../context/AppContext';
import { CongestionLevel } from '../types';
import { Users, Clock, Baby, CheckCircle2, AlertCircle } from 'lucide-react';

export const CongestionMeter: React.FC = () => {
  const { congestionLevel, congestionUpdatedAt } = useApp();

  const config: Record<
    CongestionLevel,
    {
      label: string;
      subLabel: string;
      colorClass: string;
      badgeBg: string;
      barFill: number;
      dotColor: string;
      tips: string;
    }
  > = {
    open: {
      label: '空いています',
      subLabel: 'のびのび遊べます',
      colorClass: 'text-emerald-700',
      badgeBg: 'bg-emerald-50 border-emerald-200 text-emerald-800',
      barFill: 28,
      dotColor: 'bg-emerald-500',
      tips: 'プレイスペースに十分なゆとりがあります。ベビーカーの移動も快適です。',
    },
    moderate: {
      label: 'やや混雑しています',
      subLabel: 'おもちゃは譲り合って利用中',
      colorClass: 'text-amber-700',
      badgeBg: 'bg-amber-50 border-amber-200 text-amber-800',
      barFill: 65,
      dotColor: 'bg-amber-500',
      tips: '人気の絵本やおままごとコーナーが賑わっています。見守りスタッフが近くにいます。',
    },
    crowded: {
      label: '混雑しています',
      subLabel: '入場待ちの可能性あり',
      colorClass: 'text-rose-700',
      badgeBg: 'bg-rose-50 border-rose-200 text-rose-800',
      barFill: 92,
      dotColor: 'bg-rose-500',
      tips: '現在多くの親子が来館中です。14:00以降のご来館がおすすめです。',
    },
  };

  const current = config[congestionLevel];

  return (
    <div className="bg-white rounded-2xl border border-stone-200/80 p-4 sm:p-5 shadow-sm transition-all">
      {/* Header Info */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-stone-900 tracking-tight">現在の館内混雑メーター</h2>
            <div className="flex items-center gap-1.5 text-xs text-stone-400">
              <Clock className="w-3 h-3" />
              <span className="tabular-nums">{congestionUpdatedAt}</span>
              <span>·</span>
              <span>スタッフ現地更新</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border bg-stone-50 text-stone-700">
          <span className={`w-2 h-2 rounded-full ${current.dotColor} animate-pulse`} />
          <span>リアルタイム</span>
        </div>
      </div>

      {/* Main Meter Display */}
      <div className="bg-stone-50 rounded-xl p-3.5 sm:p-4 border border-stone-100 mb-3">
        <div className="flex items-baseline justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className={`text-xl sm:text-2xl font-extrabold ${current.colorClass}`}>
              {current.label}
            </span>
          </div>
          <span className="text-xs font-medium text-stone-500">{current.subLabel}</span>
        </div>

        {/* 3-Zone Segmented Bar */}
        <div className="h-3 w-full bg-stone-200 rounded-full overflow-hidden flex p-0.5 gap-1">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              congestionLevel === 'open'
                ? 'w-full bg-emerald-500'
                : congestionLevel === 'moderate'
                ? 'w-full bg-emerald-300'
                : 'w-full bg-emerald-200'
            }`}
          />
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              congestionLevel === 'open'
                ? 'w-full bg-stone-200'
                : congestionLevel === 'moderate'
                ? 'w-full bg-amber-500'
                : 'w-full bg-amber-300'
            }`}
          />
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              congestionLevel === 'crowded' ? 'w-full bg-rose-500' : 'w-full bg-stone-200'
            }`}
          />
        </div>

        <div className="flex justify-between text-[11px] text-stone-500 font-medium mt-1.5 px-1">
          <span className={congestionLevel === 'open' ? 'text-emerald-700 font-bold' : ''}>空き</span>
          <span className={congestionLevel === 'moderate' ? 'text-amber-700 font-bold' : ''}>やや混雑</span>
          <span className={congestionLevel === 'crowded' ? 'text-rose-700 font-bold' : ''}>混雑中</span>
        </div>
      </div>

      {/* Childcare Facilities Quick Status Bar */}
      <p className="text-xs text-stone-600 mb-3 leading-relaxed flex items-start gap-1.5">
        <AlertCircle className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
        <span>{current.tips}</span>
      </p>

      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-stone-100 text-xs">
        <div className="flex items-center gap-1.5 text-stone-600">
          <Baby className="w-3.5 h-3.5 text-orange-500 shrink-0" />
          <span className="truncate">授乳室: 余裕あり</span>
        </div>
        <div className="flex items-center gap-1.5 text-stone-600">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span className="truncate">おむつ台: 空きあり</span>
        </div>
        <div className="flex items-center gap-1.5 text-stone-600">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span className="truncate">ベビーカー置場: 可</span>
        </div>
      </div>
    </div>
  );
};
