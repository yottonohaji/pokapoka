import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CongestionLevel } from '../types';
import { ShieldCheck, Users, Check, QrCode, ArrowLeft, Clock, Sparkles } from 'lucide-react';
import { sound } from '../utils/audio';

export const StaffAdminScreen: React.FC = () => {
  const {
    congestionLevel,
    setCongestionLevel,
    congestionUpdatedAt,
    staffMembers,
    toggleStaffPresence,
    setIsStaffMode,
  } = useApp();

  const [showCounterQR, setShowCounterQR] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2400);
  };

  const handleLevelChange = (level: CongestionLevel, label: string) => {
    setCongestionLevel(level);
    triggerToast(`混雑状況を「${label}」に更新しました（即時反映）`);
  };

  const presentCount = staffMembers.filter((s) => s.isPresentToday).length;

  return (
    <div className="space-y-6 pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-stone-900 text-white px-4 py-2.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-2 animate-bounce">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Admin Header Banner */}
      <div className="bg-stone-900 text-white rounded-3xl p-5 sm:p-6 shadow-md flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-orange-500/20 text-orange-400 text-[11px] font-bold mb-1.5 border border-orange-500/30">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>施設スタッフ専用 1画面管理</span>
          </div>
          <h1 className="text-lg sm:text-xl font-black">現場オペレーション管理盤</h1>
          <p className="text-xs text-stone-400 mt-0.5">
            変更した内容は、来館保護者アプリに1タップで即時反映されます。
          </p>
        </div>

        <button
          onClick={() => {
            sound.playTap();
            setIsStaffMode(false);
          }}
          className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shrink-0"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>利用者画面へ</span>
        </button>
      </div>

      {/* ① 混雑状況切替: 「空き」「やや混」「混雑」の3つの大きなボタン */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200/80 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-black text-stone-900">
                1. 混雑状況のワンタップ切替
              </h2>
              <p className="text-xs text-stone-400 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>最終更新: {congestionUpdatedAt}</span>
              </p>
            </div>
          </div>

          <span className="text-xs font-bold text-stone-500">
            現在: <strong className="text-stone-900">{congestionLevel === 'open' ? '空き' : congestionLevel === 'moderate' ? 'やや混雑' : '混雑中'}</strong>
          </span>
        </div>

        <p className="text-xs text-stone-500">
          現場の混み具合に合わせてボタンをタップしてください。利用者のメーターが即時切り替わります。
        </p>

        {/* 3 Large Buttons */}
        <div className="grid grid-cols-3 gap-2.5 sm:gap-4 pt-1">
          {/* Level 1: Open */}
          <button
            onClick={() => handleLevelChange('open', '空いている')}
            className={`py-4 px-2 sm:px-4 rounded-2xl border-2 font-black flex flex-col items-center justify-center gap-1.5 transition-all active:scale-95 min-h-[90px] ${
              congestionLevel === 'open'
                ? 'bg-emerald-500 text-white border-emerald-600 shadow-md shadow-emerald-200 ring-4 ring-emerald-100'
                : 'bg-white text-emerald-800 border-emerald-200 hover:bg-emerald-50/50'
            }`}
          >
            <span className="text-2xl sm:text-3xl">🟢</span>
            <span className="text-sm sm:text-base">空いている</span>
            <span className="text-[10px] opacity-80 font-normal">余裕あり</span>
          </button>

          {/* Level 2: Moderate */}
          <button
            onClick={() => handleLevelChange('moderate', 'やや混雑')}
            className={`py-4 px-2 sm:px-4 rounded-2xl border-2 font-black flex flex-col items-center justify-center gap-1.5 transition-all active:scale-95 min-h-[90px] ${
              congestionLevel === 'moderate'
                ? 'bg-amber-500 text-white border-amber-600 shadow-md shadow-amber-200 ring-4 ring-amber-100'
                : 'bg-white text-amber-800 border-amber-200 hover:bg-amber-50/50'
            }`}
          >
            <span className="text-2xl sm:text-3xl">🟡</span>
            <span className="text-sm sm:text-base">やや混雑</span>
            <span className="text-[10px] opacity-80 font-normal">譲り合い</span>
          </button>

          {/* Level 3: Crowded */}
          <button
            onClick={() => handleLevelChange('crowded', '混雑中')}
            className={`py-4 px-2 sm:px-4 rounded-2xl border-2 font-black flex flex-col items-center justify-center gap-1.5 transition-all active:scale-95 min-h-[90px] ${
              congestionLevel === 'crowded'
                ? 'bg-rose-500 text-white border-rose-600 shadow-md shadow-rose-200 ring-4 ring-rose-100'
                : 'bg-white text-rose-800 border-rose-200 hover:bg-rose-50/50'
            }`}
          >
            <span className="text-2xl sm:text-3xl">🟠</span>
            <span className="text-sm sm:text-base">混雑中</span>
            <span className="text-[10px] opacity-80 font-normal">入場制限あり</span>
          </button>
        </div>
      </div>

      {/* ② 本日のスタッフ選択: 登録スタッフ一覧から「出勤スイッチ」をON/OFF */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200/80 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm sm:text-base font-black text-stone-900">
              2. 本日の見守りスタッフ選択（出勤スイッチ）
            </h2>
            <p className="text-xs text-stone-500">
              今日広場にいるスタッフのスイッチをONにしてください。来館者画面のカルーセルに表示されます。
            </p>
          </div>
          <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2.5 py-1 rounded-full whitespace-nowrap">
            本日 {presentCount} 名出勤中
          </span>
        </div>

        <div className="divide-y divide-stone-100">
          {staffMembers.map((staff) => (
            <div
              key={staff.id}
              className="py-3.5 flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative w-11 h-11 rounded-full overflow-hidden bg-amber-100 shrink-0 border border-stone-200">
                  {staff.avatarUrl ? (
                    <img
                      src={staff.avatarUrl}
                      alt={staff.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-bold text-amber-800 text-sm">
                      {staff.nickname.slice(0, 2)}
                    </div>
                  )}
                  {staff.isPresentToday && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
                  )}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-stone-900 truncate">
                      {staff.nickname}
                    </span>
                    <span className="text-xs text-stone-400">（{staff.name}）</span>
                  </div>
                  <p className="text-[11px] text-stone-500 truncate">{staff.role}</p>
                </div>
              </div>

              {/* iOS / Toggle Switch */}
              <button
                onClick={() => {
                  toggleStaffPresence(staff.id);
                  triggerToast(
                    `${staff.nickname}さんを「${!staff.isPresentToday ? '本日出勤' : '本日不在'}」に切り替えました`
                  );
                }}
                className={`relative inline-flex h-8 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none min-h-[44px] items-center ${
                  staff.isPresentToday ? 'bg-orange-500' : 'bg-stone-300'
                }`}
                aria-label={`${staff.nickname}の出勤切替`}
              >
                <span
                  className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                    staff.isPresentToday ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* ③ 店頭・受付掲示用チェックインQRコード表示 */}
      <div className="bg-amber-50/70 rounded-3xl p-5 border border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-orange-500 text-white flex items-center justify-center shrink-0 shadow-sm">
            <QrCode className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-stone-900">
              来館チェックイン用QRコードの店頭提示
            </h3>
            <p className="text-xs text-stone-500">
              受付カウンターの端末や印刷用に、本日の来館ポイントQRコードを画面いっぱいに表示できます。
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            sound.playTap();
            setShowCounterQR(true);
          }}
          className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shrink-0 transition-colors shadow-xs whitespace-nowrap min-h-[44px]"
        >
          全画面QRコードを表示
        </button>
      </div>

      {/* Fullscreen Counter QR Modal */}
      {showCounterQR && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setShowCounterQR(false)}
        >
          <div
            className="bg-white rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">
                受付カウンター用
              </span>
              <button
                onClick={() => setShowCounterQR(false)}
                className="text-stone-400 hover:text-stone-600 text-xs font-bold px-2 py-1"
              >
                とじる ✕
              </button>
            </div>

            <h3 className="text-base font-black text-stone-900 mb-1">
              ぽかぽか広場 来館スタンプQR
            </h3>
            <p className="text-xs text-stone-500 mb-4">
              ご来館の保護者様はこちらをスマホカメラでお読み取りください
            </p>

            {/* Generated QR Code Graphic */}
            <div className="w-56 h-56 mx-auto bg-stone-950 p-4 rounded-2xl flex items-center justify-center mb-4 shadow-inner">
              <div className="w-full h-full bg-white p-3 rounded-xl flex flex-col items-center justify-center relative">
                {/* SVG QR Code pattern */}
                <svg viewBox="0 0 100 100" className="w-full h-full text-stone-900">
                  <rect width="100" height="100" fill="white" />
                  {/* Position detection markers */}
                  <rect x="5" y="5" width="26" height="26" fill="currentColor" />
                  <rect x="8" y="8" width="20" height="20" fill="white" />
                  <rect x="11" y="11" width="14" height="14" fill="currentColor" />

                  <rect x="69" y="5" width="26" height="26" fill="currentColor" />
                  <rect x="72" y="8" width="20" height="20" fill="white" />
                  <rect x="75" y="11" width="14" height="14" fill="currentColor" />

                  <rect x="5" y="69" width="26" height="26" fill="currentColor" />
                  <rect x="8" y="72" width="20" height="20" fill="white" />
                  <rect x="11" y="75" width="14" height="14" fill="currentColor" />

                  {/* QR modules simulated */}
                  <rect x="36" y="10" width="6" height="6" fill="currentColor" />
                  <rect x="46" y="10" width="6" height="12" fill="currentColor" />
                  <rect x="56" y="14" width="6" height="6" fill="currentColor" />
                  <rect x="10" y="36" width="12" height="6" fill="currentColor" />
                  <rect x="26" y="42" width="6" height="12" fill="currentColor" />
                  <rect x="38" y="36" width="24" height="24" rx="4" fill="#ea580c" />
                  <circle cx="50" cy="48" r="7" fill="white" />
                  <rect x="68" y="36" width="8" height="8" fill="currentColor" />
                  <rect x="80" y="42" width="12" height="6" fill="currentColor" />
                  <rect x="38" y="66" width="6" height="18" fill="currentColor" />
                  <rect x="50" y="72" width="18" height="6" fill="currentColor" />
                  <rect x="74" y="66" width="18" height="18" fill="currentColor" />
                  <rect x="78" y="70" width="10" height="10" fill="white" />
                </svg>
              </div>
            </div>

            <div className="bg-amber-50 p-2.5 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-center justify-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-orange-600" />
              <span>読み取りでスタンプ +10 pt 付与</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
