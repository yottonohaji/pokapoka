import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { RewardItem, RedeemedTicket } from '../types';
import { Sparkles, Gift, Cookie, IceCream, Ticket, Check, X, ShieldAlert, ArrowRight } from 'lucide-react';
import { sound } from '../utils/audio';

export const RewardScreen: React.FC = () => {
  const {
    rewards,
    userProfile,
    redeemReward,
    markTicketUsed,
    setShowRegistrationModal,
    activeTicketForViewing,
    setActiveTicketForViewing,
  } = useApp();

  const [confirmReward, setConfirmReward] = useState<RewardItem | null>(null);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'snack':
        return Cookie;
      case 'gacha':
        return Sparkles;
      case 'play':
        return IceCream;
      default:
        return Gift;
    }
  };

  const handleSelectReward = (item: RewardItem) => {
    sound.playTap();
    if (!userProfile.isRegistered) {
      setShowRegistrationModal(true);
      return;
    }
    setConfirmReward(item);
  };

  const handleRedeemConfirm = () => {
    if (!confirmReward) return;
    const res = redeemReward(confirmReward.id);
    setConfirmReward(null);
    if (res.success && res.ticket) {
      setActiveTicketForViewing(res.ticket);
    }
  };

  const unusedTickets = userProfile.tickets.filter((t) => !t.isUsed);

  return (
    <div className="space-y-5 pb-12">
      {/* Title & Point Header Card */}
      <div>
        <h1 className="text-base sm:text-lg font-black text-stone-900 flex items-center gap-2">
          <Gift className="w-5 h-5 text-orange-600" />
          <span>ごほうび交換所</span>
        </h1>
        <p className="text-xs text-stone-500 mt-0.5">
          たまったポイントをおやつ券やガチャチケットと交換しよう！
        </p>
      </div>

      {/* Point Balance Card */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white rounded-3xl p-5 sm:p-6 shadow-sm flex items-center justify-between">
        <div>
          <span className="text-xs text-orange-100 font-semibold block">現在の保有ポイント</span>
          <div className="text-3xl sm:text-4xl font-black tracking-tight tabular-nums mt-0.5">
            {userProfile.points} <span className="text-base font-normal">pt</span>
          </div>
          <p className="text-[11px] text-orange-100 mt-1">
            {userProfile.isRegistered ? '会員認証済み · 即時交換可能' : 'ゲスト利用中 · 会員登録でポイント引換'}
          </p>
        </div>

        <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30">
          <Sparkles className="w-8 h-8" />
        </div>
      </div>

      {/* Unused Tickets Banner if any */}
      {unusedTickets.length > 0 && (
        <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Ticket className="w-4 h-4 text-emerald-600" />
              <h2 className="text-xs font-bold text-emerald-950">
                交換済みの利用可能チケット（{unusedTickets.length}枚）
              </h2>
            </div>
          </div>
          <div className="space-y-2">
            {unusedTickets.map((ticket) => (
              <div
                key={ticket.id}
                onClick={() => {
                  sound.playTap();
                  setActiveTicketForViewing(ticket);
                }}
                className="bg-white rounded-xl p-3 border border-emerald-100 shadow-xs flex items-center justify-between cursor-pointer hover:border-emerald-300 transition-colors"
              >
                <div>
                  <p className="text-xs font-bold text-stone-900">{ticket.rewardTitle}</p>
                  <p className="text-[10px] text-stone-400">
                    コード: <strong className="tabular-nums">{ticket.ticketCode}</strong> · {ticket.redeemedAt} 発行
                  </p>
                </div>
                <button className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold flex items-center gap-1 min-h-[36px]">
                  <span>使う</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Rewards Catalog */}
      <div className="space-y-3">
        <h2 className="text-xs font-bold text-stone-800 px-1">交換できるごほうび一覧</h2>

        <div className="grid sm:grid-cols-2 gap-3">
          {rewards.map((reward) => {
            const Icon = getCategoryIcon(reward.category);
            const canAfford = userProfile.points >= reward.requiredPoints;

            return (
              <div
                key={reward.id}
                className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-xs flex flex-col justify-between hover:border-orange-200 transition-all"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 text-orange-600 flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">
                      {reward.badge}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-stone-900 mb-1">{reward.title}</h3>
                  <p className="text-xs text-stone-500 leading-relaxed mb-3">
                    {reward.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                  <div className="tabular-nums">
                    <span className="text-base font-black text-orange-600">{reward.requiredPoints}</span>
                    <span className="text-xs text-stone-500 ml-0.5">pt</span>
                  </div>

                  <button
                    onClick={() => handleSelectReward(reward)}
                    disabled={!canAfford}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all min-h-[44px] ${
                      canAfford
                        ? 'bg-orange-600 hover:bg-orange-700 text-white shadow-xs active:scale-95'
                        : 'bg-stone-100 text-stone-400 cursor-not-allowed'
                    }`}
                  >
                    {canAfford ? '交換する' : `あと ${reward.requiredPoints - userProfile.points}pt`}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Confirmation Modal */}
      {confirmReward && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setConfirmReward(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-sm w-full p-5 shadow-xl border border-stone-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center mb-4">
              <div className="w-14 h-14 rounded-2xl bg-orange-100 text-orange-600 mx-auto flex items-center justify-center mb-3">
                <Gift className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-stone-900">このごほうびと交換しますか？</h3>
              <p className="text-sm font-bold text-orange-600 mt-1">{confirmReward.title}</p>
              <p className="text-xs text-stone-500 mt-1">{confirmReward.description}</p>
            </div>

            <div className="bg-stone-50 rounded-2xl p-3 border border-stone-100 mb-4 text-xs space-y-1.5">
              <div className="flex justify-between text-stone-600">
                <span>必要ポイント:</span>
                <span className="font-bold text-stone-900 tabular-nums">{confirmReward.requiredPoints} pt</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>現在の保有ポイント:</span>
                <span className="tabular-nums">{userProfile.points} pt</span>
              </div>
              <div className="flex justify-between text-orange-700 font-bold pt-1 border-t border-stone-200">
                <span>交換後の残高:</span>
                <span className="tabular-nums">{userProfile.points - confirmReward.requiredPoints} pt</span>
              </div>
            </div>

            <div className="space-y-2">
              <button
                onClick={handleRedeemConfirm}
                className="w-full py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md transition-colors min-h-[44px]"
              >
                交換を確定してチケットを発行
              </button>
              <button
                onClick={() => setConfirmReward(null)}
                className="w-full py-2.5 rounded-xl text-stone-500 hover:bg-stone-100 text-xs font-medium transition-colors min-h-[44px]"
              >
                キャンセル
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Staff Verification "スタッフに見せてね！" Screen */}
      {activeTicketForViewing && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setActiveTicketForViewing(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-stone-200 relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setActiveTicketForViewing(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center"
              aria-label="閉じる"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header */}
            <div className="text-center mb-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold mb-2">
                <ShieldAlert className="w-3.5 h-3.5 text-orange-600" />
                <span>スタッフに見せてね！</span>
              </div>
              <h3 className="text-lg font-black text-stone-900">
                {activeTicketForViewing.rewardTitle}
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                受付またはおやつコーナーのスタッフにご提示ください
              </p>
            </div>

            {/* Ticket Card visual */}
            <div className="bg-amber-50/80 rounded-2xl p-4 border-2 border-dashed border-amber-300 mb-4 text-center">
              <span className="text-[10px] text-amber-800 font-semibold">引き換え電子コード</span>
              <div className="text-3xl font-black text-stone-900 tracking-widest my-1 tabular-nums">
                {activeTicketForViewing.ticketCode}
              </div>

              {/* Barcode visual */}
              <div className="flex justify-center items-center gap-1 h-10 my-2 px-6">
                {Array.from({ length: 24 }).map((_, i) => (
                  <div
                    key={i}
                    className={`h-full bg-stone-800 ${i % 3 === 0 ? 'w-1' : i % 2 === 0 ? 'w-0.5' : 'w-1.5'}`}
                  />
                ))}
              </div>

              <div className="flex items-center justify-between text-[11px] text-stone-500 pt-2 border-t border-amber-200/80">
                <span>発行時刻: {activeTicketForViewing.redeemedAt}</span>
                <span className="text-emerald-700 font-bold">有効中（本日限り）</span>
              </div>
            </div>

            {/* Consumption Action */}
            <div className="space-y-3">
              <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-200 text-[11px] text-stone-600 leading-relaxed">
                ※このボタンは、<strong>スタッフが確認した後に</strong>スタッフの前で押してください。
              </div>

              <button
                onClick={() => {
                  markTicketUsed(activeTicketForViewing.id);
                  setActiveTicketForViewing(null);
                }}
                className="w-full py-3.5 px-4 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 min-h-[48px]"
              >
                <Check className="w-4 h-4 text-emerald-400 stroke-[3]" />
                <span>【スタッフ確認】チケットを利用済みにする</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
