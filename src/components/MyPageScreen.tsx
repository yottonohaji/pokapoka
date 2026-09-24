import React from 'react';
import { useApp } from '../context/AppContext';
import { User, Phone, Baby, Award, Ticket, Bookmark, RotateCcw, Sparkles, ChevronRight, CheckCircle2 } from 'lucide-react';
import { sound } from '../utils/audio';

export const MyPageScreen: React.FC = () => {
  const {
    userProfile,
    setShowRegistrationModal,
    events,
    setSelectedEvent,
    resetSampleData,
    setActiveTab,
  } = useApp();

  const bookmarkedEvents = events.filter((ev) =>
    userProfile.bookmarkedEventIds.includes(ev.id)
  );

  return (
    <div className="space-y-5 pb-12">
      {/* Title */}
      <div>
        <h1 className="text-base sm:text-lg font-black text-stone-900 flex items-center gap-2">
          <User className="w-5 h-5 text-orange-600" />
          <span>マイページ</span>
        </h1>
        <p className="text-xs text-stone-500 mt-0.5">
          会員情報やお子様の登録情報、ご利用履歴をご確認いただけます。
        </p>
      </div>

      {/* Member Profile Card */}
      <div className="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-xs space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-13 h-13 rounded-2xl bg-amber-100 text-orange-700 flex items-center justify-center font-bold text-lg border border-orange-200">
              {userProfile.parentName.slice(0, 2)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black text-stone-900">{userProfile.parentName}</h2>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    userProfile.isRegistered
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-stone-100 text-stone-600'
                  }`}
                >
                  {userProfile.isRegistered ? '会員登録済' : 'ゲスト利用中'}
                </span>
              </div>
              <p className="text-xs text-stone-500 flex items-center gap-1 mt-0.5">
                <Baby className="w-3.5 h-3.5 text-orange-500" />
                <span>
                  お子様: <strong>{userProfile.childName} ちゃん</strong>（{userProfile.childAge}）
                </span>
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playTap();
              setShowRegistrationModal(true);
            }}
            className="px-3 py-1.5 rounded-xl border border-stone-200 hover:bg-stone-50 text-xs font-semibold text-stone-700 transition-colors"
          >
            {userProfile.isRegistered ? '情報変更' : '本登録する'}
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-2 pt-3 border-t border-stone-100 text-center">
          <div className="p-2 bg-stone-50 rounded-xl">
            <span className="text-[10px] text-stone-500 block">累計保有ポイント</span>
            <span className="text-base font-black text-orange-600 tabular-nums">
              {userProfile.points} <span className="text-[10px] font-normal">pt</span>
            </span>
          </div>
          <div className="p-2 bg-stone-50 rounded-xl">
            <span className="text-[10px] text-stone-500 block">集めたスタンプ</span>
            <span className="text-base font-black text-stone-800 tabular-nums">
              {userProfile.stampCount} <span className="text-[10px] font-normal">個</span>
            </span>
          </div>
          <div className="p-2 bg-stone-50 rounded-xl">
            <span className="text-[10px] text-stone-500 block">保有チケット</span>
            <span className="text-base font-black text-stone-800 tabular-nums">
              {userProfile.tickets.filter((t) => !t.isUsed).length} <span className="text-[10px] font-normal">枚</span>
            </span>
          </div>
        </div>

        {userProfile.phone && (
          <div className="flex items-center gap-2 text-xs text-stone-500 pt-1">
            <Phone className="w-3.5 h-3.5 text-stone-400" />
            <span>登録電話番号: {userProfile.phone}</span>
          </div>
        )}
      </div>

      {/* Bookmarked Events */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
            <Bookmark className="w-4 h-4 text-orange-600" />
            <span>保存したイベント・リマインダー（{bookmarkedEvents.length}件）</span>
          </h2>
          <button
            onClick={() => setActiveTab('events')}
            className="text-xs text-orange-600 font-medium hover:underline"
          >
            カレンダーを見る
          </button>
        </div>

        {bookmarkedEvents.length === 0 ? (
          <div className="bg-white rounded-2xl p-4 text-center border border-stone-200 text-xs text-stone-400">
            保存されたイベントはありません
          </div>
        ) : (
          <div className="space-y-2">
            {bookmarkedEvents.map((ev) => (
              <div
                key={ev.id}
                onClick={() => setSelectedEvent(ev)}
                className="bg-white rounded-2xl p-3.5 border border-stone-200/80 shadow-xs flex items-center justify-between cursor-pointer hover:border-orange-300 transition-colors"
              >
                <div>
                  <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded mr-2">
                    {ev.date}
                  </span>
                  <span className="text-xs font-bold text-stone-900">{ev.title}</span>
                  <p className="text-[11px] text-stone-400 mt-0.5">{ev.time} · {ev.location}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-stone-300" />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Ticket history */}
      <div className="space-y-3">
        <h2 className="text-xs font-bold text-stone-800 flex items-center gap-1.5 px-1">
          <Ticket className="w-4 h-4 text-orange-600" />
          <span>ごほうびチケット利用履歴</span>
        </h2>

        {userProfile.tickets.length === 0 ? (
          <div className="bg-white rounded-2xl p-4 text-center border border-stone-200 text-xs text-stone-400">
            まだ利用したチケットはありません
          </div>
        ) : (
          <div className="bg-white rounded-2xl divide-y divide-stone-100 border border-stone-200/80 overflow-hidden">
            {userProfile.tickets.map((t) => (
              <div key={t.id} className="p-3.5 flex items-center justify-between text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-stone-900">{t.rewardTitle}</span>
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                        t.isUsed ? 'bg-stone-100 text-stone-500' : 'bg-emerald-50 text-emerald-700'
                      }`}
                    >
                      {t.isUsed ? '利用済み' : '未利用'}
                    </span>
                  </div>
                  <p className="text-[10px] text-stone-400 mt-0.5">
                    コード: {t.ticketCode} · {t.redeemedAt} 発行
                    {t.usedAt && ` · ${t.usedAt} 店頭確認`}
                  </p>
                </div>
                <span className="text-stone-500 font-semibold tabular-nums">
                  -{t.pointsSpent} pt
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* App Data Reset & Debug Controls */}
      <div className="pt-4 border-t border-stone-200/60 flex items-center justify-between">
        <span className="text-[11px] text-stone-400">ぽかぽか広場 Web v1.2</span>
        <button
          onClick={resetSampleData}
          className="flex items-center gap-1 text-[11px] text-stone-500 hover:text-stone-800 underline transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          <span>デモデータを初期状態にリセット</span>
        </button>
      </div>
    </div>
  );
};
