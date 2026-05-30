/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Player, Mail } from '../types';
import { sound } from './SoundManager';
import { 
  Users, 
  GraduationCap, 
  Coins, 
  Sparkles, 
  Mail as MailIcon, 
  Plus, 
  Search, 
  CheckCircle, 
  Trash2, 
  Key, 
  Lock, 
  LogOut, 
  Award, 
  ShieldAlert,
  Send,
  UserPlus,
  Edit3,
  Save,
  Gift
} from 'lucide-react';

interface TeacherDashboardProps {
  activePlayer: Player;
  onUpdateActivePlayer: (updated: Player) => void;
  mails: Mail[];
  onAddMail: (newMail: Mail) => void;
  onBackToMap: () => void;
  purchaseHistory: any[];
  onUpdatePurchaseHistory: (updatedHistory: any[]) => void;
  onSimulateNextDay?: () => void;
  onLogoutStudent?: () => void;
}

interface SimulatedStudent {
  id: string;
  name: string;
  grade: 'grade_1' | 'grade_2' | 'grade_3' | 'grade_4' | 'grade_5';
  archetype: 'warrior' | 'mage' | 'stem' | 'ninja';
  level: number;
  exp: number;
  gold: number;
  gem: number;
  totalDays: number;
  completedQuestsCount: number;
  isActivePlayer?: boolean;
  phoneNumber?: string;
  classCode?: string;
  studyScheduleDays?: '2-4-6' | '3-5-7';
  studyScheduleShift?: string;
  attendanceCount?: number;
}

