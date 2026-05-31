/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import { useState, useEffect } from 'react';
import { Player, ShopItem, Quest, Mail, Guild } from './types';
import { sound } from './components/SoundManager';
import { REGIONS, SHOP_ITEMS, DAILY_QUESTS_TEMPLATE, ACHIEVEMENTS, INITIAL_MAILS, GUILDS } from './data/gameData';
import { collection, doc, getDocs, setDoc, updateDoc } from 'firebase/firestore';
import { db } from './lib/firebase';

// Các component con của game RPG
import CharacterCreate from './components/CharacterCreate';
import Header from './components/Header';
import WorldMap from './components/WorldMap';
import BattleArea from './components/BattleArea';
import Inventory from './components/Inventory';
import DailyQuests from './components/DailyQuests';
import Shop from './components/Shop';
import DailyCheckIn from './components/DailyCheckIn';
import LeaderboardPage from './components/LeaderboardPage';
import AchievementsPage from './components/AchievementsPage';
import Mailbox from './components/Mailbox';
import GuildPage from './components/GuildPage';
import TypingPractice from './components/TypingPractice';
import LuckyWheel from './components/LuckyWheel';
import TeacherDashboard from './components/TeacherDashboard';

import { motion, AnimatePresence } from 'motion/react';
import { 
  Compass, 
  Map, 
  Swords, 
  BookOpen, 
  ShoppingBag, 
  CalendarCheck, 
  UserCheck, 
  Award, 
  ShieldCheck, 
  HelpCircle,
  Sparkles,
  RefreshCw,
  LogOut,
  Mail as MailIcon,
  Settings,
  X,
  Keyboard,
  GraduationCap
} from 'lucide-react';

