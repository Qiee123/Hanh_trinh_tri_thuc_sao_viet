/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Player, Quest } from '../types';
import { sound } from './SoundManager';
import { motion } from 'motion/react';
import { CheckCircle, Clock, Play, Award, CheckCircle2 } from 'lucide-react';

interface DailyQuestsProps {
  player: Player;
  quests: Quest[];
  onClaimQuestReward: (questId: string) => void;
  onGoToTask: (actionType: 'math' | 'typing' | 'english' | 'attendance') => void;
}

export default function DailyQuests({ player, quests, onClaimQuestReward, onGoToTask }: DailyQuestsProps) {
  
  const handleClaim = (qId: string) => {
    sound.playReward();
    onClaimQuestReward(qId);
  };

  const handleActionClick = (cat: 'math' | 'typing' | 'english' | 'attendance') => {
    sound.playClick();
    onGoToTask(cat);
  };

  return (
    <div className="p-4 max-w-4xl mx-auto" id="daily-quests-wrapper">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-black text-indigo-950 font-sans tracking-wide uppercase flex items-center justify-center gap-2">
          📜 BẢNG NHIỆM VỤ CHUYÊN CẦN HẰNG NGÀY
        </h2>
        <p className="text-sm text-slate-705 mt-1 font-medium text-slate-700">
          Hoàn thành các nhiệm vụ học thuật để nhận sách EXP thăng cấp và hòm kho vàng phong phú!
        </p>
      </div>

      <div className="space-y-4" id="quests-list-container">
        {quests.filter(q => !q.claimed).map((q) => {
          const percentage = Math.min(100, Math.floor((q.progress / q.target) * 100));
          const isFinished = q.progress >= q.target;

          return (
            <div
              key={q.id}
              className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-add items-center justify-between gap-4 transition-colors ${
                q.claimed
                  ? 'border-white/20 bg-white/10 opacity-60'
                  : isFinished
                  ? 'border-emerald-300 bg-emerald-50/90 shadow-sm'
                  : 'border-white/50 bg-white/55 hover:bg-white/65 shadow-md shadow-white/5'
              }`}
              id={`quest-card-${q.id}`}
            >
              <div className="flex-1 w-full text-slate-900">
                {/* Tiêu đề nhiệm vụ */}
                <div className="flex justify-between items-start gap-2 mb-2">
                  <h3 className="font-exrabold font-bold text-sm text-indigo-950 leading-tight">
                    {q.description}
                  </h3>
                  <span className="font-mono text-xs font-black text-indigo-950 shrink-0">
                    {q.progress}/{q.target}
                  </span>
                </div>

                {/* Thanh tiến trình */}
                <div className="w-full h-2 bg-white/45 rounded-full border border-white/45 overflow-hidden relative mb-2 shadow-inner">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.4 }}
                    className={`h-full rounded-full ${isFinished ? 'bg-emerald-500' : 'bg-indigo-600'}`}
                  />
                </div>

                {/* Phần quà nhận được */}
                <div className="flex flex-wrap gap-2 text-[10px] font-mono font-black uppercase text-slate-600">
                  <span className="text-slate-500 font-bold">Phần thưởng:</span>
                  <span className="text-amber-700">🪙 +{q.rewardGold} vàng</span>
                  <span className="text-indigo-800">⚡ +{q.rewardExp} EXP</span>
                  {q.rewardGem && <span className="text-rose-600">💎 +{q.rewardGem} KC</span>}
                </div>
              </div>

              {/* Nút thao tát bên phải */}
              <div className="shrink-0 w-full sm:w-auto text-right">
                {q.claimed ? (
                  <span className="inline-flex items-center justify-center gap-1 bg-white/40 text-slate-400 text-xs px-4 py-2 rounded-xl border border-white/20 font-bold select-none cursor-default w-full sm:w-auto">
                    <CheckCircle className="w-4 h-4 text-slate-350" /> ĐÃ NHẬN
                  </span>
                ) : isFinished ? (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleClaim(q.id)}
                    className="w-full sm:w-auto px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-black tracking-wider uppercase rounded-xl text-xs shadow-lg shadow-emerald-250 cursor-pointer"
                  >
                    🎁 Nhận quà
                  </motion.button>
                ) : (
                  <button
                    onClick={() => handleActionClick(q.category)}
                    className="w-full sm:w-auto px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 border border-indigo-500 text-white shadow-md text-xs font-black tracking-wider uppercase rounded-xl flex items-center justify-center gap-1 cursor-pointer transition"
                  >
                    <Play className="w-3 h-3 fill-white text-white" /> Tiến hành
                  </button>
                )}
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
}
