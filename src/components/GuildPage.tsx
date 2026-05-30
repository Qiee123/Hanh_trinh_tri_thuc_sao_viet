/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Player, Guild } from '../types';
import { GUILDS } from '../data/gameData';
import { sound } from './SoundManager';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Users, Plus, Award, CheckCircle2, AlertCircle, X, Check } from 'lucide-react';

interface GuildPageProps {
  player: Player;
  guildsList: Guild[];
  onJoinGuild: (guildId: string) => void;
  onCreateGuild: (guildName: string, guildLogo: string) => void;
}

const LOGO_PRESETS = ['🔥', '⚡', '🛡️', '🏆', '⭐', '🐉', '🦊', '🦁', '🐼', '🤖'];

export default function GuildPage({ player, guildsList, onJoinGuild, onCreateGuild }: GuildPageProps) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newGuildName, setNewGuildName] = useState('');
  const [selectedLogo, setSelectedLogo] = useState('🔥');

  const myGuild = guildsList.find((g) => g.id === player.guildId);

  const handleJoin = (gId: string) => {
    sound.playReward();
    onJoinGuild(gId);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGuildName.trim()) return;

    if (player.gem < 5) {
      sound.playIncorrect();
      alert('Không đủ 5 Kim Cương rồi dũng sĩ ơi! Hãy tích lũy quà Boss để thành lập Biệt đội.');
      return;
    }

    sound.playLevelUp();
    onCreateGuild(newGuildName.trim(), selectedLogo);
    setShowCreateModal(false);
    setNewGuildName('');
  };

  const leaveGuildAndJoin = (gId: string) => {
    sound.playClick();
    if (confirm('Em có chắc muốn chuyển sang Biệt đội học tập mới này không? Điểm đóng góp của em sẽ được bảo lưu.')) {
      handleJoin(gId);
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto" id="guild-page-wrapper">
      
      {/* Khung Tiêu Đề */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-white/30 mb-6">
        <div>
          <h2 className="text-2xl font-black text-indigo-950 font-sans tracking-wide uppercase flex items-center gap-2">
            🛡️ BIỆT ĐỘI HỌC TẬP - BANG HỘI
          </h2>
          <p className="text-sm text-slate-700 mt-1 font-sans font-medium">
            Đồng hành cùng bạn bè, nâng cao chỉ số chuyên cần, chia sẻ bí quyết học tốt!
          </p>
        </div>

        {!player.guildId && (
          <button
            onClick={() => {
              sound.playClick();
              setShowCreateModal(true);
            }}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs uppercase tracking-wide rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer border border-indigo-500"
          >
            <Plus className="w-4 h-4" /> Thành Lập Đội (5 KC)
          </button>
        )}
      </div>

      {myGuild ? (
        // GIAO DIỆN KHI ĐÃ THAM GIA BANG HỘI
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6" id="my-guild-stats">
          
          {/* Box trái: Profile Đội */}
          <div className="bg-white/55 backdrop-blur-md border border-white/50 rounded-3xl p-6 text-center shadow-md relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-indigo-100 border-b border-l border-indigo-200 text-indigo-850 text-[9px] font-mono px-2.5 py-1 font-black rounded-bl-lg uppercase">
              Thành viên chính thức
            </div>

            <span className="text-6xl my-4 block filter drop-shadow select-none">
              {myGuild.logo}
            </span>

            <h3 className="text-xl font-black text-indigo-950 mt-2 leading-tight">
              {myGuild.name}
            </h3>
            
            <div className="text-xs text-amber-700 font-black mt-1 tracking-wider uppercase font-sans">
              Cấp Độ Đội: {myGuild.level}
            </div>

            <div className="bg-white/40 border border-white/45 p-4 rounded-xl mt-6 space-y-2 text-xs text-left shadow-inner text-slate-900">
              <div className="flex justify-between border-b border-white/30 pb-1.5 text-slate-500">
                <span className="font-bold">Thủ lĩnh đội:</span>
                <span className="font-extrabold text-slate-800">{myGuild.leader || 'Thầy cô'}</span>
              </div>
              <div className="flex justify-between border-b border-white/30 pb-1.5 text-slate-500">
                <span className="font-bold">Sĩ số đội viên:</span>
                <span className="font-mono font-extrabold text-slate-800">{myGuild.membersCount} Bạn</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span className="font-bold">Tổng điểm tích lũy:</span>
                <span className="font-mono font-black text-rose-600">🛡️ {myGuild.totalExp.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Box phải: Lời khuyên & Chatroom đồng đội (Simulated) */}
          <div className="md:col-span-2 bg-white/55 backdrop-blur-md border border-white/50 rounded-3xl p-6 flex flex-col justify-between shadow-md" id="guild-chat-panel">
            <div className="space-y-4">
              <h3 className="font-extrabold text-sm text-indigo-950 uppercase tracking-wider border-b border-white/40 pb-2 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-indigo-600" /> BẢNG TIN BIỆT ĐỘI HÀNG NGÀY
              </h3>

              <div className="space-y-3 font-sans text-xs max-h-[220px] overflow-y-auto pr-1">
                <div className="p-3 bg-white/40 rounded-xl border border-white/45 leading-relaxed text-slate-700 shadow-sm font-medium">
                  <span className="font-black text-amber-800">📢 Thông báo từ Thủ Lĩnh:</span> Các bạn thành viên cùng đi học đúng giờ tuần này nhé, biệt đội của chúng ta đang xếp hạng rất cao trên bảng vàng!
                </div>
                <div className="p-3 bg-white/30 border border-white/30 rounded-xl leading-relaxed text-slate-600 font-medium">
                  <strong className="text-blue-600">Minh Quân (Lvl 15):</strong> Sách Vạn Năng ở Cửa hàng tăng chỉ số phòng thủ đỉnh lắm các bạn ơi, mua để đấu Boss ải 15 nhé!
                </div>
                <div className="p-3 bg-white/30 border border-white/30 rounded-xl leading-relaxed text-slate-600 font-medium">
                  <strong className="text-rose-600">Mỹ Dung (Lvl 11):</strong> Sáng nay tớ vừa quy đổi được một Sticker Sao Viêt rất đẹp tại quầy tiếp tân, cố gắng thôi nào!
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/45 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <p className="text-[10px] text-slate-500 leading-normal max-w-sm font-semibold">
                * Điểm thi đua của biệt đội tự động cộng dồn dựa trên toàn bộ EXP thăng cấp và chuỗi điểm danh chuyên cần của tất cả thành viên trong đội!
              </p>
              <button
                onClick={() => leaveGuildAndJoin('')}
                className="text-[11px] font-black text-rose-600 hover:text-rose-700 whitespace-nowrap cursor-pointer"
              >
                Rời đội tuyển
              </button>
            </div>
          </div>

        </div>
      ) : (
        // GIAO DIỆN KHI CHƯA CÓ BANG HỘI
        <div className="space-y-6" id="unjoined-guilds-list">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" id="guilds-grid">
            {guildsList.map((guild) => (
              <div
                key={guild.id}
                className="p-5 bg-white/55 backdrop-blur-md border border-white/45 rounded-3xl flex flex-col justify-between shadow-md"
                id={`guild-card-${guild.id}`}
              >
                <div className="text-center text-slate-950">
                  <span className="text-5xl my-3 block filter drop-shadow select-none">{guild.logo}</span>
                  <h3 className="font-extrabold text-indigo-950 text-md tracking-wide">{guild.name}</h3>
                  <span className="text-[10px] uppercase font-mono tracking-wider font-black text-indigo-600 mt-1 block">
                    Cấp {guild.level} | Thủ lĩnh: {guild.leader}
                  </span>
                  
                  <p className="text-xs text-slate-600 mt-3 leading-relaxed font-sans font-semibold">
                    Đội ngũ học viên năng động, thúc đẩy điểm danh chuyên cần và thi đua giải bài đố xuất sắc.
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-white/35 flex justify-between items-center text-xs">
                  <span className="font-mono text-slate-500 font-bold">{guild.membersCount} Gia viên</span>
                  <button
                    onClick={() => handleJoin(guild.id)}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-lg transition text-xs cursor-pointer shadow-sm"
                  >
                    Tham gia đội
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white/40 border border-white/50 p-4 rounded-2xl flex items-start gap-2.5 max-w-2xl mx-auto text-xs text-slate-600 leading-normal font-medium shadow-inner">
            <AlertCircle className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
            <p>
              <strong>Kiến thức thi đua đội tuyển:</strong> Khi gia nhập một biệt đội học tập, mọi điểm kinh nghiệm EXP em tích lũy được khi giải đố cũng như số ngày chuyên cần sẽ đồng thời đóng góp trực tiếp vào cấp độ và vị thế của Biệt đội đó trên toàn học viện Sao Việt!
            </p>
          </div>
        </div>
      )}

      {/* POPUP SÁNG LẬP BANG HỘI MỚI */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4" id="create-guild-overlay">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-white/95 backdrop-blur-xl border border-white rounded-3xl p-6 relative shadow-2xl"
              id="create-guild-box"
            >
              <button
                onClick={() => {
                  sound.playClick();
                  setShowCreateModal(false);
                }}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-900 bg-white/60 p-1.5 rounded-full hover:bg-slate-200 border border-slate-205 transition cursor-pointer"
                aria-label="Đóng popup tạo bang"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="mb-4">
                <span className="text-xs font-mono font-black text-indigo-600 uppercase tracking-widest block">Sáng lập lực lượng học tập</span>
                <h3 className="text-xl font-black text-indigo-950 mt-1">
                  ĐẶT TÊN BIỆT ĐỘI MỚI
                </h3>
                <p className="text-[11px] text-slate-600 mt-1 font-sans font-semibold">
                  Phí thành lập đội là <strong className="text-rose-600">5 Kim Cương</strong> để chuẩn bị biểu chương học viện.
                </p>
              </div>

              <form onSubmit={handleCreateSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide">Tên biệt đội của em:</label>
                  <input
                    required
                    maxLength={24}
                    type="text"
                    placeholder="Nhập tên biệt đội học tập..."
                    value={newGuildName}
                    onChange={(e) => setNewGuildName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 font-semibold focus:ring-2 focus:ring-indigo-500 outline-none transition placeholder:text-slate-400"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide">Chọn Biểu Tượng Đại Diện Đội:</label>
                  <div className="grid grid-cols-5 gap-2 bg-white/40 p-2.5 rounded-xl border border-white/50">
                    {LOGO_PRESETS.map((logo) => (
                      <button
                        key={logo}
                        type="button"
                        onClick={() => {
                          sound.playClick();
                          setSelectedLogo(logo);
                        }}
                        className={`h-11 flex items-center justify-center text-2xl rounded-xl border transition cursor-pointer ${
                          selectedLogo === logo
                            ? 'bg-indigo-100 border-indigo-300 scale-105'
                            : 'bg-white/50 border-white/30 hover:border-slate-300'
                        }`}
                      >
                        {logo}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200 flex justify-between items-center">
                  <span className="text-[10px] text-slate-500 font-black italic">Số dư Kim cương: {player.gem} KC</span>
                  <button
                    disabled={!newGuildName.trim() || player.gem < 5}
                    type="submit"
                    className="px-6 py-2.5 bg-indigo-600 text-white font-black hover:bg-indigo-500 tracking-wider text-xs uppercase rounded-xl cursor-pointer disabled:opacity-40"
                  >
                    🚀 THÀNH LẬP NGAY
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