export default function App() {
  const [player, setPlayer] = useState<Player | null>(null);
  const [activeTab, setActiveTab] = useState<string>('map');
  const [currRegionId, setCurrRegionId] = useState<string>('region_1');
  const [currStageNum, setCurrStageNum] = useState<number>(1);
  const [isBossBattle, setIsBossBattle] = useState<boolean>(false);

  // Các danh mục động lưu LocalStorage
  const [quests, setQuests] = useState<Quest[]>([]);
  const [mails, setMails] = useState<Mail[]>([]);
  const [guilds, setGuilds] = useState<Guild[]>([]);
  const [purchaseHistory, setPurchaseHistory] = useState<any[]>([]);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // 1. Tải và Khởi tạo dữ liệu từ LocalStorage
  useEffect(() => {
    const savedPlayer = localStorage.getItem('stv_player');
    const savedQuests = localStorage.getItem('stv_quests');
    const savedMails = localStorage.getItem('stv_mails');
    const savedGuilds = localStorage.getItem('stv_guilds');
    const savedHistory = localStorage.getItem('stv_history');
    const savedMute = localStorage.getItem('stv_mute');

    if (savedMute) {
      const muteValue = savedMute === 'true';
      setIsMuted(muteValue);
      sound.setMute(muteValue);
    }

    if (savedPlayer) {
      const parsedPlayer = JSON.parse(savedPlayer);
      if (!parsedPlayer.grade) {
        parsedPlayer.grade = 'grade_1';
      }
      setPlayer(parsedPlayer);
      if (parsedPlayer.classCode === 'SYSTEM_ADMIN' || parsedPlayer.id === 'admin_teacher') {
        setActiveTab('teacher');
      }
      
      // Khởi động nhạc nền du dương sau khi tải xong player
      setTimeout(() => {
        sound.playBgm();
      }, 1000);
    }

    if (savedQuests) {
      setQuests(JSON.parse(savedQuests));
    } else {
      setQuests([...DAILY_QUESTS_TEMPLATE]);
    }

    if (savedMails) {
      setMails(JSON.parse(savedMails));
    } else {
      setMails([...INITIAL_MAILS]);
    }

    if (savedGuilds) {
      setGuilds(JSON.parse(savedGuilds));
    } else {
      setGuilds([...GUILDS]);
    }

    if (savedHistory) {
      setPurchaseHistory(JSON.parse(savedHistory));
    } else {
      setPurchaseHistory([]);
    }
  }, []);

  // 1b. Tải thông tin tháp thám hiểm từ Đám mây Firestore khi sòng số điện thoại đăng nhập thành công
  useEffect(() => {
    if (!player || player.id === 'admin_teacher') return;

    const fetchCloudData = async () => {
      try {
        const { getDoc, getDocs } = await import('firebase/firestore');
        
        // Tải Mails từ Firestore
        const sysMailsSnap = await getDocs(collection(db, 'mails'));
        const cloudMails: Mail[] = [];
        sysMailsSnap.forEach((docSnap) => {
          cloudMails.push(docSnap.data() as Mail);
        });
        if (cloudMails.length > 0) {
          cloudMails.sort((a, b) => b.date.localeCompare(a.date));
          setMails(cloudMails);
          localStorage.setItem('stv_mails', JSON.stringify(cloudMails));
        } else {
          for (const m of INITIAL_MAILS) {
            await setDoc(doc(db, 'mails', m.id), m);
          }
          setMails(INITIAL_MAILS);
        }

        // Tải Guilds từ Firestore
        const guildsSnap = await getDocs(collection(db, 'guilds'));
        const cloudGuilds: Guild[] = [];
        guildsSnap.forEach((docSnap) => {
          cloudGuilds.push(docSnap.data() as Guild);
        });
        if (cloudGuilds.length > 0) {
          setGuilds(cloudGuilds);
          localStorage.setItem('stv_guilds', JSON.stringify(cloudGuilds));
        } else {
          for (const g of GUILDS) {
            await setDoc(doc(db, 'guilds', g.id), g);
          }
          setGuilds(GUILDS);
        }

        // Tải Lịch sử quà quy đổi của cả hệ thống
        const historySnap = await getDocs(collection(db, 'purchase_history'));
        const cloudHistory: any[] = [];
        historySnap.forEach((docSnap) => {
          cloudHistory.push(docSnap.data());
        });
        cloudHistory.sort((a, b) => b.id.localeCompare(a.id));
        setPurchaseHistory(cloudHistory);
        localStorage.setItem('stv_history', JSON.stringify(cloudHistory));

        // Kiểm tra thông tin cập nhật mới nhất của chính player từ Firestore
        const playerDocSnap = await getDoc(doc(db, 'players', player.id));
        if (playerDocSnap.exists()) {
          const freshPlayer = playerDocSnap.data() as Player;
          setPlayer(freshPlayer);
          localStorage.setItem('stv_player', JSON.stringify(freshPlayer));
        }
      } catch (err) {
        console.error('Error fetching data from Firestore:', err);
      }
    };

    fetchCloudData();
  }, [player?.id]);

  // 2. Tự động Lưu trữ LocalStorage và Đám mây Firestore mỗi khi player thay đổi (Debounce 500ms)
  useEffect(() => {
    if (player) {
      localStorage.setItem('stv_player', JSON.stringify(player));

      if (player.id === 'admin_teacher') return;

      const syncToCloud = async () => {
        try {
          await setDoc(doc(db, 'players', player.id), player, { merge: true });
        } catch (err) {
          console.error('Error syncing player profile to Firestore:', err);
        }
      };

      const timerId = setTimeout(() => {
        syncToCloud();
      }, 500);

      return () => clearTimeout(timerId);
    }
  }, [player]);

  // Tự động giải phóng trạng thái điểm danh hôm nay nếu đã trôi qua 24 tiếng cách biệt
  useEffect(() => {
    if (player && player.lastCheckInDate) {
      const lastCheckInTime = new Date(player.lastCheckInDate).getTime();
      const currentTime = Date.now();
      const timePassed = currentTime - lastCheckInTime;
      const cooldownMs = 24 * 60 * 60 * 1000; // 24 hours

      if (timePassed >= cooldownMs && player.checkedInToday) {
        setPlayer(prev => prev ? { ...prev, checkedInToday: false } : null);
      }
    }
  }, [player?.lastCheckInDate, player?.checkedInToday]);

  useEffect(() => {
    if (quests.length > 0) {
      localStorage.setItem('stv_quests', JSON.stringify(quests));
    }
  }, [quests]);

  useEffect(() => {
    if (mails.length > 0) {
      localStorage.setItem('stv_mails', JSON.stringify(mails));
    }
  }, [mails]);

  useEffect(() => {
    if (guilds.length > 0) {
      localStorage.setItem('stv_guilds', JSON.stringify(guilds));

      const syncGuildsToCloud = async () => {
        try {
          for (const guild of guilds) {
            await setDoc(doc(db, 'guilds', guild.id), guild, { merge: true });
          }
        } catch (err) {
          console.error('Error syncing guilds to Firestore:', err);
        }
      };

      const timerId = setTimeout(() => {
        syncGuildsToCloud();
      }, 1000);
      return () => clearTimeout(timerId);
    }
  }, [guilds]);

  useEffect(() => {
    if (purchaseHistory.length > 0) {
      localStorage.setItem('stv_history', JSON.stringify(purchaseHistory));
    }
  }, [purchaseHistory]);

  const handleMuteToggle = (mute: boolean) => {
    setIsMuted(mute);
    sound.setMute(mute);
    localStorage.setItem('stv_mute', String(mute));
  };

  // 3. Tạo Nhân Vật Thành Công
  const handleCharacterCreated = (newPlayer: Player) => {
    setPlayer(newPlayer);
    setQuests([...DAILY_QUESTS_TEMPLATE]);
    setMails([...INITIAL_MAILS]);
    setGuilds([...GUILDS]);
    setPurchaseHistory([]);
    if (newPlayer.classCode === 'SYSTEM_ADMIN' || newPlayer.id === 'admin_teacher') {
      setActiveTab('teacher');
    } else {
      setActiveTab('map');
    }
    
    // Kích hoạt âm thanh & lưu mốc tạo
    setTimeout(() => {
      sound.playBgm();
    }, 500);
  };

  // 4. Giải Quyết Chọn Màn Chơi (Vào Battle)
  const handleSelectStage = (regionId: string, stageNum: number, isBoss: boolean) => {
    setCurrRegionId(regionId);
    setCurrStageNum(stageNum);
    setIsBossBattle(isBoss);
    setActiveTab('battle');
  };

  // 5. Cập nhật HP Player khi chiến đấu
  const handlePlayerHpChange = (newHp: number) => {
    if (!player) return;
    setPlayer((prev) => prev ? { ...prev, hp: newHp } : null);
  };

  // 6. Hoàn thành Vượt Ải thành công (Chiến Thắng Boss / Quái)
  const handleBattleVictory = (rewards: { exp: number; gold: number; gem: number; stageNum: number }) => {
    if (!player) return;

    // Cộng EXP & Vàng
    let newExp = player.exp + rewards.exp;
    let newLevel = player.level;
    let newExpToNext = player.expToNextLevel;
    let newMaxHp = player.maxHp;
    const unlockedTitles = [...player.unlockedTitles];

    // Xử lý LÊN CẤP (LEVEL UP CURVE)
    if (newExp >= newExpToNext) {
      newExp = newExp - newExpToNext;
      newLevel += 1;
      newExpToNext = newLevel * 100;
      newMaxHp = 100 + (newLevel - 1) * 10;
      
      // Hồi sức 100% khi thăng chức
      player.hp = newMaxHp;

      // Cộng dồn chỉ số sức mạnh tự động
      player.stats.attack += 2;
      player.stats.defense += 2;
      player.stats.intelligence += 2;
      player.stats.luck += 1;

      // Mở khóa danh hiệu theo cấp độ
      if (newLevel === 3 && !unlockedTitles.includes('Học Viên Siêu Đẳng')) {
        unlockedTitles.push('Học Viên Siêu Đẳng');
      }
      if (newLevel === 5 && !unlockedTitles.includes('Thần Đồng Tin Học')) {
        unlockedTitles.push('Thần Đồng Tin Học');
      }
      if (newLevel === 10 && !unlockedTitles.includes('Học Giả Vạn Năng')) {
        unlockedTitles.push('Học Giả Vạn Năng');
      }
      if (newLevel === 15 && !unlockedTitles.includes('Anh Hùng Tri Thức Vô Song')) {
        unlockedTitles.push('Anh Hùng Tri Thức Vô Song');
      }

      alert(`🎉 CHÚC MỪNG! EM ĐÃ THĂNG CẤP LÊN LEVEL ${newLevel}! HP khôi phục tối đa, gia tăng Attack & Defense!`);
    }

    // Ghi nhận mốc vượt màn trong bản đồ
    const completed = { ...player.completedStages };
    const currentMax = completed[currRegionId] || 0;
    if (currStageNum > currentMax) {
      completed[currRegionId] = currStageNum;
    }

    // Tăng tiến độ nhiệm vụ hằng ngày tương ứng
    const updatedQuests = quests.map((q) => {
      // Nếu là giải toán
      if (q.category === 'math' && currRegionId === 'region_1') {
        return { ...q, progress: Math.min(q.target, q.progress + 1) };
      }
      // Nếu là giải tin học (region 2 hoặc 5)
      if (q.category === 'english' && (currRegionId === 'region_2' || currRegionId === 'region_5')) {
        return { ...q, progress: Math.min(q.target, q.progress + 1) };
      }
      return q;
    });
    setQuests(updatedQuests);

    setPlayer({
      ...player,
      level: newLevel,
      exp: newExp,
      expToNextLevel: newExpToNext,
      hp: Math.min(newMaxHp, player.hp),
      maxHp: newMaxHp,
      gold: player.gold + rewards.gold,
      gem: player.gem + rewards.gem,
      completedStages: completed,
      unlockedTitles
    });

    // Quay lại Bản đồ thế giới
    setActiveTab('map');
  };

  // 7. Thất Trận rút lui
  const handleBattleDefeat = () => {
    setActiveTab('map');
  };

  // 8. Điểm Danh Daily Check-In
  const handleDailyCheckIn = () => {
    if (!player) return;

    const currentTime = Date.now();

    // Kiểm tra đủ 24 tiếng cách biệt giữa 2 lần điểm danh liên tục
    if (player.lastCheckInDate) {
      const lastCheckInTime = new Date(player.lastCheckInDate).getTime();
      const timePassed = currentTime - lastCheckInTime;
      const cooldownMs = 24 * 60 * 60 * 1000; // 24 hours

      if (timePassed < cooldownMs) {
        const remainingMs = cooldownMs - timePassed;
        const hours = Math.floor(remainingMs / (1000 * 60 * 60));
        const minutes = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((remainingMs % (1000 * 60)) / 1000);
        alert(`⚠️ Điểm danh lỗi: Em chưa đủ điều kiện điểm danh ngày tiếp theo! Hãy chờ thêm ${hours} giờ ${minutes} phút ${seconds} giây cho đủ 24 tiếng kể từ buổi trước nhé.`);
        return;
      }
    }

    const nowIsoStr = new Date().toISOString();
    const todayDateStr = nowIsoStr.split('T')[0];
    const newHistory = [...player.checkInHistory, todayDateStr];
    
    const nextTotalDays = player.totalDays + 1;
    let nextConsecutive = player.consecutiveDays + 1;

    // Kiểm tra tính liên tục của rèn luyện (nếu cách lần cuối quá 48 giờ thì reset về 1 ngày)
    if (player.lastCheckInDate) {
      const lastCheckInTime = new Date(player.lastCheckInDate).getTime();
      const diffHours = (currentTime - lastCheckInTime) / (1000 * 60 * 60);
      
      if (diffHours > 48) {
        // Trễ quá 48 tiếng -> Đứt chuỗi chuyên cần -> reset về 1 ngày liên tục
        nextConsecutive = 1;
      }
    }

    // Nhận vàng tương ứng số ngày
    let goldReward = nextConsecutive * 10;
    let gemReward = 0;
    const unlockedTitles = [...player.unlockedTitles];

    // Mô phỏng quà tặng đặc biệt mốc lớn
    if (nextTotalDays === 7) goldReward += 200; // Hộp quà ngày 7
    if (nextTotalDays === 14) {
      // Tặng Pet Thỏ học tập hoặc Cáo tri thức
      if (!player.inventory.includes('p_fox')) {
        player.inventory.push('p_fox');
      }
    }
    if (nextTotalDays === 30) {
      if (!unlockedTitles.includes('Giáo Hoàng Chuyên Cần')) {
        unlockedTitles.push('Giáo Hoàng Chuyên Cần');
      }
    }

    // Đi học đầy đủ tích hợp tăng tiến độ Quest Đi học
    const updatedQuests = quests.map((q) => {
      if (q.category === 'attendance') {
        return { ...q, progress: Math.min(q.target, q.progress + 1) };
      }
      return q;
    });
    setQuests(updatedQuests);

    setPlayer({
      ...player,
      consecutiveDays: nextConsecutive,
      totalDays: nextTotalDays,
      gold: player.gold + goldReward,
      gem: player.gem + gemReward,
      lastCheckInDate: nowIsoStr,
      checkedInToday: true,
      checkInHistory: newHistory,
      unlockedTitles
    });

    alert(`🎉 Điểm danh thành công ngày thứ ${nextTotalDays}! Bạn đã đi học đều ${nextConsecutive} ngày liên tiếp tại Sao Việt. Nhận ngay +${goldReward} Vàng chăm chỉ!`);
  };

  // Sinh nhiệm vụ học tập ngẫu nhiên mới phù hợp kiến thức của lớp học
  const generateNewRandomQuest = (category: 'math' | 'typing' | 'english'): Quest => {
    const gradeStr = player ? (player.grade === 'grade_1' ? 'Lớp 1' : player.grade === 'grade_2' ? 'Lớp 2' : player.grade === 'grade_3' ? 'Lớp 3' : player.grade === 'grade_4' ? 'Lớp 4' : 'Lớp 5') : 'Lớp 1';
    
    const templates = {
      math: [
        { desc: `Vượt qua thêm 3 màn chơi ôn luyện Toán học ${gradeStr}`, target: 3, exp: 35, gold: 50, gem: 0 },
        { desc: `Trả lời đúng liên tục 5 câu đố tư duy toán học của ${gradeStr}`, target: 5, exp: 45, gold: 65, gem: 1 },
        { desc: `Chiến thắng quái vật Lười tính ${gradeStr} 2 lần`, target: 2, exp: 30, gold: 40, gem: 0 }
      ],
      typing: [
        { desc: `Đạt chỉ tiêu hoàn thành bài viết 5 phút ở Vũ Đài Gõ Phím cho ${gradeStr}`, target: 5, exp: 30, gold: 45, gem: 0 },
        { desc: `Gõ phím tốc độ tắt đạt 100 chữ cái chính xác chuẩn ${gradeStr}`, target: 100, exp: 40, gold: 60, gem: 1 },
        { desc: `Thực hành gõ bàn phím liên tục 10 phút tại trung tâm`, target: 10, exp: 35, gold: 50, gem: 0 }
      ],
      english: [
        { desc: `Hoàn thành 3 câu đố Tin học an toàn thuộc kiến thức ${gradeStr}`, target: 3, exp: 35, gold: 50, gem: 0 },
        { desc: `Giải mã chính xác 4 câu đố logic rực rỡ học phần ${gradeStr}`, target: 4, exp: 40, gold: 55, gem: 1 },
        { desc: `Khám phá 3 câu trắc nghiệm khoa học STEM ${gradeStr}`, target: 3, exp: 30, gold: 45, gem: 0 }
      ]
    };

    const pool = templates[category] || templates.math;
    const picked = pool[Math.floor(Math.random() * pool.length)];

    return {
      id: 'q_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
      description: picked.desc,
      progress: 0,
      target: picked.target,
      rewardExp: picked.exp,
      rewardGold: picked.gold,
      rewardGem: picked.gem > 0 ? picked.gem : undefined,
      completed: false,
      claimed: false,
      category
    };
  };

  // 9. Quy đổi/Nhận thưởng nhiệm vụ hàng ngày
  const handleClaimQuestReward = (qId: string) => {
    if (!player) return;
    const quest = quests.find((q) => q.id === qId);
    if (!quest || quest.claimed) return;

    let newExp = player.exp + quest.rewardExp;
    let newLevel = player.level;
    let newExpToNext = player.expToNextLevel;
    let newMaxHp = player.maxHp;

    if (newExp >= newExpToNext) {
      newExp = newExp - newExpToNext;
      newLevel += 1;
      newExpToNext = newLevel * 100;
      newMaxHp = 100 + (newLevel - 1) * 10;
      player.hp = newMaxHp;
      alert(`🎉 CHÚC MỪNG LÊN CẤP LEVEL ${newLevel}!`);
    }

    setPlayer({
      ...player,
      exp: newExp,
      level: newLevel,
      expToNextLevel: newExpToNext,
      maxHp: newMaxHp,
      gold: player.gold + quest.rewardGold,
      gem: player.gem + (quest.rewardGem || 0)
    });

    // Cập nhật quest đã nhận thưởng làm ẩn đi và tạo nhiệm vụ mới thay thế
    const updatedQuests = quests.map((q) => q.id === qId ? { ...q, claimed: true } : q);
    if (quest.category !== 'attendance') {
      const newQuest = generateNewRandomQuest(quest.category);
      updatedQuests.push(newQuest);
    }
    setQuests(updatedQuests);
  };

  // 10. Chuyển đổi tab nhanh dựa trên Quest portal click
  const handleGoToTask = (actionType: 'math' | 'typing' | 'english' | 'attendance') => {
    if (actionType === 'math') {
      setActiveTab('map');
    } else if (actionType === 'typing') {
      sound.playClick();
      setActiveTab('typingGame');
    } else if (actionType === 'english') {
      setActiveTab('map');
    } else if (actionType === 'attendance') {
      setActiveTab('checkIn');
    }
  };

  // 10b. Hoàn thành bài tập gõ phím 10 ngón thực tế
  const handleCompleteTyping = (goldEarned: number, expEarned: number) => {
    if (!player) return;

    // Tiến hành cộng dồn tích lũy tuyệt đối cho Quest "typing"
    const updatedQuests = quests.map((q) => {
      if (q.category === 'typing') {
        return { ...q, progress: q.target }; // Đạt luôn chỉ tiêu
      }
      return q;
    });
    setQuests(updatedQuests);

    // Tính thăng cấp EXP học tập
    let newExp = player.exp + expEarned;
    let newLevel = player.level;
    let newExpToNext = player.expToNextLevel;
    let newMaxHp = player.maxHp;

    if (newExp >= newExpToNext) {
      newExp = newExp - newExpToNext;
      newLevel += 1;
      newExpToNext = newLevel * 100;
      newMaxHp = 100 + (newLevel - 1) * 10;
      player.hp = newMaxHp;
    }

    setPlayer({
      ...player,
      exp: newExp,
      level: newLevel,
      expToNextLevel: newExpToNext,
      maxHp: newMaxHp,
      gold: player.gold + goldEarned
    });
  };

  // 10c. Đón nhận phần thưởng thắng được từ Vòng quay may mắn
  const handleRewardWon = (reward: { type: string; amount: number; name?: string; giftId?: string }) => {
    if (!player) return;

    let updatedPlayer = { ...player };

    if (reward.type === 'gold') {
      updatedPlayer.gold += reward.amount;
    } else if (reward.type === 'gem') {
      updatedPlayer.gem += reward.amount;
    } else if (reward.type === 'exp') {
      let newExp = player.exp + reward.amount;
      let newLevel = player.level;
      let newExpToNext = player.expToNextLevel;
      let newMaxHp = player.maxHp;

      if (newExp >= newExpToNext) {
        newExp = newExp - newExpToNext;
        newLevel += 1;
        newExpToNext = newLevel * 105; // Slightly scaling
        newMaxHp = 100 + (newLevel - 1) * 10;
        updatedPlayer.hp = newMaxHp;
      }
      updatedPlayer.exp = newExp;
      updatedPlayer.level = newLevel;
      updatedPlayer.expToNextLevel = newExpToNext;
      updatedPlayer.maxHp = newMaxHp;
    } else if (reward.type === 'real_gift') {
      const verifyCode = 'SV-WQ-' + Math.floor(1000 + Math.random() * 9000);
      const dateStr = new Date().toISOString().split('T')[0];

      const newHistoryItem = {
        id: 'h_' + Date.now(),
        name: reward.name || 'Quà đặc biệt',
        date: dateStr,
        code: verifyCode,
        claimed: false
      };

      setPurchaseHistory(prev => [newHistoryItem, ...prev]);
    }

    setPlayer(updatedPlayer);
  };

  // 11. Mua Trang bị ảo trong Cửa hàng
  const handlePurchaseItem = (item: ShopItem) => {
    if (!player) return;

    const balance = player.gold;
    const isGem = item.currency === 'gem';

    setPlayer({
      ...player,
      gold: isGem ? player.gold : player.gold - item.price,
      gem: isGem ? player.gem - item.price : player.gem,
      inventory: [...player.inventory, item.id]
    });
  };

  // 12. Quy đổi Quà thật ngoài đời
  const handlePurchaseRealGift = (gift: ShopItem) => {
    if (!player) return;

    const verifyCode = 'SV-' + Math.floor(1000 + Math.random() * 9000);
    const dateStr = new Date().toISOString().split('T')[0];

    const newHistoryItem = {
      id: 'h_' + Date.now(),
      playerId: player.id,
      playerName: player.name,
      name: gift.name,
      date: dateStr,
      code: verifyCode,
      claimed: false
    };

    setPurchaseHistory([newHistoryItem, ...purchaseHistory]);

    // Cũng lưu mốc lên Firestore purchase_history
    setDoc(doc(db, 'purchase_history', newHistoryItem.id), newHistoryItem).catch(err => {
      console.error('Error saving gift redemption to Firestore:', err);
    });

    setPlayer({
      ...player,
      gold: player.gold - gift.price
    });
  };

  // 13. Mặc / Tháo trang bị tăng chỉ số
  const handleEquipItem = (itemId: string, itemType: 'weapon' | 'armor' | 'shield' | 'ring') => {
    if (!player) return;

    const currentEquippedId = player.equipped[itemType];
    const prevItem = currentEquippedId ? SHOP_ITEMS.find((s) => s.id === currentEquippedId) : null;
    const newItem = SHOP_ITEMS.find((s) => s.id === itemId);

    if (!newItem) return;

    // Trừ chỉ số của trang bị cũ và cộng trang bị mới
    const updatedStats = { ...player.stats };

    if (prevItem && prevItem.statsEffect) {
      updatedStats.attack -= prevItem.statsEffect.attack || 0;
      updatedStats.defense -= prevItem.statsEffect.defense || 0;
      updatedStats.intelligence -= prevItem.statsEffect.intelligence || 0;
      updatedStats.luck -= prevItem.statsEffect.luck || 0;
    }

    if (newItem.statsEffect) {
      updatedStats.attack += newItem.statsEffect.attack || 0;
      updatedStats.defense += newItem.statsEffect.defense || 0;
      updatedStats.intelligence += newItem.statsEffect.intelligence || 0;
      updatedStats.luck += newItem.statsEffect.luck || 0;
    }

    // Đặt Pet hỗ trợ đồng hành nếu người chơi mua pet
    let newPet = player.pet;
    if (newItem.type === 'pet') {
      newPet = newItem.id;
    }

    setPlayer({
      ...player,
      equipped: {
        ...player.equipped,
        [itemType]: itemId
      },
      stats: updatedStats,
      pet: newPet
    });
  };

  const handleUnequipItem = (itemType: 'weapon' | 'armor' | 'shield' | 'ring') => {
    if (!player) return;

    const currentEquippedId = player.equipped[itemType];
    const prevItem = currentEquippedId ? SHOP_ITEMS.find((s) => s.id === currentEquippedId) : null;

    if (!prevItem) return;

    const updatedStats = { ...player.stats };
    if (prevItem.statsEffect) {
      updatedStats.attack -= prevItem.statsEffect.attack || 0;
      updatedStats.defense -= prevItem.statsEffect.defense || 0;
      updatedStats.intelligence -= prevItem.statsEffect.intelligence || 0;
      updatedStats.luck -= prevItem.statsEffect.luck || 0;
    }

    setPlayer({
      ...player,
      equipped: {
        ...player.equipped,
        [itemType]: null
      },
      stats: updatedStats
    });
  };

  // 14. Thiết chế tháo lắp Danh hiệu
  const handleEquipTitle = (title: string) => {
    if (!player) return;
    setPlayer({
      ...player,
      title
    });
  };

  // 15. Quản lý Thư từ GV dã đọc
  const handleReadMail = (mailId: string) => {
    if (!player) return;
    if (!player.mailRead.includes(mailId)) {
      setPlayer({
        ...player,
        mailRead: [...player.mailRead, mailId]
      });
    }
  };

  const handleClaimMailReward = (mailId: string, reward: { gold?: number; gem?: number }) => {
    if (!player) return;
    if (player.mailClaimed.includes(mailId)) return;

    setPlayer({
      ...player,
      gold: player.gold + (reward.gold || 0),
      gem: player.gem + (reward.gem || 0),
      mailClaimed: [...player.mailClaimed, mailId]
    });
  };

  const handleDeleteMail = (mailId: string) => {
    const updated = mails.filter((m) => m.id !== mailId);
    setMails(updated);
  };

  // 16. Thiết chế Bang hội gia nhập
  const handleJoinGuild = (guildId: string) => {
    if (!player) return;

    // Thay đổi số sĩ số bang hội trong list
    const updatedGuilds = guilds.map((g) => {
      if (g.id === player.guildId) {
        return { ...g, membersCount: Math.max(1, g.membersCount - 1) };
      }
      if (g.id === guildId) {
        return { ...g, membersCount: g.membersCount + 1 };
      }
      return g;
    });

    setGuilds(updatedGuilds);
    setPlayer({
      ...player,
      guildId: guildId || null
    });
  };

  const handleCreateGuild = (guildName: string, guildLogo: string) => {
    if (!player) return;

    const newGuildId = 'g_' + Date.now();
    const newGuild: Guild = {
      id: newGuildId,
      name: guildName,
      logo: guildLogo,
      membersCount: 1,
      totalExp: player.exp + player.level * 100,
      level: 1,
      leader: player.name
    };

    setGuilds([newGuild, ...guilds]);
    setPlayer({
      ...player,
      guildId: newGuildId,
      gem: player.gem - 5
    });
  };

  // 17. CHỨC NĂNG ĐẶC BIỆT: MÔ PHỎNG SANG NGÀY MỚI (Dành cho Giáo viên & Học sinh trải nghiệm 30 ngày)
  const simulateNextDay = () => {
    if (!player) return;
    sound.playLevelUp();

    // Đặt checkedInToday về false để người chơi có thể điểm danh ngày tiếp theo
    // Làm mới nhiệm vụ hằng ngày về tiến trình 0
    const refreshedQuests = quests.map((q) => ({
      ...q,
      progress: 0,
      completed: false,
      claimed: false
    }));

    // Thiết lập lastCheckInDate lùi về hơn 25 tiếng để bỏ qua cooldown thắt chặt 24h và cho phép điểm danh thử nghiệm lập tức
    const mockLastCheckInDate = player.lastCheckInDate
      ? new Date(new Date(player.lastCheckInDate).getTime() - 25 * 60 * 60 * 1000).toISOString()
      : null;

    setQuests(refreshedQuests);
    setPlayer({
      ...player,
      checkedInToday: false,
      lastCheckInDate: mockLastCheckInDate
    });

    alert('☀️ Đã mô phỏng sang một ngày học mới tại Sao Việt! Em đã có thể bấn nút "ĐIỂM DANH HÀNG NGÀY" tiếp theo và thực hiện lại bộ nhiệm vụ mới!');
  };

  // Reset toàn bộ tài khoản học viên để chơi lại từ đầu
  const resetGameAccount = () => {
    if (confirm('Em có thực sự muốn xóa hết nhân vật, lượng vàng và vật phẩm để làm lại cuộc phiêu lưu từ đầu không?')) {
      localStorage.clear();
      setPlayer(null);
      setQuests([]);
      setMails([]);
      setPurchaseHistory([]);
      setShowSettingsModal(false);
      sound.stopBgm();
    }
  };

  // Đăng xuất tài khoản học sinh về màn hình đăng kí/đăng nhập
  const handlePlayerLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmPlayerLogout = () => {
    localStorage.removeItem('stv_player');
    setPlayer(null);
    setShowLogoutConfirm(false);
    setActiveTab('map');
    sound.stopBgm();
  };

  // Đếm thư chưa bóc đọc
  const unreadMailsCount = player ? mails.filter((m) => !player.mailRead.includes(m.id)).length : 0;

  // Lấy danh hiệu để cài đặt
  const activeTitle = player ? player.title : 'Tân Binh Thám Hiểm';

  if (!player) {
    return <CharacterCreate onCreated={handleCharacterCreated} />;
  }

  return (
    <div className="min-h-screen bg-[#87CEEB] text-slate-800 selection:bg-indigo-600 selection:text-white flex flex-col font-sans relative overflow-x-hidden" id="rpg-app-root">
      
      {/* Background Map Decoration (Abstract) */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-20 w-64 h-64 bg-green-400 rounded-full blur-3xl opacity-60"></div>
        <div className="absolute bottom-20 right-40 w-96 h-96 bg-yellow-300 rounded-full blur-3xl opacity-40"></div>
        <div className="absolute top-1/2 left-1/3 w-80 h-80 bg-blue-300 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute inset-0 opacity-[0.08] bg-[radial-gradient(#ffffff_2px,transparent_2px)] [background-size:24px_24px]"></div>
      </div>

      {/* 1. THANH HEADER GENERAL METRICS */}
      <Header
        player={player}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        unreadMailsCount={unreadMailsCount}
        onMuteToggle={handleMuteToggle}
        isMuted={isMuted}
      />

      {/* 2. CHƯƠNG TRÌNH CHÍNH PHỐI HỢP SIDEBAR RAILS */}
      <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto relative px-4 py-6 gap-6 z-10" id="dashboard-layout">
        
        {/* THANH MENU GỖ BÊN TRÁI ĐIỀU HƯỚNG SẮC SẢO */}
        <nav className="w-full md:w-56 shrink-0 bg-white/20 backdrop-blur-md border border-white/50 rounded-3xl p-4 h-fit space-y-2 sticky top-24 z-30 shadow-xl" id="sidebar-navigation">
          <span className="text-[10px] text-indigo-950 font-sans font-black uppercase tracking-wider block mb-3 border-b border-white/40 pb-1 text-center">
            Mục lục Thám Hiểm
          </span>

          <button
            onClick={() => { sound.playClick(); setActiveTab('map'); }}
            className={`w-full px-4 py-3 rounded-xl text-xs font-black tracking-wide uppercase transition flex items-center justify-between cursor-pointer ${
              activeTab === 'map' || activeTab === 'battle'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-300/60'
                : 'bg-white/60 text-indigo-950 hover:bg-white border border-white/40'
            }`}
          >
            <span className="flex items-center gap-2"><Map className="w-4 h-4" /> BẢN ĐỒ RPG</span>
            <span className="text-[10px] font-mono opacity-80">🗺️</span>
          </button>

          <button
            onClick={() => { sound.playClick(); setActiveTab('quests'); }}
            className={`w-full px-4 py-3 rounded-xl text-xs font-black tracking-wide uppercase transition flex items-center justify-between cursor-pointer ${
              activeTab === 'quests'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-300/60'
                : 'bg-white/60 text-indigo-950 hover:bg-white border border-white/40'
            }`}
          >
            <span className="flex items-center gap-2"><BookOpen className="w-4 h-4" /> Nhiệm Vụ</span>
            <span className="bg-rose-500 text-white font-mono text-[9px] font-black rounded-full px-1.5 py-0.5 leading-none shadow">
              {quests.filter((q) => !q.claimed).length}
            </span>
          </button>

          <button
            onClick={() => { sound.playClick(); setActiveTab('inventory'); }}
            className={`w-full px-4 py-3 rounded-xl text-xs font-black tracking-wide uppercase transition flex items-center justify-between cursor-pointer ${
              activeTab === 'inventory'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-300/60'
                : 'bg-white/60 text-indigo-950 hover:bg-white border border-white/40'
            }`}
          >
            <span className="flex items-center gap-2"><Compass className="w-4 h-4" /> Balo hòm đồ</span>
            <span className="text-[10px] font-mono opacity-80">🎒</span>
          </button>

          <button
            onClick={() => { sound.playClick(); setActiveTab('shop'); }}
            className={`w-full px-4 py-3 rounded-xl text-xs font-black tracking-wide uppercase transition flex items-center justify-between cursor-pointer ${
              activeTab === 'shop'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-300/60'
                : 'bg-white/60 text-indigo-950 hover:bg-white border border-white/40'
            }`}
          >
            <span className="flex items-center gap-2"><ShoppingBag className="w-4 h-4" /> Cửa hàng</span>
            <span className="text-[10px] font-mono opacity-80">🏪</span>
          </button>

          <button
            onClick={() => { sound.playClick(); setActiveTab('guild'); }}
            className={`w-full px-4 py-3 rounded-xl text-xs font-black tracking-wide uppercase transition flex items-center justify-between cursor-pointer ${
              activeTab === 'guild'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-300/60'
                : 'bg-white/60 text-indigo-950 hover:bg-white border border-white/40'
            }`}
          >
            <span className="flex items-center gap-2"><UserCheck className="w-4 h-4" /> Quần hùng</span>
            <span className="text-[10px] font-mono opacity-80">🛡️</span>
          </button>

          <button
            onClick={() => { sound.playClick(); setActiveTab('typingGame'); }}
            className={`w-full px-4 py-3 rounded-xl text-xs font-black tracking-wide uppercase transition flex items-center justify-between cursor-pointer ${
              activeTab === 'typingGame'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-300/60'
                : 'bg-white/60 text-indigo-950 hover:bg-white border border-white/40'
            }`}
          >
            <span className="flex items-center gap-2"><Keyboard className="w-4 h-4" /> Vũ đài gõ phím</span>
            <span className="text-[10px] font-mono opacity-80">⌨️</span>
          </button>

          <button
            onClick={() => { sound.playClick(); setActiveTab('wheel'); }}
            className={`w-full px-4 py-3 rounded-xl text-xs font-black tracking-wide uppercase transition flex items-center justify-between cursor-pointer ${
              activeTab === 'wheel'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-300/60'
                : 'bg-white/60 text-indigo-950 hover:bg-white border border-white/40'
            }`}
          >
            <span className="flex items-center gap-2"><Sparkles className="w-4 h-4" /> Vòng quay may mắn</span>
            <span className="text-[10px] font-mono opacity-80">🎡</span>
          </button>

          <div className="pt-4 border-t border-white/40 space-y-1.5">
            <button
              onClick={() => { sound.playClick(); setShowSettingsModal(true); }}
              className="w-full py-2 bg-white/40 hover:bg-white/75 text-indigo-950 hover:text-indigo-900 text-[10px] font-sans font-black uppercase border border-white/40 rounded-lg flex items-center justify-center gap-1 cursor-pointer transition"
            >
              <Settings className="w-3.5 h-3.5" /> Thống kê & Cài Đặt
            </button>
            <button
              onClick={() => { sound.playClick(); setActiveTab('teacher'); }}
              className={`w-full py-2 text-[10px] font-sans font-black uppercase rounded-lg flex items-center justify-center gap-1 cursor-pointer transition ${
                activeTab === 'teacher'
                  ? 'bg-indigo-950 text-white shadow-md'
                  : 'bg-indigo-100 hover:bg-indigo-200 text-indigo-950 border border-indigo-200/50'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" /> Portal Giáo Viên
            </button>
            <button
              onClick={() => { sound.playClick(); handlePlayerLogout(); }}
              className="w-full py-2 bg-rose-600 hover:bg-rose-500 text-white text-[10px] font-sans font-black uppercase border border-rose-700/30 rounded-lg flex items-center justify-center gap-1 cursor-pointer transition"
            >
              <LogOut className="w-3.5 h-3.5" /> Đăng Xuất Học Sinh
            </button>
          </div>
        </nav>

        {/* CONTAINER CHUYỂN TAB CHÍNH CÓ HIỆU ỨNG MOTION */}
        <main className="flex-1 bg-white/30 backdrop-blur-md border border-white/40 rounded-3xl min-h-[480px] p-2 md:p-5 shadow-2xl relative z-10 overflow-hidden text-slate-800" id="tab-renderer">
          {activeTab === 'map' && (
            <WorldMap
              player={player}
              onSelectStage={handleSelectStage}
            />
          )}

          {activeTab === 'battle' && (
            <BattleArea
              player={player}
              regionId={currRegionId}
              stageNumber={currStageNum}
              isBoss={isBossBattle}
              onVictory={handleBattleVictory}
              onDefeat={handleBattleDefeat}
              onBackToMap={() => { sound.playClick(); setActiveTab('map'); }}
              onPlayerHpChange={handlePlayerHpChange}
            />
          )}

          {activeTab === 'inventory' && (
            <Inventory
              player={player}
              onEquipItem={handleEquipItem}
              onUnequipItem={handleUnequipItem}
            />
          )}

          {activeTab === 'quests' && (
            <DailyQuests
              player={player}
              quests={quests}
              onClaimQuestReward={handleClaimQuestReward}
              onGoToTask={handleGoToTask}
            />
          )}

          {activeTab === 'shop' && (
            <Shop
              player={player}
              onPurchaseItem={handlePurchaseItem}
              onPurchaseRealGift={handlePurchaseRealGift}
              purchaseHistory={purchaseHistory}
            />
          )}

          {activeTab === 'checkIn' && (
            <DailyCheckIn
              player={player}
              onCheckIn={handleDailyCheckIn}
            />
          )}

          {activeTab === 'leaderboard' && (
            <LeaderboardPage
              player={player}
            />
          )}

          {activeTab === 'achievement' && (
            <AchievementsPage
              player={player}
              onClaimAchievement={(achId) => {
                // Thêm vào danh sách achievements đã nhận quà mốc
                if (!player.achievements.includes(achId)) {
                  const ach = ACHIEVEMENTS.find(a => a.id === achId);
                  if (ach) {
                    const titles = [...player.unlockedTitles];
                    if (ach.rewardTitle && !titles.includes(ach.rewardTitle)) {
                      titles.push(ach.rewardTitle);
                    }
                    setPlayer({
                      ...player,
                      achievements: [...player.achievements, achId],
                      gold: player.gold + ach.rewardGold,
                      gem: player.gem + ach.rewardGem,
                      unlockedTitles: titles
                    });
                    alert(`🏆 Đạt thành tích mốc! Đã cộng +${ach.rewardGold} vàng & +${ach.rewardGem} kim cương!`);
                  }
                }
              }}
              onEquipTitle={handleEquipTitle}
            />
          )}

          {activeTab === 'mail' && (
            <Mailbox
              player={player}
              mails={mails}
              onReadMail={handleReadMail}
              onClaimMailReward={handleClaimMailReward}
              onDeleteMail={handleDeleteMail}
            />
          )}

          {activeTab === 'guild' && (
            <GuildPage
              player={player}
              guildsList={guilds}
              onJoinGuild={handleJoinGuild}
              onCreateGuild={handleCreateGuild}
            />
          )}

          {activeTab === 'typingGame' && (
            <TypingPractice
              player={player}
              onCompleteTyping={handleCompleteTyping}
              onBackToQuests={() => { sound.playClick(); setActiveTab('quests'); }}
            />
          )}

          {activeTab === 'wheel' && (
            <LuckyWheel
              player={player}
              onRewardWon={handleRewardWon}
              onBackToShop={() => { sound.playClick(); setActiveTab('shop'); }}
            />
          )}

          {activeTab === 'teacher' && player && (
            <TeacherDashboard
              activePlayer={player}
              onUpdateActivePlayer={(updated) => setPlayer(updated)}
              mails={mails}
              onAddMail={async (newMail) => {
                setMails(prev => [newMail, ...prev]);
                try {
                  await setDoc(doc(db, 'mails', newMail.id), newMail);
                } catch (err) {
                  console.error('Error saving new mail to Firestore:', err);
                }
              }}
              onBackToMap={() => { sound.playClick(); setActiveTab('map'); }}
              purchaseHistory={purchaseHistory}
              onUpdatePurchaseHistory={async (updatedHistory) => {
                setPurchaseHistory(updatedHistory);
                try {
                  for (const item of updatedHistory) {
                    await setDoc(doc(db, 'purchase_history', item.id), {
                      ...item,
                      playerId: item.playerId || player.id,
                      playerName: item.playerName || player.name
                    }, { merge: true });
                  }
                } catch (err) {
                  console.error('Error updating purchase history in Firestore:', err);
                }
              }}
              onSimulateNextDay={simulateNextDay}
              onLogoutStudent={handlePlayerLogout}
            />
          )}
        </main>

      </div>

      {/* MODAL CÀI ĐẶT & THẮNG CẤP RESET */}
      <AnimatePresence>
        {showSettingsModal && (
          <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm bg-slate-900 border-2 border-slate-800 rounded-3xl p-6 relative shadow-2xl" id="settings-frame"
            >
              <button
                onClick={() => {
                  sound.playClick();
                  setShowSettingsModal(false);
                }}
                className="absolute top-4 right-4 text-zinc-400 hover:text-white bg-slate-950/65 p-1.5 rounded-full hover:bg-slate-950 border border-slate-800 cursor-pointer"
                aria-label="Đóng bảng cài đặt"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center mb-6">
                <span className="text-4xl block filter drop-shadow select-none">⚙️</span>
                <h3 className="text-lg font-black text-white mt-1.5">BẢNG HIỆU HÀNH TRÌNH</h3>
                <p className="text-[11px] text-zinc-500 mt-1 font-sans">
                  Trung Tâm Tin Học Sao Việt
                </p>
              </div>

              <div className="space-y-4">
                {/* Thông tin nốt */}
                <div className="bg-slate-950/80 p-3.5 border border-slate-800 rounded-xl space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Mã Học Viên:</span>
                    <span className="font-mono text-white font-bold">{player.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Lớp Đang Học:</span>
                    <span className="text-yellow-400 font-bold uppercase font-sans">
                      {player.grade === 'grade_1' ? 'Lớp 1' : player.grade === 'grade_2' ? 'Lớp 2' : player.grade === 'grade_3' ? 'Lớp 3' : player.grade === 'grade_4' ? 'Lớp 4' : 'Lớp 5'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Danh hiệu active:</span>
                    <span className="text-amber-400 font-bold">{activeTitle}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Số buổi chuyên cần:</span>
                    <span className="font-mono text-white font-bold">{player.totalDays} buổi</span>
                  </div>
                </div>

                {/* THAY ĐỔI LỚP HỌC CHO BÉ */}
                <div className="space-y-1.5">
                  <span className="block text-[10px] font-black text-zinc-400 uppercase tracking-wider">
                    Thay đổi Lớp học của em:
                  </span>
                  <div className="grid grid-cols-5 gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800" id="grade-switcher-settings">
                    {[1, 2, 3, 4, 5].map((gNum) => {
                      const gKey = `grade_${gNum}` as any;
                      const isChosen = player.grade === gKey;
                      return (
                        <button
                          key={gNum}
                          onClick={() => {
                            sound.playClick();
                            setPlayer(prev => prev ? { ...prev, grade: gKey } : null);
                          }}
                          className={`py-1.5 text-xs font-black rounded-lg transition text-center cursor-pointer ${
                            isChosen
                              ? 'bg-amber-400 text-slate-950 shadow-md scale-105'
                              : 'text-zinc-400 hover:bg-slate-900'
                          }`}
                        >
                          Lớp {gNum}
                        </button>
                      );
                    })}
                  </div>
                  <p className="text-[9px] text-zinc-500 font-bold leading-normal">
                    * Sau khi đổi lớp, các câu hỏi chiến đấu sẽ tự động thay đổi độ khó phù hợp với cấp học mới của bé.
                  </p>
                </div>

                <div className="space-y-2">
                  <button
                    onClick={resetGameAccount}
                    className="w-full py-2.5 bg-rose-950 hover:bg-rose-900 border border-rose-800 font-bold text-white rounded-xl text-xs uppercase cursor-pointer flex items-center justify-center gap-1 transition"
                  >
                    <LogOut className="w-3.5 h-3.5" /> Khởi Động Lại Trò Chơi (Reset Toàn Bộ)
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL XÁC NHẬN ĐĂNG XUẤT AN TOÀN */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-sm bg-white border-2 border-indigo-150 rounded-3xl p-6 relative shadow-2xl text-slate-800"
              id="logout-confirm-frame"
            >
              <div className="text-center mb-5">
                <div className="w-16 h-16 bg-rose-50 border border-rose-200 text-rose-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-3 shadow-inner">
                  🚪
                </div>
                <h3 className="text-md font-black text-slate-900 tracking-tight uppercase">Xác nhận Đăng Xuất</h3>
                <p className="text-xs text-slate-500 mt-2 font-semibold leading-relaxed">
                  Học sinh có muốn đăng xuất khỏi tài khoản hiện tại để quay lại màn hình chính không?
                </p>
              </div>

              <div className="space-y-2.5">
                <button
                  type="button"
                  onClick={confirmPlayerLogout}
                  className="w-full py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-black text-xs uppercase rounded-xl transition shadow-sm cursor-pointer text-center flex items-center justify-center gap-1.5"
                >
                  <LogOut className="w-4 h-4" /> Đồng ý Đăng Xuất
                </button>
                <button
                  type="button"
                  onClick={() => { sound.playClick(); setShowLogoutConfirm(false); }}
                  className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs uppercase rounded-xl transition cursor-pointer text-center"
                >
                  Hủy, tớ ở lại học tiếp
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CHÂN KHU TRANG TRÍ (FOOTER) BAR */}
      <footer className="bg-slate-950 py-4 text-center text-[10px] text-zinc-650 font-mono tracking-wide border-t border-slate-900 mt-auto select-none" id="school-footer">
        Cung cấp độc quyền bởi TRUNG TÂM TIN HỌC SAO VIỆT © {new Date().getFullYear()} – Hệ thống Giáo dục RPG thông minh cho tương lai học viên.
      </footer>
    </div>
  );
}
