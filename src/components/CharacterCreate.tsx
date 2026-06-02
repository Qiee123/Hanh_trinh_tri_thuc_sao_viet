/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Archetype, Player } from '../types';
import { sound } from './SoundManager';
import { motion, AnimatePresence } from 'motion/react';
import { Phone, Lock, User, GraduationCap, Award, Check, UserPlus, LogIn, Sparkles, BookOpen, ChevronRight } from 'lucide-react';
import { collection, doc, getDocs, getDoc, setDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';

interface CharacterCreateProps {
  onCreated: (player: Player) => void;
}

const CLASS_DETAILS: Record<Archetype, {
  name: string;
  emoji: string;
  avatar: string;
  desc: string;
  stats: { attack: number; defense: number; intelligence: number; luck: number };
  color: string;
}> = {
  warrior: {
    name: 'Chiến Binh Tin Học',
    emoji: '⚔️',
    avatar: '👦',
    desc: 'Học viên quả cảm, say mê thực hành, có sức mạnh bền bỉ chống lại sự lười biếng.',
    stats: { attack: 25, defense: 20, intelligence: 10, luck: 10 },
    color: 'from-amber-600 to-amber-800'
  },
  mage: {
    name: 'Phù Thủy Toán Học',
    emoji: '🔮',
    avatar: '👧',
    desc: 'Bậc thầy tính nhẩm thần tốc, sở hữu năng lực logic vũ trụ giải bài siêu đẳng.',
    stats: { attack: 15, defense: 10, intelligence: 30, luck: 10 },
    color: 'from-indigo-600 to-indigo-800'
  },
  stem: {
    name: 'Nhà Phát Minh STEM',
    emoji: '⚙️',
    avatar: '🧑‍🔬',
    desc: 'Chuyên gia chế tạo robot và thí nghiệm khoa học, hội tụ tư duy sáng tạo vô song.',
    stats: { attack: 18, defense: 12, intelligence: 20, luck: 15 },
    color: 'from-emerald-600 to-emerald-800'
  },
  ninja: {
    name: 'Ninja Bàn Phím',
    emoji: '🥷',
    avatar: '🧔',
    desc: 'Dũng sĩ gõ văn bản 10 ngón không cần nhìn, tốc độ gõ phím nhanh như chớp giật.',
    stats: { attack: 22, defense: 15, intelligence: 12, luck: 16 },
    color: 'from-rose-600 to-rose-800'
  }
};

const AVATAR_LIST = [
  { img: '👦', gender: 'boy' },
  { img: '👧', gender: 'girl' },
  { img: '🧑‍🚀', gender: 'astro' },
  { img: '🥷', gender: 'ninja' },
  { img: '🧑‍🏫', gender: 'mentor' },
  { img: '🦊', gender: 'fox' },
  { img: '🦁', gender: 'lion' },
  { img: '🐼', gender: 'panda' }
];

const GRADE_LIST = [
  { id: 'grade_1', name: 'Lớp 1', desc: 'Phép cộng trừ phạm vi 20, nhận biết phím và sử dụng chuột máy tính cơ bản.' },
  { id: 'grade_2', name: 'Lớp 2', desc: 'Phép tính phạm vi 100, nhân chia bảng 2-5, gõ chữ cơ bản, nút Caps Lock.' },
  { id: 'grade_3', name: 'Lớp 3', desc: 'Toán có dư, Excel tính toán cơ bản, phím tắt sao chép và lưu trữ.' },
  { id: 'grade_4', name: 'Lớp 4', desc: 'Phân số, hình học nâng cao, Word căn lề định dạng, lập trình Scratch rẽ nhánh.' },
  { id: 'grade_5', name: 'Lớp 5', desc: 'Tỉ số phần trăm, số thập phân, Excel nâng cao, lập trình kéo thả và logic Python.' },
];

const COURSE_CLASSES = [
  'THTE-01 Làm Quen Với Máy Tính',
  'THTE-02 Tin Học Ứng Dụng',
  'THTE-03 Tư Duy Số Và Công cụ Sáng tạo',
  'THTE-04A Tin Học Dành Cho Trẻ Em (Module 1 + 2)',
  'THTE-04B Tin Học Dành Cho Trẻ Em (Module 2 + 3)',
  'THTE-04 Tin Học Dành Cho Trẻ Em (Module 1 + 2 + 3)',
  'THTE-05 Phát Triển Tư Duy Với Lập Trình Scratch Cơ Bản',
  'THTE-05 Phát Triển Tư Duy Với Lập Trình Scratch Nâng Cao',
  'THTE-05 Phát Triển Tư Duy Với Lập Trình Scratch Cơ Bản đến Nâng Cao',
  'THTE-09 Phát Triển Tư Duy Với Lập Trình cho học sinh lớp 3',
  'THTE-10 Phát Triển Tư Duy Với Lập Trình cho học sinh lớp 4',
  'THTE-06 Ứng Dụng AI Trong Lập Trình',
  'THTE-07 Lập Trình Python Cơ Bản',
  'THTE-07 Lập Trình Python Nâng Cao',
  'THTE-07 Lập Trình Python Cơ Bản đến Nâng Cao',
  'THTE-08 Chương Trình Tin Học Lập Trình Dành Cho Trẻ Em (Scratch + AI + Python)'
];

const SEED_ACCOUNTS: Player[] = [
  {
    id: 'p_seed_0912345678',
    name: 'Nguyễn Hải Nam',
    grade: 'grade_3',
    archetype: 'warrior',
    level: 5,
    exp: 40,
    expToNextLevel: 100,
    hp: 100,
    maxHp: 100,
    gold: 800,
    gem: 15,
    title: 'Dũng Sĩ Toàn Năng',
    consecutiveDays: 3,
    totalDays: 5,
    lastCheckInDate: new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString(),
    checkedInToday: false,
    checkInHistory: [],
    stats: { attack: 35, defense: 25, intelligence: 15, luck: 15 },
    inventory: [],
    equipped: { weapon: null, armor: null, shield: null, ring: null },
    pet: null,
    petLevel: 1,
    petExp: 0,
    unlockedRegions: ['region_1', 'region_2', 'region_3'],
    completedStages: { region_1: 8, region_2: 4 },
    achievements: [],
    unlockedTitles: ['Dũng Sĩ Toàn Năng'],
    mailRead: [],
    mailClaimed: [],
    guildId: null,
    phoneNumber: '0912345678',
    password: 'Da0912345678',
    classCode: 'THTE-03 Tư Duy Số Và Công cụ Sáng tạo'
  },
  {
    id: 'p_seed_0987654321',
    name: 'Lê Thảo Vy',
    grade: 'grade_5',
    archetype: 'mage',
    level: 8,
    exp: 80,
    expToNextLevel: 100,
    hp: 100,
    maxHp: 100,
    gold: 1200,
    gem: 30,
    title: 'Phù Thủy Tri Thức',
    consecutiveDays: 5,
    totalDays: 9,
    lastCheckInDate: new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString(),
    checkedInToday: false,
    checkInHistory: [],
    stats: { attack: 28, defense: 18, intelligence: 45, luck: 18 },
    inventory: [],
    equipped: { weapon: null, armor: null, shield: null, ring: null },
    pet: null,
    petLevel: 1,
    petExp: 0,
    unlockedRegions: ['region_1', 'region_2', 'region_3', 'region_4', 'region_5'],
    completedStages: { region_1: 15, region_2: 12, region_3: 8 },
    achievements: [],
    unlockedTitles: ['Phù Thủy Tri Thức'],
    mailRead: [],
    mailClaimed: [],
    guildId: null,
    phoneNumber: '0987654321',
    password: 'Da0987654321',
    classCode: 'THTE-05 Phát Triển Tư Duy Với Lập Trình Scratch Cơ Bản đến Nâng Cao'
  }
];

export default function CharacterCreate({ onCreated }: CharacterCreateProps) {
  const [activeTab, setActiveTab] = useState<'register' | 'login'>('register');
  
  // Trạng thái Form Đăng ký
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regName, setRegName] = useState('');
  const [regGrade, setRegGrade] = useState<'grade_1' | 'grade_2' | 'grade_3' | 'grade_4' | 'grade_5'>('grade_1');
  const [regClassCode, setRegClassCode] = useState(COURSE_CLASSES[0]);
  const [regDays, setRegDays] = useState<'2-4-6' | '3-5-7'>('2-4-6');
  const [regShift, setRegShift] = useState<string>('Ca 1: 08:30 – 10:00');
  const [regArchetype, setRegArchetype] = useState<Archetype>('warrior');
  const [selectedAvatar, setSelectedAvatar] = useState('👦');

  // Trạng thái Form Đăng nhập
  const [loginPhone, setLoginPhone] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Sổ cái tài khoản đã lưu
  const [accounts, setAccounts] = useState<Player[]>([]);

  useEffect(() => {
    const loadFirebaseAccounts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'players'));
        const list: Player[] = [];
        querySnapshot.forEach((docSnap) => {
          list.push(docSnap.data() as Player);
        });

        if (list.length > 0) {
          setAccounts(list);
          localStorage.setItem('stv_registered_accounts', JSON.stringify(list));
        } else {
          // If Firestore is completely fresh, write the SEED_ACCOUNTS into Firestore
          for (const acc of SEED_ACCOUNTS) {
            await setDoc(doc(db, 'players', acc.id), acc);
          }
          setAccounts(SEED_ACCOUNTS);
          localStorage.setItem('stv_registered_accounts', JSON.stringify(SEED_ACCOUNTS));
        }
      } catch (err) {
        console.error('Error loading firebase players:', err);
        // Fallback to local storage if offline or not fully configured
        const saved = localStorage.getItem('stv_registered_accounts');
        if (saved) {
          try {
            setAccounts(JSON.parse(saved));
          } catch (e) {
            setAccounts(SEED_ACCOUNTS);
          }
        } else {
          setAccounts(SEED_ACCOUNTS);
        }
      }
    };
    loadFirebaseAccounts();
  }, []);

  // Tự động gợi ý mật khẩu đúng định dạng Da + số điện thoại cho học học sinh dễ đăng kí
  useEffect(() => {
    if (regPhone.trim().length > 0) {
      // Chỉ lấy các kí tự là số
      const numericPhone = regPhone.replace(/\D/g, '');
      setRegPassword('Da' + numericPhone);
    } else {
      setRegPassword('');
    }
  }, [regPhone]);

  // Đăng ký tài khoản
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Chuẩn hóa Số điện thoại: Phải đủ 10 chữ số
    const processedPhone = regPhone.replace(/\D/g, '');
    if (processedPhone.length !== 10) {
      alert('⚠️ Lỗi Số điện thoại: Số điện thoại phải đúng 10 chữ số (Ví dụ: 0912345678)');
      return;
    }

    // Kiểm tra định dạng mật khẩu bắt buộc: Da + 10 số điện thoại
    const requiredPass = 'Da' + processedPhone;
    if (regPassword !== requiredPass) {
      alert(`⚠️ Lỗi Mật khẩu: Mật khẩu học sinh tại Sao Việt bắt buộc phải đúng định dạng Da + 10 số điện thoại.\nMật khẩu đúng của em phải là: ${requiredPass}`);
      return;
    }

    if (!regName.trim()) {
      alert('⚠️ Vui lòng nhập họ tên của em nhé!');
      return;
    }

    try {
      // Kiểm tra xem số điện thoại này đã được đăng ký chưa bằng cách hỏi Firestore
      const playerDocRef = doc(db, 'players', 'p_' + processedPhone);
      const snap = await getDoc(playerDocRef);
      if (snap.exists()) {
        alert('⚠️ Số điện thoại này đã được đăng ký trên hệ thống Tin Học Sao Việt! Vui lòng chuyển sang tab Đăng Nhập.');
        return;
      }

      sound.playLevelUp();

      const classInfo = CLASS_DETAILS[regArchetype];
      const newPlayer: Player = {
        id: 'p_' + processedPhone,
        name: regName.trim(),
        grade: regGrade,
        archetype: regArchetype,
        level: 1,
        exp: 0,
        expToNextLevel: 100,
        hp: 100,
        maxHp: 100,
        gold: 500, // Tặng một ít vàng ban đầu để mua trang bị
        gem: 10,   // Tặng một ít kim cương
        title: 'Tân Binh Thám Hiểm',
        consecutiveDays: 0,
        totalDays: 0,
        lastCheckInDate: null,
        checkedInToday: false,
        checkInHistory: [],
        stats: { ...classInfo.stats },
        inventory: [],
        equipped: {
          weapon: null,
          armor: null,
          shield: null,
          ring: null
        },
        pet: null,
        petLevel: 1,
        petExp: 0,
        unlockedRegions: ['region_1'],
        completedStages: { region_1: 0 },
        achievements: [],
        unlockedTitles: ['Tân Binh Thám Hiểm'],
        mailRead: [],
        mailClaimed: [],
        guildId: null,
        phoneNumber: processedPhone,
        password: regPassword,
        classCode: regClassCode,
        studyScheduleDays: regDays,
        studyScheduleShift: regShift,
        attendanceCount: 0
      };

      // Ghi trực tiếp lên Firestore
      await setDoc(playerDocRef, newPlayer);

      // Cập nhật danh sách local để hiển thị ngay lập tức
      const updatedAccounts = [...accounts, newPlayer];
      setAccounts(updatedAccounts);
      localStorage.setItem('stv_registered_accounts', JSON.stringify(updatedAccounts));
      
      // Đồng thời cập nhật danh sách học viên quản lý của thầy cô ở Teacher Dashboard
      const savedTeacherDb = localStorage.getItem('stv_teacher_students_db');
      if (savedTeacherDb) {
        try {
          const parsedList = JSON.parse(savedTeacherDb);
          if (!parsedList.some((s: any) => s.id === newPlayer.id)) {
            parsedList.push({
              id: newPlayer.id,
              name: newPlayer.name,
              grade: newPlayer.grade,
              archetype: newPlayer.archetype,
              level: newPlayer.level,
              exp: newPlayer.exp,
              gold: newPlayer.gold,
              gem: newPlayer.gem,
              totalDays: newPlayer.totalDays,
              completedQuestsCount: 0,
              phoneNumber: newPlayer.phoneNumber,
              classCode: newPlayer.classCode,
              studyScheduleDays: newPlayer.studyScheduleDays,
              studyScheduleShift: newPlayer.studyScheduleShift,
              attendanceCount: newPlayer.attendanceCount
            });
            localStorage.setItem('stv_teacher_students_db', JSON.stringify(parsedList));
          }
        } catch (e) {
          console.error(e);
        }
      }

      // Thông báo đăng ký thành công và chuyển qua màn hình Đăng nhập để học sinh tiến hành đăng nhập thủ công
      alert(`🎉 Chúc mừng ${newPlayer.name} đăng ký tài khoản thành công!\nHãy sử dụng số điện thoại (${newPlayer.phoneNumber}) và mật khẩu vừa đăng ký để tiến hành đăng nhập vào hệ thống RPG nhé!`);
      
      // Lưu số điện thoại đăng ký kéo sang biểu mẫu Đăng nhập, mật khẩu để trống để học sinh tự điền
      setLoginPhone(newPlayer.phoneNumber || '');
      setLoginPassword('');
      
      // Chuyển Tab sang 'login'
      setActiveTab('login');
      
      // Xóa trắng trường đăng ký
      setRegPhone('');
      setRegName('');
    } catch (err) {
      console.error('Registration failed in Firestore: ', err);
      alert('⚠️ Gặp sự cố kết nối dữ liệu máy chủ đám mây. Vui lòng kiểm tra lại mạng kết nối!');
    }
  };

  // Đăng nhập tài khoản có sẵn
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Kiểm tra tài khoản Giáo Viên / Admin đặc biệt
    if (loginPhone.trim().toLowerCase() === 'admin') {
      let targetPassword = 'Da0356894512';
      let fetchedProfile: Player | null = null;
      try {
        const adminDocRef = doc(db, 'players', 'admin_teacher');
        const adminSnap = await getDoc(adminDocRef);
        if (adminSnap.exists()) {
          const data = adminSnap.data() as Player;
          if (data && data.password) {
            targetPassword = data.password;
            fetchedProfile = data;
          }
        }
      } catch (err) {
        console.error('Error loading admin teacher password:', err);
      }

      if (loginPassword === targetPassword) {
        const TEACHER_PLAYER_PROFILE: Player = fetchedProfile || {
          id: 'admin_teacher',
          name: 'Giáo Viên Quản Trị',
          grade: 'grade_5',
          archetype: 'ninja',
          level: 99,
          exp: 0,
          expToNextLevel: 100,
          hp: 999,
          maxHp: 999,
          gold: 99999,
          gem: 999,
          title: 'Giáo Viên Sao Việt',
          consecutiveDays: 1,
          totalDays: 1,
          lastCheckInDate: new Date().toISOString(),
          checkedInToday: true,
          checkInHistory: [],
          stats: { attack: 99, defense: 99, intelligence: 99, luck: 99 },
          inventory: [],
          equipped: { weapon: null, armor: null, shield: null, ring: null },
          pet: null,
          petLevel: 1,
          petExp: 0,
          unlockedRegions: ['region_1', 'region_2', 'region_3', 'region_4', 'region_5'],
          completedStages: { region_1: 15, region_2: 12, region_3: 8 },
          achievements: [],
          unlockedTitles: ['Giáo Viên Sao Việt'],
          mailRead: [],
          mailClaimed: [],
          guildId: null,
          phoneNumber: 'admin',
          password: targetPassword,
          classCode: 'SYSTEM_ADMIN'
        };

        // Nếu thông tin tài khoản admin chưa được lưu trên đám mây, lưu ngay để khởi lập
        if (!fetchedProfile) {
          try {
            await setDoc(doc(db, 'players', 'admin_teacher'), TEACHER_PLAYER_PROFILE);
          } catch (writeErr) {
            console.error('Error seeding admin teacher to Firestore on login:', writeErr);
          }
        }

        sound.playLevelUp();
        localStorage.setItem('stv_player', JSON.stringify(TEACHER_PLAYER_PROFILE));
        alert(`🎉 Đăng nhập thành công với vai trò GIÁO VIÊN! Chào mừng Thầy/Cô trở lại Hệ thống quản lý.`);
        onCreated(TEACHER_PLAYER_PROFILE);
        return;
      } else {
        alert(`⚠️ Mật khẩu quản trị chưa chính xác. Vui lòng kiểm tra lại!`);
        return;
      }
    }
    
    const processedPhone = loginPhone.replace(/\D/g, '');
    
    try {
      // Tìm tài khoản khớp số điện thoại từ Firestore
      const playerDocRef = doc(db, 'players', 'p_' + processedPhone);
      const snap = await getDoc(playerDocRef);
      if (!snap.exists()) {
        alert('⚠️ Số điện thoại chưa được đăng ký! Em hãy chọn Tab "Đăng Ký Tài Khoản" để tạo mới nhé.');
        return;
      }

      const found = snap.data() as Player;

      if (found.password !== loginPassword) {
        alert(`⚠️ Mật khẩu nhập chưa chính xác.\nGợi ý: Mật khẩu bắt buộc là Da + 10 số điện thoại của em (Ví dụ: Da${processedPhone})`);
        return;
      }

      sound.playLevelUp();
      localStorage.setItem('stv_player', JSON.stringify(found));
      alert(`🎉 Đăng nhập thành công!\nChào mừng học viên ${found.name} trở lại lớp học Tin Học Sao Việt!`);
      onCreated(found);
    } catch (err) {
      console.error('Login action failed in Firestore:', err);
      
      // Fallback local login if cloud fails
      const found = accounts.find(acc => acc.phoneNumber === processedPhone);
      if (found) {
        if (found.password !== loginPassword) {
          alert(`⚠️ Mật khẩu nhập chưa chính xác.\nGợi ý: Mật khẩu bắt buộc là Da + 10 số điện thoại của em (Ví dụ: Da${processedPhone})`);
          return;
        }
        sound.playLevelUp();
        localStorage.setItem('stv_player', JSON.stringify(found));
        alert(`🎉 Đăng nhập thành công (Chế độ offline)!\nChào mừng học viên ${found.name} trở lại lớp học Tin Học Sao Việt!`);
        onCreated(found);
      } else {
        alert('⚠️ Không tìm thấy thông tin tài khoản hoặc mất kết nối mạng!');
      }
    }
  };

  const handleClassSelect = (type: Archetype) => {
    sound.playClick();
    setRegArchetype(type);
    setSelectedAvatar(CLASS_DETAILS[type].avatar);
  };

  return (
    <div className="min-h-screen bg-indigo-50/10 flex items-center justify-center p-4 selection:bg-indigo-500 selection:text-white" id="char-create-container">
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(99,102,241,0.05),transparent,rgba(234,179,8,0.05))]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.1),transparent_50%)]" />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="w-full max-w-5xl bg-white/65 backdrop-blur-md border border-white/50 rounded-3xl p-6 md:p-8 shadow-xl relative z-10"
        id="creation-box"
      >
        {/* Banner trường */}
        <div className="text-center mb-6 relative">
          <div className="inline-block text-indigo-900 text-xs font-mono font-black tracking-widest uppercase border border-indigo-100 px-4 py-1.5 rounded-full mb-2 bg-indigo-50 shadow-xs">
            🏢 TRUNG TÂM TIN HỌC SAO VIỆT
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-indigo-950 select-none tracking-tight">
            HÀNH TRÌNH TRI THỨC SAO VIỆT
          </h1>
          <p className="text-indigo-800 mt-2 text-sm md:text-md italic font-bold">
            "Học mỗi ngày – Mạnh hơn mỗi ngày"
          </p>
        </div>

        {/* TABS LỰA CHỌN ĐĂNG KÝ / ĐĂNG NHẬP */}
        <div className="flex bg-indigo-950/5 max-w-sm mx-auto p-1 rounded-2xl border border-indigo-150 border-indigo-100/30 mb-8" id="auth-tabs">
          <button
            type="button"
            onClick={() => { sound.playClick(); setActiveTab('register'); }}
            className={`flex-1 py-2.5 rounded-xl font-black text-xs uppercase flex items-center justify-center gap-1.5 transition cursor-pointer ${
              activeTab === 'register'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-600 hover:text-indigo-950 hover:bg-white/30'
            }`}
          >
            <UserPlus className="w-4 h-4" /> Đăng Ký Học Viên
          </button>
          <button
            type="button"
            onClick={() => { sound.playClick(); setActiveTab('login'); }}
            className={`flex-1 py-2.5 rounded-xl font-black text-xs uppercase flex items-center justify-center gap-1.5 transition cursor-pointer ${
              activeTab === 'login'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-600 hover:text-indigo-950 hover:bg-white/30'
            }`}
          >
            <LogIn className="w-4 h-4" /> Đăng Nhập
          </button>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'register' ? (
            <motion.form
              key="register-form"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              onSubmit={handleRegisterSubmit}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                
                {/* Cột trái: Thông tin tài khoản, mật khẩu, lớp */}
                <div className="space-y-5 bg-white/40 p-5 rounded-2xl border border-white/50 backdrop-blur-xs">
                  <h2 className="text-lg font-black text-indigo-950 flex items-center gap-1.5 border-b border-indigo-100 pb-2">
                    <User className="text-indigo-600 w-5 h-5" /> 1. THÔNG TIN HỌC VIÊN ĐĂNG KÝ
                  </h2>

                  {/* Số điện thoại */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider block">
                      Số điện thoại học viên (10 số):
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                      <input
                        required
                        type="tel"
                        pattern="[0-9]*"
                        maxLength={10}
                        placeholder="Ví dụ: 0912345678"
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value.replace(/\D/g, ''))}
                        className="w-full pl-9 pr-4 py-3 bg-white border border-slate-250 rounded-xl text-indigo-950 font-black focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none transition placeholder:text-slate-400 text-sm"
                      />
                    </div>
                  </div>

                  {/* Mật khẩu */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider block">
                      Mật khẩu học tập (Bắt buộc: Da + Số điện thoại):
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                      <input
                        required
                        type="text"
                        placeholder="Tự động phát sinh theo số điện thoại"
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        className="w-full pl-9 pr-4 py-3 bg-indigo-50/50 border border-slate-200 rounded-xl text-indigo-900 font-mono font-black focus:ring-2 focus:ring-indigo-650 focus:border-indigo-650 outline-none transition placeholder:text-slate-400 text-sm"
                      />
                    </div>
                    {regPhone.length === 10 && (
                      <div className="text-[10px] text-emerald-700 font-extrabold flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Mật khẩu tự động đề xuất: <span className="font-mono bg-emerald-50 px-1 py-0.5 border border-emerald-100 rounded">{regPassword}</span>
                      </div>
                    )}
                  </div>

                  {/* Họ và tên */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider block">
                      Họ và tên học viên:
                    </label>
                    <input
                      required
                      type="text"
                      maxLength={30}
                      placeholder="Nhập họ và tên đầy đủ..."
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-indigo-950 font-bold focus:ring-2 focus:ring-indigo-600 outline-none transition placeholder:text-slate-400 text-sm shadow-xs"
                    />
                  </div>

                  {/* Chọn Lớp Học */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider block">
                      Chọn Lớp Học Tri Thức:
                    </label>
                    <div className="grid grid-cols-5 gap-1 p-1 bg-slate-100 rounded-xl" id="reg-grade-grid">
                      {[1, 2, 3, 4, 5].map((num) => {
                        const gradeId = `grade_${num}` as any;
                        const isSelected = regGrade === gradeId;
                        return (
                          <button
                            key={num}
                            type="button"
                            onClick={() => { sound.playClick(); setRegGrade(gradeId); }}
                            className={`py-2 text-xs font-black rounded-lg transition text-center cursor-pointer ${
                              isSelected
                                ? 'bg-indigo-600 text-white shadow-sm'
                                : 'bg-transparent text-slate-700 hover:text-slate-900'
                            }`}
                          >
                            Lớp {num}
                          </button>
                        );
                      })}
                    </div>
                    <div className="text-[10px] text-indigo-900 font-bold leading-normal bg-indigo-50/50 p-2 border border-indigo-100 rounded-lg">
                      📖 Chuẩn học tập của em: <span className="text-indigo-950 font-extrabold">{GRADE_LIST.find(g => g.id === regGrade)?.desc}</span>
                    </div>
                  </div>

                  {/* CHỌN MÃ LỚP CHO HỌC VIÊN */}
                  <div className="space-y-1.5 pt-1.5 border-t border-slate-100">
                    <label className="text-[11px] font-black text-indigo-950 uppercase tracking-wider block flex items-center gap-1">
                      <GraduationCap className="w-4 h-4 text-indigo-700" /> Chọn Mã Lớp Ghi Danh (Quản Lý):
                    </label>
                    <select
                      value={regClassCode}
                      onChange={(e) => setRegClassCode(e.target.value)}
                      className="w-full p-3.5 bg-white border border-slate-350 text-xs font-black text-slate-800 rounded-xl shadow-inner focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    >
                      {COURSE_CLASSES.map((courseClass) => (
                        <option key={courseClass} value={courseClass}>
                          {courseClass}
                        </option>
                      ))}
                    </select>
                    <p className="text-[9px] text-slate-500 font-medium">
                      📌 Mã lớp học đã chọn sẽ hiển thị đầy đủ trên học bạ hoặc tiến trình học tập của giáo viên quản lý!
                    </p>
                  </div>

                  {/* KHUNG GIỜ HỌC ĐĂNG KÝ */}
                  <div className="space-y-3 pt-3 border-t border-slate-100">
                    <div>
                      <label className="text-[11px] font-black text-indigo-950 uppercase tracking-wider block flex items-center gap-1 mb-1.5">
                        📅 Lịch học trong tuần:
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { id: '2-4-6', label: 'Thứ 2 - 4 - 6' },
                          { id: '3-5-7', label: 'Thứ 3 - 5 - 7' }
                        ].map((d) => {
                          const isSelected = regDays === d.id;
                          return (
                            <button
                              key={d.id}
                              type="button"
                              onClick={() => { sound.playClick(); setRegDays(d.id as any); }}
                              className={`py-2 px-3 text-xs font-black rounded-xl border transition text-center cursor-pointer flex items-center justify-center gap-1.5 ${
                                isSelected
                                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                              }`}
                            >
                              <span>{isSelected ? '✓' : '○'}</span> {d.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-black text-indigo-950 uppercase tracking-wider block flex items-center gap-1 mb-1.5">
                        ⏰ Ca học trong ngày:
                      </label>
                      <select
                        value={regShift}
                        onChange={(e) => setRegShift(e.target.value)}
                        className="w-full p-3 bg-white border border-slate-350 text-xs font-bold text-slate-800 rounded-xl shadow-inner focus:outline-none focus:ring-2 focus:ring-indigo-600"
                      >
                        <option value="Ca 1: 08:30 – 10:00">Ca 1: 08:30 – 10:00</option>
                        <option value="Ca 2: 10:00 – 11:30">Ca 2: 10:00 – 11:30</option>
                        <option value="Ca 3: 14:00 – 15:30">Ca 3: 14:00 – 15:30</option>
                        <option value="Ca 4: 17:00 – 18:30">Ca 4: 17:00 – 18:30</option>
                        <option value="Ca 5: 19:00 – 20:30">Ca 5: 19:00 – 20:30</option>
                      </select>
                      <div className="text-[9px] text-indigo-900 font-bold mt-1">
                        🌟 Lịch học đăng ký: <span className="font-extrabold text-indigo-950">{regDays === '2-4-6' ? 'Thứ 2-4-6' : 'Thứ 3-5-7'} ({regShift.split(': ')[0]})</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Cột phải: Chọn hệ nhân vật game */}
                <div className="space-y-5 bg-white/40 p-5 rounded-2xl border border-white/50 backdrop-blur-xs">
                  <h2 className="text-lg font-black text-indigo-950 flex items-center gap-1.5 border-b border-indigo-100 pb-2">
                    <Sparkles className="text-amber-500 w-5 h-5 animate-pulse" /> 2. NHÂN VẬT & DIỆN MẠO
                  </h2>

                  {/* Chibi Avatars */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider block">
                      Chọn Avatar Chibi May Mắn:
                    </label>
                    <div className="grid grid-cols-4 gap-2 bg-indigo-50/20 p-2.5 rounded-xl border border-indigo-100/35">
                      {AVATAR_LIST.map((av) => (
                        <button
                          key={av.gender}
                          type="button"
                          onClick={() => { sound.playClick(); setSelectedAvatar(av.img); }}
                          className={`h-11 flex items-center justify-center text-xl rounded-lg border transition transform hover:scale-105 cursor-pointer ${
                            selectedAvatar === av.img
                              ? 'bg-amber-100 border-amber-400 scale-105 shadow-xs'
                              : 'bg-white border-slate-200 text-slate-600'
                          }`}
                        >
                          {av.img}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Hệ Nhân Vật */}
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider block">
                      Lựa chọn Hệ Chuyên Nghiệp:
                    </label>
                    <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
                      {(Object.keys(CLASS_DETAILS) as Archetype[]).map((type) => {
                        const details = CLASS_DETAILS[type];
                        const isSelected = regArchetype === type;
                        return (
                          <button
                            key={type}
                            type="button"
                            onClick={() => handleClassSelect(type)}
                            className={`w-full text-left p-2.5 rounded-xl border transition flex gap-3 cursor-pointer ${
                              isSelected
                                ? 'bg-white border-amber-400 shadow-sm ring-1 ring-amber-400/30'
                                : 'bg-white/50 border-slate-200 hover:border-slate-300'
                            }`}
                          >
                            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${details.color} flex items-center justify-center text-md shadow-xs shrink-0 text-white`}>
                              {details.emoji}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-center gap-1 select-none">
                                <span className="font-extrabold text-indigo-950 text-xs truncate">{details.name}</span>
                                <span className="text-[8px] text-indigo-700 font-mono font-black uppercase">
                                  ATK {details.stats.attack} | INT {details.stats.intelligence}
                                </span>
                              </div>
                              <p className="text-[10px] text-slate-500 line-clamp-1 font-medium mt-0.5">
                                {details.desc}
                              </p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Xem trước Tóm Tắt */}
                  <div className="bg-indigo-950/5 p-4 rounded-xl border border-indigo-100 flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-white border border-indigo-200 flex items-center justify-center text-3xl shadow-sm text-center">
                      {selectedAvatar}
                    </div>
                    <div className="min-w-0">
                      <div className="font-extrabold text-indigo-950 text-sm truncate">{regName || "Chưa nhập họ tên..."}</div>
                      <div className="text-[10px] text-slate-600 font-bold flex flex-wrap gap-x-2 items-center">
                        <span className="text-indigo-800">Lớp {regGrade.slice(-1)}</span>
                        <span>•</span>
                        <span className="text-[10px] text-amber-700 font-black truncate">{regClassCode}</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Nút đăng ký */}
              <div className="pt-4 border-t border-indigo-100 text-center">
                <button
                  type="submit"
                  className="px-12 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black tracking-widest uppercase rounded-xl border border-indigo-500 shadow-md transition transform hover:-translate-y-0.5 active:scale-95 cursor-pointer text-xs"
                >
                  🚀 ĐĂNG KÝ HỌC VIÊN CHÍNH THỨC 🚀
                </button>
              </div>
            </motion.form>
          ) : (
            <motion.form
              key="login-form"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onSubmit={handleLoginSubmit}
              className="max-w-md mx-auto space-y-6 bg-white/45 p-6 md:p-8 rounded-2xl border border-white/50 backdrop-blur-xs"
            >
              <h2 className="text-lg font-black text-indigo-950 flex items-center gap-1.5 border-b border-indigo-100 pb-2 justify-center select-none">
                <LogIn className="text-indigo-600 w-5 h-5" /> ĐĂNG NHẬP TRẢI NGHIỆM SAO VIỆT
              </h2>

              {/* SĐT đăng nhập */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest block">
                  Số điện thoại học viên (hoặc tên tài khoản):
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                  <input
                    required
                    type="text"
                    placeholder="Nhập số điện thoại hoặc 'admin'..."
                    value={loginPhone}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val.trim().toLowerCase().startsWith('a')) {
                        setLoginPhone(val);
                      } else {
                        setLoginPhone(val.replace(/[^\d]/g, ''));
                      }
                    }}
                    className="w-full pl-9 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-indigo-950 font-black focus:ring-2 focus:ring-indigo-600 outline-none transition text-sm"
                  />
                </div>
              </div>

              {/* Mật khẩu đăng nhập */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest block">
                  Mật khẩu học viện:
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                  <input
                    required
                    type="password"
                    placeholder="Mật khẩu của em..."
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full pl-9 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 font-mono focus:ring-2 focus:ring-indigo-600 outline-none transition text-sm"
                  />
                </div>
                {loginPhone.trim().toLowerCase() !== 'admin' && (
                  <div className="text-[10px] text-slate-500 font-medium">
                    💡 Nhắc bé: Mật khẩu chuẩn là chữ <span className="font-extrabold text-slate-700">Da</span> kết hợp với 10 số điện thoại của bé (ví dụ: Da0912345678).
                  </div>
                )}
              </div>

              {/* Danh sách acc seed gợi ý để phụ huynh/giáo viên test nhanh */}
              <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-100 text-[10px] space-y-1.5">
                <div className="font-extrabold text-amber-850 text-amber-900 flex items-center gap-1">
                  ⭐ TÀI KHOẢN MẪU KHỞI TẠO ĐỂ TEST ĐĂNG NHẬP:
                </div>
                <div className="space-y-1 font-bold text-slate-600">
                  <div>1) Học viên lớp 3: SĐT: <code className="text-indigo-900 font-black">0912345678</code> | Pass: <code className="text-rose-700 font-black">Da0912345678</code></div>
                  <div>2) Học viên lớp 5: SĐT: <code className="text-indigo-900 font-black">0987654321</code> | Pass: <code className="text-rose-700 font-black">Da0987654321</code></div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase rounded-xl transition shadow-md hover:shadow cursor-pointer text-xs flex items-center justify-center gap-1 h-11"
              >
                VÀO LỚP HỌC TIN HỌC SAO VIỆT <ChevronRight className="w-4 h-4" />
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
