/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Player, AchievementItem } from '../types';
import { ACHIEVEMENTS } from '../data/gameData';
import { sound } from './SoundManager';
import { motion } from 'motion/react';
import { Award, CheckCircle, Flame, Star, Zap, Check } from 'lucide-react';

interface AchievementsPageProps {
  player: Player;
  onClaimAchievement: (achievementId: string) => void;
  onEquipTitle: (title: string) => void;
}

export default function AchievementsPage({ player, onClaimAchievement, onEquipTitle }: AchievementsPageProps) {
  
  const handleClaim = (achId: string) => {
    sound.playReward();
    sound.playLevelUp();
    onClaimAchievement(achId);
  };

  const handleTitleEquip = (title: string) => {
    sound.playClick();
    onEquipTitle(title);
  };

  // Hàm tính tiến trình tích lũy thực tế của người chơi cho từng loại thành tích
  const getProgressVal = (ach: AchievementItem) => {
    switch (ach.type) {
      case 'questions':
        // Đếm số câu hỏi thực tế đã giải (ở đây xem mốc EXP / 15 làm cơ sở giải đố giả định, hoặc lấy biến lưu cụ thể từ state của App nếu có)
        // Chúng ta sẽ lấy dữ liệu giải câu từ state `player.completedStages` (mỗi màn vượt qua được xem là đã đúng ít nhất 2 câu hỏi)
        const totalCompletedStages = Object.values(player.completedStages).reduce((a, b) => a + b, 0);
        return totalCompletedStages * 3; // Giả định mỗi màn trả lời đúng 3 câu
      case 'attendance':
        return player.totalDays;
      case 'boss_kills':
        // Đếm số lượng màn chơi thứ 15 đã được vượt qua
        return Object.values(player.completedStages).filter(stagesCompleted => stagesCompleted >= 15).length;
      case 'level':
        return player.level;
      default:
        return 0;
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto" id="achievements-wrapper">
      
      {/* Khung Tiêu Đề */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-black text-indigo-950 font-sans tracking-wide uppercase flex items-center justify-center gap-2">
          🎖️ THÀNH TÍCH ĐẠT ĐƯỢC
        </h2>
        <p className="text-sm text-slate-700 mt-1 font-medium">
          Luyện tập chăm chỉ, hoàn chỉnh học thuật để mở khóa các huân chương vinh phong và danh xưng độc nhất vô nhị!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="achievements-main-grid">
        
        {/* CỘT TRÁI: DANH SÁCH HUÂN CHƯƠNG THÀNH TÍCH (Col-span-8) */}
        <div className="lg:col-span-8 space-y-3.5" id="achievements-list">
          {ACHIEVEMENTS.map((ach) => {
            const currentVal = getProgressVal(ach);
            const percentage = Math.min(100, Math.floor((currentVal / ach.target) * 100));
            const isFinished = currentVal >= ach.target;
            const claimed = player.achievements.includes(ach.id);

            return (
              <div
                key={ach.id}
                className={`p-4 bg-white/55 backdrop-blur-md border rounded-2xl flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between transition ${
                  claimed
                    ? 'border-white/30 bg-white/30 opacity-70 shadow-none'
                    : isFinished
                    ? 'border-amber-300 bg-amber-50/75 shadow-md'
                    : 'border-white/40'
                }`}
                id={`achievement-card-${ach.id}`}
              >
                <div className="flex-1 w-full">
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <div>
                      <h3 className="font-extrabold text-sm text-indigo-950 leading-tight flex items-center gap-1.5">
                        <Award className={`w-4 h-4 ${isFinished ? 'text-amber-600 fill-amber-500/20' : 'text-slate-400'}`} />
                        {ach.name}
                      </h3>
                      <p className="text-xs text-slate-600 font-sans mt-0.5 leading-tight font-medium">
                        {ach.description}
                      </p>
                    </div>
                    <span className="font-mono text-xs font-black text-amber-700 shrink-0">
                      {currentVal}/{ach.target}
                    </span>
                  </div>

                  {/* Thanh trượt tiến trình */}
                  <div className="w-full h-1.5 bg-slate-100 rounded-full border border-slate-200 overflow-hidden mb-2">
                    <div
                      className={`h-full rounded-full transition-all ${isFinished ? 'bg-amber-550 bg-amber-500' : 'bg-indigo-600'}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>

                  {/* Phần quà */}
                  <div className="flex flex-wrap gap-2 text-[9px] font-mono uppercase font-black text-slate-500">
                    <span>Thưởng mốc:</span>
                    <span className="text-amber-800">🪙 +{ach.rewardGold} Vàng</span>
                    <span className="text-rose-600">💎 +{ach.rewardGem} KC</span>
                    {ach.rewardTitle && (
                      <span className="text-indigo-850 font-sans lowercase italic">Danh hiệu: "{ach.rewardTitle}"</span>
                    )}
                  </div>
                </div>

                <div className="shrink-0 w-full sm:w-auto text-right">
                  {claimed ? (
                    <span className="inline-flex items-center gap-1 bg-emerald-100 border border-emerald-200 text-emerald-700 font-black text-xs px-4 py-2 rounded-xl select-none cursor-default">
                      ✔ ĐÃ NHẬN
                    </span>
                  ) : isFinished ? (
                    <button
                      onClick={() => handleClaim(ach.id)}
                      className="w-full sm:w-auto px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black tracking-wider uppercase rounded-xl text-xs shadow-md border border-indigo-505 cursor-pointer"
                    >
                      🎁 Nhận Thưởng
                    </button>
                  ) : (
                    <span className="inline-flex items-center gap-1 bg-slate-100 border border-slate-200 text-slate-500 text-xs px-4 py-2 rounded-xl select-none font-bold cursor-default">
                      Chưa đạt
                    </span>
                  )}
                </div>

              </div>
            );
          })}
        </div>

        {/* CỘT PHẢI: TRANG BỊ DANH HIỆU LẤP LÁNH (Col-span-4) */}
        <div className="lg:col-span-4 bg-white/55 backdrop-blur-md border border-white/50 rounded-3xl p-5 flex flex-col justify-between shadow-md" id="equipped-titles-box">
          <div>
            <h3 className="font-extrabold text-sm text-indigo-950 uppercase tracking-wider mb-4 border-b border-white/45 pb-2 flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-rose-600 animate-pulse" /> DANH HIỆU KHẢ DỤNG
            </h3>

            <p className="text-xs text-slate-600 leading-normal font-sans font-medium mb-4">
              Nhấp chọn danh hiệu em muốn hiển thị bên cạnh tên nhân vật để mọi người cùng khen ngợi:
            </p>

            {/* Danh sách các title đã unlocked */}
            <div className="space-y-2.5 max-h-[250px] overflow-y-auto pr-1 custom-scrollbar" id="unlocked-titles-list">
              {player.unlockedTitles.map((title) => {
                const isActive = player.title === title;
                return (
                  <button
                    key={title}
                    onClick={() => handleTitleEquip(title)}
                    className={`w-full p-3 rounded-xl border-2 text-left text-xs font-sans transition flex items-center justify-between cursor-pointer ${
                      isActive
                        ? 'border-amber-400 bg-amber-50/75 text-amber-855 text-amber-800 font-black'
                        : 'border-white/30 bg-white/35 text-slate-700 hover:border-slate-350 hover:bg-white/50'
                    }`}
                  >
                    <span className="truncate max-w-[150px] font-bold">🏆 {title}</span>
                    {isActive ? (
                      <span className="bg-amber-400 text-slate-950 text-[8px] px-1 rounded uppercase font-black tracking-tight shrink-0">
                        ĐANG ĐEO
                      </span>
                    ) : (
                      <span className="text-[9px] text-slate-500 hover:text-slate-800 uppercase tracking-tight shrink-0 font-bold">
                        Đổi
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="bg-white/40 p-3.5 rounded-2xl border border-white/45 text-[10px] text-slate-500 italic mt-6 font-sans font-semibold shadow-inner">
            * Danh xưng đặc biệt giúp tăng thêm uy thế và tự tin của dũng sĩ tại các lớp học Sao Việt!
          </div>
        </div>

      </div>
    </div>
  );
}
