import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { StaffMember } from '../types';
import { Heart, MessageSquare, Clock, Sparkles } from 'lucide-react';

export const StaffCarousel: React.FC = () => {
  const { staffMembers } = useApp();
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);

  const presentStaff = staffMembers.filter((s) => s.isPresentToday);

  return (
    <div className="my-5">
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-pulse" />
          <h2 className="text-sm font-bold text-stone-900 tracking-tight">今日見守ってくれるスタッフさん</h2>
        </div>
        <span className="text-xs text-stone-500">
          本日 <span className="font-bold text-orange-600 tabular-nums">{presentStaff.length}</span> 名滞在中
        </span>
      </div>

      {presentStaff.length === 0 ? (
        <div className="bg-white rounded-2xl p-6 text-center border border-dashed border-stone-200">
          <p className="text-xs text-stone-500">本日の見守りスタッフ受付準備中です。</p>
          <p className="text-[11px] text-stone-400 mt-1">常駐スタッフがご案内いたします。</p>
        </div>
      ) : (
        <div className="flex gap-3 overflow-x-auto pb-2 pt-0.5 px-0.5 scrollbar-none snap-x snap-mandatory">
          {presentStaff.map((staff) => (
            <div
              key={staff.id}
              onClick={() => setSelectedStaff(staff)}
              className="min-w-[240px] sm:min-w-[260px] bg-white rounded-2xl p-4 border border-stone-200/80 shadow-sm snap-start hover:border-orange-300 transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                {/* Profile row */}
                <div className="flex items-center gap-3 mb-2.5">
                  <div className="relative w-13 h-13 rounded-full overflow-hidden bg-amber-100 border-2 border-orange-200 shrink-0">
                    {staff.avatarUrl ? (
                      <img
                        src={staff.avatarUrl}
                        alt={staff.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-bold text-amber-700 text-base">
                        {staff.nickname.slice(0, 2)}
                      </div>
                    )}
                    <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full" />
                  </div>

                  <div className="overflow-hidden">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-bold text-stone-900 truncate">{staff.nickname}</span>
                    </div>
                    <p className="text-[11px] text-stone-500 truncate">{staff.name}</p>
                    <p className="text-[10px] text-orange-700 font-medium truncate">{staff.role}</p>
                  </div>
                </div>

                {/* Speech Bubble Comment */}
                <div className="bg-amber-50/70 rounded-xl p-2.5 border border-amber-100/60 mb-2 relative">
                  <p className="text-xs text-stone-700 leading-relaxed line-clamp-2">
                    「{staff.comment}」
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-stone-400 pt-1 border-t border-stone-100">
                <span className="flex items-center gap-1 truncate">
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  <span>{staff.specialty}</span>
                </span>
                <span className="shrink-0 text-orange-600 font-medium">詳細を見る ›</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Staff Detail Dialog */}
      {selectedStaff && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setSelectedStaff(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-sm w-full p-5 shadow-xl border border-stone-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3.5 mb-4">
              <div className="w-16 h-16 rounded-full overflow-hidden bg-amber-100 border-2 border-orange-200 shrink-0">
                {selectedStaff.avatarUrl ? (
                  <img
                    src={selectedStaff.avatarUrl}
                    alt={selectedStaff.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center font-bold text-amber-700 text-lg">
                    {selectedStaff.nickname.slice(0, 2)}
                  </div>
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-stone-900">{selectedStaff.nickname}</h3>
                  <span className="text-xs text-stone-400">({selectedStaff.name})</span>
                </div>
                <p className="text-xs text-orange-600 font-semibold">{selectedStaff.role}</p>
                <div className="flex items-center gap-1 text-[11px] text-stone-500 mt-1">
                  <Clock className="w-3 h-3" />
                  <span>滞在予定: {selectedStaff.presentStartTime || '本日滞在中'}</span>
                </div>
              </div>
            </div>

            <div className="bg-amber-50/70 rounded-2xl p-3.5 border border-amber-100 mb-4">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800 mb-1">
                <MessageSquare className="w-3.5 h-3.5" />
                <span>本日の一言メッセージ</span>
              </div>
              <p className="text-xs text-stone-700 leading-relaxed">{selectedStaff.comment}</p>
            </div>

            <div className="space-y-2 mb-4 text-xs">
              <div className="flex items-center gap-2 text-stone-600">
                <Sparkles className="w-3.5 h-3.5 text-orange-500" />
                <span>得意なこと: <strong>{selectedStaff.specialty}</strong></span>
              </div>
              <div className="flex items-center gap-2 text-stone-600">
                <Heart className="w-3.5 h-3.5 text-rose-500" />
                <span>「見かけたらお気軽に声をかけてくださいね！」</span>
              </div>
            </div>

            <button
              onClick={() => setSelectedStaff(null)}
              className="w-full py-2.5 rounded-xl bg-stone-900 text-white font-medium text-xs hover:bg-stone-800 transition-colors"
            >
              とじる
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
