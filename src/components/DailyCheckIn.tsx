/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Player } from '../types';
import { sound } from './SoundManager';
import { motion } from 'motion/react';
import { Calendar, Check, Gift, Star, Award, Sparkles, Clock } from 'lucide-react';

interface DailyCheckInProps {
  player: Player;
  onCheckIn: () => void;
}

export default function DailyCheckIn({ player, onCheckIn }: DailyCheckInProps) {
  const [timeLeftStr, setTimeLeftStr] = useState<string>('');
  const [cooldownActive, setCooldownActive] = useState<boolean>(false);

  const calendarRewards = [
    { day: 1, type: 'gold', amount: 10, icon: '🪙' },
    { day: 2, type: 'gold', amount: 20, icon: '🪙' },
    { day: 3, type: 'gold', amount: 30, icon: '🪙' },
    { day: 4, type: 'gold', amount: 40, icon: '🪙' },
    { day: 5, type: 'gold', amount: 50, icon: '🪙' },
    { day: 6, type: 'gold', amount: 60, icon: '🪙' },
    { day: 7, type: 'mystery', amount: 0, title: 'Rương Bí Mật', icon: '🎁' },
    { day: 14, type: 'pet', amount: 0, title: 'Cáo Tri Thức', icon: '🦊' },
    { day: 30, type: 'title', amount: 0, title: 'Giáo Hoàng Chuyên Cần', icon: '👑' }
  ];

  useEffect(() => {
    const updateCountdown = () => {
      if (!player.lastCheckInDate) {
        setCooldownActive(false);
        setTimeLeftStr('');
        return;
      }

      const lastCheckInTime = new Date(player.lastCheckInDate).getTime();
      const currentTime = Date.now();
      const timePassed = currentTime - lastCheckInTime;
      const cooldownMs = 24 * 60 * 60 * 1000; // 24 hours

      if (timePassed < cooldownMs) {
        setCooldownActive(true);
        const remainingMs = cooldownMs - timePassed;
        const hours = Math.floor(remainingMs / (1000 * 60 * 60));
        const minutes = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((remainingMs % (1000 * 60)) / 1000);
        setTimeLeftStr(
          `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
        );
      } else {
        setCooldownActive(false);
        setTimeLeftStr('');
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [player.lastCheckInDate, player.checkedInToday]);

  const handleInteract = () => {
    if (player.checkedInToday || cooldownActive) return;
    sound.playLevelUp();
    sound.playReward();
    onCheckIn();
  };

  const isDayChecked = (dayNum: number) => {
    // Nếu số ngày chuyên cần của người chơi >= dayNum thì coi như đã nhận quà mốc đó
    return player.totalDays >= dayNum;
  };

  return (
    <div className="p-4 max-w-4xl mx-auto" id="checkin-wrapper">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-black text-indigo-950 font-sans tracking-wide uppercase flex items-center justify-center gap-2">
          🗓️ ĐIỂM DANH CHUYÊN CẦN SAO VIỆT
        </h2>
        <p className="text-sm text-slate-700 mt-1 font-medium">
          Ghé thăm điểm danh mỗi buổi đi học tại Trung tâm để tích lũy chuỗi ngày liên mạch nhận Pet và Quà bí mật cực hiếm!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch" id="check-in-layout">
        
        {/* KHUNG NÚT BẤM TO GIỮA */}
        <div className="md:col-span-1 bg-white/55 backdrop-blur-md rounded-2xl border border-white/50 p-6 flex flex-col justify-between align-center text-center shadow-md">
          <div className="space-y-4">
            <h3 className="font-extrabold text-sm text-indigo-950 uppercase tracking-wider border-b border-white/40 pb-2">
              TRẠNG THÁI HÔM NAY
            </h3>

            <div className="py-2">
              <span className="text-6xl animate-bounce duration-4000 block">🗓️</span>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] text-slate-500 uppercase font-mono font-black block">Chuỗi chuyên cần hiện tại:</span>
              <span className="text-2xl font-mono font-black text-indigo-950">{player.consecutiveDays} Ngày liên tiếp</span>
              <span className="block text-[10px] text-slate-600 font-sans font-bold italic mt-1">Tổng điểm danh học tập: {player.totalDays} ngày</span>
            </div>
          </div>

          <div className="mt-6">
            {cooldownActive ? (
              <div className="space-y-2">
                <div aria-label="Hồi chiêu điểm danh" className="w-full py-3 px-2 bg-rose-50 border border-rose-200 text-rose-700 font-black tracking-wider uppercase rounded-xl text-[10px] flex flex-col items-center justify-center gap-1 leading-normal">
                  <div className="flex items-center gap-1 text-[11px]">
                    <Clock className="w-3.5 h-3.5 text-rose-600 animate-spin" style={{ animationDuration: '4s' }} /> CHỜ COOLDOWN 24H
                  </div>
                  <span className="text-sm font-mono tracking-widest">{timeLeftStr}</span>
                </div>
                <p className="text-[9px] text-slate-550 text-slate-500 font-medium">
                  Bé cần cách đủ 24 tiếng kể từ lần điểm danh trước để mở khóa mốc chuyên cần tiếp theo.
                </p>
              </div>
            ) : player.checkedInToday ? (
              <div aria-label="Đã điểm danh" className="w-full py-3.5 bg-white/40 border border-white/35 text-slate-400 font-black tracking-widest uppercase rounded-xl text-xs flex items-center justify-center gap-2 select-none">
                <Check className="w-4 h-4 text-emerald-600" /> BẠN ĐÃ ĐIỂM DANH
              </div>
            ) : (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleInteract}
                className="w-full py-3.5 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 text-white font-black tracking-widest uppercase rounded-xl text-xs cursor-pointer shadow-md"
              >
                🚀 ĐIỂM DANH NGAY 🚀
              </motion.button>
            )}
          </div>
        </div>

        {/* CỘT PHẢI: GRID CÁC NGÀY NHẬN QUÀ */}
        <div className="md:col-span-2 bg-white/55 backdrop-blur-md border border-white/50 rounded-2xl p-6 shadow-md" id="checkin-rewards-grid">
          <h3 className="font-extrabold text-sm text-indigo-950 uppercase tracking-wider mb-4 border-b border-white/45 pb-2">
            MỐC QUÀ TẶNG CHUYÊN CẦN
          </h3>

          <div className="grid grid-cols-3 gap-3" id="calendar-grid">
            {calendarRewards.map((reward) => {
              const checked = isDayChecked(reward.day);
              
              let cardStyle = 'border-white/50 bg-white/40 text-slate-700';
              if (checked) {
                cardStyle = 'border-emerald-300 bg-emerald-55 text-emerald-800 font-bold';
              } else if (reward.day === 7 || reward.day === 14 || reward.day === 30) {
                cardStyle = 'border-indigo-300 bg-indigo-50/70 text-indigo-950 animate-pulse';
              }

              return (
                <div
                  key={reward.day}
                  className={`p-3 rounded-2xl border flex flex-col items-center text-center justify-between transition min-h-[105px] relative overflow-hidden ${cardStyle}`}
                >
                  {/* Badge số ngày */}
                  <span className="text-[10px] font-mono leading-none tracking-tight font-extrabold uppercase text-slate-500">
                    Mốc Ngày {reward.day}
                  </span>

                  {/* Icon */}
                  <span className="text-2xl my-1 filter drop-shadow select-none">
                    {reward.icon}
                  </span>

                  {/* Nội dung phần quà */}
                  <div className="space-y-0.5 leading-none">
                    {reward.type === 'gold' && (
                      <span className="text-[10px] font-mono font-black text-amber-700">+{reward.amount} Vàng</span>
                    )}
                    {reward.type === 'mystery' && (
                      <span className="text-[9px] font-black text-teal-700 block truncate max-w-[85px]">{reward.title}</span>
                    )}
                    {reward.type === 'pet' && (
                      <span className="text-[9px] font-black text-rose-700 block truncate max-w-[85px]">{reward.title}</span>
                    )}
                    {reward.type === 'title' && (
                      <span className="text-[9px] font-black text-indigo-800 block truncate max-w-[85px]">{reward.title}</span>
                    )}
                  </div>

                  {/* Check-mark đã nhận */}
                  {checked && (
                    <div className="absolute top-1.5 right-1.5 bg-emerald-500 text-white rounded-full w-4.5 h-4.5 flex items-center justify-center border border-white text-[10px] font-black" title="Đã nhận">
                      ✓
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-4 pt-3 border-t border-white/45 text-[10px] leading-relaxed text-slate-500 font-sans flex items-start gap-1 font-medium">
            <Sparkles className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
            <p>
              * Chuỗi ngày liên tiếp tính bằng số lần điểm danh mỗi ngày không ngắt quãng. Hãy đi học đều để không bỏ lỡ phần quà Rương Bí Mật ngày thứ 7 nhé!
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
