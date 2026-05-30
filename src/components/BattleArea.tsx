/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Player, Question, Region } from '../types';
import { getRandomQuestion } from '../data/questions';
import { REGIONS } from '../data/gameData';
import { sound } from './SoundManager';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Sparkles, AlertCircle, RefreshCw, Trophy, HelpCircle } from 'lucide-react';

interface BattleAreaProps {
  player: Player;
  regionId: string;
  stageNumber: number;
  isBoss: boolean;
  onVictory: (rewards: { exp: number; gold: number; gem: number; stageNum: number }) => void;
  onDefeat: () => void;
  onBackToMap: () => void;
  onPlayerHpChange: (newHp: number) => void;
}

export default function BattleArea({
  player,
  regionId,
  stageNumber,
  isBoss,
  onVictory,
  onDefeat,
  onBackToMap,
  onPlayerHpChange
}: BattleAreaProps) {
  const currentRegion = REGIONS.find((r) => r.id === regionId) || REGIONS[0];
  
  // Trạng thái HP
  const [bossMaxHp, setBossMaxHp] = useState(isBoss ? 100 + stageNumber * 10 : 40 + stageNumber * 5);
  const [bossHp, setBossHp] = useState(bossMaxHp);
  const [playerHp, setPlayerHp] = useState(player.hp);

  // Câu hỏi hiện tại và danh sách ID đã gõ/đã hỏi để tránh trùng lặp câu hỏi
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnsweredCorrectly, setIsAnsweredCorrectly] = useState<boolean | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [showAnswerExplanation, setShowAnswerExplanation] = useState(false);
  const [askedQuestionIds, setAskedQuestionIds] = useState<string[]>([]);

  // Hoạt ảnh chiến đấu
  const [playerAttacking, setPlayerAttacking] = useState(false);
  const [bossAttacking, setBossAttacking] = useState(false);
  const [combatText, setCombatText] = useState('');
  const [shakeScreen, setShakeScreen] = useState(false);

  // Hiệu ứng nhận quà
  const [isBattleFinished, setIsBattleFinished] = useState(false);
  const [battleOutcome, setBattleOutcome] = useState<'victory' | 'defeat' | null>(null);

  // Nạp câu hỏi đầu tiên
  useEffect(() => {
    // Reset lịch sử câu hỏi mỗi khi chuyển vùng chiến đấu
    setAskedQuestionIds([]);
    loadNewQuestion([]);
  }, [regionId]);

  const loadNewQuestion = (currentExcludes?: string[] | any) => {
    const excludes = Array.isArray(currentExcludes) ? currentExcludes : askedQuestionIds;
    const q = getRandomQuestion(regionId, player.grade || 'grade_1', excludes);
    if (q) {
      setCurrentQuestion(q);
      setAskedQuestionIds((prev) => {
        if (prev.includes(q.id)) return prev;
        return [...prev, q.id];
      });
    }
    setSelectedAnswer(null);
    setIsAnsweredCorrectly(null);
    setShowHint(false);
    setShowAnswerExplanation(false);
  };

  const getPetEmoji = () => {
    if (player.pet === 'p_fox') return '🦊';
    if (player.pet === 'p_dragon') return '🐉';
    return '🐰'; // Thỏ mặc định
  };

  const getPetBonusLabel = () => {
    if (player.pet === 'p_fox') return '+15% Vàng';
    if (player.pet === 'p_dragon') return '+25% Vàng & EXP';
    return '';
  };

  const handleAnswerClick = (ansIdx: number) => {
    if (selectedAnswer !== null || isBattleFinished) return;

    sound.playClick();
    setSelectedAnswer(ansIdx);
    const correct = ansIdx === currentQuestion?.correct;
    setIsAnsweredCorrectly(correct);

    if (correct) {
      // Đúng -> Tấn công Boss
      sound.playAttack();
      sound.playCorrect();
      setPlayerAttacking(true);
      setCombatText(`Tấn công chính xác: Gây sát thương cực lớn!`);
      
      // Sát thương nhân vật có cộng thêm từ lực tấn công ở chỉ số & trang bị vũ khí
      const attackBonus = player.stats.attack;
      const damage = 20 + Math.floor(attackBonus / 5);
      
      setTimeout(() => {
        const nextBossHp = Math.max(0, bossHp - damage);
        setBossHp(nextBossHp);
        if (nextBossHp <= 0) {
          handleBattleVictory();
        }
        setPlayerAttacking(false);
      }, 500);

    } else {
      // Sai -> Người chơi bị tổn thất HP
      sound.playIncorrect();
      setBossAttacking(true);
      setShakeScreen(true);
      setCombatText(`Sai rồi! Boss phản công dữ dội!`);
      
      // Tính sát thương giảm trừ qua phòng thủ
      const defBonus = player.stats.defense;
      const originalDamage = isBoss ? 25 : 15;
      const netDamage = Math.max(5, originalDamage - Math.floor(defBonus / 10));

      setTimeout(() => {
        const nextPlayerHp = Math.max(0, playerHp - netDamage);
        setPlayerHp(nextPlayerHp);
        onPlayerHpChange(nextPlayerHp);
        if (nextPlayerHp <= 0) {
          handleBattleDefeat();
        }
        setShakeScreen(false);
        setBossAttacking(false);
      }, 500);
    }

    setShowAnswerExplanation(true);
  };

  const handleBattleVictory = () => {
    sound.playLevelUp();
    sound.playReward();
    setBattleOutcome('victory');
    setIsBattleFinished(true);
  };

  const handleBattleDefeat = () => {
    setBattleOutcome('defeat');
    setIsBattleFinished(true);
  };

  const claimVictoryRewards = () => {
    sound.playReward();
    // Tính toán thưởng
    let rawExp = isBoss ? 50 : 25;
    let rawGold = isBoss ? 80 : 35;
    let rawGem = isBoss ? 5 : 0;

    // Pet tăng thưởng
    if (player.pet === 'p_fox') {
      rawGold = Math.floor(rawGold * 1.15);
    } else if (player.pet === 'p_dragon') {
      rawGold = Math.floor(rawGold * 1.25);
      rawExp = Math.floor(rawExp * 1.25);
    }

    onVictory({
      exp: rawExp,
      gold: rawGold,
      gem: rawGem,
      stageNum: stageNumber
    });
  };

  const revivePlayer = () => {
    sound.playClick();
    if (player.gold >= 100) {
      sound.playLevelUp();
      // Trừ 100 vàng để hồi sinh đầy máu tiếp tục chiến đấu
      player.gold -= 100;
      setPlayerHp(player.maxHp);
      onPlayerHpChange(player.maxHp);
      setIsBattleFinished(false);
      setBattleOutcome(null);
      loadNewQuestion();
    } else {
      onDefeat();
    }
  };

  return (
    <div className={`p-4 md:p-6 max-w-5xl mx-auto rounded-3xl bg-white/55 backdrop-blur-md border border-white/50 shadow-md ${shakeScreen ? 'animate-bounce' : ''}`} id="arena-main">
      
      {/* Khung Tiêu Đề Trực Quan */}
      <div className="flex justify-between items-center pb-4 border-b border-white/35 mb-6" id="arena-header">
        <div>
          <span className="text-[10px] font-mono tracking-widest text-indigo-900 uppercase font-black bg-indigo-50 px-2.5 py-1 rounded">
            {currentRegion.name}
          </span>
          <h2 className="text-xl md:text-2xl font-black text-indigo-950 mt-1">
            {isBoss ? `⚔️ ẢI 15 - TRẬN BOSS CUỐI: ${currentRegion.bossName}` : `🏹 Màn Luyện Tập ${stageNumber}/15`}
          </h2>
        </div>
        <button
          onClick={() => {
            sound.playClick();
            onBackToMap();
          }}
          className="px-4 py-2 bg-white/50 text-xs font-black rounded-xl text-indigo-950 border border-white/35 hover:bg-white/80 cursor-pointer"
        >
          Quay lại bản đồ
        </button>
      </div>

      {/* KHU VỰC CHIẾN ĐẤU ĐỒ HỌA (ANIMATED RPG STAGE) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-100/60 rounded-3xl p-6 border border-slate-200/80 relative mb-6 min-h-[220px] shadow-inner overflow-hidden" id="combat-stage">
        
        {/* Nền phong cảnh nhẹ theo vùng đất */}
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-100/10 to-indigo-50/20 opacity-80 rounded-2xl pointer-events-none" />

        {/* BÊN TRÁI: NGƯỜI CHƠI CHIBI & PET ĐỒNG HÀNH */}
        <motion.div 
          animate={playerAttacking ? { x: [0, 40, 0] } : {}}
          transition={{ duration: 0.4 }}
          className="flex flex-col items-center justify-center relative z-10"
          id="hero-side"
        >
          <div className="relative">
            {/* Người chơi */}
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-100 to-slate-50 border-4 border-amber-400 shadow-md flex items-center justify-center text-5xl relative">
              👦
              {/* Trang trí vũ khí */}
              {player.equipped.weapon && (
                <span className="absolute -bottom-2 -left-2 text-3xl filter hover:scale-110 duration-200 select-none">⚔️</span>
              )}
            </div>

            {/* Pet cưng đồng hành bay nhảy */}
            {player.pet && (
              <motion.div 
                animate={{ y: [0, -6, 0] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
                className="absolute -top-3 -right-6 w-12 h-12 rounded-full bg-white/80 border border-white flex items-center justify-center text-2xl shadow-md"
                title={`Đã kích hoạt Pet: ${getPetBonusLabel()}`}
              >
                {getPetEmoji()}
              </motion.div>
            )}
          </div>

          <div className="mt-4 text-center w-full max-w-[180px]">
            <span className="font-extrabold text-sm text-indigo-950">{player.name}</span>
            <div className="w-full bg-slate-200 rounded-full h-3 border border-slate-300 overflow-hidden mt-1 relative shadow-inner">
              <div 
                className="h-full bg-emerald-500 rounded-full" 
                style={{ width: `${(playerHp / player.maxHp) * 100}%` }}
              />
              <span className="absolute inset-0 flex items-center justify-center text-[8px] font-mono leading-none font-bold text-emerald-950">
                HP: {playerHp}/{player.maxHp}
              </span>
            </div>
          </div>
        </motion.div>

        {/* BÊN PHẢI: QUÁI VẬT BOSS */}
        <motion.div 
          animate={bossAttacking ? { x: [0, -40, 0] } : {}}
          transition={{ duration: 0.4 }}
          className="flex flex-col items-center justify-center relative z-10"
          id="boss-side"
        >
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-rose-50 to-slate-50 border-4 border-rose-600 shadow-md flex items-center justify-center text-5xl">
            {currentRegion.bossAvatar}
          </div>

          <div className="mt-4 text-center w-full max-w-[180px]">
            <span className="font-black text-sm text-rose-700">
              {isBoss ? currentRegion.bossName : `Quái Lười Tiểu Cấp`}
            </span>
            <div className="w-full bg-slate-200 rounded-full h-3 border border-slate-300 overflow-hidden mt-1 relative shadow-inner">
              <div 
                className="h-full bg-rose-500 rounded-full transition-all duration-300" 
                style={{ width: `${(bossHp / bossMaxHp) * 100}%` }}
              />
              <span className="absolute inset-0 flex items-center justify-center text-[8px] font-mono leading-none font-bold text-rose-950">
                HP: {bossHp}/{bossMaxHp}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Thông báo chiến đấu / combat dialogue */}
        {combatText && (
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-white border border-indigo-200 px-4 py-1.5 rounded-full text-[10px] font-mono font-black tracking-tight text-indigo-900 text-center animate-bounce shadow-sm">
            ⚡ {combatText}
          </div>
        )}
      </div>

      {/* KHUK VỰC CÂU HỎI TRẮC NGHIỆM */}
      <AnimatePresence mode="wait">
        {!isBattleFinished && currentQuestion && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4 relative"
            id="question-card"
          >
            {/* Nội dung câu hỏi */}
            <div className="bg-white/45 border border-white/45 p-5 rounded-3xl shadow-sm">
              <div className="flex items-center gap-1.5 text-slate-500 text-xs mb-2">
                <HelpCircle className="w-4 h-4 text-indigo-600" />
                <span className="font-bold">Kiến thức cần trả lời chính xác:</span>
              </div>
              <h3 className="text-indigo-950 text-md md:text-lg font-black leading-relaxed">
                {currentQuestion.question}
              </h3>
            </div>

            {/* 4 Đáp án A - B - C - D */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" id="answers-grid">
              {currentQuestion.answers.map((ans, idx) => {
                const prefix = String.fromCharCode(65 + idx); // A, B, C, D
                const isSelected = selectedAnswer === idx;
                const isCorrectAns = idx === currentQuestion.correct;
                
                let btnStyle = 'bg-white/35 border-white/40 text-slate-800 hover:bg-white/60 hover:border-indigo-400';
                if (selectedAnswer !== null) {
                  if (isSelected) {
                    btnStyle = isCorrectAns
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-800 font-extrabold shadow-sm'
                      : 'bg-rose-50 border-rose-300 text-rose-800 font-extrabold shadow-sm';
                  } else if (isCorrectAns && showAnswerExplanation) {
                    btnStyle = 'bg-emerald-50/70 border-emerald-300 text-emerald-700';
                  } else {
                    btnStyle = 'opacity-40 bg-white/10 border-transparent text-slate-400';
                  }
                }

                return (
                  <button
                    key={idx}
                    disabled={selectedAnswer !== null}
                    onClick={() => handleAnswerClick(idx)}
                    className={`p-4 rounded-xl border-2 text-left transition duration-150 flex items-start gap-2.5 cursor-pointer disabled:pointer-events-none ${btnStyle}`}
                  >
                    <span className="font-mono font-black text-amber-600 shrink-0">{prefix}.</span>
                    <span className="text-xs font-semibold">{ans}</span>
                  </button>
                );
              })}
            </div>

            {/* Gợi ý đố học thuật (Hint) */}
            <div className="flex justify-between items-center pt-2">
              <div>
                {currentQuestion.hint && !showHint && (
                  <button
                    onClick={() => {
                      sound.playClick();
                      setShowHint(true);
                    }}
                    className="flex items-center gap-1 text-[11px] font-black text-amber-705 hover:text-amber-800 cursor-pointer"
                  >
                    💡 Gợi ý học tập
                  </button>
                )}
                {showHint && currentQuestion.hint && (
                  <p className="text-[11px] bg-amber-50 border border-amber-200 text-amber-850 px-3 py-1.5 rounded-xl max-w-md shadow-inner animate-fade-in font-sans font-semibold">
                    📚 {currentQuestion.hint}
                  </p>
                )}
              </div>

              {/* Tiếp tục nạp câu hỏi mới sau khi hoàn tất xem kết quả câu này */}
              {selectedAnswer !== null && (
                <button
                  onClick={loadNewQuestion}
                  className="px-5 py-2.5 bg-indigo-600 text-white font-black rounded-xl text-xs hover:bg-indigo-700 transition shadow-md flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Chuyển câu hỏi mới
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MÀN TỔNG KẾT KHI KẾT THÚC BẬT LÊN (VICTORY / DEFEAT SCREENS) */}
      <AnimatePresence>
        {isBattleFinished && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm z-55 flex items-center justify-center p-4"
            id="battle-end-modal"
          >
            {battleOutcome === 'victory' ? (
              // BẢNG CHIẾN THẮNG
              <div aria-label="Khung chiến thắng" className="bg-white border border-white rounded-3xl p-6 md:p-8 w-full max-w-md text-center shadow-2xl">
                <span className="text-7xl filter drop-shadow">🎉</span>
                <h3 className="text-2xl font-black text-indigo-950 uppercase mt-4">
                  QUA ẢI THÀNH CÔNG!
                </h3>
                <p className="text-xs text-slate-650 mt-2 font-sans font-bold md:px-4">
                  Em đã trả lời chính xác, đánh bại quái vật, giải cứu vương quốc và tích lũy được các phần thưởng sau:
                </p>

                {/* Chiến lợi phẩm */}
                <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200 my-6 shadow-inner">
                  <div className="flex flex-col items-center">
                    <span className="text-2xl">🪙</span>
                    <span className="text-[10px] text-slate-500 font-mono font-black mt-1">VÀNG TÍCH LŨY</span>
                    <span className="font-mono font-black text-amber-850 text-lg">
                      +{isBoss ? 80 : 35} {player.pet && <strong className="text-[10px] text-slate-400">({getPetBonusLabel()})</strong>}
                    </span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-2xl">⚡</span>
                    <span className="text-[10px] text-slate-500 font-mono font-black mt-1">EXP PHIÊU LƯU</span>
                    <span className="font-mono font-black text-indigo-700 text-lg">
                      +{isBoss ? 50 : 25}
                    </span>
                  </div>
                  {isBoss && (
                    <div className="col-span-2 flex justify-center items-center gap-2 border-t border-slate-200 pt-2 mt-2">
                      <span className="text-xl">💎</span>
                      <span className="text-xs font-mono font-black text-rose-600">Cộng thêm +5 Kim Cương!</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <button
                    onClick={claimVictoryRewards}
                    className="w-full py-3.5 bg-indigo-650 bg-indigo-600 text-white font-black tracking-widest uppercase rounded-xl hover:bg-indigo-700 transition border border-indigo-500 shadow-sm cursor-pointer"
                  >
                    🎁 Nhận Quà & Tiến Bước 🎁
                  </button>
                </div>
              </div>
            ) : (
              // BẢNG THẤT BẠI
              <div aria-label="Khung thất bại" className="bg-white border border-white rounded-3xl p-6 md:p-8 w-full max-w-md text-center shadow-2xl">
                <span className="text-7xl filter drop-shadow">🥀</span>
                <h3 className="text-2xl font-black text-rose-650 uppercase mt-4">
                  CỐ GẮNG LÊN EM NHÉ!
                </h3>
                <p className="text-xs text-slate-650 mt-2 font-sans font-bold md:px-4">
                  Thất bại hôm nay là mẹ thành công mai sau! Thầy cô khuyên em nên đọc sách, ôn tập lại các phím tắt và phép tính để tiếp tục công phá quái vật nhé.
                </p>

                {/* Options hồi sinh hoặc thoát */}
                <div className="my-6 space-y-3">
                  <button
                    disabled={player.gold < 100}
                    onClick={revivePlayer}
                    className="w-full py-3 bg-amber-500 hover:bg-amber-600 transition text-slate-950 font-black rounded-xl text-xs flex items-center justify-center gap-1.5 border border-amber-400 cursor-pointer disabled:opacity-40"
                  >
                    🩹 Hồi Phục Đầy Máu (Tốn 100 Vàng)
                  </button>
                  {player.gold < 100 && (
                    <p className="text-[10px] text-rose-600 font-extrabold">
                      * Cần tối thiểu 100 vàng để hồi sinh tại chỗ.
                    </p>
                  )}
                </div>

                <button
                  onClick={() => {
                    sound.playClick();
                    onDefeat();
                  }}
                  className="w-full py-3 border border-slate-205 text-slate-600 hover:bg-slate-50 transition rounded-xl text-xs font-black cursor-pointer"
                >
                  Rút lui về Bản đồ
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
