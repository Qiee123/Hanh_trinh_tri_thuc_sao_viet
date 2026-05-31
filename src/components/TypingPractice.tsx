/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Player } from '../types';
import { sound } from './SoundManager';
import { Keyboard, ArrowRight, Play, RefreshCw, Award, Volume2, Lock, CheckCircle, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface TypingPracticeProps {
  player: Player;
  onCompleteTyping: (gold: number, exp: number) => void;
  onBackToQuests: () => void;
}

interface Lesson {
  id: number;
  name: string;
  desc: string;
  difficulty: 'Rất Dễ' | 'Dễ' | 'Trung Bình' | 'Khó' | 'Rất Khó' | 'Huyền Thoại';
  phrases: { text: string; desc: string; category: string }[];
}

// 6 Bài luyện ngón thông minh rèn từ đơn giản đến khó dần phục vụ trẻ em học tập gõ 10 ngón
const TYPING_LESSONS: Lesson[] = [
  {
    id: 1,
    name: 'Bài 1: Khởi động - Hàng phím Cơ Sở',
    desc: 'Bóng tối vỡ ra khi dũng sĩ luyện 8 phím gốc hàng Giữa (Home Row). Hãy đặt 4 ngón tay trái lên A S D F và 4 ngón tay phải lên J K L ; nhẹ nhàng.',
    difficulty: 'Rất Dễ',
    phrases: [
      { text: 'a s d f j k l ;', desc: 'Luyện gõ tuần tự từng ngón tay một cách chậm rãi, đều nhịp.', category: 'exercise' },
      { text: 'asdf jkl;', desc: 'Gõ liền một lèo tay trái trước tay phải sau liên kết mượt mà.', category: 'exercise' },
      { text: 'ff jj dd kk ss ll aa ;;', desc: 'Luyện thao tác gập đúp hai lần dứt khoát rèn sức bật đầu ngón.', category: 'exercise' }
    ]
  },
  {
    id: 2,
    name: 'Bài 2: Đột phá - Ghép từ hàng Giữa',
    desc: 'Kết hợp linh hoạt các ngón tay ở hàng giữa nhằm kiến tạo nên các từ ghép tiếng Anh siêu cơ bản.',
    difficulty: 'Dễ',
    phrases: [
      { text: 'sad dad', desc: 'Rèn luyện phản xạ cặp ngón tay trái s, a, d ấm áp.', category: 'exercise' },
      { text: 'ask fad', desc: 'Khéo léo sang nhịp gõ kết hợp cả hai bên bàn tay trái phải.', category: 'exercise' },
      { text: 'sad dad ask fad', desc: 'Chuỗi xâu chuỗi rèn luyện cơ tay phản xạ không cần nhìn bàn phím.', category: 'exercise' }
    ]
  },
  {
    id: 3,
    name: 'Bài 3: Vươn cao - Hàng Trên cơ bản',
    desc: 'Trải nghiệm kỹ năng vươn ngón trỏ và ngón giữa lên hàng phím Trên (để gõ phím E, I, R, U).',
    difficulty: 'Trung Bình',
    phrases: [
      { text: 'f r e d j u i k', desc: 'Vươn ngón trỏ lên r, u ; vươn ngón giữa lên e, i nhịp nhàng.', category: 'exercise' },
      { text: 'rude deer free juice', desc: 'Thiết kế từ tiếng Anh thông dụng rèn cự ly vươn chính xác.', category: 'exercise' },
      { text: 'em yeu lop hoc tin hoc', desc: 'Tập viết câu tiếng Việt không dấu đơn giản dứt khoát.', category: 'slogan' }
    ]
  },
  {
    id: 4,
    name: 'Bài 4: Gập sâu - Trải nghiệm Hàng Dưới',
    desc: 'Rèn luyện gập đều các ngón xuống hàng phím Dưới (phím Z, X, C, V, B, N, M), rèn sự dẻo dai của khớp tay.',
    difficulty: 'Khó',
    phrases: [
      { text: 'f v c d j n m k', desc: 'Uốn rướn cặp ngón trỏ và ngón giữa gập nhẹ xuống hàng dưới.', category: 'exercise' },
      { text: 'van back next exam', desc: 'Hành trình mười ngón bay lượn kết nối hàng phím dưới.', category: 'exercise' },
      { text: 'Ctrl + C va Ctrl + V', desc: 'Thao tác tổ hợp sao chép & dán nhanh nhạy bổ ích.', category: 'shortcut' }
    ]
  },
  {
    id: 5,
    name: 'Bài 5: Bứt tốc - Hàng phím Số học',
    desc: 'Thử thách vươn ngón tay cao nhất lên hàng phím Số trên cùng để chinh phục các chữ số từ 0 đến 9.',
    difficulty: 'Rất Khó',
    phrases: [
      { text: '1 2 3 4 5 6 7 8 9 0', desc: 'Bấm đều đặn cự ly vươn tối đa để chạm đúng dải số.', category: 'exercise' },
      { text: 'grade 5 is coding 101', desc: 'Luyện phản xạ gõ đan xen nhịp nhàng chữ cái thường và số.', category: 'exercise' },
      { text: 'toan hoc va tin hoc rat vui', desc: 'Gõ nhanh dải từ vựng toán học lý thú kết hợp phím cách.', category: 'slogan' }
    ]
  },
  {
    id: 6,
    name: 'Bài 6: Thạc Dĩ - Lập trình Cú Pháp',
    desc: 'Khoa mục huyền thoại dành cho lập trình viên nhí: kết hợp ký tự đặc biệt, dấu ngoặc nhọn, nháy kép.',
    difficulty: 'Huyền Thoại',
    phrases: [
      { text: 'print("Hello World")', desc: 'In dòng chữ huyền thoại trong Python chuẩn cú pháp.', category: 'coding' },
      { text: '<html><body>code</body></html>', desc: 'Gõ thẻ dải xương sườn giao diện trang web HTML mượt mà.', category: 'coding' },
      { text: 'Ctrl + Shift + T', desc: 'Tổ hợp phím khôi phục nhanh tab hữu dụng tuyệt hảo.', category: 'shortcut' }
    ]
  }
];

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
  if (['1', 'q', 'a', 'z', '!', '`', '~'].includes(c)) {
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

  return { hand: 'right', finger: 'pinky', fingerName: 'Ngón út phải' };
}

export default function TypingPractice({ player, onCompleteTyping, onBackToQuests }: TypingPracticeProps) {
  // Đọc mốc bài luyện ngón đã mở khóa từ localStorage
  const [unlockedLevel, setUnlockedLevel] = useState<number>(() => {
    const saved = localStorage.getItem('stv_typing_unlocked_level');
    return saved ? parseInt(saved, 10) : 1;
  });

  const [selectedLessonId, setSelectedLessonId] = useState<number>(1);
  const activeLesson = TYPING_LESSONS.find(l => l.id === selectedLessonId) || TYPING_LESSONS[0];
  const phrasesToUse = activeLesson.phrases;

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
  const currentPhrase = phrasesToUse[currentIndex] || phrasesToUse[0];
  const nextChar = currentPhrase && !isFinished ? currentPhrase.text[typedText.length] : undefined;
  const activeGuide = nextChar ? getFingerGuide(nextChar) : null;

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [currentIndex, isFinished, selectedLessonId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTotalKeystrokes(prev => prev + 1);

    const expected = currentPhrase.text;
    
    if (val === expected) {
      sound.playCorrect();
      setCorrectKeystrokes(prev => prev + 1);
      setTypedText(val);

      // Cộng dồn thưởng dựa theo độ khó của từng bài tập
      const levelMultiplier = selectedLessonId; 
      const bonusGold = 6 + (levelMultiplier * 2);
      const bonusExp = 4 + levelMultiplier;
      
      setGoldEarned(prev => prev + bonusGold);
      setExpEarned(prev => prev + bonusExp);

      if (currentIndex < phrasesToUse.length - 1) {
        setTimeout(() => {
          setTypedText('');
          setCurrentIndex(prev => prev + 1);
        }, 120);
      } else {
        // Đã hoàn tất toàn bộ bài tập này của khóa hối! Mở khóa bài gõ tiếp theo nếu đạt yêu cầu
        setIsFinished(true);
        
        if (selectedLessonId === unlockedLevel && unlockedLevel < TYPING_LESSONS.length) {
          const nextLevel = unlockedLevel + 1;
          setUnlockedLevel(nextLevel);
          localStorage.setItem('stv_typing_unlocked_level', String(nextLevel));
        }

        setTimeout(() => {
          setShowResultCard(true);
          sound.playLevelUp();
        }, 400);
      }
    } else if (expected.startsWith(val)) {
      if (val.length > typedText.length) {
        sound.playClick();
        setCorrectKeystrokes(prev => prev + 1);
      }
      setTypedText(val);
    } else {
      sound.playIncorrect();
    }
  };

  const handleSelectLesson = (id: number) => {
    if (id > unlockedLevel) {
      sound.playIncorrect();
      alert('🔒 Bài gõ này đang bị khóa! Em hãy gõ thật chính xác và hoàn thành bài trước để mở khóa nhé.');
      return;
    }
    sound.playClick();
    setSelectedLessonId(id);
    setCurrentIndex(0);
    setTypedText('');
    setIsFinished(false);
    setShowResultCard(false);
    setGoldEarned(0);
    setExpEarned(0);
    setCorrectKeystrokes(0);
    setTotalKeystrokes(0);
  };

  const finishAndClaim = () => {
    onCompleteTyping(goldEarned, expEarned);
    onBackToQuests();
  };

  const accuracy = totalKeystrokes > 0 ? Math.round((correctKeystrokes / totalKeystrokes) * 100) : 100;

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto" id="typing-arena-wrapper">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-4 border-b border-indigo-100 mb-6 gap-3" id="typing-header">
        <div>
          <span className="text-[10px] font-mono tracking-widest text-indigo-900 uppercase font-black bg-indigo-50 px-2.5 py-1 rounded">
            Hệ Thống Luyện Ngón Tiến Trình
          </span>
          <h2 className="text-xl md:text-2xl font-black text-indigo-950 mt-1 flex items-center gap-2">
            ⌨️ HỌC VIỆN GO 10 NGÓN SAO VIỆT
          </h2>
        </div>
        <button
          onClick={() => {
            sound.playClick();
            onBackToQuests();
          }}
          className="px-4 py-2 bg-white/60 hover:bg-white text-xs font-black rounded-xl text-indigo-950 border border-indigo-100 hover:border-indigo-305 cursor-pointer shadow-xs"
        >
          Quay lại Bản đồ Thám hiểm
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* SIDEBAR LESSON SELECTION (Dũng sĩ chinh phục từ từ) */}
        <div className="lg:col-span-4 space-y-3" id="typing-lessons-sidebar">
          <div className="p-4 bg-indigo-950 text-white rounded-2xl flex items-center justify-between shadow-sm">
            <h3 className="text-xs font-black tracking-wider uppercase flex items-center gap-2">
              <Keyboard className="w-4 h-4 text-amber-400" />
              Chương Trình Luyện Ngón
            </h3>
            <span className="text-[11px] font-mono bg-white/20 px-2 py-0.5 rounded-md text-amber-300 font-bold">
              Đã mở: {unlockedLevel}/6
            </span>
          </div>

          <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
            {TYPING_LESSONS.map((lesson) => {
              const isLocked = lesson.id > unlockedLevel;
              const isActive = lesson.id === selectedLessonId;
              const isFinishedByMe = lesson.id < unlockedLevel;

              let difficultyColor = 'text-green-600 bg-green-50';
              if (lesson.difficulty === 'Trung Bình') difficultyColor = 'text-amber-600 bg-amber-50';
              else if (lesson.difficulty === 'Khó' || lesson.difficulty === 'Rất Khó') difficultyColor = 'text-orange-600 bg-orange-50';
              else if (lesson.difficulty === 'Huyền Thoại') difficultyColor = 'text-red-600 bg-red-50';

              return (
                <button
                  key={lesson.id}
                  onClick={() => handleSelectLesson(lesson.id)}
                  disabled={isLocked && lesson.id !== 1}
                  className={`w-full text-left p-3.5 rounded-2xl border transition duration-150 flex items-center justify-between cursor-pointer ${
                    isActive 
                      ? 'bg-indigo-50 border-indigo-300 ring-2 ring-indigo-500/10' 
                      : isLocked
                        ? 'bg-slate-100/70 border-slate-200 text-slate-400 cursor-not-allowed opacity-60'
                        : 'bg-white border-slate-100 hover:bg-slate-50'
                  }`}
                >
                  <div className="space-y-1 pr-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-xs font-black text-slate-900">
                        {lesson.name}
                      </span>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${difficultyColor}`}>
                        {lesson.difficulty}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 line-clamp-1 leading-normal font-sans">
                      {lesson.desc}
                    </p>
                  </div>

                  <div className="shrink-0">
                    {isLocked ? (
                      <Lock className="w-4 h-4 text-slate-400" />
                    ) : isFinishedByMe ? (
                      <CheckCircle className="w-5 h-5 text-emerald-500 fill-emerald-50" />
                    ) : (
                      <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-indigo-600 animate-ping' : 'bg-slate-350'}`} />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="p-3 bg-amber-50/50 border border-amber-100 rounded-2xl text-[11px] text-amber-900 leading-normal font-sans">
            💡 <strong>Mẹo luyện gõ:</strong> Trẻ mầm non, học sinh lớp 1 mới bắt đầu gõ nên chỉ gõ <strong>Bài 1</strong> hàng giữa cơ bản. Khi đôi bàn tay đã quen phím, hệ thống sẽ mở khóa bài tập tiếp theo để em rèn luyện khó dần lên!
          </div>
        </div>

        {/* WORKSPACE & GRAPHICS */}
        <div className="lg:col-span-8">
          <AnimatePresence mode="wait">
            {!showResultCard ? (
              <motion.div
                key={`${selectedLessonId}-${currentIndex}`}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="bg-white rounded-3xl p-5 md:p-6 border border-slate-100 shadow-xs space-y-6"
                id="arena-stage"
              >
                {/* Progress bar */}
                <div className="flex justify-between items-center text-xs font-bold text-slate-500 flex-wrap gap-2">
                  <span>Tiến trình Bài tập: {currentIndex + 1} / {phrasesToUse.length} cụm phím</span>
                  <span className="text-indigo-600 font-black">Thưởng tích lũy: 🪙 +{goldEarned} Vàng | ⚡ +{expEarned} EXP</span>
                </div>

                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden shadow-inner">
                  <div 
                    className="h-full bg-indigo-600 rounded-full transition-all duration-300"
                    style={{ width: `${((currentIndex + 1) / phrasesToUse.length) * 100}%` }}
                  />
                </div>

                {/* TEXT SCREEN DISPLAY */}
                <div className="bg-slate-950 rounded-2xl p-7 relative overflow-hidden flex flex-col items-center justify-center min-h-[160px] shadow-inner text-center">
                  <div className="absolute top-3 left-3 px-2 py-0.5 rounded bg-white/10 text-[9px] font-mono font-bold text-white uppercase tracking-wider select-none">
                    Khối mộc: {currentPhrase.category}
                  </div>

                  <div className="font-mono text-xl md:text-3xl text-zinc-500 font-bold tracking-normal mb-3 select-none flex flex-wrap justify-center">
                    {currentPhrase.text.split('').map((char, index) => {
                      let colorClass = 'text-zinc-500';
                      let decoClass = '';
                      if (index < typedText.length) {
                        colorClass = 'text-emerald-400 font-black';
                      } else if (index === typedText.length) {
                        colorClass = 'text-amber-400 font-black underline decoration-2';
                        decoClass = 'animate-pulse';
                      }
                      
                      const displayChar = char === ' ' ? '␣' : char;
                      return (
                        <span key={index} className={`${colorClass} ${decoClass} mx-0.5 transition duration-100`}>
                          {displayChar}
                        </span>
                      );
                    })}
                  </div>

                  <p className="text-white/60 text-xs md:text-sm font-sans max-w-lg leading-relaxed select-none">
                    📖 {currentPhrase.desc}
                  </p>
                </div>

                {/* ACTIVE GUIDE - HAND ANIMATION */}
                {activeGuide && (
                  <div className="bg-slate-50 border border-slate-150 rounded-2xl p-4 md:p-5 space-y-4" id="finger-guide-panel">
                    <div className="flex justify-between items-center gap-2 border-b border-slate-200 pb-2.5">
                      <h4 className="text-xs font-black text-indigo-950 uppercase flex items-center gap-1.5">
                        👐 HƯỚNG DẪN ĐẶT NGÓN TAY
                      </h4>
                      <p className="text-[11px] font-sans font-bold text-slate-500 bg-indigo-50/70 border border-indigo-100/40 px-2.5 py-0.5 rounded-full">
                        Phím kế tế: Dùng <span className="text-indigo-650 font-extrabold text-indigo-600">{activeGuide.fingerName}</span> gõ phím <span className="font-mono bg-white border border-slate-350 font-extrabold px-1.5 py-0.5 rounded text-amber-600 text-xs">'{nextChar === ' ' ? 'Phím Cách' : nextChar}'</span>
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* LEFT CARD */}
                      <div className={`flex flex-col items-center p-3 rounded-xl border transition-all duration-150 ${activeGuide.hand === 'left' ? 'bg-amber-50/40 border-amber-200 shadow-xs' : 'bg-white/50 border-slate-150'}`}>
                        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full mb-4 ${activeGuide.hand === 'left' ? 'bg-amber-100 text-amber-900' : 'bg-slate-100 text-slate-500'}`}>
                          Bàn tay Trái {activeGuide.hand === 'left' && '👈'}
                        </span>
                        
                        <div className="relative w-44 h-24 flex items-end justify-center select-none">
                          <div className={`absolute bottom-0 w-28 h-10 rounded-t-2xl border-t transition-all duration-150 ${activeGuide.hand === 'left' ? 'bg-amber-200 border-amber-350' : 'bg-slate-200 border-slate-300'}`} />
                          
                          <div className={`absolute left-3 bottom-8 w-4 rounded-full transition-all duration-150 flex flex-col items-center justify-end pb-1 ${activeGuide.hand === 'left' && activeGuide.finger === 'pinky' ? 'bg-amber-450 bg-amber-500 h-14 ring-2 ring-amber-200 text-white font-extrabold' : 'bg-slate-300 h-9 text-slate-500'}`}>
                            <span className="text-[7px] font-bold">ÚT</span>
                          </div>
                          <div className={`absolute left-8 bottom-8 w-4 rounded-full transition-all duration-150 flex flex-col items-center justify-end pb-1 ${activeGuide.hand === 'left' && activeGuide.finger === 'ring' ? 'bg-amber-450 bg-amber-500 h-16 ring-2 ring-amber-200 text-white font-extrabold' : 'bg-slate-300 h-11 text-slate-500'}`}>
                            <span className="text-[7px] font-bold">ÁP</span>
                          </div>
                          <div className={`absolute left-13 bottom-8 w-4 rounded-full transition-all duration-150 flex flex-col items-center justify-end pb-1 ${activeGuide.hand === 'left' && activeGuide.finger === 'middle' ? 'bg-amber-450 bg-amber-500 h-18 ring-2 ring-amber-200 text-white font-extrabold' : 'bg-slate-300 h-13 text-slate-500'}`}>
                            <span className="text-[7px] font-bold">GIỮA</span>
                          </div>
                          <div className={`absolute left-18 bottom-8 w-4 rounded-full transition-all duration-150 flex flex-col items-center justify-end pb-1 ${activeGuide.hand === 'left' && activeGuide.finger === 'index' ? 'bg-amber-450 bg-amber-500 h-16 ring-2 ring-amber-200 text-white font-extrabold' : 'bg-slate-300 h-12 text-slate-500'}`}>
                            <span className="text-[7px] font-bold">TRỎ</span>
                          </div>
                          <div className={`absolute left-23 bottom-4 w-4 rounded-full transition-all duration-150 flex flex-col items-center justify-end pb-1 origin-bottom-left -rotate-[30deg] ${activeGuide.hand === 'left' && activeGuide.finger === 'thumb' ? 'bg-amber-450 bg-amber-500 h-11 ring-2 ring-amber-200 text-white font-extrabold' : 'bg-slate-300 h-7 text-slate-500'}`}>
                            <span className="text-[7px] font-bold">CÁI</span>
                          </div>
                        </div>
                      </div>

                      {/* RIGHT CARD */}
                      <div className={`flex flex-col items-center p-3 rounded-xl border transition-all duration-150 ${activeGuide.hand === 'right' ? 'bg-amber-50/40 border-amber-200 shadow-xs' : 'bg-white/50 border-slate-150'}`}>
                        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full mb-4 ${activeGuide.hand === 'right' ? 'bg-amber-100 text-amber-900' : 'bg-slate-100 text-slate-500'}`}>
                          Bàn tay Phải {activeGuide.hand === 'right' && '👉'}
                        </span>
                        
                        <div className="relative w-44 h-24 flex items-end justify-center select-none">
                          <div className={`absolute bottom-0 w-28 h-10 rounded-t-2xl border-t transition-all duration-150 ${activeGuide.hand === 'right' ? 'bg-amber-200 border-amber-350' : 'bg-slate-200 border-slate-300'}`} />
                          
                          <div className={`absolute right-23 bottom-4 w-4 rounded-full transition-all duration-150 flex flex-col items-center justify-end pb-1 origin-bottom-right rotate-[30deg] ${activeGuide.hand === 'right' && activeGuide.finger === 'thumb' ? 'bg-amber-450 bg-amber-500 h-11 ring-2 ring-amber-200 text-white font-extrabold' : 'bg-slate-300 h-7 text-slate-500'}`}>
                            <span className="text-[7px] font-bold">CÁI</span>
                          </div>
                          <div className={`absolute right-18 bottom-8 w-4 rounded-full transition-all duration-150 flex flex-col items-center justify-end pb-1 ${activeGuide.hand === 'right' && activeGuide.finger === 'index' ? 'bg-amber-450 bg-amber-500 h-16 ring-2 ring-amber-200 text-white font-extrabold' : 'bg-slate-300 h-12 text-slate-500'}`}>
                            <span className="text-[7px] font-bold">TRỎ</span>
                          </div>
                          <div className={`absolute right-13 bottom-8 w-4 rounded-full transition-all duration-150 flex flex-col items-center justify-end pb-1 ${activeGuide.hand === 'right' && activeGuide.finger === 'middle' ? 'bg-amber-450 bg-amber-500 h-18 ring-2 ring-amber-200 text-white font-extrabold' : 'bg-slate-300 h-13 text-slate-500'}`}>
                            <span className="text-[7px] font-bold">GIỮA</span>
                          </div>
                          <div className={`absolute right-8 bottom-8 w-4 rounded-full transition-all duration-150 flex flex-col items-center justify-end pb-1 ${activeGuide.hand === 'right' && activeGuide.finger === 'ring' ? 'bg-amber-450 bg-amber-500 h-16 ring-2 ring-amber-200 text-white font-extrabold' : 'bg-slate-300 h-11 text-slate-500'}`}>
                            <span className="text-[7px] font-bold">ÁP</span>
                          </div>
                          <div className={`absolute right-3 bottom-8 w-4 rounded-full transition-all duration-150 flex flex-col items-center justify-end pb-1 ${activeGuide.hand === 'right' && activeGuide.finger === 'pinky' ? 'bg-amber-450 bg-amber-500 h-14 ring-2 ring-amber-200 text-white font-extrabold' : 'bg-slate-300 h-9 text-slate-500'}`}>
                            <span className="text-[7px] font-bold">ÚT</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* TEXT INPUT FIELD */}
                <div className="space-y-3">
                  <div className="relative">
                    <input
                      ref={inputRef}
                      type="text"
                      value={typedText}
                      onChange={handleInputChange}
                      disabled={isFinished}
                      placeholder="Bấm đặt tay cơ sở và gõ đáp án tại đây..."
                      className="w-full text-center px-4 py-3.5 bg-indigo-50/10 border-2 border-indigo-150 focus:border-indigo-500 rounded-2xl font-mono text-lg font-bold text-indigo-950 focus:ring-4 focus:ring-indigo-100 outline-none transition duration-150 shadow-inner"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-2xl filter saturate-75 opacity-45 select-none hidden md:inline">
                      ⌨️
                    </span>
                  </div>

                  <div className="flex flex-col md:flex-row justify-between items-center gap-3 text-xs font-sans text-slate-500 font-bold bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-1.5">
                      <Volume2 className="w-3.5 h-3.5 text-slate-400" />
                      <span>Sử dụng phím Shift cho ký tự IN HOA nếu cần!</span>
                    </div>
                    <div className="flex gap-4">
                      <span>Cột gõ: {totalKeystrokes}</span>
                      <span className="text-indigo-700">Độ chính xác: {accuracy}%</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              /* LESSON REWARD OR FINAL SCREEN */
              <motion.div
                key="result-stage"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 text-center shadow-lg space-y-6"
                id="typing-result-card"
              >
                <div className="relative inline-block">
                  <span className="text-7xl">🏆</span>
                  <Sparkles className="w-6 h-6 text-amber-500 absolute -top-1 -right-1 animate-bounce" />
                </div>
                <h3 className="text-2xl font-black text-indigo-950 uppercase">
                  Bài tập Hoàn Thành Mỹ Mãn!
                </h3>
                <p className="text-xs text-slate-500 font-sans font-bold px-4 leading-relaxed">
                  Em đã hoàn thành tốt khóa mục <strong>{activeLesson.name}</strong>, gặt hái được vàng và EXP thăng tiến sức mạnh thám hiểm.
                </p>

                <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-150 shadow-inner font-mono text-sm max-w-sm mx-auto">
                  <div className="flex flex-col items-center">
                    <span className="text-2xl">🪙</span>
                    <span className="text-[9px] text-slate-500 font-black mt-1 uppercase">Vàng Tích Lũy</span>
                    <span className="font-mono font-black text-amber-800 text-lg">+{goldEarned}</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-2xl">⚡</span>
                    <span className="text-[9px] text-slate-500 font-black mt-1 uppercase">EXP Học tập</span>
                    <span className="font-mono font-black text-indigo-700 text-lg">+{expEarned}</span>
                  </div>
                  <div className="col-span-2 border-t border-slate-200 pt-2.5 mt-2 flex justify-between px-3 text-xs font-bold text-slate-500 font-sans">
                    <span>Gõ hợp lệ: {correctKeystrokes} phím</span>
                    <span>Chính xác: {accuracy}%</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 max-w-sm mx-auto">
                  <button
                    onClick={() => {
                      const nextLvlId = selectedLessonId + 1;
                      if (nextLvlId <= unlockedLevel) {
                        handleSelectLesson(nextLvlId);
                      } else {
                        // claim and back to map
                        finishAndClaim();
                      }
                    }}
                    className="flex-1 py-3 bg-indigo-650 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-xl cursor-pointer text-xs uppercase tracking-wider"
                  >
                    {selectedLessonId < unlockedLevel ? 'Bài học Tiếp Theo ➔' : 'Nhận Quà & Hoàn Thành 🎉'}
                  </button>
                  {selectedLessonId === unlockedLevel && (
                    <button
                      onClick={finishAndClaim}
                      className="py-3 px-5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black rounded-xl cursor-pointer text-xs uppercase"
                    >
                      Bản đồ chính
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
