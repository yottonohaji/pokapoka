import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Calendar as CalendarIcon, Clock, MapPin, Users, Bookmark, Search, Sparkles } from 'lucide-react';
import { sound } from '../utils/audio';

export const EventCalendarScreen: React.FC = () => {
  const { events, setSelectedEvent, userProfile, toggleBookmark } = useApp();
  const [selectedDateFilter, setSelectedDateFilter] = useState<'today' | 'tomorrow' | 'weekend' | 'all'>('today');
  const [searchTag, setSearchTag] = useState<string>('all');

  const filterOptions: { id: 'today' | 'tomorrow' | 'weekend' | 'all'; label: string; dateStr: string }[] = [
    { id: 'today', label: '今日', dateStr: '9/24(木)' },
    { id: 'tomorrow', label: '明日', dateStr: '9/25(金)' },
    { id: 'weekend', label: '今週末', dateStr: '9/27(日)' },
    { id: 'all', label: 'すべて', dateStr: '全一覧' },
  ];

  const tags = ['all', '絵本', '手遊び', '育児相談', '木育', '体操'];

  const filteredEvents = events.filter((ev) => {
    // Date filter
    let matchDate = true;
    if (selectedDateFilter === 'today') matchDate = ev.date === '2026-09-24';
    else if (selectedDateFilter === 'tomorrow') matchDate = ev.date === '2026-09-25';
    else if (selectedDateFilter === 'weekend') matchDate = ev.date === '2026-09-27';

    // Tag filter
    let matchTag = true;
    if (searchTag !== 'all') {
      matchTag = ev.tags.some((t) => t.includes(searchTag));
    }

    return matchDate && matchTag;
  });

  return (
    <div className="space-y-4 pb-12">
      {/* Title & Calendar Description */}
      <div>
        <h1 className="text-base sm:text-lg font-black text-stone-900 flex items-center gap-2">
          <CalendarIcon className="w-5 h-5 text-orange-600" />
          <span>イベントカレンダー</span>
        </h1>
        <p className="text-xs text-stone-500 mt-0.5">
          今日や今週末に開催される親子イベントやワークショップ一覧です。
        </p>
      </div>

      {/* Date Filter Tabs */}
      <div className="flex gap-2 p-1 bg-amber-100/60 rounded-xl">
        {filterOptions.map((opt) => {
          const isActive = selectedDateFilter === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => {
                sound.playTap();
                setSelectedDateFilter(opt.id);
              }}
              className={`flex-1 py-2 px-2 rounded-lg text-xs font-semibold transition-all min-h-[44px] flex flex-col items-center justify-center ${
                isActive
                  ? 'bg-white text-orange-950 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <span>{opt.label}</span>
              <span className="text-[10px] text-stone-400 font-normal">{opt.dateStr}</span>
            </button>
          );
        })}
      </div>

      {/* Tag pills / Interactive filter controls */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
        {tags.map((tag) => (
          <button
            key={tag}
            onClick={() => {
              sound.playTap();
              setSearchTag(tag);
            }}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors min-h-[36px] ${
              searchTag === tag
                ? 'bg-orange-600 text-white'
                : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
            }`}
          >
            {tag === 'all' ? 'すべてのテーマ' : `#${tag}`}
          </button>
        ))}
      </div>

      {/* Event list */}
      {filteredEvents.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 text-center border border-dashed border-stone-200">
          <CalendarIcon className="w-10 h-10 text-stone-300 mx-auto mb-2" />
          <p className="text-sm font-bold text-stone-700">該当するイベントはありません</p>
          <p className="text-xs text-stone-400 mt-1">「すべて」タブで他の日のイベントをご覧ください。</p>
          <button
            onClick={() => {
              setSelectedDateFilter('all');
              setSearchTag('all');
            }}
            className="mt-3 px-4 py-1.5 rounded-lg bg-stone-900 text-white text-xs font-medium"
          >
            全イベントを表示
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredEvents.map((ev) => {
            const isBookmarked = userProfile.bookmarkedEventIds.includes(ev.id);
            const isFull = ev.currentBookings >= ev.capacity;

            return (
              <div
                key={ev.id}
                onClick={() => setSelectedEvent(ev)}
                className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-xs hover:border-orange-300 transition-all cursor-pointer flex flex-col sm:flex-row gap-3.5"
              >
                {/* Event thumbnail */}
                {ev.imageUrl && (
                  <div className="w-full sm:w-28 h-28 rounded-xl overflow-hidden bg-amber-50 shrink-0 relative">
                    <img
                      src={ev.imageUrl}
                      alt={ev.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    {ev.isFeatured && (
                      <span className="absolute top-1.5 left-1.5 bg-orange-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                        注目
                      </span>
                    )}
                  </div>
                )}

                {/* Event info */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2 text-xs text-stone-500">
                        <span className="font-bold text-orange-600">{ev.date}</span>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-stone-400" />
                          <span>{ev.time}</span>
                        </span>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleBookmark(ev.id);
                        }}
                        className="min-h-[40px] min-w-[40px] flex items-center justify-center text-stone-400 hover:text-orange-600"
                        title={isBookmarked ? 'リマインダー中' : '保存'}
                      >
                        <Bookmark
                          className={`w-4 h-4 ${
                            isBookmarked ? 'fill-orange-500 text-orange-500' : ''
                          }`}
                        />
                      </button>
                    </div>

                    <h3 className="text-sm sm:text-base font-bold text-stone-900 leading-snug mb-1">
                      {ev.title}
                    </h3>
                    <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed mb-2">
                      {ev.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-2 border-t border-stone-100">
                    <div className="flex items-center gap-3 text-stone-500 text-[11px]">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-stone-400" />
                        <span className="truncate max-w-[120px]">{ev.location}</span>
                      </span>
                      <span>·</span>
                      <span>{ev.targetAge}</span>
                    </div>

                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded ${
                        isFull
                          ? 'bg-stone-100 text-stone-500'
                          : 'bg-emerald-50 text-emerald-700'
                      }`}
                    >
                      {isFull ? '満員' : `参加費: ${ev.fee}`}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
