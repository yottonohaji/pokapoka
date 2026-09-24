import React from 'react';
import { useApp } from '../context/AppContext';
import { Calendar, Clock, MapPin, Users, Bookmark, X, Check, Share2 } from 'lucide-react';

export const EventDetailModal: React.FC = () => {
  const { selectedEvent, setSelectedEvent, userProfile, toggleBookmark } = useApp();

  if (!selectedEvent) return null;

  const isBookmarked = userProfile.bookmarkedEventIds.includes(selectedEvent.id);
  const isFull = selectedEvent.currentBookings >= selectedEvent.capacity;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={() => setSelectedEvent(null)}
    >
      <div
        className="bg-white rounded-t-3xl sm:rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top visual banner */}
        <div className="relative h-44 sm:h-52 bg-amber-100 overflow-hidden">
          {selectedEvent.imageUrl ? (
            <img
              src={selectedEvent.imageUrl}
              alt={selectedEvent.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-tr from-amber-200 to-orange-100">
              <Calendar className="w-12 h-12 text-orange-400 opacity-60" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Close button */}
          <button
            onClick={() => setSelectedEvent(null)}
            className="absolute top-3.5 right-3.5 w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-xs transition-colors"
            aria-label="閉じる"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Floating date badge */}
          <div className="absolute bottom-3 left-4 text-white">
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-orange-600/90 text-white mr-2">
              {selectedEvent.fee}
            </span>
            <span className="text-xs opacity-90">{selectedEvent.targetAge}</span>
          </div>
        </div>

        {/* Content body */}
        <div className="p-5 sm:p-6 space-y-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-stone-500 mb-1.5">
              <span>{selectedEvent.tags.join(' · ')}</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-stone-900 leading-snug">
              {selectedEvent.title}
            </h2>
          </div>

          {/* Key details list */}
          <div className="bg-stone-50 rounded-2xl p-4 border border-stone-100 space-y-2.5 text-xs text-stone-700">
            <div className="flex items-center gap-2.5">
              <Calendar className="w-4 h-4 text-orange-600 shrink-0" />
              <span>開催日: <strong>{selectedEvent.date}</strong></span>
            </div>
            <div className="flex items-center gap-2.5">
              <Clock className="w-4 h-4 text-orange-600 shrink-0" />
              <span>時間: <strong>{selectedEvent.time}</strong></span>
            </div>
            <div className="flex items-center gap-2.5">
              <MapPin className="w-4 h-4 text-orange-600 shrink-0" />
              <span>場所: <strong>{selectedEvent.location}</strong></span>
            </div>
            <div className="flex items-center gap-2.5">
              <Users className="w-4 h-4 text-orange-600 shrink-0" />
              <div className="flex-1">
                <div className="flex justify-between mb-1">
                  <span>参加状況: {selectedEvent.currentBookings} / {selectedEvent.capacity}組</span>
                  <span className="font-semibold text-orange-600">
                    {isFull ? '満員御礼' : `残り ${selectedEvent.capacity - selectedEvent.currentBookings}組`}
                  </span>
                </div>
                <div className="w-full h-1.5 bg-stone-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-orange-500 rounded-full"
                    style={{ width: `${Math.min(100, (selectedEvent.currentBookings / selectedEvent.capacity) * 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-xs font-bold text-stone-900 mb-1.5">イベント内容</h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              {selectedEvent.description}
            </p>
          </div>

          <div className="bg-amber-50 rounded-xl p-3 border border-amber-100 text-xs text-amber-900">
            <p className="font-semibold mb-0.5">持ち物・注意事項:</p>
            <p className="text-stone-600">水分補給用のお飲み物、お子様の着替え。途中参加・授乳退室も自由です。</p>
          </div>

          {/* Actions */}
          <div className="pt-2 flex gap-2.5">
            <button
              onClick={() => toggleBookmark(selectedEvent.id)}
              className={`flex-1 py-3 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all min-h-[44px] ${
                isBookmarked
                  ? 'bg-amber-100 text-amber-900 border border-amber-300'
                  : 'bg-stone-900 text-white hover:bg-stone-800'
              }`}
            >
              {isBookmarked ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>保存済み（リマインダー中）</span>
                </>
              ) : (
                <>
                  <Bookmark className="w-4 h-4" />
                  <span>気になる！保存する</span>
                </>
              )}
            </button>

            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: selectedEvent.title,
                    text: `ぽかぽか広場イベント: ${selectedEvent.title} (${selectedEvent.time})`,
                    url: window.location.href,
                  }).catch(() => {});
                } else {
                  alert('イベントリンクをクリップボードにコピーしました！');
                }
              }}
              className="py-3 px-3.5 rounded-xl border border-stone-200 text-stone-700 hover:bg-stone-50 transition-colors flex items-center justify-center min-h-[44px]"
              aria-label="シェア"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
