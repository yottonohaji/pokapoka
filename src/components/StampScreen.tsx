import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { QrCode, Camera, Sparkles, Check, Gift, RefreshCw, X, AlertCircle } from 'lucide-react';
import { sound } from '../utils/audio';

export const StampScreen: React.FC = () => {
  const { userProfile, addStamp, setShowRegistrationModal, setActiveTab } = useApp();
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [lastStampResult, setLastStampResult] = useState<{
    show: boolean;
    bonus: boolean;
    pointsAdded: number;
  } | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const handleStartScan = () => {
    sound.playTap();
    if (!userProfile.isRegistered) {
      // Flow requirement: If guest -> show registration prompt
      setShowRegistrationModal(true);
      return;
    }
    setIsScanning(true);
    setCameraError(null);
  };

  // Setup device camera when scanning opens
  useEffect(() => {
    if (!isScanning) {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
      return;
    }

    let isMounted = true;

    const startCamera = async () => {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'environment' },
          });
          if (!isMounted) {
            stream.getTracks().forEach((t) => t.stop());
            return;
          }
          streamRef.current = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play().catch(() => {});
          }
        } else {
          setCameraError('お使いの環境ではカメラが直接起動できません。テストスキャンボタンをご利用ください。');
        }
      } catch (err: unknown) {
        const error = err as Error;
        setCameraError(error.message || 'カメラへのアクセスが許可されていません');
      }
    };

    startCamera();

    return () => {
      isMounted = false;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, [isScanning]);

  const handleExecuteStamp = (locationTitle = 'ぽかぽか広場 受付QR') => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setIsScanning(false);

    const result = addStamp(locationTitle);
    setLastStampResult({
      show: true,
      bonus: result.bonus,
      pointsAdded: result.bonus ? 40 : 10,
    });
  };

  const totalSlots = 10;
  const currentStampIndex = userProfile.stampCount % totalSlots || (userProfile.stampCount > 0 ? 10 : 0);

  return (
    <div className="space-y-5 pb-12">
      {/* Title */}
      <div>
        <div className="flex items-center justify-between">
          <h1 className="text-base sm:text-lg font-black text-stone-900 flex items-center gap-2">
            <QrCode className="w-5 h-5 text-orange-600" />
            <span>来館スタンプカード</span>
          </h1>
          <button
            onClick={() => setActiveTab('rewards')}
            className="text-xs text-orange-600 font-semibold hover:underline flex items-center gap-1"
          >
            <Gift className="w-3.5 h-3.5" />
            <span>ごほうび一覧</span>
          </button>
        </div>
        <p className="text-xs text-stone-500 mt-0.5">
          施設内のQRコードを読み取ってスタンプを集めよう！10個で特別ボーナス獲得。
        </p>
      </div>

      {/* Guest Notice Callout */}
      {!userProfile.isRegistered && (
        <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200 text-xs text-amber-900 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-bold text-amber-950">現在はゲストとして閲覧中です</p>
            <p className="text-amber-800 text-[11px] mt-0.5 leading-relaxed">
              スタンプを押すには簡単な会員登録（お名前と電話番号のみ）が必要です。集めたポイントはお菓子やガチャチケットと交換できます！
            </p>
            <button
              onClick={() => setShowRegistrationModal(true)}
              className="mt-2.5 px-3 py-1.5 rounded-lg bg-orange-600 text-white font-bold text-xs hover:bg-orange-700 transition-colors"
            >
              30秒で会員登録する（+20pt進呈）
            </button>
          </div>
        </div>
      )}

      {/* 10-Slot Stamp Sheet Card */}
      <div className="bg-gradient-to-b from-amber-50 to-orange-50/50 rounded-3xl p-5 sm:p-6 border-2 border-orange-200/80 shadow-sm relative overflow-hidden">
        {/* Card Header */}
        <div className="flex items-center justify-between border-b border-orange-200/60 pb-3 mb-4">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-orange-600">
              COMMUNITY STAMP RALLY
            </span>
            <h2 className="text-base sm:text-lg font-black text-amber-950">
              ぽかぽか広場 来館カード
            </h2>
          </div>
          <div className="text-right">
            <span className="text-xs text-amber-800">保有ポイント</span>
            <div className="text-xl font-black text-orange-600 tabular-nums">
              {userProfile.points} <span className="text-xs font-normal">pt</span>
            </div>
          </div>
        </div>

        {/* 10 Stamp Circles Grid */}
        <div className="grid grid-cols-5 gap-2.5 sm:gap-3.5 mb-5">
          {Array.from({ length: totalSlots }).map((_, idx) => {
            const slotNumber = idx + 1;
            const isStamped = slotNumber <= currentStampIndex;
            const isGoal = slotNumber === 10;

            return (
              <div
                key={slotNumber}
                className={`relative aspect-square rounded-2xl flex flex-col items-center justify-center border-2 transition-all ${
                  isStamped
                    ? 'bg-white border-orange-400 shadow-xs'
                    : isGoal
                    ? 'bg-amber-100/50 border-dashed border-amber-400'
                    : 'bg-white/80 border-dashed border-stone-300'
                }`}
              >
                {isStamped ? (
                  <div className="flex flex-col items-center justify-center animate-stamp-pop">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center text-white shadow-xs">
                      {isGoal ? <Sparkles className="w-5 h-5" /> : <Check className="w-5 h-5 stroke-[3]" />}
                    </div>
                    <span className="text-[9px] font-bold text-orange-700 mt-0.5">済</span>
                  </div>
                ) : (
                  <div className="text-center">
                    <span
                      className={`text-xs font-extrabold ${
                        isGoal ? 'text-amber-700' : 'text-stone-400'
                      }`}
                    >
                      {isGoal ? 'GOAL' : slotNumber}
                    </span>
                    <span className="block text-[8px] text-stone-400">
                      {isGoal ? '+40pt' : '+10pt'}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Card Footer status */}
        <div className="flex items-center justify-between text-xs text-amber-900/80 bg-white/70 rounded-xl p-2.5 border border-orange-100">
          <span>
            現在の達成状況: <strong className="text-orange-600 tabular-nums">{currentStampIndex} / 10</strong> 個
          </span>
          <span className="text-[11px] text-amber-700">
            {10 - currentStampIndex === 0
              ? '🎉 コンプリート達成！'
              : `あと ${10 - currentStampIndex} 個でゴール`}
          </span>
        </div>
      </div>

      {/* Big Action Button: スタンプを押す（QR読み取り） */}
      <div className="pt-2">
        <button
          onClick={handleStartScan}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold text-sm sm:text-base flex items-center justify-center gap-3 shadow-md shadow-orange-200 transition-all active:scale-[0.98] min-h-[56px]"
        >
          <Camera className="w-6 h-6" />
          <span>スタンプを押す（QRコード読み取り）</span>
        </button>
        <p className="text-center text-[11px] text-stone-400 mt-2">
          ※広場の入口または受付に掲示されているQRコードを読み取ってください
        </p>
      </div>

      {/* QR Scanner Modal */}
      {isScanning && (
        <div className="fixed inset-0 z-50 bg-black/85 flex flex-col items-center justify-between p-4 sm:p-6 backdrop-blur-xs">
          {/* Top Bar */}
          <div className="w-full max-w-md flex items-center justify-between text-white pt-2">
            <div className="flex items-center gap-2">
              <QrCode className="w-5 h-5 text-orange-400" />
              <span className="font-bold text-sm">QRコードスキャナー</span>
            </div>
            <button
              onClick={() => {
                sound.playTap();
                setIsScanning(false);
              }}
              className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors"
              aria-label="スキャン中止"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Viewfinder Window */}
          <div className="w-full max-w-xs aspect-square relative rounded-3xl overflow-hidden border-2 border-orange-400/80 shadow-2xl flex items-center justify-center bg-stone-900">
            {/* Live Video Feed if available */}
            <video
              ref={videoRef}
              playsInline
              autoPlay
              muted
              className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Corner Target Markers */}
            <div className="absolute inset-4 border-2 border-orange-400/50 rounded-2xl pointer-events-none flex flex-col justify-between p-2">
              <div className="flex justify-between">
                <span className="w-5 h-5 border-t-4 border-l-4 border-orange-400 -mt-1 -ml-1" />
                <span className="w-5 h-5 border-t-4 border-r-4 border-orange-400 -mt-1 -mr-1" />
              </div>
              {/* Animated scan bar */}
              <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-orange-400 to-transparent animate-pulse" />
              <div className="flex justify-between">
                <span className="w-5 h-5 border-b-4 border-l-4 border-orange-400 -mb-1 -ml-1" />
                <span className="w-5 h-5 border-b-4 border-r-4 border-orange-400 -mb-1 -mr-1" />
              </div>
            </div>

            {/* Camera message if error */}
            {cameraError && (
              <div className="relative z-10 p-4 text-center bg-black/70 rounded-xl m-4 text-stone-200 text-xs leading-relaxed">
                <p>{cameraError}</p>
              </div>
            )}
          </div>

          {/* Bottom Actions & Instant Demo Trigger */}
          <div className="w-full max-w-sm space-y-3 pb-4">
            <p className="text-center text-xs text-stone-300">
              枠内にQRコードを合わせてください
            </p>

            {/* Simulation button for demo / non-camera testing */}
            <button
              onClick={() => handleExecuteStamp('受付カウンター 来館QR')}
              className="w-full py-3.5 px-4 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all min-h-[44px]"
            >
              <RefreshCw className="w-4 h-4" />
              <span>【テスト／デモ用】受付QRを即時読取</span>
            </button>

            <button
              onClick={() => handleExecuteStamp('絵本コーナー チェックインQR')}
              className="w-full py-2.5 px-4 rounded-xl bg-white/15 hover:bg-white/25 text-white font-medium text-xs flex items-center justify-center gap-2 transition-colors min-h-[44px]"
            >
              <span>【テスト用】絵本コーナーQRを読取</span>
            </button>
          </div>
        </div>
      )}

      {/* Stamp Success Celebration Modal */}
      {lastStampResult?.show && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setLastStampResult(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl border border-stone-200 relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Rubber Stamp graphic */}
            <div className="w-20 h-20 mx-auto rounded-full bg-orange-100 border-4 border-orange-500 flex items-center justify-center text-orange-600 mb-4 animate-stamp-pop">
              <Sparkles className="w-10 h-10" />
            </div>

            <h3 className="text-lg font-black text-stone-900 mb-1">
              {lastStampResult.bonus ? '🎉 10個コンプリート達成！' : 'スタンプ獲得！ポンッ！'}
            </h3>

            <p className="text-xs text-stone-500 mb-3">
              ぽかぽか広場へのご来館ありがとうございます！
            </p>

            <div className="bg-amber-50 rounded-2xl p-3.5 border border-amber-200 mb-4">
              <span className="text-xs text-amber-800">獲得ポイント</span>
              <div className="text-2xl font-black text-orange-600 tabular-nums">
                +{lastStampResult.pointsAdded} <span className="text-xs">pt</span>
              </div>
              {lastStampResult.bonus && (
                <p className="text-[11px] font-bold text-amber-900 mt-1">
                  ★10個達成ゴールボーナス30ptを含みます！
                </p>
              )}
            </div>

            <div className="space-y-2">
              <button
                onClick={() => {
                  sound.playTap();
                  setLastStampResult(null);
                  setActiveTab('rewards');
                }}
                className="w-full py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs transition-colors min-h-[44px]"
              >
                ごほうび交換所を見に行く
              </button>
              <button
                onClick={() => {
                  sound.playTap();
                  setLastStampResult(null);
                }}
                className="w-full py-2.5 rounded-xl text-stone-600 hover:bg-stone-100 font-medium text-xs transition-colors min-h-[44px]"
              >
                とじる
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stamp History List */}
      <div className="bg-white rounded-2xl p-4 border border-stone-200/80 space-y-3">
        <h3 className="text-xs font-bold text-stone-800">最近のスタンプ獲得履歴</h3>
        {userProfile.stampHistory.length === 0 ? (
          <p className="text-xs text-stone-400 py-3 text-center">まだ履歴はありません</p>
        ) : (
          <div className="divide-y divide-stone-100">
            {userProfile.stampHistory.slice(0, 5).map((record) => (
              <div key={record.id} className="py-2.5 flex items-center justify-between text-xs">
                <div>
                  <p className="font-semibold text-stone-800">{record.locationName}</p>
                  <p className="text-[10px] text-stone-400 tabular-nums">{record.timestamp}</p>
                </div>
                <span className="font-bold text-orange-600 tabular-nums">
                  +{record.pointsEarned} pt
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
