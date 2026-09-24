import React from 'react';
import { useApp } from '../context/AppContext';
import { CongestionMeter } from './CongestionMeter';
import { StaffCarousel } from './StaffCarousel';
import { Sparkles, Calendar, ArrowRight, QrCode, HeartHandshake, MapPin } from 'lucide-react';

export const HomeScreen: React.FC = () => {
  const { events, setSelectedEvent, setActiveTab, userProfile, setShowRegistrationModal } = useApp();

  const featuredEvents = events.filter((e) => e.isFeatured);

  return (
    <div className="space-y-5 pb-10">
      {/* Welcome Banner for Family & Guest indicator */}
      {!userProfile.isRegistered && (
        <div className="bg-gradient-to-r from-orange-100/90 to-amber-100/90 border border-orange-200/80 rounded-2xl p-3.5 sm:p-4 flex items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-orange-950 truncate">
                ゲスト利用中：登録不要で閲覧できます
              </p>
              <p className="text-[11px] text-orange-800 truncate">
                会員登録すると来館ポイントがたまり、おやつやガチャと交換可能！
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowRegistrationModal(true)}
            className="px-3 py-1.5 rounded-lg bg-orange-600 text-white text-xs font-bold shrink-0 hover:bg-orange-700 transition-colors shadow-xs whitespace-nowrap min-h-[38px]"
          >
            無料会員登録
          </button>
        </div>
      )}

      {/* ① 上部: 「現在の混雑状況」を大きなメーターとアイコンで表示 */}
      <CongestionMeter />

      {/* ② 中部: 「今日見守ってくれるスタッフさん」の顔写真カードが横スクロールで並ぶ */}
      <StaffCarousel />

      {/* Quick Interactive Stamp Rally Callout */}
      <div
        onClick={() => setActiveTab('stamp')}
        className="bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 text-white rounded-2xl p-4 sm:p-5 shadow-sm cursor-pointer hover:shadow-md transition-all relative overflow-hidden"
      >
        <div className="relative z-10 flex items-center justify-between">
          <div className="space-y-1 max-w-[70%]">
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-xs text-[11px] font-semibold text-white">
              <QrCode className="w-3 h-3" />
              <span>来館チェックイン</span>
            </div>
            <h3 className="text-base sm:text-lg font-black tracking-tight leading-tight">
              現地QRコードを読んでスタンプGET！
            </h3>
            <p className="text-xs text-orange-100">
              スタンプを押すごとに10pt獲得。10個集めるとごほうびボーナス！
            </p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/30 text-white">
            <QrCode className="w-8 h-8" />
          </div>
        </div>
      </div>

      {/* ③ 下部: 本日の注目のイベントをピックアップ表示 */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-orange-600" />
            <h2 className="text-sm font-bold text-stone-900 tracking-tight">本日の注目イベント</h2>
          </div>
          <button
            onClick={() => setActiveTab('events')}
            className="text-xs text-orange-600 font-semibold flex items-center gap-1 hover:text-orange-700"
          >
            <span>すべて見る</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid sm:grid-cols-2 gap-3">
          {featuredEvents.map((event) => (
            <div
              key={event.id}
              onClick={() => setSelectedEvent(event)}
              className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-xs hover:border-orange-300 transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 text-[11px] text-stone-500 mb-2">
                  <span className="font-semibold text-orange-600 bg-orange-50 px-2 py-0.5 rounded">
                    {event.time}
                  </span>
                  <span className="text-stone-400 truncate">{event.location}</span>
                </div>

                <h3 className="text-sm font-bold text-stone-900 leading-snug mb-2 line-clamp-2">
                  {event.title}
                </h3>

                <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed mb-3">
                  {event.description}
                </p>
              </div>

              <div className="flex items-center justify-between text-xs pt-2 border-t border-stone-100">
                <span className="text-stone-500">{event.targetAge}</span>
                <span className="text-orange-600 font-semibold text-xs flex items-center gap-1">
                  <span>詳細・予約</span>
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Facility Information footer card */}
      <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200/70 text-xs text-stone-600 space-y-2">
        <div className="flex items-center gap-2 font-bold text-stone-800">
          <HeartHandshake className="w-4 h-4 text-orange-500" />
          <span>ぽかぽか広場について</span>
        </div>
        <p className="text-[11px] leading-relaxed">
          地域の子育て世帯がいつでも気軽に集い、ボランティアスタッフと一緒に子どもの成長を見守るコミュニティ広場です。利用料は無料。お弁当の持ち込みも可能です。
        </p>
        <div className="flex items-center gap-3 text-[11px] text-stone-500 pt-1">
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3 text-stone-400" />
            <span>市民ふれあいセンター2F</span>
          </span>
          <span>·</span>
          <span>開館時間 09:30〜17:00 (火曜休館)</span>
        </div>
      </div>
    </div>
  );
};
