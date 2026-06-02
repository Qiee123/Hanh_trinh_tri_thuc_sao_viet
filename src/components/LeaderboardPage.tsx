/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Player, Guild } from '../types';
import { SAMPLE_LEADERBOARD, GUILDS } from '../data/gameData';
import { sound } from './SoundManager';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Medal, Crown, Star, Shield, School } from 'lucide-react';

interface LeaderboardPageProps {
  player: Player;
  guildsList?: Guild[];
}

const SAMPLE_CLASSES = [
  { rank: 1, name: 'Lớp Scratch Cơ Bản - Sáng Thứ Bảy', members: 16, totalExp: 18400, activeRate: '95%' },
  { rank: 2, name: 'Lớp Thiết Kế PowerPoint - Tối Thứ Ba', members: 12, totalExp: 15450, activeRate: '90%' },
  { rank: 3, name: 'Lớp Lập Trình Python Thiếu Nhi - Chiều Chủ Nhật', members: 15, totalExp: 14200, activeRate: '88%' },
  { rank: 4, name: 'Lớp Tin Học Văn Phòng MOS - Tối Thứ Sáu', members: 10, totalExp: 12100, activeRate: '92%' }
];

export default function LeaderboardPage({ player, guildsList }: LeaderboardPageProps) {
  const [activeTab, setActiveTab] = useState<'individual' | 'class' | 'guild'>('individual');

  const displayGuilds = guildsList || GUILDS;
  const sortedGuilds = [...displayGuilds].sort((a, b) => b.totalExp - a.totalExp);

  // Gộp người chơi hiện tại vào danh sách xếp hạng cá nhân
  const getCombinedLeaderboard = () => {
    // Tìm xem người chơi có trong danh sách mẫu chưa
    const exists = SAMPLE_LEADERBOARD.some((l) => l.name === player.name);
    if (exists) return SAMPLE_LEADERBOARD;

    // Nếu chưa, thêm người chơi vào dựa trên kinh nghiệm thực tế
    const list = [...SAMPLE_LEADERBOARD];
    list.push({
      rank: 99, // Sẽ tính chính xác lại hạng sau khi sort
      name: player.name,
      archetype: player.archetype,
      level: player.level,
      exp: player.exp + player.level * 100, //ước tính EXP
      consecutiveDays: player.consecutiveDays,
      guildName:  'Tân Binh',
      isCurrentUser: true
    });

    // Sắp xếp giảm dần theo level rồi đến EXP
    list.sort((a, b) => {
      if (b.level !== a.level) return b.level - a.level;
      return b.exp - a.exp;
    });

    // Gán lại rank chính xác sau sắp xếp
    return list.map((item, index) => ({
      ...item,
      rank: index + 1
    }));
  };

  const usersList = getCombinedLeaderboard();
  const currentUserRankEntry = usersList.find((u) => u.name === player.name || u.isCurrentUser);
  const myRank = currentUserRankEntry ? currentUserRankEntry.rank : 8;

  const handleTabChange = (tab: 'individual' | 'class' | 'guild') => {
    sound.playClick();
    setActiveTab(tab);
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) return <Crown className="w-5 h-5 text-yellow-500 fill-yellow-500 animate-bounce" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-zinc-300 fill-zinc-300" />;
    if (rank === 3) return <Medal className="w-5 h-5 text-amber-600 fill-amber-600" />;
    return <span className="text-xs font-mono font-black text-zinc-500">{rank}</span>;
  };

  const getArchetypeIcon = (arch: any) => {
    if (arch === 'warrior') return '👦';
    if (arch === 'mage') return '👧';
    if (arch === 'stem') return '🧑‍🔬';
    return '🥷';
  };

  return (
    <div className="p-4 max-w-4xl mx-auto" id="leaderboard-wrapper">
      
      {/* Khung tiêu đề */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-black text-indigo-950 font-sans tracking-wide uppercase flex items-center justify-center gap-2">
          <Trophy className="w-6 h-6 text-yellow-500 fill-yellow-500 animate-pulse" /> BẢNG VÀNG DANH DỰ SAO VIỆT
        </h2>
        <p className="text-sm text-slate-700 mt-1 font-medium">
          Nơi vinh danh những dũng sĩ thám hiểm có thành tích học tập vượt trội, đi học siêng năng đúng giờ nhất!
        </p>
      </div>

      {/* Tabs chuyển đổi */}
      <div className="flex justify-center gap-2.5 mb-6" id="leaderboard-tabs">
        <button
          onClick={() => handleTabChange('individual')}
          className={`px-4.5 py-2.5 rounded-xl font-black text-xs uppercase cursor-pointer transition border ${
            activeTab === 'individual'
              ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
              : 'bg-white/50 border-white/35 text-slate-705 hover:bg-white/60 hover:text-indigo-950'
          }`}
        >
          👤 Cá Nhân
        </button>
        <button
          onClick={() => handleTabChange('class')}
          className={`px-4.5 py-2.5 rounded-xl font-black text-xs uppercase cursor-pointer transition border ${
            activeTab === 'class'
              ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
              : 'bg-white/50 border-white/35 text-slate-705 hover:bg-white/60 hover:text-indigo-950'
          }`}
        >
          🏫 Lớp học
        </button>
        <button
          onClick={() => handleTabChange('guild')}
          className={`px-4.5 py-2.5 rounded-xl font-black text-xs uppercase cursor-pointer transition border ${
            activeTab === 'guild'
              ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
              : 'bg-white/50 border-white/35 text-slate-705 hover:bg-white/60 hover:text-indigo-950'
          }`}
        >
          🛡️ Bang Hội
        </button>
      </div>

      <div className="bg-white/55 backdrop-blur-md border border-white/50 rounded-3xl p-5 shadow-md" id="leaderboard-body-box">
        <AnimatePresence mode="wait">
          
          {/* TAB 1: CÁ NHÂN */}
          {activeTab === 'individual' && (
            <motion.div
              key="individual-view"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="space-y-2.5"
            >
              <div className="grid grid-cols-12 text-[10px] font-mono font-black text-slate-500 px-3 uppercase tracking-wider border-b border-indigo-100 pb-2">
                <span className="col-span-1">Hạng</span>
                <span className="col-span-5">Tên Học Viên</span>
                <span className="col-span-2 text-center">Cấp độ</span>
                <span className="col-span-2 text-center">Chuỗi ngày</span>
                <span className="col-span-2 text-right">Biệt đội</span>
              </div>

              <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1.5 custom-scrollbar" id="leaderboard-list">
                {usersList.map((entry) => {
                  const isCur = entry.name === player.name || entry.isCurrentUser;
                  return (
                    <div
                      key={entry.rank}
                      className={`grid grid-cols-12 items-center p-3 rounded-xl border text-xs font-sans transition ${
                        isCur
                          ? 'border-indigo-300 bg-indigo-50/75 text-indigo-950 font-extrabold shadow-md'
                          : 'border-white/30 bg-white/30 text-slate-800 hover:border-slate-200'
                      }`}
                    >
                      <div className="col-span-1 flex items-center justify-start">
                        {getRankBadge(entry.rank)}
                      </div>
                      <div className="col-span-5 flex items-center gap-2 truncate">
                        <span className="text-lg select-none">{getArchetypeIcon(entry.archetype)}</span>
                        <span className="truncate font-bold text-indigo-950">{entry.name}</span>
                        {isCur && <span className="bg-indigo-600 text-white font-mono text-[9px] px-1 rounded uppercase font-black">BẠN</span>}
                      </div>
                      <div className="col-span-2 text-center font-mono font-black text-indigo-900">
                        Cấp {entry.level}
                      </div>
                      <div className="col-span-2 text-center font-mono font-extrabold text-orange-650">
                        🔥 {entry.consecutiveDays}
                      </div>
                      <div className="col-span-2 text-right text-[11px] text-slate-550 truncate font-semibold">
                        {entry.guildName || 'Tân binh'}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* TAB 2: LỚP HỌC */}
          {activeTab === 'class' && (
            <motion.div
              key="class-view"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="space-y-3"
            >
              <div className="grid grid-cols-12 text-[10px] font-mono font-black text-slate-500 px-3 uppercase tracking-wider border-b border-indigo-100 pb-2">
                <span className="col-span-1">Hạng</span>
                <span className="col-span-6">Tên lớp tin học</span>
                <span className="col-span-2 text-center">Sĩ số</span>
                <span className="col-span-3 text-right">Tổng tích lũy EXP</span>
              </div>

              <div className="space-y-2">
                {SAMPLE_CLASSES.map((cls) => (
                  <div
                    key={cls.rank}
                    className="grid grid-cols-12 items-center p-3.5 rounded-xl border border-white/35 bg-white/30 text-xs font-sans text-slate-700"
                  >
                    <div className="col-span-1 flex items-center">
                      {getRankBadge(cls.rank)}
                    </div>
                    <div className="col-span-6 flex items-center gap-2 truncate font-extrabold text-indigo-950">
                      <School className="w-4 h-4 text-indigo-600" />
                      <span className="truncate">{cls.name}</span>
                    </div>
                    <div className="col-span-2 text-center font-mono font-bold">
                      {cls.members} Học viên
                    </div>
                    <div className="col-span-3 text-right font-mono text-indigo-700 font-extrabold">
                      ⚡ {cls.totalExp.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* TAB 3: BANG HỘI */}
          {activeTab === 'guild' && (
            <motion.div
              key="guild-view"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="space-y-3"
            >
              <div className="grid grid-cols-12 text-[10px] font-mono font-black text-slate-500 px-3 uppercase tracking-wider border-b border-indigo-100 pb-2">
                <span className="col-span-1">Hạng</span>
                <span className="col-span-5">Biệt Đội / Bang hội</span>
                <span className="col-span-2 text-center">Thủ lĩnh</span>
                <span className="col-span-2 text-center">Thành viên</span>
                <span className="col-span-2 text-right">Điểm thi đua</span>
              </div>

              <div className="space-y-2">
                {sortedGuilds.map((guild, idx) => {
                  const rank = idx + 1;
                  return (
                    <div
                      key={guild.id}
                      className="grid grid-cols-12 items-center p-3.5 rounded-xl border border-white/35 bg-white/30 text-xs font-sans text-slate-700 hover:border-slate-200"
                    >
                      <div className="col-span-1 flex items-center">
                        {getRankBadge(rank)}
                      </div>
                      <div className="col-span-5 flex items-center gap-2 truncate font-extrabold text-indigo-950">
                        <span className="text-xl filter drop-shadow">{guild.logo}</span>
                        <span className="truncate">{guild.name}</span>
                      </div>
                      <div className="col-span-2 text-center text-slate-600 font-bold">
                        {guild.leader}
                      </div>
                      <div className="col-span-2 text-center font-mono text-slate-650 font-bold">
                        {guild.membersCount} bạn
                      </div>
                      <div className="col-span-2 text-right font-mono font-black text-rose-600">
                        🛡️ {guild.totalExp.toLocaleString()}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* FOOTER HIỂN THỊ HẠNG CÁ NHÂN CỦA BẠN */}
      <div className="bg-white/55 backdrop-blur-md border border-white/50 px-5 py-4 rounded-3xl mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 font-sans shadow-md" id="leaderboard-personal-summary">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-amber-100 rounded-xl border border-amber-200 flex items-center justify-center text-2xl">
            🏆
          </div>
          <div>
            <h4 className="text-slate-500 text-[10px] font-mono font-black uppercase leading-none">Vị trí thi đua của em:</h4>
            <p className="text-slate-800 text-md font-extrabold mt-1">
              Bạn đang xếp <strong className="text-indigo-950 font-black">Hạng #{myRank}</strong> toàn Học Viện!
            </p>
          </div>
        </div>

        <p className="text-[11px] text-slate-650 font-bold italic text-center sm:text-right font-sans leading-relaxed max-w-sm">
          * Hãy tiếp tục đi học đầy đủ đúng giờ và vượt thêm 15 ải Boss để gia tăng vị thứ thăng hạng của mình trên Bảng Vàng!
        </p>
      </div>

    </div>
  );
}
