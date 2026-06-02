/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Player, Guild } from '../types';
import { sound } from './SoundManager';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { SHOP_ITEMS } from '../data/gameData';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, 
  Users, 
  Plus, 
  Award, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  Check, 
  BookOpen, 
  Trophy, 
  Sparkles, 
  Zap, 
  Gamepad2, 
  Coins, 
  Crown,
  Monitor,
  Lightbulb,
  Heart
} from 'lucide-react';

interface GuildPageProps {
  player: Player;
  guildsList: Guild[];
  onJoinGuild: (guildId: string) => void;
  onCreateGuild: (guildName: string, guildLogo: string) => void;
  onUpdateActivePlayer?: (player: Player) => void;
  onUpdateGuildsList?: (guilds: Guild[]) => void;
}

const LOGO_PRESETS = ['🛡️', '🔥', '⚡', '🏆', '⭐', '🐉', '🦁', '🐼', '🤖', '👑', '🌈', '💎'];

interface GQuest {
  id: string;
  name: string;
  description: string;
  rewardItemId: string;
  rewardItemName: string;
  rewardItemIcon: string;
  rewardExp: number;
  gameType: 'math' | 'shortcut' | 'stem' | 'donate';
}

const GUILD_QUESTS: GQuest[] = [
  {
    id: 'gq1',
    name: 'Đấu Trường Siêu Nhẩm',
    description: 'Vượt qua bài đố toán học tốc độ để nhận rương khiên.',
    rewardItemId: 's1', // Khiên Chuyên Cần
    rewardItemName: 'Khiên Chuyên Cần',
    rewardItemIcon: '🔰',
    rewardExp: 1200,
    gameType: 'math'
  },
  {
    id: 'gq2',
    name: 'Mật Mã Phím Tắt',
    description: 'Nhận diện các tổ hợp phím tin học định dạng nhanh.',
    rewardItemId: 's2', // Sách vạn năng
    rewardItemName: 'Sách Vạn Năng',
    rewardItemIcon: '📖',
    rewardExp: 1800,
    gameType: 'shortcut'
  },
  {
    id: 'gq3',
    name: 'Phân Loại Linh Kiện STEM',
    description: 'Bố trí đúng Linh Kiện Phần cứng và Phần mềm máy tính.',
    rewardItemId: 'w1', // Kiếm tri thức
    rewardItemName: 'Kiếm Tri Thức',
    rewardItemIcon: '⚔️',
    rewardExp: 2200,
    gameType: 'stem'
  },
  {
    id: 'gq4',
    name: 'Cống Hiến Xây Dựng Chi Nhánh',
    description: 'Góp 350 Vàng vào quỹ tài liệu học tập của ban hội.',
    rewardItemId: 'r1', // Nhẫn logic thần tốc
    rewardItemName: 'Nhẫn Logic Thần Tốc',
    rewardItemIcon: '💍',
    rewardExp: 1500,
    gameType: 'donate'
  }
];

