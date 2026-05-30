/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Player } from '../types';
import { sound } from './SoundManager';
import { Keyboard, ArrowRight, Play, RefreshCw, Award, Volume2, Key, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface TypingPracticeProps {
  player: Player;
  onCompleteTyping: (gold: number, exp: number) => void;
  onBackToQuests: () => void;
}

// Danh sách các từ, lệnh và phím tắt dành cho học viên ôn tập thiết kế đặc trị theo từng Lớp học
const GRADE_PHRASES: Record<string, { text: string; desc: string; category: string }[]> = {
  grade_1: [
    { text: 'em yeu lop 1', desc: 'Em yêu lớp 1 - Tập gõ phím cơ bản rèn chữ cái tiếng Việt', category: 'slogan' },
    { text: 'tin hoc sao viet', desc: 'Tin học Sao Việt - Trường học công nghệ tuyệt vời dành cho bé', category: 'slogan' },
    { text: 'hoc tap cham chi', desc: 'Học tập chăm chỉ - Tập gõ các phím cơ bản thật điêu luyện', category: 'slogan' },
    { text: 'be go ban phim', desc: 'Bé gõ bàn phím - Luyện gõ phím 10 ngón với tư thế ngồi chuẩn', category: 'exercise' },
    { text: 'Ctrl + C', desc: 'Phím sao chép đối tượng tiện lợi', category: 'shortcut' }
  ],
  grade_2: [
    { text: 'em hoc go phim 10 ngon', desc: 'Em tập gõ phím mười ngón tay giúp tăng tốc độ gõ chữ', category: 'exercise' },
    { text: 'tin hoc rat la vui', desc: 'Tin học rất là vui - Khám phá thế giới trò chơi giáo dục kỳ thú', category: 'slogan' },
    { text: 'may tinh la ban cua em', desc: 'Máy tính là bạn của em - Kính hiển vi kỹ thuật số mở tạ thế giới rộng lớn', category: 'exercise' },
    { text: 'Ctrl + C va Ctrl + V', desc: 'Tổ hợp phím thần thánh: Sao chép đối tượng rồi Dán nhanh', category: 'shortcut' },
    { text: 'Ctrl + S de luu bai', desc: 'Ctrl + S để Lưu bài học - Giúp bảo toàn đồ án quý giá', category: 'shortcut' }
  ],
  grade_3: [
    { text: 'hoc tin hoc tren may tinh sao viet', desc: 'Gõ chữ thạo và rèn luyện kỹ năng gõ từ kết hợp không dấu', category: 'exercise' },
    { text: '=SUM(A1:A5) tinh tong trong excel', desc: 'Hàm SUM - Công cụ tính nhanh tổng các ô dữ liệu trong bảng Excel lớp 3', category: 'office' },
    { text: 'Ctrl + Z de undo tro lai buoc truoc', desc: 'Nhấn Ctrl + Z khi gõ sai hoặc làm hỏng sơ đồ để quay về bước trước đó', category: 'shortcut' },
    { text: 'hoc moi ngay manh hon moi ngay', desc: 'Châm ngôn tiến bước rèn luyện tri thức vững chãi của chúng ta', category: 'slogan' }
  ],
  grade_4: [
    { text: 'may tinh co ban phim va chuot nhap du lieu', desc: 'Các thiết bị đầu vào cốt lõi giúp học sinh tương tác học tin học', category: 'office' },
    { text: 'print("Chao mung ban den voi Python")', desc: 'Dòng lệnh Python đầu đời đón chào em vào thế giới lập trình kỳ thú', category: 'coding' },
    { text: 'Alt + Tab giup chuyen doi cua so sieu toc', desc: 'Tách biệt công tác học tập: chuyển đổi qua lại nhanh chóng giữa các trang', category: 'shortcut' },
    { text: 'PowerPoint thiet ke slide thuyet trinh', desc: 'Sử dụng phần mềm trình chiếu PowerPoint để tự tin thuyết trình trước lớp', category: 'office' }
  ],
  grade_5: [
    { text: '<html> giup tao dung cau truc mot trang web xinh dep', desc: 'Học sinh lớp 5 khám phá mã HTML định nghĩa cấu trúc nội dung internet', category: 'coding' },
    { text: 'SELECT * FROM students WHERE point >= 9', desc: 'Truy vấn SQL nâng cao xuất danh sách các học viên xuất sắc nhất lớp', category: 'coding' },
    { text: 'Alt + F4 dong ngay ung dung dang chay tren Windows', desc: 'Tổ hợp phím tắt khôi phục không gian màn hình bằng cách tắt ứng dụng nhanh', category: 'shortcut' },
    { text: 'Ctrl + Shift + T khoi phuc lai tab web vua vo tinh dong', desc: 'Mẹo cứu cánh vô cùng hữu hiệu cho các bạn lỡ tay xóa tab bài học bận rộn', category: 'shortcut' }
  ]
};

interface FingerGuide {
  hand: 'left' | 'right';
  finger: 'pinky' | 'ring' | 'middle' | 'index' | 'thumb';
  fingerName: string;
}

function getFingerGuide(char: string | undefined): FingerGuide | null {
  if (!char) return null;
  const c = char.toLowerCase();

  // Spacebar
  if (c === ' ' || c === '␣') {
    return { hand: 'left', finger: 'thumb', fingerName: 'Ngón cái' };
  }

  // Left hand pinky
  if (['1', 'q', 'a', 'z', '!', '`', '~', 'c', 'v'].includes(c)) {
    // If copying/pasting hotkeys
    if (c === 'c' || c === 'v') {
      return { hand: 'left', finger: 'index', fingerName: 'Ngón trỏ trái' };
    }
    return { hand: 'left', finger: 'pinky', fingerName: 'Ngón út trái' };
  }
  // Left hand ring
  if (['2', 'w', 's', 'x', '@'].includes(c)) {
    return { hand: 'left', finger: 'ring', fingerName: 'Ngón áp út trái' };
  }
  // Left hand middle
  if (['3', 'e', 'd', 'c', '#'].includes(c)) {
    return { hand: 'left', finger: 'middle', fingerName: 'Ngón giữa trái' };
  }
  // Left hand index
  if (['4', 'r', 'f', 'v', '5', 't', 'g', 'b', '$', '%'].includes(c)) {
    return { hand: 'left', finger: 'index', fingerName: 'Ngón trỏ trái' };
  }

  // Right hand index
  if (['6', 'y', 'h', 'n', '7', 'u', 'j', 'm', '^', '&'].includes(c)) {
    return { hand: 'right', finger: 'index', fingerName: 'Ngón trỏ phải' };
  }
  // Right hand middle
  if (['8', 'i', 'k', ',', '*', '<'].includes(c)) {
    return { hand: 'right', finger: 'middle', fingerName: 'Ngón giữa phải' };
  }
  // Right hand ring
  if (['9', 'o', 'l', '.', '(', ')'].includes(c)) {
    return { hand: 'right', finger: 'ring', fingerName: 'Ngón áp út phải' };
  }
  // Right hand pinky
  if (['0', 'p', ';', ':', '/', '?', '-', '_', '=', '+', '[', ']', '{', '}', '\\', '|'].includes(c)) {
    return { hand: 'right', finger: 'pinky', fingerName: 'Ngón út phải' };
  }

  // Fallback
  return { hand: 'right', finger: 'pinky', fingerName: 'Ngón út phải' };
}

export default function TypingPractice({ player, onCompleteTyping, onBackToQuests }: TypingPracticeProps) {
  const gradeKey = player.grade && GRADE_PHRASES[player.grade] ? player.grade : 'grade_1';
  const phrasesToUse = GRADE_PHRASES[gradeKey];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [typedText, setTypedText] = useState('');
  const [isFinished, setIsFinished] = useState(false);
  const [showResultCard, setShowResultCard] = useState(false);
  const [goldEarned, setGoldEarned] = useState(0);
  const [expEarned, setExpEarned] = useState(0);
  
  // Stats
  const [correctKeystrokes, setCorrectKeystrokes] = useState(0);
  const [totalKeystrokes, setTotalKeystrokes] = useState(0);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const currentPhrase = phrasesToUse[currentIndex];
  const nextChar = currentPhrase && !isFinished ? currentPhrase.text[typedText.length] : undefined;
  const activeGuide = nextChar ? getFingerGuide(nextChar) : null;

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [currentIndex, isFinished]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTotalKeystrokes(prev => prev + 1);

    // Kiểm tra ký tự vừa nhập vào có gõ đúng với cụm từ mẫu không
    const expected = currentPhrase.text;
    
    if (val === expected) {
      // Đúng hoàn toàn cụm từ này
      sound.playCorrect();
      setCorrectKeystrokes(prev => prev + 1);
      setTypedText(val);

      // Thưởng vàng tích lũy cho mỗi từ gõ đúng
      const bonusGold = currentPhrase.category === 'coding' ? 12 : 8;
      const bonusExp = 5;
      
      setGoldEarned(prev => prev + bonusGold);
      setExpEarned(prev => prev + bonusExp);

      // Chuyển sang cụm tiếp theo
      if (currentIndex < phrasesToUse.length - 1) {
        setTimeout(() => {
          setTypedText('');
          setCurrentIndex(prev => prev + 1);
        }, 100);
      } else {
        // Đã hoàn tất toàn bộ bộ gõ phím
        setIsFinished(true);
        setTimeout(() => {
          setShowResultCard(true);
          sound.playLevelUp();
        }, 400);
      }
    } else if (expected.startsWith(val)) {
      // Đang gõ đúng từng phần
      if (val.length > typedText.length) {
        sound.playClick();
        setCorrectKeystrokes(prev => prev + 1);
      }
      setTypedText(val);
    } else {
      // Gõ sai
      sound.playIncorrect();
      // Không cập nhật typedText để giữ chữ đúng, bắt buộc học viên sửa lỗi gõ sai
    }
  };

  const finishAndClaim = () => {
    onCompleteTyping(goldEarned, expEarned);
    onBackToQuests();
  };

  // Tính độ chính xác %
  const accuracy = totalKeystrokes > 0 ? Math.round((correctKeystrokes / totalKeystrokes) * 100) : 100;

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto" id="typing-arena-wrapper">
      
      {/* HEADER */}
      <div className="flex justify-between items-center pb-4 border-b border-white/35 mb-6" id="typing-header">
        <div>
          <span className="text-[10px] font-mono tracking-widest text-indigo-900 uppercase font-black bg-indigo-50 px-2.5 py-1 rounded">
            Luyện Gõ Phím 10 Ngón
          </span>
          <h2 className="text-xl md:text-2xl font-black text-indigo-950 mt-1 flex items-center gap-2">
            ⌨️ VŨ ĐÀI GO PHÍM SAO VIỆT
          </h2>
        </div>
        <button
          onClick={() => {
            sound.playClick();
            onBackToQuests();
          }}
          className="px-4 py-2 bg-white/50 text-xs font-black rounded-xl text-indigo-950 border border-white/35 hover:bg-white/80 cursor-pointer"
        >
          Quay lại Nhiệm Vụ
        </button>
      </div>

      <AnimatePresence mode="wait">
        {!showResultCard ? (
          <motion.div
            key="practice-stage"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="bg-white/55 backdrop-blur-md rounded-3xl p-6 border border-white/50 shadow-md space-y-6"
            id="arena-stage"
          >
            {/* Progress indicator */}
            <div className="flex justify-between items-center text-xs font-bold text-slate-500">
              <span>Độ tiến trình: {currentIndex + 1} / {phrasesToUse.length} cụm từ</span>
              <span className="text-indigo-600 font-black">Thưởng tích lũy: 🪙 +{goldEarned} Vàng | ⚡ +{expEarned} EXP</span>
            </div>

            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden shadow-inner">
              <div 
                className="h-full bg-indigo-600 rounded-full transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / phrasesToUse.length) * 100}%` }}
              />
            </div>

            {/* PHRASE DISPLAY AREA */}
            <div className="bg-slate-950 rounded-2xl p-8 relative overflow-hidden flex flex-col items-center justify-center min-h-[180px] shadow-inner text-center">
              <div className="absolute top-3 left-3 px-2 py-0.5 rounded bg-white/10 text-[9px] font-mono font-bold text-white uppercase tracking-wider select-none">
                Chủ đề: {currentPhrase.category}
              </div>

              {/* Target Phrase with Highlighted Progress */}
              <div className="font-mono text-xl md:text-3xl text-zinc-500 font-bold tracking-normal mb-3 select-none flex flex-wrap justify-center">
                {currentPhrase.text.split('').map((char, index) => {
                  let colorClass = 'text-zinc-500';
                  let decoClass = '';
                  if (index < typedText.length) {
                    colorClass = 'text-emerald-400 font-black'; // đã gõ đúng
                  } else if (index === typedText.length) {
                    colorClass = 'text-amber-400 font-black underline decoration-2'; // ký tự kế tiếp cần gõ
                    decoClass = 'animate-pulse';
                  }
                  
                  // Thay thế khoảng trắng hiển thị để rõ nét hơn
                  const displayChar = char === ' ' ? '␣' : char;
                  return (
                    <span key={index} className={`${colorClass} ${decoClass} mx-0.5 transition duration-100`}>
                      {displayChar}
                    </span>
                  );
                })}
              </div>

              {/* Định nghĩa phím tắt / Mô tả giáo dục */}
              <p className="text-white/60 text-xs md:text-sm font-sans max-w-lg leading-relaxed select-none">
                📖 {currentPhrase.desc}
              </p>
            </div>

            {/* 10-FINGER TYPING VISUAL GUIDE */}
            {activeGuide && (
              <div className="bg-slate-50 border border-slate-200 rounded-3xl p-5 md:p-6 space-y-4 shadow-sm" id="finger-guide-panel">
                <div className="flex flex-col md:flex-row justify-between items-center gap-2 border-b border-slate-150 pb-3">
                  <h4 className="text-xs font-black text-indigo-950 uppercase flex items-center gap-1.5">
                    👐 BÀN TAY HƯỚNG DẪN 10 NGÓN TAY
                  </h4>
                  <p className="text-[11px] font-sans font-bold text-slate-500 bg-indigo-50/75 border border-indigo-100/50 px-3 py-1 rounded-full">
                    Gợi ý: Hãy dùng <span className="text-indigo-600 font-extrabold">{activeGuide.fingerName}</span> để gõ ký tự <span className="font-mono bg-white border border-slate-300 font-extrabold px-1.5 py-0.5 rounded text-amber-600 text-xs">'{nextChar === ' ' ? 'Cách' : nextChar}'</span>
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  {/* LEFT HAND CARD */}
                  <div className={`flex flex-col items-center p-4 rounded-2xl border transition-all duration-300 ${activeGuide.hand === 'left' ? 'bg-amber-50/60 border-amber-200 ring-2 ring-amber-100/50' : 'bg-white/40 border-slate-200'}`}>
                    <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full mb-6 tracking-wider uppercase ${activeGuide.hand === 'left' ? 'bg-amber-100 text-amber-900 border border-amber-200' : 'bg-slate-100 text-slate-500 border border-slate-200'}`}>
                      Bàn tay Trái {activeGuide.hand === 'left' && '👈'}
                    </span>
                    {/* Visual model Left hand */}
                    <div className="relative w-48 h-32 flex items-end justify-center select-none">
                      {/* Palm background */}
                      <div className={`absolute bottom-0 w-32 h-14 rounded-t-3xl border-t transition-all duration-300 ${activeGuide.hand === 'left' ? 'bg-amber-200/80 border-amber-300' : 'bg-slate-200 border-slate-300'}`} />
                      
                      {/* Pinky Left */}
                      <div className={`absolute left-4 bottom-12 w-5 rounded-full transition-all duration-300 flex flex-col items-center justify-end pb-1 shadow-inner ${activeGuide.hand === 'left' && activeGuide.finger === 'pinky' ? 'bg-gradient-to-t from-amber-400 to-amber-500 h-18 ring-4 ring-amber-100 text-white font-extrabold' : 'bg-slate-300 text-slate-700 h-12'}`}>
                        <span className="text-[8px] font-sans font-bold leading-none">ÚT</span>
                      </div>

                      {/* Ring Left */}
                      <div className={`absolute left-10 bottom-12 w-5 rounded-full transition-all duration-300 flex flex-col items-center justify-end pb-1 shadow-inner ${activeGuide.hand === 'left' && activeGuide.finger === 'ring' ? 'bg-gradient-to-t from-amber-400 to-amber-500 h-22 ring-4 ring-amber-100 text-white font-extrabold' : 'bg-slate-300 text-slate-700 h-16'}`}>
                        <span className="text-[8px] font-sans font-bold leading-none">ÁP</span>
                      </div>

                      {/* Middle Left */}
                      <div className={`absolute left-16 bottom-12 w-5 rounded-full transition-all duration-300 flex flex-col items-center justify-end pb-1 shadow-inner ${activeGuide.hand === 'left' && activeGuide.finger === 'middle' ? 'bg-gradient-to-t from-amber-400 to-amber-500 h-24 ring-4 ring-amber-100 text-white font-extrabold' : 'bg-slate-300 text-slate-700 h-18'}`}>
                        <span className="text-[8px] font-sans font-bold leading-none">GIỮA</span>
                      </div>

                      {/* Index Left */}
                      <div className={`absolute left-22 bottom-12 w-5 rounded-full transition-all duration-300 flex flex-col items-center justify-end pb-1 shadow-inner ${activeGuide.hand === 'left' && activeGuide.finger === 'index' ? 'bg-gradient-to-t from-amber-400 to-amber-500 h-22 ring-4 ring-amber-100 text-white font-extrabold' : 'bg-slate-300 text-slate-700 h-16'}`}>
                        <span className="text-[8px] font-sans font-bold leading-none">TRỎ</span>
                      </div>

                      {/* Thumb Left */}
                      <div className={`absolute left-28 bottom-7 w-5 rounded-full transition-all duration-300 flex flex-col items-center justify-end pb-1 shadow-inner origin-bottom-left -rotate-[30deg] ${activeGuide.hand === 'left' && activeGuide.finger === 'thumb' ? 'bg-gradient-to-t from-amber-400 to-amber-500 h-14 ring-4 ring-amber-100 text-white font-extrabold' : 'bg-slate-300 text-slate-700 h-10'}`}>
                        <span className="text-[8px] font-sans font-bold leading-none">CÁI</span>
                      </div>
                    </div>
                  </div>

                  {/* RIGHT HAND CARD */}
                  <div className={`flex flex-col items-center p-4 rounded-2xl border transition-all duration-300 ${activeGuide.hand === 'right' ? 'bg-amber-50/60 border-amber-200 ring-2 ring-amber-100/50' : 'bg-white/40 border-slate-200'}`}>
                    <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full mb-6 tracking-wider uppercase ${activeGuide.hand === 'right' ? 'bg-amber-100 text-amber-900 border border-amber-200' : 'bg-slate-100 text-slate-500 border border-slate-200'}`}>
                      Bàn tay Phải {activeGuide.hand === 'right' && '👉'}
                    </span>
                    {/* Visual model Right hand */}
                    <div className="relative w-48 h-32 flex items-end justify-center select-none">
                      {/* Palm background */}
                      <div className={`absolute bottom-0 w-32 h-14 rounded-t-3xl border-t transition-all duration-300 ${activeGuide.hand === 'right' ? 'bg-amber-200/80 border-amber-300' : 'bg-slate-200 border-slate-300'}`} />
                      
                      {/* Thumb Right */}
                      <div className={`absolute right-28 bottom-7 w-5 rounded-full transition-all duration-300 flex flex-col items-center justify-end pb-1 shadow-inner origin-bottom-right rotate-[30deg] ${activeGuide.hand === 'right' && activeGuide.finger === 'thumb' ? 'bg-gradient-to-t from-amber-400 to-amber-500 h-14 ring-4 ring-amber-100 text-white font-extrabold' : 'bg-slate-300 text-slate-700 h-10'}`}>
                        <span className="text-[8px] font-sans font-bold leading-none">CÁI</span>
                      </div>

                      {/* Index Right */}
                      <div className={`absolute right-22 bottom-12 w-5 rounded-full transition-all duration-300 flex flex-col items-center justify-end pb-1 shadow-inner ${activeGuide.hand === 'right' && activeGuide.finger === 'index' ? 'bg-gradient-to-t from-amber-400 to-amber-500 h-22 ring-4 ring-amber-100 text-white font-extrabold' : 'bg-slate-300 text-slate-700 h-16'}`}>
                        <span className="text-[8px] font-sans font-bold leading-none">TRỎ</span>
                      </div>

                      {/* Middle Right */}
                      <div className={`absolute right-16 bottom-12 w-5 rounded-full transition-all duration-300 flex flex-col items-center justify-end pb-1 shadow-inner ${activeGuide.hand === 'right' && activeGuide.finger === 'middle' ? 'bg-gradient-to-t from-amber-400 to-amber-500 h-24 ring-4 ring-amber-100 text-white font-extrabold' : 'bg-slate-300 text-slate-700 h-18'}`}>
                        <span className="text-[8px] font-sans font-bold leading-none">GIỮA</span>
                      </div>

                      {/* Ring Right */}
                      <div className={`absolute right-10 bottom-12 w-5 rounded-full transition-all duration-300 flex flex-col items-center justify-end pb-1 shadow-inner ${activeGuide.hand === 'right' && activeGuide.finger === 'ring' ? 'bg-gradient-to-t from-amber-400 to-amber-500 h-22 ring-4 ring-amber-100 text-white font-extrabold' : 'bg-slate-300 text-slate-700 h-16'}`}>
                        <span className="text-[8px] font-sans font-bold leading-none">ÁP</span>
                      </div>

                      {/* Pinky Right */}
                      <div className={`absolute right-4 bottom-12 w-5 rounded-full transition-all duration-300 flex flex-col items-center justify-end pb-1 shadow-inner ${activeGuide.hand === 'right' && activeGuide.finger === 'pinky' ? 'bg-gradient-to-t from-amber-400 to-amber-500 h-18 ring-4 ring-amber-100 text-white font-extrabold' : 'bg-slate-300 text-slate-700 h-12'}`}>
                        <span className="text-[8px] font-sans font-bold leading-none">ÚT</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* INPUT BOX */}
            <div className="space-y-4">
              <div className="relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={typedText}
                  onChange={handleInputChange}
                  disabled={isFinished}
                  placeholder="Bắt đầu gõ lại dòng chữ phía trên tại đây..."
                  className="w-full text-center px-4 py-4 bg-white/70 border-2 border-indigo-250 border-indigo-200 focus:border-indigo-505 rounded-2xl font-mono text-lg md:text-xl font-bold text-indigo-950 focus:ring-4 focus:ring-indigo-100 outline-none transition duration-150 shadow-inner"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-2xl filter saturate-75 opacity-40 select-none hidden md:inline">
                  ⌨️
                </span>
              </div>

              <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-sans text-slate-500 font-bold bg-white/40 p-4 rounded-xl border border-white/50">
                <div className="flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-slate-500" />
                  <span>Mẹo: Hãy kích hoạt âm thanh loa để nghe nhịp gõ phím chân thật!</span>
                </div>
                <div className="flex gap-4">
                  <span>Tổng lực gõ: {totalKeystrokes}</span>
                  <span className="text-indigo-700">Độ chính xác: {accuracy}%</span>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          /* RESULT END SCREEN */
          <motion.div
            key="result-stage"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md mx-auto bg-white border border-white rounded-3xl p-6 md:p-8 text-center shadow-2xl space-y-6"
            id="typing-result-card"
          >
            <span className="text-7xl filter drop-shadow">🏆</span>
            <h3 className="text-2xl font-black text-indigo-950 uppercase">
              TỐC THỦ BÀN PHÍM XUẤT SẮC!
            </h3>
            <p className="text-xs text-slate-650 font-sans font-bold px-4">
              Em đã hoàn thành tốt khoa mục rèn luyện gõ bàn phím và phản xạ phím tắt tại Sao Việt, gặt hái được các quà tặng sau:
            </p>

            <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200 shadow-inner font-mono text-sm">
              <div className="flex flex-col items-center">
                <span className="text-2xl">🪙</span>
                <span className="text-[10px] text-slate-500 font-black mt-1">VÀNG TÍCH LŨY</span>
                <span className="font-mono font-black text-amber-850 text-lg">+{goldEarned}</span>
              </div>
              <div className="flex flex-col flex-wrap items-center">
                <span className="text-2xl">⚡</span>
                <span className="text-[10px] text-slate-500 font-black mt-1">EXP HỌC TẬP</span>
                <span className="font-mono font-black text-indigo-700 text-lg">+{expEarned}</span>
              </div>
              <div className="col-span-2 border-t border-slate-200 pt-2 mt-2 flex justify-between px-4 text-xs font-bold text-slate-500 font-sans">
                <span>Lực gõ hoàn hảo: {correctKeystrokes}</span>
                <span>Tỉ lệ chính xác: {accuracy}%</span>
              </div>
            </div>

            <button
              onClick={finishAndClaim}
              className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black tracking-widest uppercase rounded-xl border border-indigo-500 shadow-md transition cursor-pointer text-xs"
            >
              🎉 Nhận Quà & Hoàn Tất Nhiệm Vụ 🎉
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
