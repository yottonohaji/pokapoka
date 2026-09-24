import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Sparkles, Smartphone, User, Baby, CheckCircle, ShieldCheck } from 'lucide-react';
import { sound } from '../utils/audio';

export const RegistrationModal: React.FC = () => {
  const { showRegistrationModal, setShowRegistrationModal, registerUser, userProfile } = useApp();

  const [parentName, setParentName] = useState(userProfile.parentName === 'ゲスト保護者' ? '' : userProfile.parentName);
  const [phone, setPhone] = useState(userProfile.phone || '');
  const [childName, setChildName] = useState(userProfile.childName || '');
  const [childAge, setChildAge] = useState(userProfile.childAge || '2歳');

  if (!showRegistrationModal) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    registerUser({
      parentName: parentName || 'ぽかぽかママ',
      phone: phone || '090-1234-5678',
      childName: childName || 'はるき',
      childAge: childAge || '2歳',
    });
  };

  const handleQuickDemoFill = () => {
    sound.playTap();
    setParentName('さくらママ');
    setPhone('090-8765-4321');
    setChildName('ゆうき');
    setChildAge('1歳8ヶ月');
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
      onClick={() => setShowRegistrationModal(false)}
    >
      <div
        className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-stone-200 relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={() => {
            sound.playTap();
            setShowRegistrationModal(false);
          }}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 flex items-center justify-center transition-colors"
          aria-label="閉じる"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="text-center mb-5">
          <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 mx-auto flex items-center justify-center mb-2 shadow-xs">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="text-base sm:text-lg font-black text-stone-900">
            かんたん30秒 会員登録
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            ポイントを保存してごほうびチケットと交換できます
          </p>
        </div>

        {/* Bonus announcement */}
        <div className="bg-amber-50 rounded-2xl p-3 border border-amber-200 flex items-center gap-2.5 mb-4 text-xs text-amber-900">
          <CheckCircle className="w-4 h-4 text-orange-600 shrink-0" />
          <span>今なら新規登録で <strong>+20 pt</strong> プレゼント！</span>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block font-bold text-stone-700 mb-1 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-stone-400" />
              <span>保護者ニックネーム</span>
            </label>
            <input
              type="text"
              required
              placeholder="例: たろうママ、ゆうきパパ"
              value={parentName}
              onChange={(e) => setParentName(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all text-xs"
            />
          </div>

          <div>
            <label className="block font-bold text-stone-700 mb-1 flex items-center gap-1.5">
              <Smartphone className="w-3.5 h-3.5 text-stone-400" />
              <span>携帯電話番号（ポイント保存・引換用）</span>
            </label>
            <input
              type="tel"
              required
              placeholder="090-0000-0000"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block font-bold text-stone-700 mb-1 flex items-center gap-1.5">
                <Baby className="w-3.5 h-3.5 text-stone-400" />
                <span>お子様のお名前</span>
              </label>
              <input
                type="text"
                placeholder="例: そうた"
                value={childName}
                onChange={(e) => setChildName(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all text-xs"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">
                <span>年齢・月齢</span>
              </label>
              <select
                value={childAge}
                onChange={(e) => setChildAge(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all text-xs bg-white"
              >
                <option value="0歳(ねんね期)">0歳(ねんね期)</option>
                <option value="0歳(ハイハイ期)">0歳(ハイハイ期)</option>
                <option value="1歳">1歳</option>
                <option value="2歳">2歳</option>
                <option value="3歳">3歳</option>
                <option value="4歳〜就学前">4歳〜就学前</option>
              </select>
            </div>
          </div>

          <div className="pt-2 space-y-2">
            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md transition-all active:scale-95 min-h-[48px]"
            >
              登録してポイントを保存する
            </button>

            <button
              type="button"
              onClick={handleQuickDemoFill}
              className="w-full py-2 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-600 font-medium text-[11px] transition-colors"
            >
              ⚡【テスト用】ワンタップで入力内容を自動補完
            </button>
          </div>
        </form>

        <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-center gap-1.5 text-[10px] text-stone-400">
          <ShieldCheck className="w-3.5 h-3.5 text-stone-400" />
          <span>個人情報は本アプリの来館確認のみに使用されます</span>
        </div>
      </div>
    </div>
  );
};