export default function GuildPage({ 
  player, 
  guildsList, 
  onJoinGuild, 
  onCreateGuild,
  onUpdateActivePlayer,
  onUpdateGuildsList
}: GuildPageProps) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newGuildName, setNewGuildName] = useState('');
  const [selectedLogo, setSelectedLogo] = useState('🛡️');
  const [activeRightTab, setActiveRightTab] = useState<'chat' | 'quests'>('quests');

  // Trạng thái mini-game
  const [activePlayQuest, setActivePlayQuest] = useState<GQuest | null>(null);
  const [mathStep, setMathStep] = useState(0);
  const [mathAnswers, setMathAnswers] = useState<number[]>([]);
  const [shortcutStep, setShortcutStep] = useState(0);
  const [stemScore, setStemScore] = useState(0);
  const [stemAnswers, setStemAnswers] = useState<Record<string, 'hardware' | 'software'>>({});

  const [completedQuestIds, setCompletedQuestIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(`stv_completed_guild_quests_${player.id}`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const myGuild = guildsList.find((g) => g.id === player.guildId);

  // Sắp xếp các bang hội theo EXP để hiển thị TOP
  const sortedGuilds = [...guildsList].sort((a, b) => b.totalExp - a.totalExp);

  const handleJoin = (gId: string) => {
    sound.playReward();
    onJoinGuild(gId);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGuildName.trim()) return;

    if (player.gem < 5) {
      sound.playIncorrect();
      alert('Không đủ 5 Kim Cương rồi dũng sĩ học tập ơi! Hãy giải Boss thăng cấp để tích lũy.');
      return;
    }

    sound.playLevelUp();
    onCreateGuild(newGuildName.trim(), selectedLogo);
    setShowCreateModal(false);
    setNewGuildName('');
  };

  const leaveGuildAndJoin = (gId: string) => {
    sound.playClick();
    if (confirm('Em có chắc chắn muốn rời Biệt đội học tập hiện tại? Điểm cống hiến lịch sử của em và các bang hội vẫn được bảo lưu.')) {
      sound.playClick();
      onJoinGuild('');
    }
  };

  // Hoàn thành xuất sắc 1 nhiệm vụ
  const executeQuestSuccess = async (questId: string, goldCost = 0) => {
    if (completedQuestIds.includes(questId)) return;

    sound.playLevelUp();

    const newCompleted = [...completedQuestIds, questId];
    setCompletedQuestIds(newCompleted);
    localStorage.setItem(`stv_completed_guild_quests_${player.id}`, JSON.stringify(newCompleted));

    const qConfig = GUILD_QUESTS.find(q => q.id === questId);
    if (!qConfig) {
      setActivePlayQuest(null);
      return;
    }

    // 1. Cập nhật player (Trừ vàng nếu có và thêm vật phẩm)
    if (onUpdateActivePlayer) {
      // Tìm xem người chơi đã có vật phẩm chưa, thêm vào kho đồ
      const updatedPlayer = {
        ...player,
        gold: Math.max(0, player.gold - goldCost),
        inventory: [...player.inventory, qConfig.rewardItemId]
      };
      onUpdateActivePlayer(updatedPlayer);
      try {
        await setDoc(doc(db, 'players', player.id), updatedPlayer, { merge: true });
      } catch (e) {
        console.error('Error updating player:', e);
      }
    }

    // 2. Cập nhật Biệt Đội EXP
    if (player.guildId && onUpdateGuildsList) {
      const updatedGuilds = guildsList.map(g => {
        if (g.id === player.guildId) {
          const newExp = g.totalExp + qConfig.rewardExp;
          const newLevel = Math.floor(newExp / 5000) + 1;
          return {
            ...g,
            totalExp: newExp,
            level: newLevel
          };
        }
        return g;
      });

      onUpdateGuildsList(updatedGuilds);
      try {
        const curG = updatedGuilds.find(g => g.id === player.guildId);
        if (curG) {
          await setDoc(doc(db, 'guilds', player.guildId), curG, { merge: true });
        }
      } catch (e) {
        console.error('Error updating guild exp:', e);
      }
    }

    setActivePlayQuest(null);
    alert(`🎉 CHÚC MỪNG CHIẾN HỮU!\n🏆 Em đã hoàn thành xuất sắc nhiệm vụ: "${qConfig.name}"!\n🎁 Nhận: Vật phẩm [${qConfig.rewardItemName}] ${qConfig.rewardItemIcon} (Đã thêm vào túi đồ) và đóng góp +${qConfig.rewardExp} EXP cho Chi Nhánh của mình thăng hạng!`);
  };

  // Mini-game toán học nhẩm
  const quickMathQuestions = [
    { text: '16 + 28 = ?', ans: [34, 44, 46], correct: 1 },
    { text: '124 - 45 = ?', ans: [79, 81, 75], correct: 0 },
    { text: '9 x 7 = ?', ans: [56, 63, 72], correct: 1 }
  ];

  const handleMathAnswer = (idx: number) => {
    sound.playClick();
    if (idx === quickMathQuestions[mathStep].correct) {
      if (mathStep === quickMathQuestions.length - 1) {
        executeQuestSuccess('gq1');
      } else {
        setMathStep(mathStep + 1);
      }
    } else {
      sound.playIncorrect();
      alert('Chưa chính xác rồi dũng sĩ ơi! Hãy tính toán cẩn thận lại nhé.');
    }
  };

  // Mini-game phím tắt
  const shortcutQuestions = [
    { text: 'Để LƯU (Save) nhanh file văn bản Word, PowerPoint em nhấn phím gì?', ans: ['Ctrl + S', 'Ctrl + N', 'Ctrl + P'], correct: 0 },
    { text: 'Tổ hợp phím nào dùng để SAO CHÉP (Copy) dữ liệu hoặc văn bản?', ans: ['Ctrl + X', 'Ctrl + C', 'Ctrl + V'], correct: 1 },
    { text: 'Tổ hợp phím nào dùng để HOÀN TÁC (Undo) lùi lại hành động trước đó?', ans: ['Ctrl + Z', 'Ctrl + Y', 'Ctrl + W'], correct: 0 }
  ];

  const handleShortcutAnswer = (idx: number) => {
    sound.playClick();
    if (idx === shortcutQuestions[shortcutStep].correct) {
      if (shortcutStep === shortcutQuestions.length - 1) {
        executeQuestSuccess('gq2');
      } else {
        setShortcutStep(shortcutStep + 1);
      }
    } else {
      sound.playIncorrect();
      alert('Tổ hợp phím này chưa đúng rồi. Em hãy nhớ lại kiến thức lớp Tin học Sao Việt nhé!');
    }
  };

  // Mini-game STEM
  const stemClassifications = [
    { id: 'item1', name: 'Thân máy tính (CPU)', category: 'hardware', text: 'Phần Cứng hay Phần Mềm?' },
    { id: 'item2', name: 'Học trình Scratch', category: 'software', text: 'Phần Cứng hay Phần Mềm?' },
    { id: 'item3', name: 'Bàn phím cơ & chuột led', category: 'hardware', text: 'Phần Cứng hay Phần Mềm?' },
    { id: 'item4', name: 'Hệ điều hành Windows 11', category: 'software', text: 'Phần Cứng hay Phần Mềm?' },
    { id: 'item5', name: 'Trình duyệt web Chrome', category: 'software', text: 'Phần Cứng hay Phần Mềm?' }
  ];

  const handleStemAnswer = (itemId: string, selected: 'hardware' | 'software') => {
    sound.playClick();
    const correctCategory = stemClassifications.find(i => i.id === itemId)?.category;
    if (selected === correctCategory) {
      const nextAnswers = { ...stemAnswers, [itemId]: selected };
      setStemAnswers(nextAnswers);
      const answeredCount = Object.keys(nextAnswers).length;
      if (answeredCount === stemClassifications.length) {
        executeQuestSuccess('gq3');
      }
    } else {
      sound.playIncorrect();
      alert('Chưa chính xác rồi em ơi! Linh kiện hay chương trình này thuộc loại khác.');
    }
  };

  // Xử lý nộp cống hiến vàng
  const handleDonateGold = () => {
    if (player.gold < 350) {
      sound.playIncorrect();
      alert('Chuẩn bị ngân khố chưa đủ 350 Vàng! Hãy vượt thêm ải đấu Boss để nhận thêm vàng nhé.');
      return;
    }
    executeQuestSuccess('gq4', 350);
  };

  return (
    <div className="p-4 max-w-6xl mx-auto" id="guild-page-wrapper">
      
      {/* Khung Tiêu Đề */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-white/30 mb-6">
        <div>
          <h2 className="text-2xl font-black text-indigo-950 font-sans tracking-wide uppercase flex items-center gap-2">
            🛡️ QUẦN HÙNG - BANG HỘI CHI NHÁNH
          </h2>
          <p className="text-sm text-slate-700 mt-1 font-sans font-medium">
            Gia nhập chi nhánh lớp học của em, chung tay làm nhiệm vụ nhận trang bị quý hiếm và leo Top bảng vàng!
          </p>
        </div>

        {!player.guildId && (
          <button
            onClick={() => {
              sound.playClick();
              setShowCreateModal(true);
            }}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs uppercase tracking-wide rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer border border-indigo-500 transition-transform hover:scale-105"
          >
            <Plus className="w-4 h-4" /> Thành Lập Đội Mới (5 KC)
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="guild-layout-grid">
        
        {/* CỘT TRÁI (Lgp 4 cols): PROFILE HOẶC DANH SÁCH CHI NHÁNH + BẢNG XẾP HẠNG PHÂN ĐOÀN */}
        <div className="lg:col-span-4 space-y-6" id="guild-sidebar">
          
          {/* Box Profile Biệt Đội đã tham gia */}
          {myGuild ? (
            <div className="bg-white/55 backdrop-blur-md border border-white/55 rounded-3xl p-5 text-center shadow-md relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-indigo-100 border-b border-l border-indigo-200 text-indigo-850 text-[9px] font-mono px-2.5 py-1 font-black rounded-bl-lg uppercase">
                Thành viên chính thức
              </div>

              <span className="text-6xs my-4 bg-indigo-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto text-4xl filter drop-shadow select-none">
                {myGuild.logo}
              </span>

              <h3 className="text-lg font-black text-indigo-950 mt-2 leading-tight">
                {myGuild.name}
              </h3>
              
              <div className="text-xs text-indigo-700 font-extrabold mt-1 tracking-wider uppercase font-sans">
                Độ Uy Tín Chi Nhánh Lvl {myGuild.level}
              </div>

              <div className="bg-white/40 border border-white/45 p-4 rounded-2xl mt-5 space-y-2 text-xs text-left shadow-inner text-slate-900">
                <div className="flex justify-between border-b border-white/30 pb-1.5 text-slate-500">
                  <span className="font-bold">Đại diện chi nhánh:</span>
                  <span className="font-extrabold text-slate-850">{myGuild.leader || 'Thầy Cô Sao Việt'}</span>
                </div>
                <div className="flex justify-between border-b border-white/30 pb-1.5 text-slate-500">
                  <span className="font-bold">Team học viên:</span>
                  <span className="font-mono font-extrabold text-slate-850">{myGuild.membersCount} bạn</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span className="font-bold">Điểm thi đua chi nhánh:</span>
                  <span className="font-mono font-black text-rose-650">🛡️ {myGuild.totalExp.toLocaleString()}</span>
                </div>
              </div>

              <button
                onClick={() => leaveGuildAndJoin('')}
                className="mt-4 text-[10px] font-black text-slate-400 hover:text-rose-500 cursor-pointer block mx-auto uppercase hover:underline transition"
              >
                Rời Chi Nhánh Hiện Tại
              </button>
            </div>
          ) : (
            <div className="bg-amber-50/80 border border-amber-200 p-5 rounded-3xl shadow-sm text-slate-800 leading-relaxed text-xs font-semibold">
              <span className="text-3xl mb-3 block">🔰</span>
              <p className="text-sm font-extrabold text-indigo-950 mb-1.5 uppercase">Chưa Gia Nhập Chi Nhánh</p>
              Hãy lựa chọn tham gia một chi nhánh đào tạo Sao Việt bên dưới hoặc tự thành lập lực lượng để giải mật mã STEM, thực hiện nhiệm vụ đổi trang bị sử thi!
            </div>
          )}

          {/* Bảng Xếp Hạng TOP 5 Chi Nhánh Thách Thức */}
          <div className="bg-white/55 backdrop-blur-md border border-white/55 rounded-3xl p-5 shadow-md">
            <h3 className="font-black text-xs text-indigo-950 uppercase tracking-wider pb-3 border-b border-indigo-100 flex items-center gap-1.5">
              <Trophy className="w-4 h-4 text-amber-500 animate-pulse fill-amber-500" /> TOP CHI NHÁNH CHUYÊN CẦN
            </h3>

            <div className="pt-3 space-y-2.5">
              {sortedGuilds.slice(0, 5).map((guild, idx) => {
                const isMyGuild = guild.id === player.guildId;
                const rank = idx + 1;
                return (
                  <div 
                    key={guild.id}
                    className={`flex items-center justify-between p-2 rounded-xl transition border text-xs font-sans ${
                      isMyGuild 
                        ? 'bg-indigo-60 border-indigo-200 text-indigo-950 font-black shadow-sm'
                        : 'border-transparent hover:bg-white/40 text-slate-850 font-bold'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="font-mono font-black text-[11px] text-slate-400 w-4 block text-center">
                        {rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `${rank}`}
                      </span>
                      <span className="text-lg">{guild.logo}</span>
                      <span className="truncate pr-1.5 text-[11px]">{guild.name}</span>
                    </div>
                    <div className="font-mono text-[11px] text-right text-rose-600 flex items-center gap-0.5 shrink-0 font-extrabold">
                      🛡️ {guild.totalExp.toLocaleString()}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* CỘT PHẢI (Lg 8 cols): QUYẾT ĐỊNH HIỂN THỊ DÉP TIÊU BAN HỘI HOẶC CHƯA GIA NHẬP */}
        <div className="lg:col-span-8" id="guild-main-stage">
          
          {myGuild ? (
            // GIAO DIỆN KHI ĐÃ CÓ CHI NHÁNH
            <div className="space-y-6" id="my-guild-content">
              
              {/* TAB SELECTION TRÊN HOẠT ĐỘNG */}
              <div className="flex border-b border-indigo-100 bg-white/40 p-1.5 rounded-2xl gap-1">
                <button
                  onClick={() => { sound.playClick(); setActiveRightTab('quests'); }}
                  className={`flex-1 py-2.5 px-4 text-center rounded-xl text-xs font-black uppercase transition cursor-pointer flex items-center justify-center gap-2 ${
                    activeRightTab === 'quests'
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-slate-700 hover:bg-white/40 hover:text-indigo-950'
                  }`}
                >
                  <Gamepad2 className="w-4 h-4" /> 🎯 Nhiệm Vụ Chi Nhánh
                </button>
                <button
                  onClick={() => { sound.playClick(); setActiveRightTab('chat'); }}
                  className={`flex-1 py-2.5 px-4 text-center rounded-xl text-xs font-black uppercase transition cursor-pointer flex items-center justify-center gap-2 ${
                    activeRightTab === 'chat'
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-slate-700 hover:bg-white/40 hover:text-indigo-950'
                  }`}
                >
                  <Users className="w-4 h-4" /> 💬 Bảng Tin Đồng Đội
                </button>
              </div>

              {/* KHỐI NỘI DUNG TAB */}
              <AnimatePresence mode="wait">
                {activeRightTab === 'quests' ? (
                  <motion.div
                    key="tab-quests"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-4"
                  >
                    <div className="bg-indigo-50 border border-indigo-200 p-4 rounded-2xl flex items-start gap-2 text-xs text-indigo-950 leading-normal font-semibold shadow-sm">
                      <Sparkles className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5 animate-pulse" />
                      <div>
                        <strong>Nội quy biệt đội:</strong> Hãy vận dụng trí thông minh, hoàn thành các màn thử thách nhanh bên dưới. Mỗi nhiệm vụ hoàn thành sẽ giúp em mở khóa nhận trực tiếp **Trang Bị Ảo** xịn xò để đeo tăng chiến lực và thăng hạng chi nhánh Sao Việt!
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" id="guild-quests-grid">
                      {GUILD_QUESTS.map((quest) => {
                        const isDone = completedQuestIds.includes(quest.id);
                        return (
                          <div 
                            key={quest.id}
                            className={`p-4 bg-white/60 backdrop-blur-md rounded-2xl border transition flex flex-col justify-between shadow-sm relative ${
                              isDone ? 'border-emerald-250 bg-emerald-50/40' : 'border-white/50 hover:border-indigo-200'
                            }`}
                          >
                            {isDone && (
                              <div className="absolute top-3 right-3 bg-emerald-500 text-white rounded-full p-1 shadow-sm font-black flex items-center justify-center">
                                <Check className="w-3 h-3" />
                              </div>
                            )}

                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="bg-indigo-100 text-indigo-700 font-black text-[9px] px-2 py-0.5 rounded-full uppercase tracking-wider">
                                  {quest.gameType === 'donate' ? 'Cống hiến' : 'Kiểm tra STEM'}
                                </span>
                              </div>
                              <h4 className="font-extrabold text-sm text-indigo-950 mt-1.5">{quest.name}</h4>
                              <p className="text-[11px] text-slate-550 mt-1 leading-relaxed font-semibold">{quest.description}</p>
                            </div>

                            <div className="mt-4 pt-3 border-t border-indigo-50/50 flex items-center justify-between">
                              <div className="space-y-0.5 text-left">
                                <p className="text-[10px] text-rose-500 font-extrabold uppercase">
                                  EXP đội: +{quest.rewardExp} EXP
                                </p>
                                <p className="text-[10px] text-slate-505 font-bold flex items-center gap-1">
                                  Quà: <span className="text-amber-800 text-xs font-black">{quest.rewardItemIcon} {quest.rewardItemName}</span>
                                </p>
                              </div>

                              {isDone ? (
                                <span className="text-xs text-emerald-600 font-black uppercase flex items-center gap-0.5">
                                  Đã Nhận ✔️
                                </span>
                              ) : (
                                <button
                                  onClick={() => {
                                    sound.playClick();
                                    if (quest.gameType === 'donate') {
                                      handleDonateGold();
                                    } else {
                                      // Reset mini game steps
                                      setMathStep(0);
                                      setShortcutStep(0);
                                      setStemAnswers({});
                                      setActivePlayQuest(quest);
                                    }
                                  }}
                                  className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-[11px] uppercase tracking-wider rounded-lg shadow-sm transition"
                                >
                                  {quest.gameType === 'donate' ? 'Góp 350 Vàng' : 'Làm Ngay'}
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="tab-chat"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-white/55 backdrop-blur-md border border-white/50 rounded-2xl p-5 flex flex-col justify-between shadow-sm min-h-[350px]"
                  >
                    <div className="space-y-4">
                      <h3 className="font-extrabold text-sm text-indigo-950 uppercase tracking-wider border-b border-white/40 pb-2">
                        Bảng Tin Nội Bộ {myGuild.logo} {myGuild.name}
                      </h3>

                      <div className="space-y-3 font-sans text-xs max-h-[220px] overflow-y-auto pr-1">
                        <div className="p-3 bg-white/40 rounded-xl border border-white/45 leading-relaxed text-slate-705 shadow-xs font-semibold">
                          <span className="font-black text-amber-700">📢 Thông báo từ Ban Giám Hiệu:</span> Đội tuyển {myGuild.name} hãy ra sức tích lũy EXP bằng cách điểm danh lớp học đúng giờ để giữ vị trí dẫn đầu!
                        </div>
                        <div className="p-3 bg-white/30 border border-white/30 rounded-xl leading-relaxed text-slate-650 font-semibold">
                          <strong className="text-blue-600">Thầy Minh Hoàng:</strong> Thầy vừa tặng 100 EXP Biệt đội cho chi nhánh chúng ta đấy, các dũng sĩ học tập thăng tiến nhanh nào!
                        </div>
                        <div className="p-3 bg-white/30 border border-white/30 rounded-xl leading-relaxed text-slate-650 font-semibold">
                          <strong className="text-purple-600">Khánh Vy (Lvl 11):</strong> Hôm nay tớ vừa giải được 5 câu tiếng Anh của Đảo thám hiểm, thích quá nhận được Kiếm Tri Thức rồi!
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-white/30 flex items-center gap-2">
                      <input 
                        type="text" 
                        placeholder="Em hãy viết nội dung động viên đồng đội..." 
                        className="flex-1 px-4 py-2 bg-white/70 border border-slate-200 rounded-xl text-slate-800 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            sound.playClick();
                            alert('💬 Tin nhắn học tập của em đã được gửi sang phòng trò chuyện chi nhánh!');
                            (e.target as HTMLInputElement).value = '';
                          }
                        }}
                      />
                      <button 
                        onClick={() => {
                          sound.playClick();
                          alert('💬 Tin nhắn học tập của em đã được gửi thành công!');
                        }}
                        className="px-4 py-2 bg-indigo-650 hover:bg-indigo-600 text-white font-extrabold text-xs rounded-xl uppercase transition cursor-pointer"
                      >
                        Gửi tin
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          ) : (
            // GIAO DIỆN CHƯA CÓ CHI NHÁNH - DANH SÁCH 12 CHI NHÁNH ĐỂ LỰA CHỌN THAM GIA
            <div className="space-y-5" id="unjoined-guilds-flow">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {guildsList.map((guild) => (
                  <div
                    key={guild.id}
                    className="p-5 bg-white/55 backdrop-blur-md border border-white/45 rounded-2xl flex flex-col justify-between shadow-sm hover:border-indigo-300 transition-all hover:shadow-md"
                    id={`guild-card-${guild.id}`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-3xl filter drop-shadow select-none">{guild.logo}</span>
                        <span className="font-mono text-[10px] text-slate-500 font-extrabold bg-slate-100 px-2 py-0.5 rounded">
                          Lvl {guild.level}
                        </span>
                      </div>
                      <h3 className="font-black text-indigo-950 text-sm tracking-wide mt-3">{guild.name}</h3>
                      <p className="text-[11px] text-slate-500 font-bold mt-1">
                        🔑 Người phụ trách: {guild.leader || 'Thầy Cô Giáo Viên'}
                      </p>
                      
                      <p className="text-[11px] text-slate-600 mt-2.5 leading-relaxed font-semibold">
                        Gia nhập biệt đội để đồng hành cùng các bạn học tập chuyên cần, tăng điểm thi đua cho chi nhánh lớp học!
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center text-xs">
                      <span className="font-mono text-slate-500 font-black text-[10px]">{guild.membersCount} Thành viên</span>
                      <button
                        onClick={() => handleJoin(guild.id)}
                        className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-lg transition text-[11px] uppercase tracking-wider cursor-pointer shadow-sm"
                      >
                        Gia Nhập
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>

      {/* POPUP CHƠI MINI-GAME KIỂM TRA NHIỆM VỤ */}
      <AnimatePresence>
        {activePlayQuest && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm bg-white rounded-3xl p-6 relative border border-indigo-150 shadow-2xl text-center"
            >
              <button
                onClick={() => {
                  sound.playClick();
                  setActivePlayQuest(null);
                }}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-900"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-indigo-950 font-black text-md uppercase tracking-wider flex items-center justify-center gap-1.5 mb-2 mt-2">
                🎮 {activePlayQuest.name}
              </h3>
              <p className="text-[11px] text-slate-500 font-bold mb-4">
                Hoàn thành 3 câu đố để cống hiến cho ban hội!
              </p>

              {/* GAME 1: MATH */}
              {activePlayQuest.gameType === 'math' && (
                <div className="space-y-4">
                  <div className="bg-indigo-50/60 p-4 rounded-xl border border-indigo-100">
                    <p className="text-xs font-mono font-black text-indigo-500 uppercase">Câu hỏi số {mathStep + 1}/3</p>
                    <p className="text-xl font-black text-indigo-950 mt-1">{quickMathQuestions[mathStep].text}</p>
                  </div>

                  <div className="grid grid-cols-1 gap-2">
                    {quickMathQuestions[mathStep].ans.map((option, keyIdx) => (
                      <button
                        key={keyIdx}
                        onClick={() => handleMathAnswer(keyIdx)}
                        className="py-2 px-4 border border-slate-200 hover:border-indigo-600 rounded-xl hover:bg-indigo-50 text-slate-800 font-extrabold text-xs transition cursor-pointer"
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* GAME 2: SHORTCUT */}
              {activePlayQuest.gameType === 'shortcut' && (
                <div className="space-y-4">
                  <div className="bg-indigo-50/60 p-4 rounded-xl border border-indigo-100">
                    <p className="text-xs font-mono font-black text-indigo-500 uppercase">Thử thách {shortcutStep + 1}/3</p>
                    <p className="text-xs leading-relaxed font-extrabold text-indigo-950 mt-1">
                      {shortcutQuestions[shortcutStep].text}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-2">
                    {shortcutQuestions[shortcutStep].ans.map((option, keyIdx) => (
                      <button
                        key={keyIdx}
                        onClick={() => handleShortcutAnswer(keyIdx)}
                        className="py-2.5 px-3 border border-slate-200 hover:border-indigo-500 rounded-xl hover:bg-indigo-50 text-slate-800 font-black text-[11px] transition cursor-pointer"
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* GAME 3: STEM CATEGORIZER */}
              {activePlayQuest.gameType === 'stem' && (
                <div className="space-y-4">
                  <p className="text-[11px] text-slate-500 font-extrabold text-left mb-2">
                    Phân loại 5 mục bên dưới để kích hoạt rương siêu máy tính:
                  </p>

                  <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
                    {stemClassifications.map((item) => {
                      const ans = stemAnswers[item.id];
                      return (
                        <div key={item.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-2">
                          <span className="text-xs font-black text-slate-800 text-left">{item.name}</span>
                          
                          <div className="flex gap-1.5 w-full sm:w-auto">
                            <button
                              disabled={!!ans}
                              onClick={() => handleStemAnswer(item.id, 'hardware')}
                              className={`flex-1 sm:flex-none px-2.5 py-1 text-[10px] font-black rounded uppercase ${
                                ans === 'hardware'
                                  ? 'bg-indigo-600 text-white'
                                  : 'bg-white border hover:bg-slate-50 text-slate-600'
                              }`}
                            >
                              Phần Cứng
                            </button>
                            <button
                              disabled={!!ans}
                              onClick={() => handleStemAnswer(item.id, 'software')}
                              className={`flex-1 sm:flex-none px-2.5 py-1 text-[10px] font-black rounded uppercase ${
                                ans === 'software'
                                  ? 'bg-purple-600 text-white'
                                  : 'bg-white border hover:bg-slate-50 text-slate-600'
                              }`}
                            >
                              Phần Mềm
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* POPUP SÁNG LẬP BIỆT ĐỘI HỌC TẬP */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm bg-white border border-slate-100 rounded-3xl p-6 relative shadow-2xl"
              id="create-guild-box"
            >
              <button
                onClick={() => {
                  sound.playClick();
                  setShowCreateModal(false);
                }}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-900 bg-slate-100 p-1.5 rounded-full hover:bg-slate-250 transition"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="mb-4">
                <span className="text-[10px] font-mono font-black text-indigo-650 uppercase tracking-widest block">Thành lập biệt đội học viên</span>
                <h3 className="text-lg font-black text-indigo-950 mt-1">
                  ĐẶT TÊN BIỆT ĐỘI
                </h3>
                <p className="text-[11px] text-slate-500 mt-1 font-semibold leading-relaxed">
                  Lệ phí lập đội là <strong className="text-rose-500">5 Kim Cương</strong> để bảo an biểu biểu trưng học viện.
                </p>
              </div>

              <form onSubmit={handleCreateSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-xs font-black text-slate-500 uppercase">Tên Biệt Đội Học Tập Mới:</label>
                  <input
                    required
                    maxLength={32}
                    type="text"
                    placeholder="Ví dụ: Team Gõ Phím Siêu Tốc..."
                    value={newGuildName}
                    onChange={(e) => setNewGuildName(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 text-xs font-bold focus:ring-1 focus:ring-indigo-500 outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-black text-slate-500 uppercase">Chọn Biểu Tượng:</label>
                  <div className="grid grid-cols-6 gap-2 bg-slate-50 p-2 rounded-xl border">
                    {LOGO_PRESETS.map((logo) => (
                      <button
                        key={logo}
                        type="button"
                        onClick={() => {
                          sound.playClick();
                          setSelectedLogo(logo);
                        }}
                        className={`h-9 flex items-center justify-center text-xl rounded-lg border transition ${
                          selectedLogo === logo
                            ? 'bg-indigo-100 border-indigo-300 scale-105'
                            : 'bg-white border-transparent hover:border-slate-200'
                        }`}
                      >
                        {logo}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-500">Gems của em: {player.gem} KC</span>
                  <button
                    disabled={!newGuildName.trim() || player.gem < 5}
                    type="submit"
                    className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs uppercase tracking-wider rounded-lg disabled:opacity-40"
                  >
                    Tạo biệt đội
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
