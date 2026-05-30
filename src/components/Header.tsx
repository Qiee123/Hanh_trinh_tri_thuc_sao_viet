/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Player } from '../types';
import { sound } from './SoundManager';
import { motion } from 'motion/react';
import { 
  Volume2, 
  VolumeX, 
  Calendar, 
  Trophy, 
  Mail, 
  Users, 
  ShieldAlert, 
  Sparkles,
  Award
} from 'lucide-react';

interface HeaderProps {
  player: Player;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  unreadMailsCount: number;
  onMuteToggle: (isMuted: boolean) => void;
  isMuted: boolean;
}

export default function Header({
  player,
  activeTab,
  setActiveTab,
  unreadMailsCount,
  onMuteToggle,
  isMuted
}: HeaderProps) {

  const handleTabChange = (tab: string) => {
    sound.playClick();
    setActiveTab(tab);
  };

  const expPercentage = Math.min(100, Math.floor((player.exp / player.expToNextLevel) * 100));

  const getArchetypeLabel = (arch: typeof player.archetype) => {
    switch (arch) {
      case 'warrior': return 'Chiến Binh Tin Học';
      case 'mage': return 'Phù Thủy Toán Học';
      case 'stem': return 'Nhà Phát Minh STEM';
      case 'ninja': return 'Ninja Bàn Phím';
    }
  };

  const getArchetypeIcon = (arch: typeof player.archetype) => {
    switch (arch) {
      case 'warrior': return '⚔️';
      case 'mage': return '🔮';
      case 'stem': return '⚙️';
      case 'ninja': return '🥷';
    }
  };

  return (
    <header className="bg-white/45 backdrop-blur-md border-b border-white/45 p-4 sticky top-0 z-40 text-slate-900 shadow-md relative" id="game-header">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-4 items-center justify-between">
        
        {/* Góc trái: Hồ sơ nhân vật RPG */}
        <div className="flex items-center gap-4 w-full md:w-auto" id="profile-block">
          {/* Avatar container */}
          <div className="relative group">
            <div className="w-16 h-16 rounded-2xl bg-white/60 backdrop-blur-sm flex items-center justify-center text-4xl border border-white shadow relative z-10">
              {player.pet && (
                <span className="absolute -top-2 -left-2 text-xl filter drop-shadow animate-bounce">
                  🐉
                </span>
              )}
              {getArchetypeIcon(player.archetype)}
            </div>
            {/* Cột cấp độ */}
            <div className="absolute -bottom-2 -right-2 bg-indigo-600 text-white font-black text-xs px-2 py-0.5 rounded-md border border-white z-20 shadow-md">
              Lvl {player.level}
            </div>
          </div>

          <div className="flex-1 min-w-[200px]">
            <div className="flex items-center gap-2">
              <h2 className="font-black text-lg text-indigo-950 truncate max-w-[150px]" title={player.name}>
                {player.name}
              </h2>
              <span className="bg-indigo-600/10 text-indigo-800 text-[10px] font-black px-1.5 py-0.5 rounded border border-indigo-500/20">
                {getArchetypeLabel(player.archetype)}
              </span>
            </div>
            
            <div className="text-[11px] text-indigo-950/80 flex items-center gap-1 mt-0.5" title={player.title}>
              <Award className="w-3.5 h-3.5 text-amber-600" />
              <span className="truncate max-w-[180px] text-indigo-900 font-bold font-sans">
                {player.title}
              </span>
            </div>

            {/* Thanh kinh nghiệm EXP */}
            <div className="w-full mt-2" id="exp-container">
              <div className="flex justify-between text-[9px] text-slate-600 mb-0.5 font-mono">
                <span className="font-bold">EXP: {player.exp}/{player.expToNextLevel}</span>
                <span className="font-bold">{expPercentage}%</span>
              </div>
              <div className="w-full h-1.5 bg-white/50 rounded-full overflow-hidden border border-white/60 shadow-inner">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${expPercentage}%` }}
                  transition={{ duration: 0.5 }}
                  className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Giữa: Chào mừng đầy màu sắc & ví dặm vàng, kim cương */}
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto" id="stat-currency-block">
          <div className="flex items-center gap-3 bg-white/50 border border-white/60 shadow-sm px-4 py-2.5 rounded-2xl">
            {/* Vàng */}
            <div className="flex items-center gap-2 pr-3 border-r border-slate-350">
              <span className="text-xl animate-pulse">🪙</span>
              <div>
                <span className="block text-[8px] text-slate-500 uppercase font-mono font-black tracking-wider">VÀNG CHĂM CHỈ</span>
                <span className="font-mono font-black text-amber-700 text-sm">{player.gold.toLocaleString()}</span>
              </div>
            </div>
            {/* Kim cương */}
            <div className="flex items-center gap-2">
              <span className="text-xl">💎</span>
              <div>
                <span className="block text-[8px] text-slate-500 uppercase font-mono font-black tracking-wider">KIM CƯƠNG TRI THỨC</span>
                <span className="font-mono font-black text-rose-600 text-sm">{player.gem}</span>
              </div>
            </div>
          </div>

          {/* Lịch học & Số buổi học sinh */}
          <div className="hidden lg:flex flex-col items-start px-3.5 py-2 justify-center bg-white/60 border border-white/65 rounded-2xl max-w-[250px] shadow-sm">
            <div className="flex items-center gap-1 text-indigo-900 font-mono text-[9px] font-black tracking-widest leading-none uppercase">
              <Calendar className="w-3 h-3 text-indigo-600" /> LỊCH HỌC: {player.studyScheduleDays || '2-4-6'}
            </div>
            <div className="text-[10px] text-slate-800 font-bold font-sans mt-0.5 whitespace-nowrap truncate max-w-[220px]">
              {player.studyScheduleShift || 'Ca 1: 08:30 – 10:00'}
            </div>
            <div className="text-[9px] bg-indigo-50/80 text-indigo-800 px-2 py-0.5 rounded border border-indigo-100 font-black flex items-center gap-1 mt-1 font-sans">
              <span>📚</span> Đi học tích lũy: <span className="text-indigo-950 font-extrabold">{player.attendanceCount || 0} buổi</span>
            </div>
          </div>
        </div>

        {/* Góc phải: Thanh điều hướng RPG nhanh (Điểm danh, Xếp hạng, Hòm thư, Bang hội, Cài đặt) */}
        <div className="flex flex-wrap md:flex-nowrap items-center gap-2 w-full md:w-auto justify-end" id="header-nav">
          <button
            onClick={() => handleTabChange('checkIn')}
            className={`flex flex-col items-center justify-center w-12 h-12 rounded-xl border transition duration-200 cursor-pointer ${
              activeTab === 'checkIn'
                ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-200'
                : 'bg-white/50 text-indigo-950 border-white/55 hover:bg-white/80'
            }`}
            title="Điểm danh chuyên cần"
          >
            <Calendar className="w-5 h-5" />
            <span className="text-[8px] font-bold mt-0.5 uppercase tracking-tighter">Ngày</span>
          </button>

          <button
            onClick={() => handleTabChange('achievement')}
            className={`flex flex-col items-center justify-center w-12 h-12 rounded-xl border transition duration-200 cursor-pointer ${
              activeTab === 'achievement'
                ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-200'
                : 'bg-white/50 text-indigo-950 border-white/55 hover:bg-white/80'
            }`}
            title="Thành tích đạt được"
          >
            <Trophy className="w-5 h-5" />
            <span className="text-[8px] font-bold mt-0.5 uppercase tracking-tighter">Huân</span>
          </button>

          <button
            onClick={() => handleTabChange('leaderboard')}
            className={`flex flex-col items-center justify-center w-12 h-12 rounded-xl border transition duration-200 cursor-pointer ${
              activeTab === 'leaderboard'
                ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-200'
                : 'bg-white/50 text-indigo-950 border-white/55 hover:bg-white/80'
            }`}
            title="Bảng xếp hạng"
          >
            <Users className="w-5 h-5" />
            <span className="text-[8px] font-bold mt-0.5 uppercase tracking-tighter">Hạng</span>
          </button>

          <button
            onClick={() => handleTabChange('mail')}
            className={`flex flex-col items-center justify-center w-12 h-12 rounded-xl border transition duration-200 cursor-pointer relative ${
              activeTab === 'mail'
                ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-200'
                : 'bg-white/50 text-indigo-950 border-white/55 hover:bg-white/80'
            }`}
            title="Hòm thư từ Giáo Viên"
          >
            {unreadMailsCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-rose-500 text-white font-mono text-[9px] font-black rounded-full w-4.5 h-4.5 flex items-center justify-center border border-white pulse">
                {unreadMailsCount}
              </span>
            )}
            <Mail className="w-5 h-5" />
            <span className="text-[8px] font-bold mt-0.5 uppercase tracking-tighter">Thư</span>
          </button>

          {/* Mute toggle button */}
          <button
            onClick={() => onMuteToggle(!isMuted)}
            className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/40 border border-white/50 text-indigo-950 hover:text-indigo-900 hover:bg-white/70 transition cursor-pointer"
            title={isMuted ? "Bật âm thanh" : "Tắt âm thanh"}
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5 text-indigo-600 animate-pulse" />}
          </button>
        </div>

      </div>
    </header>
  );
}