export default function TeacherDashboard({
  activePlayer,
  onUpdateActivePlayer,
  mails,
  onAddMail,
  onBackToMap,
  purchaseHistory,
  onUpdatePurchaseHistory,
  onSimulateNextDay,
  onLogoutStudent
}: TeacherDashboardProps) {
  // Trạng thái Đăng nhập mạng Admin
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return activePlayer.classCode === 'SYSTEM_ADMIN' || activePlayer.id === 'admin_teacher';
  });
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Đồng bộ trạng thái đăng nhập cho tài khoản giáo viên gốc
  useEffect(() => {
    if (activePlayer && (activePlayer.classCode === 'SYSTEM_ADMIN' || activePlayer.id === 'admin_teacher')) {
      setIsLoggedIn(true);
    }
  }, [activePlayer]);

  // Danh dách học sinh đồng bộ
  const [students, setStudents] = useState<SimulatedStudent[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');

  // Trình điều khiển tab chi tiết học viên
  const [activeDetailTab, setActiveDetailTab] = useState<'manage' | 'edit_profile' | 'redeemed_gifts'>('manage');

  // Trạng thái edit học viên
  const [editName, setEditName] = useState('');
  const [editGrade, setEditGrade] = useState<'grade_1' | 'grade_2' | 'grade_3' | 'grade_4' | 'grade_5'>('grade_1');
  const [editArchetype, setEditArchetype] = useState<'warrior' | 'mage' | 'stem' | 'ninja'>('warrior');
  const [editLevel, setEditLevel] = useState(1);
  const [editGold, setEditGold] = useState(0);
  const [editGem, setEditGem] = useState(0);
  const [editDays, setEditDays] = useState<'2-4-6' | '3-5-7'>('2-4-6');
  const [editShift, setEditShift] = useState<string>('Ca 1: 08:30 – 10:00');
  const [editAttendanceCount, setEditAttendanceCount] = useState<number>(0);

  // Danh sách quà quy đổi của học viên ảo (để quản trị giáo viên mượt mà)
  const [simulatedRedemptions, setSimulatedRedemptions] = useState<Record<string, any[]>>({});
  
  // Trạng thái gửi thư
  const [mailTitle, setMailTitle] = useState('');
  const [mailContent, setMailContent] = useState('');
  const [mailGoldReward, setMailGoldReward] = useState<number>(0);
  const [mailGemReward, setMailGemReward] = useState<number>(0);
  const [mailSuccess, setMailSuccess] = useState(false);

  // Trạng thái thêm học sinh mới
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentGrade, setNewStudentGrade] = useState<'grade_1' | 'grade_2' | 'grade_3' | 'grade_4' | 'grade_5'>('grade_1');
  const [newStudentArchetype, setNewStudentArchetype] = useState<'warrior' | 'mage' | 'stem' | 'ninja'>('warrior');
  const [showAddForm, setShowAddForm] = useState(false);

  // Khởi tạo danh sách học sinh ban đầu từ localStorage hoặc tạo mới
  useEffect(() => {
    // 1. Tải các tài khoản đã đăng ký thật từ hệ thống
    const savedReg = localStorage.getItem('stv_registered_accounts');
    let registeredList: any[] = [];
    if (savedReg) {
      try {
        registeredList = JSON.parse(savedReg);
      } catch (e) {
        console.error(e);
      }
    }

    // 2. Tải danh sách học sinh quản lý dồi dào
    const savedDb = localStorage.getItem('stv_teacher_students_db');
    let dbList: SimulatedStudent[] = [];
    if (savedDb) {
      try {
        dbList = JSON.parse(savedDb);
      } catch (e) {
        console.error(e);
      }
    }

    // Nếu không có dbList, ta khởi dựng danh sách mẫu tượng trưng ban đầu
    if (dbList.length === 0) {
      dbList = [
        {
          id: 'std_9921',
          name: 'Nguyễn Hoàng Long',
          grade: 'grade_3',
          archetype: 'mage',
          level: 4,
          exp: 150,
          gold: 320,
          gem: 5,
          totalDays: 6,
          completedQuestsCount: 12,
          phoneNumber: '0977112233',
          classCode: 'THTE-03 Tư Duy Số Và Công cụ Sáng tạo'
        },
        {
          id: 'std_7732',
          name: 'Phạm Minh Triết',
          grade: 'grade_5',
          archetype: 'ninja',
          level: 6,
          exp: 290,
          gold: 850,
          gem: 18,
          totalDays: 14,
          completedQuestsCount: 28,
          phoneNumber: '0988556677',
          classCode: 'THTE-05 Phát Triển Tư Duy Với Lập Trình Scratch Cơ Bản đến Nâng Cao'
        },
        {
          id: 'std_1052',
          name: 'Trần Hải Phong',
          grade: 'grade_1',
          archetype: 'stem',
          level: 2,
          exp: 45,
          gold: 150,
          gem: 2,
          totalDays: 3,
          completedQuestsCount: 5,
          phoneNumber: '0933445566',
          classCode: 'THTE-01 Làm Quen Với Máy Tính'
        }
      ];
    }

    // 3. Với mỗi tài khoản đăng ký thật, ta cập nhật/bổ sung vào dbList
    const mergedList = [...dbList];

    registeredList.forEach(p => {
      const idx = mergedList.findIndex(s => s.id === p.id || (p.phoneNumber && s.phoneNumber === p.phoneNumber));
      const mapped: SimulatedStudent = {
        id: p.id,
        name: p.name,
        grade: p.grade,
        archetype: p.archetype,
        level: p.level,
        exp: p.exp,
        gold: p.gold,
        gem: p.gem,
        totalDays: p.totalDays,
        completedQuestsCount: p.completedStages ? (Object.values(p.completedStages) as any[]).reduce((a: number, b: any) => a + Number(b || 0), 0) : 2,
        isActivePlayer: p.id === activePlayer.id,
        phoneNumber: p.phoneNumber,
        classCode: p.classCode,
        studyScheduleDays: p.studyScheduleDays,
        studyScheduleShift: p.studyScheduleShift,
        attendanceCount: p.attendanceCount !== undefined ? p.attendanceCount : 0
      };

      if (idx !== -1) {
        mergedList[idx] = {
          ...mergedList[idx],
          ...mapped
        };
      } else {
        mergedList.push(mapped);
      }
    });

    // Luôn đảm bảo tài khoản người dùng đang hoạt động (activePlayer) có mặt chính xác nhất
    const userIndex = mergedList.findIndex(s => s.id === activePlayer.id || s.isActivePlayer);
    const activeMapped: SimulatedStudent = {
      id: activePlayer.id,
      name: activePlayer.name,
      grade: activePlayer.grade,
      archetype: activePlayer.archetype,
      level: activePlayer.level,
      exp: activePlayer.exp,
      gold: activePlayer.gold,
      gem: activePlayer.gem,
      totalDays: activePlayer.totalDays,
      completedQuestsCount: activePlayer.totalDays * 2,
      isActivePlayer: true,
      phoneNumber: activePlayer.phoneNumber,
      classCode: activePlayer.classCode,
      studyScheduleDays: activePlayer.studyScheduleDays,
      studyScheduleShift: activePlayer.studyScheduleShift,
      attendanceCount: activePlayer.attendanceCount !== undefined ? activePlayer.attendanceCount : 0
    };

    if (userIndex !== -1) {
      mergedList[userIndex] = activeMapped;
    } else {
      mergedList.push(activeMapped);
    }

    setStudents(mergedList);
    localStorage.setItem('stv_teacher_students_db', JSON.stringify(mergedList));
    
    if (!selectedStudentId) {
      setSelectedStudentId(activePlayer.id);
    }
  }, [activePlayer]);

  // Khởi tạo một vài tin nhắn mẫu quy đổi quà cho học sinh ảo
  useEffect(() => {
    const saved = localStorage.getItem('stv_simulated_redemptions');
    if (saved) {
      setSimulatedRedemptions(JSON.parse(saved));
    } else {
      const initial: Record<string, any[]> = {
        'std_9921': [
          { id: 'sim_h1', name: 'Bút chì Kim Sao Việt siêu bền', date: '2026-05-28', code: 'SV-9912', claimed: false },
          { id: 'sim_h2', name: 'Vở vẽ STEM sáng tạo cấp trung', date: '2026-05-20', code: 'SV-3342', claimed: true }
        ],
        'std_7732': [
          { id: 'sim_h3', name: 'Balo Sao Việt thám hiểm Vũ Trụ', date: '2026-05-29', code: 'SV-1250', claimed: false },
          { id: 'sim_h4', name: 'Bình nước giữ nhiệt Kim Cương', date: '2026-05-15', code: 'SV-8851', claimed: true }
        ]
      };
      setSimulatedRedemptions(initial);
      localStorage.setItem('stv_simulated_redemptions', JSON.stringify(initial));
    }
  }, []);

  const currentSelectedStudent = students.find(s => s.id === selectedStudentId);

  // Sync thông tin học viên được chọn vào form chỉnh sửa cá nhân
  useEffect(() => {
    if (currentSelectedStudent) {
      setEditName(currentSelectedStudent.name);
      setEditGrade(currentSelectedStudent.grade);
      setEditArchetype(currentSelectedStudent.archetype);
      setEditLevel(currentSelectedStudent.level);
      setEditGold(currentSelectedStudent.gold);
      setEditGem(currentSelectedStudent.gem);
      setEditDays(currentSelectedStudent.studyScheduleDays || '2-4-6');
      setEditShift(currentSelectedStudent.studyScheduleShift || 'Ca 1: 08:30 – 10:00');
      setEditAttendanceCount(currentSelectedStudent.attendanceCount || 0);
    }
  }, [selectedStudentId, students]);

  // Chọn student đầu tiên làm mặc định nếu có thể
  useEffect(() => {
    if (students.length > 0 && !selectedStudentId) {
      setSelectedStudentId(students[0].id);
    }
  }, [students, selectedStudentId]);

  // Xử lý đăng nhập
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim().toLowerCase() === 'admin' && password === 'admin') {
      sound.playLevelUp();
      setIsLoggedIn(true);
      setLoginError('');
    } else {
      sound.playClick();
      setLoginError('Tài khoản hoặc mật khẩu không chính xác! Gợi ý: admin / admin');
    }
  };

  // Lưu biến động danh sách học sinh
  const saveStudentList = (updated: SimulatedStudent[]) => {
    setStudents(updated);
    localStorage.setItem('stv_teacher_students_db', JSON.stringify(updated));

    // Đồng bộ ngược lại stv_registered_accounts (danh sách đăng ký thật)
    const savedReg = localStorage.getItem('stv_registered_accounts');
    if (savedReg) {
      try {
        let registeredList: any[] = JSON.parse(savedReg);
        let updatedReg = registeredList.map(p => {
          const found = updated.find(s => s.id === p.id);
          if (found) {
            return {
              ...p,
              name: found.name,
              grade: found.grade,
              archetype: found.archetype,
              level: found.level,
              gold: found.gold,
              gem: found.gem,
              classCode: found.classCode || p.classCode,
              phoneNumber: found.phoneNumber || p.phoneNumber,
              studyScheduleDays: found.studyScheduleDays,
              studyScheduleShift: found.studyScheduleShift,
              attendanceCount: found.attendanceCount
            };
          }
          return p;
        });
        localStorage.setItem('stv_registered_accounts', JSON.stringify(updatedReg));
      } catch (e) {
        console.error(e);
      }
    }
  };

  // Xác nhận lưu thông tin cá nhân được chỉnh sửa bởi giáo viên
  const handleSavePersonalInfo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentSelectedStudent) return;
    if (!editName.trim()) {
      alert('Họ tên học viên không được để trống!');
      return;
    }

    sound.playLevelUp();

    const updated = students.map(s => {
      if (s.id === currentSelectedStudent.id) {
        return {
          ...s,
          name: editName.trim(),
          grade: editGrade,
          archetype: editArchetype,
          level: editLevel,
          gold: editGold,
          gem: editGem,
          studyScheduleDays: editDays,
          studyScheduleShift: editShift,
          attendanceCount: editAttendanceCount
        };
      }
      return s;
    });

    saveStudentList(updated);

    // Đồng bộ nếu là active thám hiểm người chơi
    if (currentSelectedStudent.isActivePlayer || currentSelectedStudent.id === activePlayer.id) {
      onUpdateActivePlayer({
        ...activePlayer,
        name: editName.trim(),
        grade: editGrade,
        archetype: editArchetype,
        level: editLevel,
        gold: editGold,
        gem: editGem,
        studyScheduleDays: editDays,
        studyScheduleShift: editShift,
        attendanceCount: editAttendanceCount
      });
    }

    alert(`💾 Đã lưu thành công các thay đổi thông tin cá nhân cho học học viên: ${editName}!`);
  };

  // Trao duyệt quà đổi thực tế
  const handleApproveRealGift = (giftId: string) => {
    sound.playLevelUp();
    if (!currentSelectedStudent) return;

    if (currentSelectedStudent.isActivePlayer || currentSelectedStudent.id === activePlayer.id) {
      const updatedHistory = purchaseHistory.map(item => {
        if (item.id === giftId) {
          return { ...item, claimed: true };
        }
        return item;
      });
      onUpdatePurchaseHistory(updatedHistory);
      alert('🎁 Xét duyệt thành công! Đã thay đổi trạng thái quà thực tế sang "Đã Nhận Quà".');
    } else {
      const studentId = currentSelectedStudent.id;
      const historyList = simulatedRedemptions[studentId] || [];
      const updatedList = historyList.map(h => h.id === giftId ? { ...h, claimed: true } : h);
      const updatedRedemptions = {
        ...simulatedRedemptions,
        [studentId]: updatedList
      };
      setSimulatedRedemptions(updatedRedemptions);
      localStorage.setItem('stv_simulated_redemptions', JSON.stringify(updatedRedemptions));
      alert(`🎁 Đã xác thực trao thành công món quà cho bạn học sinh: ${currentSelectedStudent.name}!`);
    }
  };

  // Trao quà trực tiếp cho học sinh (Vàng/Kim cương)
  const handleAddReward = (gold: number, gems: number) => {
    if (!currentSelectedStudent) return;
    sound.playLevelUp();

    const updated = students.map(s => {
      if (s.id === currentSelectedStudent.id) {
        return {
          ...s,
          gold: s.gold + gold,
          gem: s.gem + gems
        };
      }
      return s;
    });

    saveStudentList(updated);

    // Nếu học sinh được nhận quà chính là player đang đăng nhập, ta đồng bộ trực tiếp lên UI
    if (currentSelectedStudent.isActivePlayer || currentSelectedStudent.id === activePlayer.id) {
      onUpdateActivePlayer({
        ...activePlayer,
        gold: activePlayer.gold + gold,
        gem: activePlayer.gem + gems
      });
    }

    alert(`🎁 Giáo viên đã phát thưởng thành công cho ${currentSelectedStudent.name}: +${gold} Vàng và +${gems} Kim Cương!`);
  };

  // Cập nhật đổi lớp học từ phía giáo viên
  const handleTeacherChangeGrade = (newGrade: 'grade_1' | 'grade_2' | 'grade_3' | 'grade_4' | 'grade_5') => {
    if (!currentSelectedStudent) return;
    sound.playClick();

    const updated = students.map(s => {
      if (s.id === currentSelectedStudent.id) {
        return {
          ...s,
          grade: newGrade
        };
      }
      return s;
    });

    saveStudentList(updated);

    // Nếu chính là active player, đồng bộ lên
    if (currentSelectedStudent.isActivePlayer || currentSelectedStudent.id === activePlayer.id) {
      onUpdateActivePlayer({
        ...activePlayer,
        grade: newGrade
      });
    }

    alert(`📝 Đã đổi lộ trình lớp học của học viên ${currentSelectedStudent.name} sang: ${
      newGrade === 'grade_1' ? 'Lớp 1' : newGrade === 'grade_2' ? 'Lớp 2' : newGrade === 'grade_3' ? 'Lớp 3' : newGrade === 'grade_4' ? 'Lớp 4' : 'Lớp 5'
    }`);
  };

  // Xóa học sinh (chỉ áp dụng đối với các học sinh ảo, không cho tự xóa bản thân)
  const handleDeleteStudent = (id: string) => {
    if (id === activePlayer.id) {
      alert('❌ Giáo viên không thể xóa tài khoản của chính học viên đang trực tiếp thám hiểm hệ thống!');
      return;
    }
    if (confirm('Giáo viên có chắc chắn muốn xóa vĩnh viễn hồ sơ học sinh này khỏi danh sách quản lý?')) {
      sound.playClick();
      const filtered = students.filter(s => s.id !== id);
      saveStudentList(filtered);
      if (selectedStudentId === id) {
        setSelectedStudentId(filtered[0]?.id || '');
      }
    }
  };

  // Thêm học viên ảo mới
  const handleCreateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName.trim()) {
      alert('Vui lòng điền họ tên học sinh!');
      return;
    }

    sound.playClick();
    const newStudent: SimulatedStudent = {
      id: 'std_' + Math.floor(Math.random() * 10000),
      name: newStudentName.trim(),
      grade: newStudentGrade,
      archetype: newStudentArchetype,
      level: 1,
      exp: 0,
      gold: 50,
      gem: 0,
      totalDays: 1,
      completedQuestsCount: 0
    };

    const updated = [...students, newStudent];
    saveStudentList(updated);
    setSelectedStudentId(newStudent.id);
    setNewStudentName('');
    setShowAddForm(false);
    alert(`🎉 Đã đăng ký thành viên mới: học viên ${newStudent.name} học lớp ${newStudentGrade.slice(-1)} thành công!`);
  };

  // Gửi thư thông điệp/giao nhiệm vụ mới cho lớp học
  const handleSendNotification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mailTitle.trim() || !mailContent.trim()) {
      alert('Vui lòng nhập đầy đủ tiêu đề và nội dung thư!');
      return;
    }

    sound.playClick();

    // Tạo thư mới
    const newMail: Mail = {
      id: 'mail_teacher_' + Date.now(),
      title: '📢 [TỪ GIÁO VIÊN]: ' + mailTitle.trim(),
      sender: 'Thầy Cô Sao Việt',
      content: mailContent.trim(),
      date: new Date().toLocaleDateString('vi-VN'),
      reward: (mailGoldReward > 0 || mailGemReward > 0) ? {
        gold: mailGoldReward || undefined,
        gem: mailGemReward || undefined
      } : undefined
    };

    // Gửi vào hệ thống thư chính (được nhận bởi active user)
    onAddMail(newMail);

    // Đồng bộ tăng điểm kinh nghiệm hoặc cộng quà ảo cho các bạn học sinh ảo khác
    const updated = students.map(s => {
      // Nếu gửi thư có đính kèm phần quà, các bé ảo cũng được tích lũy tương ứng
      if (!s.isActivePlayer) {
        return {
          ...s,
          gold: s.gold + (mailGoldReward || 0),
          gem: s.gem + (mailGemReward || 0)
        };
      }
      return s;
    });
    saveStudentList(updated);

    // Kích hoạt thông báo thành công
    setMailSuccess(true);
    setMailTitle('');
    setMailContent('');
    setMailGoldReward(0);
    setMailGemReward(0);

    setTimeout(() => {
      setMailSuccess(false);
    }, 4000);

    alert('✉️ Thư thông điệp chung đã được phát sóng thành công đến hòm thư của tất cả các học sinh!');
  };

  // Lọc học sinh theo từ khóa tìm kiếm
  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Nếu chưa đăng nhập, hiển thị Form đăng nhập admin đẹp đẽ
  if (!isLoggedIn) {
    return (
      <div className="max-w-md mx-auto my-8 bg-white/55 backdrop-blur-md p-6 rounded-3xl border border-white/45 shadow-xl" id="admin-login-frame">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-indigo-600 text-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
            <Lock className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-black text-indigo-950 uppercase tracking-wide">Cổng Giáo Viên Sao Việt</h2>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Đăng nhập tài khoản quản trị viên để theo dõi, quản lý học viên và cấp thưởng.
          </p>
        </div>

        {loginError && (
          <div className="mb-4 bg-rose-50 border border-rose-300 text-rose-800 p-3 rounded-xl text-xs font-bold flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            {loginError}
          </div>
        )}

        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-black text-indigo-950 uppercase mb-1">
              Tài khoản quản trị:
            </label>
            <input
              type="text"
              placeholder="Nhập 'admin'"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white/80 font-bold text-slate-800 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-black text-indigo-950 uppercase mb-1">
              Mật khẩu:
            </label>
            <input
              type="password"
              placeholder="Nhập 'admin'"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white/80 font-bold text-slate-800 text-sm"
              autoComplete="current-password"
            />
          </div>

          <div className="bg-amber-50 border border-amber-300 p-3 rounded-xl text-[10px] text-amber-900 leading-normal font-bold">
            💡 <strong>Gợi ý xác thực nhanh:</strong> Nhập tài khoản <strong>admin</strong> và mật khẩu <strong>admin</strong> để truy cập ngay vào trang giáo trình!
          </div>

          <div className="pt-2 flex gap-2">
            <button
              type="button"
              onClick={onBackToMap}
              className="flex-1 py-3 px-4 bg-slate-300 hover:bg-slate-350 text-slate-800 font-extrabold rounded-xl text-xs uppercase cursor-pointer transition text-center"
            >
              Trở về học
            </button>
            <button
              type="submit"
              className="flex-1 py-3 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold rounded-xl text-xs uppercase cursor-pointer transition text-center flex items-center justify-center gap-1.5"
            >
              <Key className="w-4 h-4" /> Đăng nhập
            </button>
          </div>
        </form>

        {onLogoutStudent && (
          <div className="mt-6 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                onLogoutStudent();
              }}
              className="w-full py-3 bg-rose-600 hover:bg-rose-500 text-white font-black text-xs uppercase rounded-xl transition shadow-sm cursor-pointer text-center flex items-center justify-center gap-1.5"
            >
              <LogOut className="w-4.5 h-4.5" /> Đăng Xuất Tài Khoản Học Sinh
            </button>
            <p className="text-[10px] text-slate-500 font-medium text-center mt-2 leading-normal">
              📌 Dành cho học sinh muốn đăng xuất khỏi tài khoản hiện tại để đăng nhập tài khoản khác hoặc đăng ký mới!
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-1 md:p-3" id="admin-dashboard-container">
      {/* Header Admin */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 pb-4 border-b border-white/40 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <GraduationCap className="text-indigo-700 w-7 h-7" />
            <h1 className="text-xl font-black text-indigo-950 uppercase tracking-tight">Học Viện Tin Học Sao Việt — Giáo Viên Portal</h1>
          </div>
          <p className="text-xs text-indigo-950/70 font-semibold mt-1">
            Hệ thống theo dõi tiến trình, điều chỉnh phân môn lớp học và động viên phát thưởng học viên.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 self-stretch md:self-auto w-full md:w-auto">
          <button
            onClick={() => {
              sound.playClick();
              setIsLoggedIn(false);
            }}
            className="px-4 py-2 bg-slate-100 border border-slate-200 hover:bg-slate-200 text-slate-800 font-extrabold text-xs uppercase rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer flex-1 sm:flex-none"
          >
            Đăng xuất Admin
          </button>
          {onLogoutStudent && (
            <button
              onClick={() => {
                sound.playClick();
                onLogoutStudent();
              }}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-black text-xs uppercase rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer flex-1 sm:flex-none"
            >
              <LogOut className="w-4 h-4" /> Đăng xuất Học Sinh
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* CỘT CỦA DANH SÁCH LỚP HỌC (4 CỘT) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white/40 backdrop-blur-md border border-white/50 p-4 rounded-3xl shadow-md">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-black text-xs text-indigo-950 uppercase tracking-widest flex items-center gap-1.5">
                <Users className="w-4 h-4 text-indigo-700" /> Sĩ số Lớp Học ({students.length})
              </h3>
              
              <button
                onClick={() => {
                  sound.playClick();
                  setShowAddForm(!showAddForm);
                }}
                className="py-1 px-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-black uppercase transition flex items-center gap-1 cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5" /> Tạo Account
              </button>
            </div>

            {/* FORM THÊM HỌC SINH MỚI */}
            {showAddForm && (
              <form onSubmit={handleCreateStudent} className="bg-white/70 p-3 rounded-2xl border border-indigo-100 mb-4 space-y-3 shadow-inner">
                <h4 className="text-xs font-black text-indigo-950 uppercase">Đăng ký học viên ảo mới</h4>
                
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase">Họ và tên:</label>
                  <input
                    type="text"
                    required
                    placeholder="ví dụ: Nguyễn An Khang"
                    value={newStudentName}
                    onChange={(e) => setNewStudentName(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-505"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase font-mono">Đăng ký lớp học:</label>
                    <select
                      value={newStudentGrade}
                      onChange={(e) => setNewStudentGrade(e.target.value as any)}
                      className="w-full p-1.5 rounded-lg border border-slate-300 text-xs font-bold text-slate-800"
                    >
                      <option value="grade_1">Lớp 1</option>
                      <option value="grade_2">Lớp 2</option>
                      <option value="grade_3">Lớp 3</option>
                      <option value="grade_4">Lớp 4</option>
                      <option value="grade_5">Lớp 5</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase">Hệ Nhân Vật:</label>
                    <select
                      value={newStudentArchetype}
                      onChange={(e) => setNewStudentArchetype(e.target.value as any)}
                      className="w-full p-1.5 rounded-lg border border-slate-300 text-xs font-bold text-slate-800"
                    >
                      <option value="warrior">Chiến Binh ⚔️</option>
                      <option value="mage">Phù Thủy 🔮</option>
                      <option value="stem">Phát Minh ⚙️</option>
                      <option value="ninja">Bàn Phím 🥷</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-1.5 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="flex-1 py-1 text-slate-700 bg-slate-200 hover:bg-slate-300 rounded text-[10px] uppercase font-bold cursor-pointer"
                  >
                    Bỏ qua
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-[10px] uppercase font-black cursor-pointer"
                  >
                    Nhập Học
                  </button>
                </div>
              </form>
            )}

            {/* THANH TÌM KIẾM */}
            <div className="relative mb-3">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                <Search className="w-4 h-4" />
              </span>
              <input
                type="text"
                placeholder="Tìm tên học viên..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white/70 text-xs font-bold"
              />
            </div>

            {/* DANH SÁCH CUỘN HỌC SINH */}
            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
              {filteredStudents.map((s) => {
                const isSelected = s.id === selectedStudentId;
                const isUser = s.id === activePlayer.id || s.isActivePlayer;

                return (
                  <div
                    key={s.id}
                    onClick={() => {
                      sound.playClick();
                      setSelectedStudentId(s.id);
                    }}
                    className={`p-2.5 rounded-2xl border transition duration-150 cursor-pointer relative flex items-center justify-between ${
                      isSelected
                        ? 'bg-amber-100 border-amber-400 shadow-md scale-[1.01]'
                        : 'bg-white/60 hover:bg-white border-white/40 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-white/80 border border-white flex items-center justify-center text-xl">
                        {s.archetype === 'warrior' ? '⚔️' : s.archetype === 'mage' ? '🔮' : s.archetype === 'stem' ? '⚙️' : '🥷'}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-black text-xs text-indigo-950 truncate max-w-[140px]">{s.name}</span>
                          {isUser && (
                            <span className="bg-indigo-600 text-[8px] font-black uppercase text-white px-1 rounded animate-pulse">
                              LIVELY
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-500 font-extrabold flex items-center gap-2">
                          <span className="text-indigo-800">
                            Cấp {s.level} | {s.grade === 'grade_1' ? 'Lớp 1' : s.grade === 'grade_2' ? 'Lớp 2' : s.grade === 'grade_3' ? 'Lớp 3' : s.grade === 'grade_4' ? 'Lớp 4' : 'Lớp 5'}
                          </span>
                        </div>
                        {s.classCode && (
                          <p className="text-[9px] text-amber-800 font-black truncate max-w-[140px] mt-0.5">
                            🏷️ {s.classCode.split(' ')[0]}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <span className="font-mono text-amber-700 text-xs font-black">🪙 {s.gold}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteStudent(s.id);
                        }}
                        className={`text-slate-400 hover:text-rose-600 p-1 rounded-lg hover:bg-rose-50 transition shrink-0 cursor-pointer ${
                          isUser ? 'opacity-20 pointer-events-none' : ''
                        }`}
                        title="Xóa hồ sơ"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}

              {filteredStudents.length === 0 && (
                <div className="text-center py-8 text-xs text-slate-400 font-bold bg-white/20 rounded-2xl">
                  Không tìm thấy học viên tương ứng.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* CỘT CHI TIẾT HỌC SINH ĐƯỢC CHỌN & CHỨC NĂNG PHÁT THƯỞNG, ĐỔI LỚP (7 CỘT) */}
        <div className="lg:col-span-12 xl:col-span-7 space-y-4">
          
          {currentSelectedStudent ? (
            <div className="bg-white/40 backdrop-blur-md border border-white/50 p-4 md:p-5 rounded-3xl shadow-md space-y-5" id="admin-detail-view">
              
              {/* PROFILE CHUNG */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-indigo-950/15 pb-4 gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-white/70 border-2 border-indigo-200 rounded-2xl flex items-center justify-center text-3xl shadow">
                    {currentSelectedStudent.archetype === 'warrior' ? '⚔️' : currentSelectedStudent.archetype === 'mage' ? '🔮' : currentSelectedStudent.archetype === 'stem' ? '⚙️' : '🥷'}
                  </div>
                  <div>
                    <h3 className="text-base font-black text-indigo-950 flex items-center gap-2">
                      {currentSelectedStudent.name}
                      {currentSelectedStudent.id === activePlayer.id && (
                        <span className="text-[9px] bg-emerald-100 text-emerald-800 py-0.5 px-1.5 rounded-full border border-emerald-300 font-sans font-black">
                          Đang hoạt động (Bạn)
                        </span>
                      )}
                    </h3>
                    <p className="text-xs text-slate-500 font-semibold flex flex-wrap gap-x-2 items-center">
                      <span>Mã học viên: <strong className="font-mono text-indigo-900">{currentSelectedStudent.id}</strong></span>
                      <span>•</span>
                      <span>Chuyên hệ: <strong>{
                        currentSelectedStudent.archetype === 'warrior' ? 'Chiến Binh Tin Học' : currentSelectedStudent.archetype === 'mage' ? 'Phù Thủy Toán Học' : currentSelectedStudent.archetype === 'stem' ? 'Nhà STEM' : 'Bàn Phím Ninja'
                      }</strong></span>
                      {currentSelectedStudent.phoneNumber && (
                        <>
                          <span>•</span>
                          <span>SĐT: <strong className="text-teal-700 font-mono">{currentSelectedStudent.phoneNumber}</strong></span>
                        </>
                      )}
                      {currentSelectedStudent.classCode && (
                        <>
                          <span>•</span>
                          <span>Mã Lớp: <strong className="text-amber-800 font-bold">{currentSelectedStudent.classCode}</strong></span>
                        </>
                      )}
                    </p>
                  </div>
                </div>

                <div className="bg-indigo-600/10 border border-indigo-600/20 px-3 py-1 bg-white/30 rounded-xl text-center self-stretch sm:self-auto">
                  <span className="block text-[8px] font-black text-slate-500 uppercase tracking-widest font-mono">BẬC TIÊN PHONG</span>
                  <span className="text-indigo-900 font-mono font-black text-base">Cấp Độ {currentSelectedStudent.level}</span>
                </div>
              </div>

              {/* CHỈ SỐ TIẾN ĐỘ THỰC TẾ & VÍ TIỀN */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-white/60 p-3 rounded-2xl border border-white/55 text-center shadow-sm">
                  <span className="text-lg block mb-1">🪙</span>
                  <span className="block text-[8px] text-zinc-500 font-black font-mono">VÀNG CHĂM CHỈ</span>
                  <span className="font-mono font-black text-sm text-yellow-700">{currentSelectedStudent.gold}</span>
                </div>

                <div className="bg-white/60 p-3 rounded-2xl border border-white/55 text-center shadow-sm">
                  <span className="text-lg block mb-1">💎</span>
                  <span className="block text-[8px] text-zinc-500 font-black font-mono">KIM CƯƠNG TRÍ THỨC</span>
                  <span className="font-mono font-black text-sm text-rose-600">{currentSelectedStudent.gem}</span>
                </div>

                <div className="bg-white/60 p-3 rounded-2xl border border-white/55 text-center shadow-sm">
                  <span className="text-lg block mb-1">🎒</span>
                  <span className="block text-[8px] text-zinc-500 font-black font-mono">ĐỒNG HÀNH CHUYÊN CẦN</span>
                  <span className="font-mono font-black text-xs text-indigo-950">{currentSelectedStudent.totalDays} buổi học</span>
                </div>

                <div className="bg-white/60 p-3 rounded-2xl border border-white/55 text-center shadow-sm">
                  <span className="text-lg block mb-1">✅</span>
                  <span className="block text-[8px] text-zinc-500 font-black font-mono">NHIỆM VỤ ĐÃ GIẢI</span>
                  <span className="font-mono font-black text-xs text-emerald-700">{currentSelectedStudent.completedQuestsCount} bài luyện</span>
                </div>
              </div>

              {/* LỊCH HỌC & THỐNG KÊ BUỔI ĐI HỌC CỦA HỌC VIÊN */}
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-3.5 border border-indigo-100 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-xs">
                    📅
                  </div>
                  <div>
                    <span className="block text-[10px] font-black text-indigo-950 uppercase tracking-wider">Khung Giờ Học Đăng Ký Sao Việt</span>
                    <div className="flex items-center gap-1.5 flex-wrap mt-0.5">
                      <span className="bg-indigo-100 text-indigo-900 border border-indigo-200 text-[10px] font-black py-0.5 px-2 rounded-lg">
                        Thứ {currentSelectedStudent.studyScheduleDays || 'Chưa chọn'}
                      </span>
                      <span className="bg-purple-100 text-purple-900 border border-purple-200 text-[10px] font-black py-0.5 px-2 rounded-lg">
                        {currentSelectedStudent.studyScheduleShift || 'Chưa chọn'}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white px-3.5 py-2 border border-indigo-100 rounded-xl flex items-center justify-between sm:justify-start gap-4">
                  <div>
                    <span className="block text-[8px] font-black text-slate-500 uppercase font-mono">THỐNG KÊ SỐ BUỔI HỌC</span>
                    <span className="text-indigo-950 font-black text-sm block leading-tight">{currentSelectedStudent.attendanceCount || 0} buổi đi học</span>
                  </div>
                  <div>
                    <button
                      type="button"
                      onClick={() => {
                        sound.playLevelUp();
                        const updated = students.map(s => {
                          if (s.id === currentSelectedStudent.id) {
                            return { ...s, attendanceCount: (s.attendanceCount || 0) + 1 };
                          }
                          return s;
                        });
                        saveStudentList(updated);
                        
                        // Đồng bộ nếu là active thám hiểm người chơi
                        if (currentSelectedStudent.isActivePlayer || currentSelectedStudent.id === activePlayer.id) {
                          onUpdateActivePlayer({
                            ...activePlayer,
                            attendanceCount: (activePlayer.attendanceCount || 0) + 1
                          });
                        }
                      }}
                      className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-black rounded-lg text-[9px] cursor-pointer transition select-none uppercase tracking-wide shadow-xs"
                    >
                      + Điểm danh buổi học
                    </button>
                  </div>
                </div>
              </div>

              {/* TABS TRÌNH ĐIỀU KHIỂN CHI TIẾT */}
              <div className="flex border-b border-indigo-950/10 gap-1 mt-2">
                <button
                  type="button"
                  onClick={() => { sound.playClick(); setActiveDetailTab('manage'); }}
                  className={`py-2 px-3 border-b-2 text-xs font-black uppercase transition cursor-pointer ${
                    activeDetailTab === 'manage'
                      ? 'border-indigo-600 text-indigo-700 font-extrabold'
                      : 'border-transparent text-slate-500 hover:text-slate-700 font-bold'
                  }`}
                >
                  🛠️ Quản lý & Cấp phát
                </button>
                <button
                  type="button"
                  onClick={() => { sound.playClick(); setActiveDetailTab('edit_profile'); }}
                  className={`py-2 px-3 border-b-2 text-xs font-black uppercase transition cursor-pointer ${
                    activeDetailTab === 'edit_profile'
                      ? 'border-indigo-600 text-indigo-700 font-extrabold'
                      : 'border-transparent text-slate-500 hover:text-slate-700 font-bold'
                  }`}
                >
                  ✏️ Sửa Thông Tin Cá Nhân
                </button>
                <button
                  type="button"
                  onClick={() => { sound.playClick(); setActiveDetailTab('redeemed_gifts'); }}
                  className={`py-2 px-3 border-b-2 text-xs font-black uppercase transition cursor-pointer relative ${
                    activeDetailTab === 'redeemed_gifts'
                      ? 'border-indigo-600 text-indigo-700 font-extrabold'
                      : 'border-transparent text-slate-500 hover:text-slate-700 font-bold'
                  }`}
                >
                  🎁 Quà Đã Đổi
                  {(currentSelectedStudent.isActivePlayer || currentSelectedStudent.id === activePlayer.id
                    ? purchaseHistory.filter(h => !h.claimed).length
                    : (simulatedRedemptions[currentSelectedStudent.id] || []).filter(h => !h.claimed).length) > 0 && (
                    <span className="absolute top-1 right-[-4px] w-2 h-2 bg-rose-600 rounded-full animate-pulse" />
                  )}
                </button>
              </div>

              {/* TAB 1: QUẢN LÝ & CẤP PHÁT KHANH THƯỞNG */}
              {activeDetailTab === 'manage' && (
                <div className="space-y-4">
                  {/* CHỨC NĂNG 1: THOẢI MÁI CHỈNH ĐỘ KHÓ / TRÌNH ĐỘ CHO HỌC VIÊN */}
                  <div className="space-y-2 bg-indigo-50/50 p-3.5 border border-indigo-100 rounded-2xl">
                    <h4 className="font-black text-xs text-indigo-950 uppercase tracking-wider flex items-center gap-1.5">
                      <GraduationCap className="w-4 h-4 text-indigo-700" /> 
                      Cài Đặt Cấp Học kiến thức (Độ Khó ôn luyện)
                    </h4>
                    <p className="text-[10px] text-slate-500 font-medium">
                      Hòa nhịp năng lực học tập của bé. Khi giáo viên chuyển lớp, hệ thống sẽ tự động cập nhật ngân hàng câu hỏi thích hợp đi kèm giúp bé không gặp khó khăn:
                    </p>

                    <div className="grid grid-cols-5 gap-1.5 pt-1.5" id="teacher-grade-buttons">
                      {[1, 2, 3, 4, 5].map((gNum) => {
                        const gradeKey = `grade_${gNum}` as any;
                        const isCurrent = currentSelectedStudent.grade === gradeKey;
                        
                        return (
                          <button
                            key={gNum}
                            onClick={() => handleTeacherChangeGrade(gradeKey)}
                            className={`py-2 text-xs font-black rounded-xl transition cursor-pointer text-center ${
                              isCurrent
                                ? 'bg-amber-400 text-slate-950 shadow-md font-black scale-105 border border-amber-400'
                                : 'bg-white text-slate-800 border border-slate-300 hover:border-slate-400 hover:bg-slate-50'
                            }`}
                          >
                            Lớp {gNum}
                          </button>
                        );
                      })}
                    </div>
                    <div className="pt-1 text-[9px] text-indigo-900 font-bold leading-normal">
                      📌 Trình độ bé hiện tại: Lớp {currentSelectedStudent.grade.slice(-1)}. Khi bé làm bài trắc nghiệm học thuật, câu hỏi sẽ được trích ra phù hợp chuẩn giáo lý sư phạm!
                    </div>
                  </div>

                  {/* CHỨC NĂNG 2: PHÁT THƯỞNG ĐỘNG VIÊN QUÀ TẶNG (VÀNG / KIM CƯƠNG) */}
                  <div className="space-y-2.5 bg-amber-50/50 p-3.5 border border-amber-200 rounded-2xl">
                    <h4 className="font-black text-xs text-indigo-950 uppercase tracking-wider flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-amber-600 animate-bounce" />
                      Khen Thưởng Học Viên Chăm Học
                    </h4>
                    <p className="text-[10px] text-slate-500 font-medium">
                      Giáo viên có thể khích lệ thành tích rèn luyện của bé bằng cách tặng trực tiếp Vàng hoặc Kim cương lên tài khoản:
                    </p>

                    <div className="flex flex-wrap gap-2 pt-1">
                      <button
                        onClick={() => handleAddReward(100, 0)}
                        className="flex-1 py-2 px-3 bg-white hover:bg-amber-100 border border-amber-300 text-amber-900 font-black text-xs rounded-xl transition cursor-pointer text-center flex items-center justify-center gap-1 shadow-sm"
                      >
                        🪙 +100 Vàng
                      </button>
                      <button
                        onClick={() => handleAddReward(500, 0)}
                        className="flex-1 py-2 px-3 bg-white hover:bg-amber-100 border border-amber-300 text-amber-900 font-black text-xs rounded-xl transition cursor-pointer text-center flex items-center justify-center gap-1 shadow-sm"
                      >
                        🪙 +500 Vàng
                      </button>
                      <button
                        onClick={() => handleAddReward(0, 5)}
                        className="flex-1 py-2 px-3 bg-white hover:bg-rose-100 border border-rose-300 text-rose-800 font-black text-xs rounded-xl transition cursor-pointer text-center flex items-center justify-center gap-1 shadow-sm"
                      >
                        💎 +5 Kim Cương
                      </button>
                      <button
                        onClick={() => handleAddReward(0, 20)}
                        className="flex-1 py-2 px-3 bg-white hover:bg-rose-100 border border-rose-300 text-rose-800 font-black text-xs rounded-xl transition cursor-pointer text-center flex items-center justify-center gap-1 shadow-sm"
                      >
                        💎 +20 Kim Cương
                      </button>
                    </div>
                  </div>

                  {/* CHỨC NĂNG 3: MÔ PHỎNG SANG NGÀY HỌC MỚI (CHỈ GIÁO VIÊN/ADMIN MỚI KHÓA/MỞ) */}
                  <div className="space-y-2 bg-emerald-50/50 p-3.5 border border-emerald-200 rounded-2xl">
                    <h4 className="font-black text-xs text-emerald-950 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-emerald-600 animate-pulse" />
                      Mở Khóa Ngày Học Tiếp Theo (Bỏ Qua Chờ 24H)
                    </h4>
                    <p className="text-[10px] text-slate-500 font-medium">
                      Để thuận tiện cho thầy cô kiểm tra, làm bài demo hoặc hướng dẫn mốc chuyên cần của học viên, tính năng này sẽ lập tức mở khóa ngày điểm danh tiếp theo cho tài khoản học viên đang kích hoạt:
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        if (onSimulateNextDay) {
                          onSimulateNextDay();
                        } else {
                          alert("Không tìm thấy hàm callback mô phỏng!");
                        }
                      }}
                      className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase rounded-xl transition cursor-pointer text-center flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      ☀️ Kích hoạt Sang Ngày Học Tiếp Theo (Reset Cooldown)
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 2: THAY ĐỔI THÔNG TIN CÁ NHÂN */}
              {activeDetailTab === 'edit_profile' && (
                <form onSubmit={handleSavePersonalInfo} className="space-y-4 bg-indigo-50/30 p-4 border border-indigo-100 rounded-2xl">
                  <h4 className="font-black text-xs text-indigo-950 uppercase tracking-wider flex items-center gap-1.5">
                    <Edit3 className="w-4 h-4 text-indigo-700" />
                    Chỉnh sửa Thông tin cá nhân & Chỉ số
                  </h4>
                  <p className="text-[10px] text-slate-500 font-medium">
                    Nhập thông tin cá nhân mới cho học viên. Dữ liệu sẽ đồng bộ hóa đầy đủ lên tài khoản của trẻ.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-black text-slate-500 uppercase mb-1">Họ tên học viên:</label>
                      <input
                        type="text"
                        required
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white font-bold text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-black text-slate-500 uppercase mb-1">Cấp học ôn luyện (Lớp):</label>
                      <select
                        value={editGrade}
                        onChange={(e) => setEditGrade(e.target.value as any)}
                        className="w-full p-2 rounded-xl border border-slate-300 text-xs font-bold bg-white"
                      >
                        <option value="grade_1">Lớp 1</option>
                        <option value="grade_2">Lớp 2</option>
                        <option value="grade_3">Lớp 3</option>
                        <option value="grade_4">Lớp 4</option>
                        <option value="grade_5">Lớp 5</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-black text-slate-500 uppercase mb-1">Chuyên hệ nhân vật:</label>
                      <select
                        value={editArchetype}
                        onChange={(e) => setEditArchetype(e.target.value as any)}
                        className="w-full p-2 rounded-xl border border-slate-300 text-xs font-bold bg-white"
                      >
                        <option value="warrior">Chiến Binh ⚔️</option>
                        <option value="mage">Phù Thủy 🔮</option>
                        <option value="stem">Phát Minh ⚙️</option>
                        <option value="ninja">Bàn Phím 🥷</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-black text-slate-500 uppercase mb-1">Trình độ (Cấp Độ):</label>
                      <input
                        type="number"
                        min="1"
                        max="100"
                        value={editLevel}
                        onChange={(e) => setEditLevel(parseInt(e.target.value) || 1)}
                        className="w-full px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-bold bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-black text-slate-500 uppercase mb-1">Vàng chăm chỉ:</label>
                      <input
                        type="number"
                        min="0"
                        value={editGold}
                        onChange={(e) => setEditGold(parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-bold bg-white font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-black text-slate-500 uppercase mb-1">Kim Cương trí thức:</label>
                      <input
                        type="number"
                        min="0"
                        value={editGem}
                        onChange={(e) => setEditGem(parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-bold bg-white font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-black text-slate-500 uppercase mb-1">📅 Ngày học cố định:</label>
                      <select
                        value={editDays}
                        onChange={(e) => setEditDays(e.target.value as any)}
                        className="w-full p-2 rounded-xl border border-slate-300 text-xs font-bold bg-white"
                      >
                        <option value="2-4-6">Thứ 2 - 4 - 6</option>
                        <option value="3-5-7">Thứ 3 - 5 - 7</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-black text-slate-500 uppercase mb-1">⏰ Khung giờ ca học:</label>
                      <select
                        value={editShift}
                        onChange={(e) => setEditShift(e.target.value)}
                        className="w-full p-2 rounded-xl border border-slate-300 text-xs font-bold bg-white"
                      >
                        <option value="Ca 1: 08:30 – 10:00">Ca 1: 08:30 – 10:00</option>
                        <option value="Ca 2: 10:00 – 11:30">Ca 2: 10:00 – 11:30</option>
                        <option value="Ca 3: 14:00 – 15:30">Ca 3: 14:00 – 15:30</option>
                        <option value="Ca 4: 17:00 – 18:30">Ca 4: 17:00 – 18:30</option>
                        <option value="Ca 5: 19:00 – 20:30">Ca 5: 19:00 – 20:30</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-black text-slate-500 uppercase mb-1">📝 Thống kê số buổi đi học:</label>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => { sound.playClick(); setEditAttendanceCount(Math.max(0, editAttendanceCount - 1)); }}
                          className="px-2.5 py-1.5 bg-slate-200 hover:bg-slate-300 rounded-lg font-black text-xs cursor-pointer select-none transition"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          min="0"
                          value={editAttendanceCount}
                          onChange={(e) => setEditAttendanceCount(parseInt(e.target.value) || 0)}
                          className="flex-1 w-full px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-bold bg-white text-center font-mono"
                        />
                        <button
                          type="button"
                          onClick={() => { sound.playClick(); setEditAttendanceCount(editAttendanceCount + 1); }}
                          className="px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-black text-xs cursor-pointer select-none transition"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="text-right pt-2">
                    <button
                      type="submit"
                      className="py-2 px-5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black uppercase transition inline-flex items-center gap-1.5 cursor-pointer shadow-sm hover:shadow"
                    >
                      <Save className="w-3.5 h-3.5" /> Lưu thông tin cá nhân
                    </button>
                  </div>
                </form>
              )}

              {/* TAB 3: QUÀ ĐÃ QUY ĐỔI */}
              {activeDetailTab === 'redeemed_gifts' && (
                <div className="space-y-3 bg-amber-50/20 p-4 border border-amber-100 rounded-2xl animate-fade-in">
                  <h4 className="font-black text-xs text-indigo-950 uppercase tracking-wider flex items-center gap-1.5">
                    <Gift className="w-4 h-4 text-indigo-700" />
                    Quà hoặc Phần Thưởng đã quy đổi cần trao
                  </h4>
                  <p className="text-[10px] text-slate-500 font-medium font-sans">
                    {currentSelectedStudent.isActivePlayer || currentSelectedStudent.id === activePlayer.id
                      ? "Đây là danh sách quà được đổi TRỰC TIẾP từ vàng của học sinh này trên Shop:"
                      : "Trạng thái đổi quà của học sinh này:"}
                  </p>

                  <div className="space-y-2 mt-2">
                    {(currentSelectedStudent.isActivePlayer || currentSelectedStudent.id === activePlayer.id
                      ? purchaseHistory
                      : (simulatedRedemptions[currentSelectedStudent.id] || [])
                    ).length > 0 ? (
                      (currentSelectedStudent.isActivePlayer || currentSelectedStudent.id === activePlayer.id
                        ? purchaseHistory
                        : (simulatedRedemptions[currentSelectedStudent.id] || [])
                      ).map((item: any) => (
                        <div key={item.id} className="p-3 bg-white/70 border border-slate-200 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
                          <div>
                            <div className="text-xs font-bold text-slate-800">{item.name}</div>
                            <div className="flex flex-wrap items-center gap-x-2 text-[10px] text-slate-500 font-bold mt-1">
                              <span>Ngày đổi: {item.date}</span>
                              <span>•</span>
                              <span>Mã nhận: <span className="text-indigo-900 font-mono font-black">{item.code}</span></span>
                            </div>
                          </div>

                          <div>
                            {item.claimed ? (
                              <span className="inline-flex items-center gap-1 text-[10px] font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg">
                                <CheckCircle className="w-3 h-3 text-emerald-600" /> Đã nhận quà
                              </span>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleApproveRealGift(item.id)}
                                className="py-1 px-3 bg-indigo-650 hover:bg-indigo-600 bg-indigo-600 text-white rounded-lg text-[10px] font-black uppercase transition cursor-pointer flex items-center gap-1 shadow-sm"
                              >
                                Duyệt & Trao Quà
                              </button>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-6 text-xs text-slate-400 font-medium bg-white/20 rounded-xl border border-dashed border-slate-300">
                        Học sinh này chưa có lịch sử đổi quà.
                      </div>
                    )}
                  </div>
                </div>
              )}

            </div>
          ) : (
            <div className="bg-white/30 rounded-3xl p-8 text-center text-slate-500 font-bold border border-white/40">
              Hãy chọn 1 học sinh bên cột danh sách để bắt đầu chỉ định giáo trình và khích bách phát thưởng.
            </div>
          )}

          {/* CHỨC NĂNG 3: SOẠN VÀ PHÁT SÓNG THƯ THÔNG ĐIỆP CHUNG TOÀN LỚP CÓ KÈM QUÀ */}
          <div className="bg-white/45 backdrop-blur-sm border border-white/50 p-4 rounded-3xl shadow-md space-y-4">
            <h3 className="font-black text-xs text-indigo-950 uppercase tracking-widest flex items-center gap-1.5">
              <MailIcon className="w-4 h-4 text-indigo-700" /> Bảng Thông Điệp & Phát Quà Toàn Lớp
            </h3>
            <p className="text-[10px] text-slate-500 font-semibold leading-normal">
              Soạn thảo thư dặn dò hoặc thử thách hàng tuần. Thư sẽ được gửi trực tiếp vào Hòm thư của học viên tích cực của bạn trên UI đồng bộ!
            </p>

            {mailSuccess && (
              <div className="bg-emerald-100 border border-emerald-400 text-emerald-800 rounded-xl p-3 text-xs font-bold flex items-center gap-2 transition duration-200 animate-pulse">
                <CheckCircle className="w-4 h-4 shrink-0" />
                Đồng bộ thành công! Tin nhắn đã ghim thẳng lên vũ đài thông điệp lớp học và gửi đến hòm thư live của học viên!
              </div>
            )}

            <form onSubmit={handleSendNotification} className="space-y-3.5">
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase">Tiêu đề thư dặn dò:</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Thử thách giải tinh nhuệ Tin học cuối tuần"
                  value={mailTitle}
                  onChange={(e) => setMailTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-800 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-indigo-505 bg-white/70"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase">Nội dung thông điệp cụ thể:</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Ví dụ: Xin chào các em dũng sỹ! Hãy hoàn thành xuất sắc các màn đấu tại Đảo Rồng để rinh thật nhiều quà tặng nhé..."
                  value={mailContent}
                  onChange={(e) => setMailContent(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-800 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-indigo-505 bg-white/70"
                />
              </div>

              {/* Tùy chọn quà kèm theo */}
              <div className="grid grid-cols-2 gap-3" id="mail-rewards-box">
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase flex items-center gap-1">🪙 Đính kèm Vàng thưởng học:</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="Chọn số lượng vàng (nếu có)"
                    value={mailGoldReward || ''}
                    onChange={(e) => setMailGoldReward(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-300 text-slate-800 text-xs font-bold bg-white/70"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase flex items-center gap-1">💎 Đính kèm Kim Cương thưởng:</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="Chọn số lượng Kim Cương"
                    value={mailGemReward || ''}
                    onChange={(e) => setMailGemReward(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-300 text-slate-800 text-xs font-bold bg-white/70"
                  />
                </div>
              </div>

              <div className="text-right">
                <button
                  type="submit"
                  className="py-2.5 px-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-black uppercase transition flex items-center gap-1.5 cursor-pointer ml-auto shadow-md hover:shadow-lg inline-flex"
                >
                  <Send className="w-3.5 h-3.5" /> Phát sóng Tin nhắn & Quà đến cả lớp
                </button>
              </div>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
}
