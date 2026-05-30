/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Player, Region } from '../types';
import { REGIONS } from '../data/gameData';
import { sound } from './SoundManager';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, Star, Play, X, Swords } from 'lucide-react';

interface WorldMapProps {
  player: Player;
  onSelectStage: (regionId: string, stageNumber: number, isBoss: boolean) => void;
}

const REGION_THEMATIC_IMAGES: Record<string, string> = {
  region_1: '🌲',
  region_2: '🏰',
  region_3: '❄️',
  region_4: '🌋',
  region_5: '🐉',
  region_6: '🤖'
};

export default function WorldMap({ player, onSelectStage }: WorldMapProps) {
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);

  const handleRegionClick = (region: Region) => {
    sound.playClick();
    if (player.level < region.minLevel) {
      // Đang khóa
      return;
    }
    setSelectedRegion(region);
  };

  const handleStageClick = (regionId: string, stageNum: number) => {
    sound.playClick();
    const isBoss = stageNum === 15;
    // Đóng popup trước khi chuyển
    setSelectedRegion(null);
    onSelectStage(regionId, stageNum, isBoss);
  };

  const getCompletedStagesForRegion = (regionId: string) => {
    return player.completedStages[regionId] || 0;
  };

  return (
    <div className="p-4" id="world-map-wrapper">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-black text-indigo-950 font-sans tracking-wide uppercase flex items-center justify-center gap-2">
          🗺️ BẢN ĐỒ THẾ GIỚI PHIÊU LƯU
        </h2>
        <p className="text-sm text-indigo-900/80 mt-1 font-medium">
          Lựa chọn vùng đất kiến thức tương ứng với cấp độ của em để vượt ải và diệt Boss!
        </p>
      </div>

      {/* Grid 6 vùng đất */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" id="regions-grid">
        {REGIONS.map((region) => {
          const isUnlocked = player.level >= region.minLevel;
          const completedNum = getCompletedStagesForRegion(region.id);
          const icon = REGION_THEMATIC_IMAGES[region.id] || '🗺️';

          return (
            <motion.div
              key={region.id}
              whileHover={isUnlocked ? { y: -5, scale: 1.02 } : {}}
              className={`relative rounded-2xl border overflow-hidden shadow-lg flex flex-col justify-between transition-colors duration-200 ${
                isUnlocked
                  ? 'bg-white/45 backdrop-blur-md border-white/50 cursor-pointer hover:bg-white/60 hover:border-indigo-400/50'
                  : 'bg-white/15 backdrop-blur-sm border-white/20 opacity-60'
              }`}
              onClick={() => handleRegionClick(region)}
              id={`region-card-${region.id}`}
            >
              <div className="p-5">
                {/* Header vùng */}
                <div className="flex justify-between items-start gap-2 mb-3">
                  <h3 className="font-extrabold text-lg text-indigo-950 font-sans truncate">
                    {region.name}
                  </h3>
                  {isUnlocked ? (
                    <span className="bg-indigo-600/10 text-indigo-800 font-black font-mono text-xs px-2 py-0.5 rounded border border-indigo-500/20 shrink-0">
                      Lvl {region.minLevel}+
                    </span>
                  ) : (
                    <span className="bg-rose-100 text-rose-700 font-black font-mono text-xs px-2 py-0.5 rounded border border-rose-300 shrink-0 flex items-center gap-1">
                      <Lock className="w-3 h-3" /> Cần cấp {region.minLevel}
                    </span>
                  )}
                </div>

                {/* Body vùng */}
                <div className="flex items-center gap-4 py-2">
                  <span className="text-5xl filter drop-shadow select-none">
                    {icon}
                  </span>
                  <p className="text-xs text-slate-700 font-medium leading-relaxed font-sans line-clamp-3">
                    {region.description}
                  </p>
                </div>
              </div>

              {/* Footer vùng */}
              <div className="bg-white/30 px-5 py-3 border-t border-white/40 flex justify-between items-center transition-colors">
                {isUnlocked ? (
                  <>
                    <div className="flex items-center gap-1.5 text-amber-600" title="Tổng số màn chơi đã vượt">
                      <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                      <span className="font-mono text-xs font-black text-slate-600">
                        Tiến trình: <strong className="text-indigo-900">{completedNum}/15</strong>
                      </span>
                    </div>
                    <span className="text-xs text-indigo-700 font-extrabold flex items-center gap-1 group">
                      KHÁM PHÁ <Play className="w-3 h-3 group-hover:translate-x-0.5 transition" />
                    </span>
                  </>
                ) : (
                  <div className="text-[11px] text-rose-700 font-bold italic flex items-center gap-1">
                    🔒 Hãy tích lũy thêm EXP để mở khóa vùng này!
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* POPUP CHỌN MÀN CHƠI (STAGE SELECT) */}
      <AnimatePresence>
        {selectedRegion && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4" id="stage-select-overlay">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="w-full max-w-2xl bg-white/85 backdrop-blur-xl border border-white rounded-3xl relative shadow-2xl p-6"
              id="stage-select-box"
            >
              {/* Nút đóng */}
              <button
                onClick={() => {
                  sound.playClick();
                  setSelectedRegion(null);
                }}
                className="absolute top-4 right-4 text-slate-500 hover:text-slate-900 bg-white/60 p-1.5 rounded-full hover:bg-white border border-slate-200 transition cursor-pointer"
                aria-label="Đóng popup chọn màn"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="mb-6">
                <span className="text-sm font-mono text-indigo-600 uppercase font-black tracking-wider">Hành trình chi tiết của</span>
                <h3 className="text-2xl font-black text-indigo-950 mt-1">
                  {selectedRegion.name}
                </h3>
                <p className="text-xs text-slate-600 mt-1 font-sans font-medium">
                  Nhấp chọn các màn chơi để trả lời kiến thức. Hãy hạ gục Boss ở ải 15 để cứu lấy xứ sở này!
                </p>
              </div>

              {/* Grid 15 màn chơi */}
              <div className="grid grid-cols-5 gap-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar" id="stages-grid-sub">
                {Array.from({ length: 15 }).map((_, idx) => {
                  const stageNum = idx + 1;
                  const isBoss = stageNum === 15;
                  const completedNum = getCompletedStagesForRegion(selectedRegion.id);
                  
                  // Quy tắc mở màn chơi:
                  // Màn 1 luôn mở. Màn n mở nếu màn (n-1) đã hoàn thành (completedNum >= n-1).
                  const isStageUnlocked = stageNum === 1 || completedNum >= (stageNum - 1);
                  const isStageCompleted = completedNum >= stageNum;

                  return (
                    <button
                      key={stageNum}
                      disabled={!isStageUnlocked}
                      onClick={() => handleStageClick(selectedRegion.id, stageNum)}
                      className={`h-16 rounded-xl flex flex-col items-center justify-center border transition relative cursor-pointer transform hover:scale-105 active:scale-95 duration-100 disabled:pointer-events-none ${
                        isBoss
                          ? isStageUnlocked
                            ? 'bg-rose-100 border-rose-400 text-rose-800 animate-pulse hover:bg-rose-200 hover:text-rose-900'
                            : 'bg-white/20 border-white/40 text-slate-400'
                          : isStageCompleted
                          ? 'bg-emerald-100 border-emerald-400 text-emerald-800 font-extrabold hover:bg-emerald-200'
                          : isStageUnlocked
                          ? 'bg-white/80 border-indigo-400/40 text-indigo-900 font-black hover:bg-white'
                          : 'bg-white/20 border-white/10 text-slate-400'
                      }`}
                      title={isBoss ? `Boss cuối: ${selectedRegion.bossName}` : `Màn chơi ${stageNum}`}
                    >
                      {isBoss ? (
                        <>
                          <Swords className="w-5 h-5 mb-0.5" />
                          <span className="text-[10px] font-black uppercase tracking-tighter">BOSS</span>
                        </>
                      ) : (
                        <>
                          <span className="text-lg font-mono font-black">{stageNum}</span>
                          {isStageCompleted && (
                            <span className="absolute bottom-1 right-1 text-emerald-600 font-black text-[10px]" title="Đã qua ải">
                              ✔
                            </span>
                          )}
                        </>
                      )}

                      {!isStageUnlocked && (
                        <div className="absolute inset-0 bg-white/40 rounded-xl flex items-center justify-center">
                          <Lock className="w-4 h-4 text-slate-400" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="mt-6 pt-4 border-t border-slate-200 text-right">
                <p className="text-[11px] text-indigo-700/95 font-bold italic">
                  * Trả lời chính xác câu hỏi để tiếp tục tiến lên màn tiếp theo!
                </p>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
