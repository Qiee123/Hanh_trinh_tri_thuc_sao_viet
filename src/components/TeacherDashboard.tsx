/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useState, useEffect } from 'react';
import { Player, Mail } from '../types';
import { sound } from './SoundManager';
import { doc, getDoc, getDocs, setDoc, collection } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { 
  Users, 
  GraduationCap, 
  Coins, 
  Sparkles, 
  Mail as MailIcon, 
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
  Gift,
  BarChart2,
  Calendar,
  Clock,
  BookOpen,
  ChevronRight,
  TrendingUp,
  MapPin,
  Sliders
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
  completedStages?: Record<string, number>;
}

// Danh sách các vùng bản đồ trong game tương ứng REGIONS
const GAME_REGIONS = [
  { id: 'region_1', name: 'Rừng Toán Học', icon: '🌲', maxStages: 15 },
  { id: 'region_2', name: 'Lâu Đài Tin Học', icon: '🏰', maxStages: 15 },
  { id: 'region_3', name: 'Băng Giá Logic', icon: '❄️', maxStages: 15 },
  { id: 'region_4', name: 'Núi Lửa Tư Duy', icon: '🔥', maxStages: 15 },
  { id: 'region_5', name: 'Đảo Rồng MOS', icon: '🐉', maxStages: 15 },
  { id: 'region_6', name: 'Vương Quốc AI', icon: '🤖', maxStages: 15 }
];

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
  // Trạng thái Đăng nhập hệ giáo viên
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return activePlayer.classCode === 'SYSTEM_ADMIN' || activePlayer.id === 'admin_teacher';
  });
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Tab Menu chính của Teacher:
  // - 'stats': Thống Kê Chung & Ca Học
  // - 'students': Quản Lý Chi Tiết Học Viên
  // - 'broadcast': Phát Thông Điệp Toàn Lớp
  const [activeMainTab, setActiveMainTab] = useState<'stats' | 'students' | 'broadcast'>('stats');

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

  // Trình điều khiển tab chi tiết học viên (bên trong tab quản lý chi tiết)
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
  const [newStudentDays, setNewStudentDays] = useState<'2-4-6' | '3-5-7'>('2-4-6');
  const [newStudentShift, setNewStudentShift] = useState<string>('Ca 1: 08:30 – 10:00');
  const [showAddForm, setShowAddForm] = useState(false);

  // Chi tiết ca học đang được click xem danh sách trong biểu đồ ca học
  const [viewingShiftKey, setViewingShiftKey] = useState<{ days: '2-4-6' | '3-5-7'; shift: string } | null>(null);

  // Trạng thái Đổi mật khẩu Admin
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [currentPasswordInput, setCurrentPasswordInput] = useState('');
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [changePasswordError, setChangePasswordError] = useState('');
  const [changePasswordSuccess, setChangePasswordSuccess] = useState('');

  // Danh sách các Ca học mặc định
  const SHIFT_OPTIONS = [
    'Ca 1: 08:30 – 10:00',
    'Ca 2: 10:00 – 11:30',
    'Ca 3: 14:00 – 15:30',
    'Ca 4: 17:00 – 18:30',
    'Ca 5: 19:00 – 20:30'
  ];

  // Khởi tạo danh sách học sinh ban đầu từ localStorage + Đám mây Firestore
  useEffect(() => {
    const loadFromCloudAndLocal = async () => {
      // 1. Tải các tài khoản đã đăng ký thật từ Firestore
      let registeredList: any[] = [];
      try {
        const querySnapshot = await getDocs(collection(db, 'players'));
        querySnapshot.forEach((docSnap) => {
          registeredList.push(docSnap.data());
        });
        localStorage.setItem('stv_registered_accounts', JSON.stringify(registeredList));
      } catch (err) {
        console.error('Error loading players from Firestore into teacher dashboard:', err);
        // Fallback local storage
        const savedReg = localStorage.getItem('stv_registered_accounts');
        if (savedReg) {
          try {
            registeredList = JSON.parse(savedReg);
          } catch (e) {}
        }
      }

      // 2. Tải danh sách học sinh quản lý bồi đắp từ LocalStorage
      const savedDb = localStorage.getItem('stv_teacher_students_db');
      let dbList: SimulatedStudent[] = [];
      if (savedDb) {
        try {
          dbList = JSON.parse(savedDb);
        } catch (e) {
          console.error(e);
        }
      }

      // Nếu không có dữ liệu sẵn trong stv_teacher_students_db, ta sẽ khởi dựng
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
            completedQuestsCount: 18,
            phoneNumber: '0977112233',
            classCode: 'THTE-03 Tư Duy Số',
            studyScheduleDays: '2-4-6',
            studyScheduleShift: 'Ca 2: 10:00 – 11:30',
            attendanceCount: 5,
            completedStages: { 'region_1': 15, 'region_2': 11, 'region_3': 3, 'region_4': 0, 'region_5': 0, 'region_6': 0 }
          },
          {
            id: 'std_7732',
            name: 'Phạm Minh Triết',
            grade: 'grade_5',
            archetype: 'ninja',
            level: 7,
            exp: 290,
            gold: 850,
            gem: 18,
            totalDays: 14,
            completedQuestsCount: 54,
            phoneNumber: '0988556677',
            classCode: 'THTE-05 Lập Trình Scratch',
            studyScheduleDays: '3-5-7',
            studyScheduleShift: 'Ca 3: 14:00 – 15:30',
            attendanceCount: 12,
            completedStages: { 'region_1': 15, 'region_2': 15, 'region_3': 15, 'region_4': 8, 'region_5': 1, 'region_6': 0 }
          },
          {
            id: 'std_1052',
            name: 'Trần Hải Phong',
            grade: 'grade_1',
            archetype: 'stem',
            level: 2,
            exp: 45,
            gold: 155,
            gem: 2,
            totalDays: 3,
            completedQuestsCount: 8,
            phoneNumber: '0933445566',
            classCode: 'THTE-01 Làm Quen Máy Tính',
            studyScheduleDays: '2-4-6',
            studyScheduleShift: 'Ca 1: 08:30 – 10:00',
            attendanceCount: 3,
            completedStages: { 'region_1': 8, 'region_2': 0, 'region_3': 0, 'region_4': 0, 'region_5': 0, 'region_6': 0 }
          },
          {
            id: 'std_3521',
            name: 'Lê Thảo Vy',
            grade: 'grade_2',
            archetype: 'warrior',
            level: 5,
            exp: 100,
            gold: 410,
            gem: 9,
            totalDays: 9,
            completedQuestsCount: 22,
            phoneNumber: '0944111333',
            classCode: 'THTE-02 Sáng Tạo Số',
            studyScheduleDays: '3-5-7',
            studyScheduleShift: 'Ca 1: 08:30 – 10:00',
            attendanceCount: 8,
            completedStages: { 'region_1': 15, 'region_2': 7, 'region_3': 0, 'region_4': 0, 'region_5': 0, 'region_6': 0 }
          },
          {
            id: 'std_8122',
            name: 'Vũ Quốc Anh',
            grade: 'grade_4',
            archetype: 'stem',
            level: 3,
            exp: 110,
            gold: 230,
            gem: 3,
            totalDays: 5,
            completedQuestsCount: 12,
            phoneNumber: '0955222444',
            classCode: 'THTE-04 Công Cụ Văn Phòng',
            studyScheduleDays: '2-4-6',
            studyScheduleShift: 'Ca 4: 17:00 – 18:30',
            attendanceCount: 4,
            completedStages: { 'region_1': 10, 'region_2': 2, 'region_3': 0, 'region_4': 0, 'region_5': 0, 'region_6': 0 }
          },
          {
            id: 'std_4456',
            name: 'Hoàng Bảo Ngọc',
            grade: 'grade_1',
            archetype: 'mage',
            level: 3,
            exp: 60,
            gold: 190,
            gem: 4,
            totalDays: 4,
            completedQuestsCount: 11,
            phoneNumber: '0966333555',
            classCode: 'THTE-01 Làm Quen Máy Tính',
            studyScheduleDays: '3-5-7',
            studyScheduleShift: 'Ca 5: 19:00 – 20:30',
            attendanceCount: 4,
            completedStages: { 'region_1': 11, 'region_2': 0, 'region_3': 0, 'region_4': 0, 'region_5': 0, 'region_6': 0 }
          }
        ];
      }

      // 3. Quyện hợp tài khoản thật (Registered List) dâng lên UI giáo viên
      const mergedList = [...dbList];

      registeredList.forEach(p => {
        const idx = mergedList.findIndex(s => s.id === p.id || (p.phoneNumber && s.phoneNumber === p.phoneNumber));
        
        // Tính toán số lượng bài tập hoàn thành (StagesCompleted) của trẻ thật
        const realCompletedCount = p.completedStages ? Object.values(p.completedStages).reduce((a: number, b: any) => a + Number(b || 0), 0) : 0;

        const mapped: SimulatedStudent = {
          id: String(p.id || ''),
          name: String(p.name || ''),
          grade: (p.grade || 'grade_1') as 'grade_1' | 'grade_2' | 'grade_3' | 'grade_4' | 'grade_5',
          archetype: (p.archetype || 'warrior') as 'warrior' | 'mage' | 'stem' | 'ninja',
          level: Number(p.level || 1),
          exp: Number(p.exp || 0),
          gold: Number(p.gold || 0),
          gem: Number(p.gem || 0),
          totalDays: Number(p.totalDays || 1),
          completedQuestsCount: Number(realCompletedCount || (p.totalDays * 2) || 2),
          isActivePlayer: p.id === activePlayer.id,
          phoneNumber: p.phoneNumber ? String(p.phoneNumber) : undefined,
          classCode: p.classCode ? String(p.classCode) : undefined,
          studyScheduleDays: (p.studyScheduleDays || '2-4-6') as '2-4-6' | '3-5-7',
          studyScheduleShift: p.studyScheduleShift ? String(p.studyScheduleShift) : 'Ca 1: 08:30 – 10:00',
          attendanceCount: typeof p.attendanceCount === 'number' ? p.attendanceCount : 0,
          completedStages: (p.completedStages || { 'region_1': 0, 'region_2': 0, 'region_3': 0, 'region_4': 0, 'region_5': 0, 'region_6': 0 }) as Record<string, number>
        };

        if (idx !== -1) {
          mergedList[idx] = {
            ...mergedList[idx],
            ...mapped,
            completedStages: p.completedStages && Object.keys(p.completedStages).length > 0 
              ? p.completedStages 
              : (mergedList[idx].completedStages || mapped.completedStages)
          };
        } else {
          mergedList.push(mapped);
        }
      });

      // Luôn đảm bảo tài khoản người dùng đang hoạt động (activePlayer) có thông số chính xác nhất ở đầu/trong bảng
      const userIndex = mergedList.findIndex(s => s.id === activePlayer.id || s.isActivePlayer);
      
      const activePlayerQuestsCount = activePlayer.completedStages ? Object.values(activePlayer.completedStages).reduce((a: number, b: any) => a + Number(b || 0), 0) : 0;

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
        completedQuestsCount: activePlayerQuestsCount || activePlayer.totalDays * 2,
        isActivePlayer: true,
        phoneNumber: activePlayer.phoneNumber,
        classCode: activePlayer.classCode || 'THTE-LIVE Thám Hiểm Sao Việt',
        studyScheduleDays: activePlayer.studyScheduleDays || '2-4-6',
        studyScheduleShift: activePlayer.studyScheduleShift || 'Ca 1: 08:30 – 10:00',
        attendanceCount: activePlayer.attendanceCount !== undefined ? activePlayer.attendanceCount : 0,
        completedStages: activePlayer.completedStages || { 'region_1': 0, 'region_2': 0, 'region_3': 0, 'region_4': 0, 'region_5': 0, 'region_6': 0 }
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
    };

    loadFromCloudAndLocal();
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

  // Chọn student đầu tiên làm mặc định nếu danh sách trống và chưa có selectedStudentId
  useEffect(() => {
    if (students.length > 0 && !selectedStudentId) {
      setSelectedStudentId(students[0].id);
    }
  }, [students, selectedStudentId]);

  // Xử lý đăng nhập
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (username.trim().toLowerCase() !== 'admin') {
      sound.playClick();
      setLoginError('Tài khoản hoặc mật khẩu không chính xác!');
      return;
    }

    let targetPassword = 'Da0356894512';
    try {
      const adminDocRef = doc(db, 'players', 'admin_teacher');
      const adminSnap = await getDoc(adminDocRef);
      if (adminSnap.exists()) {
        const data = adminSnap.data();
        if (data && data.password) {
          targetPassword = data.password;
        }
      }
    } catch (err) {
      console.error('Error fetching admin password during login in TeacherDashboard:', err);
    }

    if (password === targetPassword) {
      sound.playLevelUp();
      setIsLoggedIn(true);
      setLoginError('');
    } else {
      sound.playClick();
      setLoginError(`Tài khoản hoặc mật khẩu không chính xác!\nGợi ý: admin / Da0356894512 (hoặc mật khẩu mới đổi).`);
    }
  };

  // Xử lý đổi mật khẩu admin giáo viên
  const handleChangePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setChangePasswordError('');
    setChangePasswordSuccess('');

    if (!currentPasswordInput || !newPasswordInput || !confirmPasswordInput) {
      setChangePasswordError('Vui lòng điền đầy đủ tất cả các trường!');
      sound.playClick();
      return;
    }

    if (newPasswordInput.length < 4) {
      setChangePasswordError('Mật khẩu mới phải có ít nhất 4 ký tự!');
      sound.playClick();
      return;
    }

    if (newPasswordInput !== confirmPasswordInput) {
      setChangePasswordError('Mật khẩu mới và xác nhận mật khẩu không khớp!');
      sound.playClick();
      return;
    }

    // Load active admin password from Firestore (to verify currentPasswordInput)
    let currentAdminPassword = activePlayer.password || 'Da0356894512';
    try {
      const adminDocRef = doc(db, 'players', 'admin_teacher');
      const adminSnap = await getDoc(adminDocRef);
      if (adminSnap.exists()) {
        const data = adminSnap.data();
        if (data && data.password) {
          currentAdminPassword = data.password;
        }
      }
    } catch (err) {
      console.error('Error fetching admin password during change password:', err);
    }

    if (currentPasswordInput !== currentAdminPassword) {
      setChangePasswordError('Mật khẩu hiện tại chưa chính xác!');
      sound.playClick();
      return;
    }

    try {
      // Cập nhật lên Firestore
      const adminDocRef = doc(db, 'players', 'admin_teacher');
      const updatedProfile = {
        ...activePlayer,
        password: newPasswordInput
      };
      await setDoc(adminDocRef, updatedProfile, { merge: true });

      // Cập nhật bộ nhớ cục bộ local & parent state
      localStorage.setItem('stv_player', JSON.stringify(updatedProfile));
      onUpdateActivePlayer(updatedProfile);

      sound.playLevelUp();
      setChangePasswordSuccess('🎉 Thay đổi mật khẩu quản trị giáo viên thành công!');
      
      // Reset input fields
      setCurrentPasswordInput('');
      setNewPasswordInput('');
      setConfirmPasswordInput('');
      
      setTimeout(() => {
        setShowChangePasswordModal(false);
        setChangePasswordSuccess('');
      }, 2000);
    } catch (err) {
      console.error('Failed to update admin password in Firestore:', err);
      setChangePasswordError('Gặp sự cố khi ghi dữ liệu lên đám mây. Vui lòng thử lại!');
      sound.playClick();
    }
  };

  // Lưu biến động danh sách học sinh (đồng bộ lên Đám mây Firestore không chặn)
  const saveStudentList = (updated: SimulatedStudent[]) => {
    setStudents(updated);
    localStorage.setItem('stv_teacher_students_db', JSON.stringify(updated));

    // Đồng bộ từng học sinh có tài khoản thật lên Firestore!
    const syncRealPlayers = async () => {
      try {
        for (const s of updated) {
          if (s.id.startsWith('p_')) {
            const playerDocRef = doc(db, 'players', s.id);
            const snap = await getDoc(playerDocRef);
            if (snap.exists()) {
              const pData = snap.data();
              const updatedProfile = {
                ...pData,
                name: s.name,
                grade: s.grade,
                archetype: s.archetype,
                level: s.level,
                gold: s.gold,
                gem: s.gem,
                studyScheduleDays: s.studyScheduleDays,
                studyScheduleShift: s.studyScheduleShift,
                attendanceCount: s.attendanceCount
              };
              await setDoc(playerDocRef, updatedProfile, { merge: true });
            } else {
              await setDoc(playerDocRef, {
                id: s.id,
                name: s.name,
                grade: s.grade,
                archetype: s.archetype,
                level: s.level,
                gold: s.gold,
                gem: s.gem,
                phoneNumber: s.phoneNumber || s.id.replace('p_', ''),
                password: 'Da' + (s.phoneNumber || s.id.replace('p_', '')),
                studyScheduleDays: s.studyScheduleDays || '2-4-6',
                studyScheduleShift: s.studyScheduleShift || 'Ca 1: 08:30 – 10:00',
                attendanceCount: s.attendanceCount || 0,
                exp: 0,
                expToNextLevel: 100,
                hp: 100,
                maxHp: 100,
                title: 'Tân Binh Thám Hiểm',
                unlockedRegions: ['region_1'],
                completedStages: s.completedStages || { region_1: 0 }
              }, { merge: true });
            }
          }
        }
      } catch (err) {
        console.error('Error syncing edited student list to Firestore:', err);
      }
    };
    
    syncRealPlayers();

    // Đồng bộ ngược lại stv_registered_accounts (danh sách đăng ký thật để giữ tiến trình hệ thống)
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
              attendanceCount: found.attendanceCount,
              completedStages: found.completedStages
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
        attendanceCount: editAttendanceCount,
        completedStages: currentSelectedStudent.completedStages || activePlayer.completedStages
      });
    }

    alert(`💾 Đã lưu thành công các thay đổi thông tin cá nhân cho học viên: ${editName}!`);
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

  // Cập nhật tiến độ vượt màn theo từng vùng của từng học sinh
  const handleUpdateRegionProgress = (regionId: string, delta: number) => {
    if (!currentSelectedStudent) return;
    sound.playLevelUp();

    const currentStages: Record<string, number> = currentSelectedStudent.completedStages || {};
    const previousProgress = currentStages[regionId] || 0;
    let newProgress = previousProgress + delta;
    if (newProgress < 0) newProgress = 0;
    if (newProgress > 15) newProgress = 15;

    const updatedStages: Record<string, number> = {
      ...currentStages,
      [regionId]: newProgress
    };

    // Tính tổng nhiệm vụ giải quyết mới
    const totalCompletedQuests = Object.values(updatedStages).reduce((a: number, b: number) => a + b, 0);

    const updated = students.map(s => {
      if (s.id === currentSelectedStudent.id) {
        return {
          ...s,
          completedStages: updatedStages,
          completedQuestsCount: totalCompletedQuests
        };
      }
      return s;
    });

    saveStudentList(updated);

    // Đồng bộ nếu là active thám hiểm người chơi
    if (currentSelectedStudent.isActivePlayer || currentSelectedStudent.id === activePlayer.id) {
      onUpdateActivePlayer({
        ...activePlayer,
        completedStages: updatedStages
      });
    }
  };

  // Đặt tiến độ hoàn thành tối đa một vùng (Set Max Stages)
  const handleCompleteRegionStages = (regionId: string) => {
    if (!currentSelectedStudent) return;
    sound.playLevelUp();

    const currentStages: Record<string, number> = currentSelectedStudent.completedStages || {};
    const updatedStages: Record<string, number> = {
      ...currentStages,
      [regionId]: 15
    };

    const totalCompletedQuests = Object.values(updatedStages).reduce((a: number, b: number) => a + b, 0);

    const updated = students.map(s => {
      if (s.id === currentSelectedStudent.id) {
        return {
          ...s,
          completedStages: updatedStages,
          completedQuestsCount: totalCompletedQuests
        };
      }
      return s;
    });

    saveStudentList(updated);

    if (currentSelectedStudent.isActivePlayer || currentSelectedStudent.id === activePlayer.id) {
      onUpdateActivePlayer({
        ...activePlayer,
        completedStages: updatedStages
      });
    }
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

  // Thêm học sinh học viên mới
  const handleCreateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName.trim()) {
      alert('Vui lòng điền họ tên học sinh!');
      return;
    }

    sound.playClick();
    const newId = 'std_' + Math.floor(Math.random() * 10000);
    const newStudent: SimulatedStudent = {
      id: newId,
      name: newStudentName.trim(),
      grade: newStudentGrade,
      archetype: newStudentArchetype,
      level: 1,
      exp: 0,
      gold: 150,
      gem: 2,
      totalDays: 1,
      completedQuestsCount: 0,
      phoneNumber: '097' + Math.floor(1000000 + Math.random() * 9000000),
      classCode: `THTE-0${newStudentGrade.slice(-1)} Học Phần Sao Việt`,
      studyScheduleDays: newStudentDays,
      studyScheduleShift: newStudentShift,
      attendanceCount: 1,
      completedStages: { 'region_1': 0, 'region_2': 0, 'region_3': 0, 'region_4': 0, 'region_5': 0, 'region_6': 0 }
    };

    const updated = [...students, newStudent];
    saveStudentList(updated);
    setSelectedStudentId(newStudent.id);
    setNewStudentName('');
    setShowAddForm(false);
    alert(`🎉 Đăng ký thành công! Học viên mới ${newStudent.name} đã được phân chia vào lớp ${newStudentGrade.slice(-1)} [Lịch học Thứ ${newStudentDays} - ${newStudentShift}]!`);
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

    alert('✉️ Thư thông điệp và quà đính kèm đã được phát sóng thành công đến tất cả các học sinh của học viện!');
  };

  // Lọc học sinh theo từ khóa tìm kiếm
  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // === PHÂN TÍCH THỐNG KÊ (CALCULATING ANALYTICS FOR TEACHER OVERVIEW) ===
  const totalStudents = students.length;
  
  // 1. Level trung bình
  const avgLevel = totalStudents > 0 
    ? (students.reduce((sum, s) => sum + s.level, 0) / totalStudents).toFixed(1) 
    : 0;

  // 2. Tổng vàng và Kim Cương
  const totalGoldDistributed = students.reduce((sum, s) => sum + s.gold, 0);
  const totalGemsDistributed = students.reduce((sum, s) => sum + s.gem, 0);

  // 3. Tổng số buổi học chuyên cần trung bình
  const avgAttendance = totalStudents > 0 
    ? (students.reduce((sum, s) => sum + (s.attendanceCount || 0), 0) / totalStudents).toFixed(1)
    : 0;

  // 4. Quà đang chờ giáo viên duyệt trao
  const pendingGiftsCount = (() => {
    let count = 0;
    students.forEach(s => {
      if (s.isActivePlayer) {
        count += purchaseHistory.filter(item => !item.claimed).length;
      } else {
        count += (simulatedRedemptions[s.id] || []).filter(item => !item.claimed).length;
      }
    });
    return count;
  })();

  // 5. Thống kê Phân bổ Khối Lớp
  const gradeDistribution = {
    'grade_1': students.filter(s => s.grade === 'grade_1').length,
    'grade_2': students.filter(s => s.grade === 'grade_2').length,
    'grade_3': students.filter(s => s.grade === 'grade_3').length,
    'grade_4': students.filter(s => s.grade === 'grade_4').length,
    'grade_5': students.filter(s => s.grade === 'grade_5').length
  };

  // 6. Thống kê Lịch Học Thứ (2-4-6 vs 3-5-7)
  const daysDistribution = {
    '2-4-6': students.filter(s => s.studyScheduleDays === '2-4-6').length,
    '3-5-7': students.filter(s => s.studyScheduleDays === '3-5-7').length
  };

  // 7. Thống kê Chi Tiết Sinh Viên từng Ca Học (Shifts Counting)
  // Tính số học sinh trong từng Ca học cụ thể cho Thứ 2-4-6 và Thứ 3-5-7
  const shiftDistribution: Record<string, { total: number; '2-4-6': number; '3-5-7': number }> = {};
  SHIFT_OPTIONS.forEach(opt => {
    const list246 = students.filter(s => s.studyScheduleDays === '2-4-6' && s.studyScheduleShift === opt);
    const list357 = students.filter(s => s.studyScheduleDays === '3-5-7' && s.studyScheduleShift === opt);
    shiftDistribution[opt] = {
      total: list246.length + list357.length,
      '2-4-6': list246.length,
      '3-5-7': list357.length
    };
  });

  // 8. Phân bố Hệ Nhân Vật
  const archetypeDistribution = {
    warrior: students.filter(s => s.archetype === 'warrior').length,
    mage: students.filter(s => s.archetype === 'mage').length,
    stem: students.filter(s => s.archetype === 'stem').length,
    ninja: students.filter(s => s.archetype === 'ninja').length
  };

  // Tìm danh sách học sinh thuộc 1 Ca học cụ thể
  const getStudentsInShift = (days: '2-4-6' | '3-5-7', shiftName: string) => {
    return students.filter(s => s.studyScheduleDays === days && s.studyScheduleShift === shiftName);
  };

  // === GIAO DIỆN CHƯA ĐĂNG NHẬP (LOGIN PORTAL) ===
  if (!isLoggedIn) {
    return (
      <div className="max-w-md mx-auto my-8 bg-white/55 backdrop-blur-md p-6 rounded-3xl border border-white/45 shadow-xl" id="admin-login-frame">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-indigo-600 text-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
            <Lock className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-black text-indigo-950 uppercase tracking-wide">Cổng Giáo Viên Sao Việt</h2>
          <p className="text-xs text-slate-505 font-medium mt-1">
            Đăng nhập tài khoản quản trị viên để theo dõi, quản trị giáo trình, lịch học ca dạy và khích lệ phát quà.
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
              placeholder="Nhập mật khẩu..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white/80 font-bold text-slate-800 text-sm"
              autoComplete="current-password"
            />
          </div>

          <div className="bg-amber-50 border border-amber-300 p-3 rounded-xl text-[10px] text-amber-900 leading-normal font-bold">
            💡 <strong>Xác thực giáo sinh Sao Việt:</strong> Hãy sử dụng tài khoản <strong>admin</strong> và mật khẩu <strong>Da0356894512</strong> (hoặc mật khẩu thầy cô đã đổi) để khởi chạy quyền quản trị lớp học!
          </div>

          <div className="pt-2 flex gap-2">
            <button
              type="button"
              onClick={onBackToMap}
              className="flex-1 py-3 px-4 bg-slate-350 hover:bg-slate-400/90 text-slate-800 font-extrabold rounded-xl text-xs uppercase cursor-pointer transition text-center"
            >
              Trở về thám hiểm
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
              📌 Dành cho học sinh Sao Việt muốn rời nhóm để login hoặc tạo tài khoản thám hiểm mới phù hợp bậc học!
            </p>
          </div>
        )}
      </div>
    );
  }

  // === GIAO DIỆN CHÍNH CỦA GIÁO VIÊN (DASH BOARD) ===
  return (
    <div className="max-w-7xl mx-auto p-1 md:p-3" id="admin-dashboard-container">
      
      {/* Header Admin */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 pb-4 border-b border-indigo-950/10 gap-x-4 gap-y-3">
        <div>
          <div className="flex items-center gap-2">
            <GraduationCap className="text-indigo-700 w-8 h-8" />
            <h1 className="text-xl md:text-2xl font-black text-indigo-950 uppercase tracking-tight">Học Viện Sao Việt — Giáo Viên Portal</h1>
          </div>
          <p className="text-xs text-indigo-950/70 font-semibold mt-1">
            Trung tâm điều phối: Theo dõi sĩ số, rà soát tiến trình, tinh chọn giáo án độ khó và xếp dọn lịch phân ca học viên.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 self-stretch md:self-auto w-full md:w-auto">
          <button
            onClick={() => {
              sound.playClick();
              setShowChangePasswordModal(true);
            }}
            className="px-4 py-2 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 text-indigo-700 font-extrabold text-xs uppercase rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer flex-1 sm:flex-none"
          >
            <Key className="w-4 h-4 text-indigo-600" /> Đổi mật khẩu
          </button>
          <button
            onClick={() => {
              sound.playClick();
              setIsLoggedIn(false);
            }}
            className="px-4 py-2 bg-slate-100 border border-slate-200 hover:bg-slate-200 text-slate-800 font-extrabold text-xs uppercase rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer flex-1 sm:flex-none"
          >
            Đóng Cổng Giáo Viên
          </button>
          {onLogoutStudent && (
            <button
              onClick={() => {
                sound.playClick();
                onLogoutStudent();
              }}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-black text-xs uppercase rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer flex-1 sm:flex-none"
            >
              <LogOut className="w-4 h-4" /> Đăng Xuất Học Sinh
            </button>
          )}
        </div>
      </div>

      {/* THANH ĐIỀU CHỈNH CHỌN PHÂN VÙNG HOẠT ĐỘNG (TAB BAR CHÍNH) */}
      <div className="flex flex-wrap border-b border-indigo-950/10 gap-1.5 mb-6" id="teacher-tabs-strip">
        <button
          onClick={() => { sound.playClick(); setActiveMainTab('stats'); }}
          className={`py-2.5 px-4 text-xs font-black uppercase tracking-wider transition-all duration-150 border-b-2 cursor-pointer flex items-center gap-1.5 ${
            activeMainTab === 'stats'
              ? 'border-indigo-600 text-indigo-700 font-extrabold bg-indigo-50/40 rounded-t-xl'
              : 'border-transparent text-slate-600 hover:text-indigo-950 hover:bg-slate-50 rounded-t-xl'
          }`}
        >
          <BarChart2 className="w-4.5 h-4.5 text-indigo-600" />
          📊 Thống Kê Tổng Quan & Ca Học
        </button>

        <button
          onClick={() => { sound.playClick(); setActiveMainTab('students'); }}
          className={`py-2.5 px-4 text-xs font-black uppercase tracking-wider transition-all duration-150 border-b-2 cursor-pointer flex items-center gap-1.5 ${
            activeMainTab === 'students'
              ? 'border-indigo-600 text-indigo-700 font-extrabold bg-indigo-50/40 rounded-t-xl'
              : 'border-transparent text-slate-600 hover:text-indigo-950 hover:bg-slate-50 rounded-t-xl'
          }`}
        >
          <Users className="w-4.5 h-4.5 text-indigo-600" />
          👥 Quản Lý & Tiến Độ Học Viên
        </button>

        <button
          onClick={() => { sound.playClick(); setActiveMainTab('broadcast'); }}
          className={`py-2.5 px-4 text-xs font-black uppercase tracking-wider transition-all duration-150 border-b-2 cursor-pointer flex items-center gap-1.5 ${
            activeMainTab === 'broadcast'
              ? 'border-indigo-600 text-indigo-700 font-extrabold bg-indigo-50/40 rounded-t-xl'
              : 'border-transparent text-slate-600 hover:text-indigo-950 hover:bg-slate-50 rounded-t-xl'
          }`}
        >
          <MailIcon className="w-4.5 h-4.5 text-indigo-600" />
          📢 Phát Quà Toàn Lớp
        </button>
      </div>

      {/* ======================= TAB 1: THỐNG KÊ TỔNG QUAN & CA HỌC ======================= */}
      {activeMainTab === 'stats' && (
        <div className="space-y-6 animate-fade-in" id="panel-stats-overview">
          
          {/* Sổ Thẻ Số Chỉ Tiêu Nhanh (KPI Cards) */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white p-4 rounded-2xl shadow-sm border border-indigo-400">
              <span className="text-2xl block mb-1">👥</span>
              <span className="text-[9px] font-black uppercase tracking-widest text-indigo-200">Sĩ Số Học Viên</span>
              <span className="text-xl md:text-2xl font-black block mt-0.5">{totalStudents} Học Sinh</span>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-4 rounded-2xl shadow-sm border border-purple-400">
              <span className="text-2xl block mb-1">📈</span>
              <span className="text-[9px] font-black uppercase tracking-widest text-purple-200">Cấp Học Trung Bình</span>
              <span className="text-xl md:text-2xl font-black block mt-0.5">Lv {avgLevel}</span>
            </div>

            <div className="bg-gradient-to-br from-amber-500 to-amber-600 text-white p-4 rounded-2xl shadow-sm border border-amber-400">
              <span className="text-2xl block mb-1">🪙</span>
              <span className="text-[9px] font-black uppercase tracking-widest text-amber-200">Vàng Đang Lưu Hành</span>
              <span className="text-xl md:text-2xl font-black block mt-0.5">{totalGoldDistributed.toLocaleString('vi-VN')} Vàng</span>
            </div>

            <div className="bg-gradient-to-br from-rose-500 to-rose-600 text-white p-4 rounded-2xl shadow-sm border border-rose-400">
              <span className="text-2xl block mb-1">💎</span>
              <span className="text-[9px] font-black uppercase tracking-widest text-rose-200">Tích Lũy Kim Cương</span>
              <span className="text-xl md:text-2xl font-black block mt-0.5">{totalGemsDistributed} Diamond</span>
            </div>

            <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white p-4 rounded-2xl shadow-sm border border-emerald-400 col-span-2 md:col-span-1">
              <span className="text-2xl block mb-1">🏫</span>
              <span className="text-[9px] font-black uppercase tracking-widest text-emerald-200">Tần Suất Chuyên Cần</span>
              <span className="text-xl md:text-2xl font-black block mt-0.5">{avgAttendance} Buổi/Bé</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* PHẦN THỐNG KÊ LỊCH HỌC VÀ SỐ LƯỢNG CA HỌC (8 Columns) */}
            <div className="lg:col-span-8 bg-white/55 backdrop-blur-md border border-white/50 p-4 md:p-5 rounded-3xl shadow-md space-y-4">
              <div className="flex items-center justify-between border-b border-indigo-950/10 pb-3">
                <div>
                  <h3 className="font-black text-sm text-indigo-950 uppercase tracking-widest flex items-center gap-1.5">
                    <Calendar className="w-5 h-5 text-indigo-700" />
                    Thống Kê Khung Ca Học Đăng Ký
                  </h3>
                  <p className="text-[10px] text-slate-500 font-semibold mt-0.5">
                    Số lượng em đăng ký theo lịch và ca học thực tế. Click vào ca học để hiển thị danh sách các học viên trong ca.
                  </p>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-black bg-indigo-100 text-indigo-900 border border-indigo-200 px-2 py-0.5 rounded-lg">
                    T2-4-6: {daysDistribution['2-4-6']} bé
                  </span>
                  <span className="text-[10px] font-black bg-purple-100 text-purple-900 border border-purple-200 px-2 py-0.5 rounded-lg">
                    T3-5-7: {daysDistribution['3-5-7']} bé
                  </span>
                </div>
              </div>

              {/* Bảng trực quan các Ca Học */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* LỊCH THỨ 2 - 4 - 6 */}
                <div className="space-y-3">
                  <div className="flex items-center gap-1.5 px-1">
                    <span className="w-3 h-3 rounded-full bg-indigo-600 block animate-pulse"></span>
                    <h4 className="text-xs font-black text-indigo-950 uppercase">Lịch Thứ 2 - Thứ 4 - Thứ 6</h4>
                  </div>

                  <div className="space-y-2">
                    {SHIFT_OPTIONS.map(shiftOpt => {
                      const countInfo = shiftDistribution[shiftOpt] || { total: 0, '2-4-6': 0, '3-5-7': 0 };
                      const countInThis = countInfo['2-4-6'];
                      const isViewing = viewingShiftKey?.days === '2-4-6' && viewingShiftKey?.shift === shiftOpt;

                      return (
                        <div
                          key={shiftOpt}
                          onClick={() => {
                            sound.playClick();
                            if (isViewing) setViewingShiftKey(null);
                            else setViewingShiftKey({ days: '2-4-6', shift: shiftOpt });
                          }}
                          className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                            isViewing 
                              ? 'bg-indigo-600 text-white border-indigo-600 shadow-md scale-[1.01]' 
                              : countInThis > 0 
                                ? 'bg-indigo-50/50 hover:bg-indigo-50 border-indigo-100 hover:border-indigo-300' 
                                : 'bg-slate-50 border-slate-100 opacity-60 hover:opacity-100'
                          }`}
                        >
                          <div>
                            <span className={`block text-xs font-bold ${isViewing ? 'text-white' : 'text-indigo-950'}`}>
                              {shiftOpt}
                            </span>
                            <span className={`text-[10px] font-semibold ${isViewing ? 'text-indigo-100' : 'text-slate-500'}`}>
                              Học Sao Việt trung tâm
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className={`text-xs font-black px-2.5 py-1 rounded-lg font-mono ${
                              isViewing 
                                ? 'bg-indigo-700 text-white' 
                                : 'bg-indigo-100/90 text-indigo-900 border border-indigo-200'
                            }`}>
                              {countInThis} bé
                            </span>
                            <ChevronRight className={`w-4 h-4 transition-transform ${isViewing ? 'translate-x-0.5 rotate-90 text-white' : 'text-indigo-400'}`} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* LỊCH THỨ 3 - 5 - 7 */}
                <div className="space-y-3">
                  <div className="flex items-center gap-1.5 px-1">
                    <span className="w-3 h-3 rounded-full bg-purple-600 block animate-pulse"></span>
                    <h4 className="text-xs font-black text-purple-950 uppercase">Lịch Thứ 3 - Thứ 5 - Thứ 7</h4>
                  </div>

                  <div className="space-y-2">
                    {SHIFT_OPTIONS.map(shiftOpt => {
                      const countInfo = shiftDistribution[shiftOpt] || { total: 0, '2-4-6': 0, '3-5-7': 0 };
                      const countInThis = countInfo['3-5-7'];
                      const isViewing = viewingShiftKey?.days === '3-5-7' && viewingShiftKey?.shift === shiftOpt;

                      return (
                        <div
                          key={shiftOpt}
                          onClick={() => {
                            sound.playClick();
                            if (isViewing) setViewingShiftKey(null);
                            else setViewingShiftKey({ days: '3-5-7', shift: shiftOpt });
                          }}
                          className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                            isViewing 
                              ? 'bg-purple-600 text-white border-purple-650 shadow-md scale-[1.01]' 
                              : countInThis > 0 
                                ? 'bg-purple-50/50 hover:bg-purple-50 border-purple-100 hover:border-purple-300' 
                                : 'bg-slate-50 border-slate-100 opacity-60 hover:opacity-100'
                          }`}
                        >
                          <div>
                            <span className={`block text-xs font-bold ${isViewing ? 'text-white' : 'text-purple-950'}`}>
                              {shiftOpt}
                            </span>
                            <span className={`text-[10px] font-semibold ${isViewing ? 'text-purple-100' : 'text-slate-505'}`}>
                              Học Sao Việt trung tâm
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className={`text-xs font-black px-2.5 py-1 rounded-lg font-mono ${
                              isViewing 
                                ? 'bg-purple-700 text-white' 
                                : 'bg-purple-100/95 text-purple-900 border border-purple-200'
                            }`}>
                              {countInThis} bé
                            </span>
                            <ChevronRight className={`w-4 h-4 transition-transform ${isViewing ? 'translate-x-0.5 rotate-90 text-white' : 'text-purple-400'}`} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>

              {/* POPUP DROPDOWN DANH SÁCH EM TRONG CA HỌC ĐƯỢC CHỌN */}
              {viewingShiftKey && (
                <div className="bg-gradient-to-r from-slate-50 to-indigo-50 p-3.5 rounded-2xl border border-indigo-150 animate-fade-in relative shadow-inner">
                  <div className="flex items-center justify-between mb-3 border-b border-indigo-950/10 pb-2">
                    <span className="text-xs font-black text-indigo-950 uppercase tracking-wide flex items-center gap-1.5">
                      <Clock className="w-4.5 h-4.5 text-indigo-600 animate-spin" />
                      Học Viên Lăng Xả Lớp: Thứ {viewingShiftKey.days} / {viewingShiftKey.shift} (Sĩ Số: {getStudentsInShift(viewingShiftKey.days, viewingShiftKey.shift).length} bé)
                    </span>
                    <button 
                      onClick={() => setViewingShiftKey(null)}
                      className="text-xs font-black text-indigo-700 hover:text-indigo-950 cursor-pointer"
                    >
                      [Đóng danh sách]
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-[220px] overflow-y-auto pr-1">
                    {getStudentsInShift(viewingShiftKey.days, viewingShiftKey.shift).map((s) => (
                      <div 
                        key={s.id}
                        onClick={() => {
                          sound.playClick();
                          setSelectedStudentId(s.id);
                          setActiveMainTab('students');
                        }}
                        className="bg-white/85 p-2 rounded-xl border border-indigo-100 hover:border-indigo-300 hover:bg-white flex items-center justify-between cursor-pointer transition"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-lg">
                            {s.archetype === 'warrior' ? '⚔️' : s.archetype === 'mage' ? '🔮' : s.archetype === 'stem' ? '⚙️' : '🥷'}
                          </span>
                          <div>
                            <span className="font-bold text-xs text-indigo-950 block">{s.name}</span>
                            <span className="text-[9px] text-zinc-500 font-bold block mt-0.5">
                              Lớp {s.grade.slice(-1)} | Lv {s.level} | {s.attendanceCount || 0} chuyên cần
                            </span>
                          </div>
                        </div>
                        <span className="text-[10px] text-indigo-700 font-mono font-black py-0.5 px-2 bg-indigo-50 rounded-lg">
                          Xem chi tiết
                        </span>
                      </div>
                    ))}
                    {getStudentsInShift(viewingShiftKey.days, viewingShiftKey.shift).length === 0 && (
                      <div className="text-center py-4 text-xs text-slate-400 font-semibold col-span-2">
                        Buổi học ca này tạm thời chưa xếp học sinh vào.
                      </div>
                    )}
                  </div>
                </div>
              )}

            </div>

            {/* PHẦN BIỂU ĐỒ TRỰC QUAN KHỐI LỚP & HỆ NHÂN VẬT (4 Columns) */}
            <div className="lg:col-span-4 bg-white/55 backdrop-blur-md border border-white/50 p-4 rounded-3xl shadow-md space-y-5">
              <h3 className="font-black text-sm text-indigo-950 uppercase tracking-widest border-b border-indigo-950/10 pb-3 block">
                Phân Loại Thống Kê Bé
              </h3>

              {/* Khối lớp */}
              <div className="space-y-2.5">
                <span className="text-[10px] font-black text-slate-500 tracking-wider uppercase block">
                  Phân bố Học Sinh theo Thư Mục Grade:
                </span>
                
                <div className="space-y-1.5">
                  {[1, 2, 3, 4, 5].map(g => {
                    const key = `grade_${g}` as const;
                    const count = gradeDistribution[key] || 0;
                    const percentage = totalStudents > 0 ? (count / totalStudents) * 100 : 0;
                    
                    return (
                      <div key={g} className="text-xs">
                        <div className="flex justify-between font-bold text-[11px] text-indigo-950 mb-0.5">
                          <span>Giáo án lớp {g}</span>
                          <span className="font-mono text-indigo-800">{count} bé ({percentage.toFixed(0)}%)</span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-indigo-500 rounded-full transition-all duration-300"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Hệ nhân vật */}
              <div className="space-y-2.5 pt-2 border-t border-indigo-950/5">
                <span className="text-[10px] font-black text-slate-500 tracking-wider uppercase block">
                  Phân bố Hệ Đặc Tính Nhân Vật Đấu Trận:
                </span>

                <div className="space-y-1.5">
                  {[
                    { type: 'warrior', label: '⚔️ Chiến Binh Sao Việt', count: archetypeDistribution.warrior, color: 'bg-indigo-600' },
                    { type: 'mage', label: '🔮 Phù Thủy Toán Học', count: archetypeDistribution.mage, color: 'bg-purple-600' },
                    { type: 'stem', label: '⚙️ Nhà STEM Tiên Phong', count: archetypeDistribution.stem, color: 'bg-yellow-500' },
                    { type: 'ninja', label: '🥷 Bàn Phím Sát Thủ', count: archetypeDistribution.ninja, color: 'bg-emerald-600' }
                  ].map(arc => {
                    const percentage = totalStudents > 0 ? (arc.count / totalStudents) * 100 : 0;
                    return (
                      <div key={arc.type} className="text-xs">
                        <div className="flex justify-between font-semibold text-[11px] text-indigo-950 mb-0.5">
                          <span>{arc.label}</span>
                          <span className="font-mono">{arc.count} bé ({percentage.toFixed(0)}%)</span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${arc.color} rounded-full transition-all duration-300`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Chờ nhận quà */}
              {pendingGiftsCount > 0 && (
                <div className="bg-amber-50 border border-amber-300 text-amber-900 rounded-2xl p-3 text-[11px] font-black flex items-center gap-2 animate-bounce">
                  <Gift className="w-5 h-5 text-amber-600 shrink-0" />
                  <div>
                    Có {pendingGiftsCount} đơn đổi quà thực phẩm/văn phòng phẩm đang chờ giáo viên rà duyệt trao tay!
                  </div>
                </div>
              )}

            </div>

          </div>

          {/* BẢNG TIẾN ĐỘ BUỔI HỌC CỦA TỪNG TÀI KHOẢN HỌC VIÊN (Student ledger with progress bars) */}
          <div className="bg-white/55 backdrop-blur-md border border-white/50 p-4 md:p-5 rounded-3xl shadow-md">
            <h3 className="font-black text-sm text-indigo-950 uppercase tracking-widest border-b border-indigo-950/10 pb-3 flex items-center gap-1.5">
              <TrendingUp className="w-5 h-5 text-indigo-700" />
              Sổ Tiến Độ Bài Học Tổng Thể Toàn Lớp (90 Màn Luyện)
            </h3>
            
            <div className="overflow-x-auto mt-4">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-indigo-100 text-slate-500 uppercase font-black text-[9px] tracking-wider bg-indigo-50/20">
                    <th className="py-2.5 px-3">Học Viên</th>
                    <th className="py-2.5 px-2 text-center">Bậc Lớp</th>
                    <th className="py-2.5 px-3">Học Lịch Kỳ</th>
                    <th className="py-2.5 px-1 text-center">Tích Lũy</th>
                    <th className="py-2.5 px-3">Hoàn Thành (Tổng tiến trình 6 Đảo)</th>
                    <th className="py-2.5 px-2 text-center">Chuyên Cần</th>
                    <th className="py-2.5 px-3 text-right">Điều Phối</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-indigo-50">
                  {students.map((s) => {
                    const totalStagesCompleted = s.completedStages 
                      ? Object.values(s.completedStages).reduce((a: number, b: any) => a + Number(b || 0), 0)
                      : s.completedQuestsCount;
                    const completionPct = (totalStagesCompleted / 90) * 100;

                    return (
                      <tr key={s.id} className="hover:bg-indigo-50/30 transition">
                        {/* Tên */}
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2">
                            <span className="text-sm">
                              {s.archetype === 'warrior' ? '⚔️' : s.archetype === 'mage' ? '🔮' : s.archetype === 'stem' ? '⚙️' : '🥷'}
                            </span>
                            <div>
                              <span className="font-black text-slate-900 block">{s.name}</span>
                              <span className="text-[9px] font-mono text-indigo-800 font-bold block mt-0.5">Mã: {s.id}</span>
                            </div>
                          </div>
                        </td>

                        {/* Quỹ Lớp */}
                        <td className="py-3 px-2 text-center font-bold text-slate-800">
                          {s.grade === 'grade_1' ? 'Lớp 1' : s.grade === 'grade_2' ? 'Lớp 2' : s.grade === 'grade_3' ? 'Lớp 3' : s.grade === 'grade_4' ? 'Lớp 4' : 'Lớp 5'}
                        </td>

                        {/* Lịch Ca học */}
                        <td className="py-3 px-3">
                          <div className="font-semibold text-indigo-950">
                            Thứ {s.studyScheduleDays || 'Chưa xếp'}
                          </div>
                          <div className="text-[9px] text-slate-500 font-bold mt-0.5">
                            {s.studyScheduleShift || 'Chưa xếp'}
                          </div>
                        </td>

                        {/* Số dư ví */}
                        <td className="py-3 px-1 text-center">
                          <div className="font-mono font-bold text-amber-800 text-[10px]">🪙 {s.gold}</div>
                          <div className="font-mono font-bold text-rose-600 text-[10px]">💎 {s.gem}</div>
                        </td>

                        {/* Tổng số bài học tiến độ */}
                        <td className="py-3 px-3">
                          <div className="flex items-center justify-between text-[10px] font-bold text-slate-650 mb-1">
                            <span className="text-slate-500 font-medium">90 Ải Săn Đuổi</span>
                            <span className="font-bold text-emerald-800 font-mono">
                              {totalStagesCompleted}/90 Màn ({completionPct.toFixed(1)}%)
                            </span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full transition-all duration-300 ${completionPct > 80 ? 'bg-emerald-500' : completionPct > 40 ? 'bg-indigo-500' : 'bg-blue-400'}`}
                              style={{ width: `${completionPct}%` }}
                            />
                          </div>
                        </td>

                        {/* Attendance Count */}
                        <td className="py-3 px-2 text-center">
                          <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 font-mono text-xs font-black py-0.5 px-2 rounded-lg inline-block">
                            {s.attendanceCount || 0} Buổi
                          </span>
                        </td>

                        {/* Nút kiểm soát */}
                        <td className="py-3 px-3 text-right">
                          <button
                            onClick={() => {
                              sound.playClick();
                              setSelectedStudentId(s.id);
                              setActiveMainTab('students');
                              setActiveDetailTab('manage');
                            }}
                            className="py-1 px-3 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-black text-[10px] uppercase rounded-lg transition select-none cursor-pointer"
                          >
                            Định hướng
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

          </div>

        </div>
      )}

      {/* ======================= TAB 2: QUẢN LÝ CHI TIẾT & TIẾN ĐỘ HỌC VIÊN ======================= */}
      {activeMainTab === 'students' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in" id="panel-students-management">
          
          {/* CỘT DANH SÁCH SĨ SỐ (4 Cột) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white/55 backdrop-blur-md border border-white/55 p-4 rounded-3xl shadow-md">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-black text-xs text-indigo-950 uppercase tracking-widest flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-indigo-700" /> Sĩ Số Sao Việt ({students.length})
                </h3>
                
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setShowAddForm(!showAddForm);
                  }}
                  className="py-1 px-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-black uppercase transition flex items-center gap-1 cursor-pointer"
                >
                  <UserPlus className="w-3.5 h-3.5" /> Tạo Account
                </button>
              </div>

              {/* FORM THÊM HỌC VIÊN MỚI */}
              {showAddForm && (
                <form onSubmit={handleCreateStudent} className="bg-white/80 p-4 rounded-2xl border border-indigo-100 mb-4 space-y-4 shadow-sm animate-fade-in">
                  <h4 className="text-xs font-black text-indigo-950 uppercase pb-1 border-b border-indigo-50">Đăng học viên Sao Việt mới</h4>
                  
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase mb-1">Họ và tên học viên:</label>
                    <input
                      type="text"
                      required
                      placeholder="Ví dụ: Nguyễn An Khang"
                      value={newStudentName}
                      onChange={(e) => setNewStudentName(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-black text-slate-500 uppercase mb-1">Cấp học (Lớp):</label>
                      <select
                        value={newStudentGrade}
                        onChange={(e) => setNewStudentGrade(e.target.value as any)}
                        className="w-full p-2 rounded-lg border border-slate-300 text-xs font-bold text-slate-800 bg-white"
                      >
                        <option value="grade_1">Lớp 1</option>
                        <option value="grade_2">Lớp 2</option>
                        <option value="grade_3">Lớp 3</option>
                        <option value="grade_4">Lớp 4</option>
                        <option value="grade_5">Lớp 5</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-black text-slate-500 uppercase mb-1">Hệ đấu trận:</label>
                      <select
                        value={newStudentArchetype}
                        onChange={(e) => setNewStudentArchetype(e.target.value as any)}
                        className="w-full p-2 rounded-lg border border-slate-300 text-xs font-bold text-slate-800 bg-white"
                      >
                        <option value="warrior">Chiến Binh ⚔️</option>
                        <option value="mage">Phù Thủy 🔮</option>
                        <option value="stem">Phát Minh ⚙️</option>
                        <option value="ninja">Ninja Gõ Phím 🥷</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-black text-slate-500 uppercase mb-1">Lịch học thứ:</label>
                      <select
                        value={newStudentDays}
                        onChange={(e) => setNewStudentDays(e.target.value as any)}
                        className="w-full p-2 rounded-lg border border-slate-300 text-xs font-bold text-slate-800 bg-white"
                      >
                        <option value="2-4-6">Thứ 2 - 4 - 6</option>
                        <option value="3-5-7">Thứ 3 - 5 - 7</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-black text-slate-500 uppercase mb-1">Ca học đăng ký:</label>
                      <select
                        value={newStudentShift}
                        onChange={(e) => setNewStudentShift(e.target.value)}
                        className="w-full p-2 rounded-lg border border-slate-300 text-xs font-bold text-slate-800 bg-white"
                      >
                        {SHIFT_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="flex gap-1.5 pt-1">
                    <button
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      className="flex-1 py-1 px-3 text-slate-700 bg-slate-200 hover:bg-slate-300 rounded text-[10px] uppercase font-bold cursor-pointer"
                    >
                      Bỏ qua
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-1 px-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-[10px] uppercase font-black cursor-pointer"
                    >
                      Xếp Lớp Nhập Học
                    </button>
                  </div>
                </form>
              )}

              {/* THANH TÌM KIẾM HỌC VIÊN */}
              <div className="relative mb-3">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                  <Search className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  placeholder="Tìm tên học viên..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white/75 text-xs font-semibold"
                />
              </div>

              {/* CUỘN DANH SÁCH TRÁI */}
              <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
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
                        <div className="w-9 h-9 rounded-xl bg-white/80 border border-white flex items-center justify-center text-xl shadow-xs">
                          {s.archetype === 'warrior' ? '⚔️' : s.archetype === 'mage' ? '🔮' : s.archetype === 'stem' ? '⚙️' : '🥷'}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-extrabold text-xs text-indigo-950 truncate max-w-[140px]">{s.name}</span>
                            {isUser && (
                              <span className="bg-indigo-600 text-[8px] font-black uppercase text-white px-1.5 rounded animate-pulse">
                                BÉ LIVE
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-slate-500 font-bold flex items-center gap-2">
                            <span className="text-indigo-800">
                              Cấp {s.level} | {s.grade === 'grade_1' ? 'Lớp 1' : s.grade === 'grade_2' ? 'Lớp 2' : s.grade === 'grade_3' ? 'Lớp 3' : s.grade === 'grade_4' ? 'Lớp 4' : 'Lớp 5'}
                            </span>
                          </div>
                          <p className="text-[9px] text-slate-500 truncate max-w-[145px] mt-0.5 font-sans font-medium">
                            🗂️ Ca: T{s.studyScheduleDays} ({s.studyScheduleShift?.split(' ')[1] || '08:30'})
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <span className="font-mono text-amber-700 text-[11px] font-black mr-1">🪙 {s.gold}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteStudent(s.id);
                          }}
                          className={`text-slate-400 hover:text-rose-600 p-1 rounded-lg hover:bg-rose-50 transition shrink-0 cursor-pointer ${
                            isUser ? 'opacity-20 pointer-events-none' : ''
                          }`}
                          title="Xóa hồ sơ học sinh"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}

                {filteredStudents.length === 0 && (
                  <div className="text-center py-8 text-xs text-slate-400 font-bold bg-white/20 rounded-2xl">
                    Không tìm thấy học sinh Sao Việt tương tự.
                  </div>
                )}
              </div>

            </div>
          </div>

          {/* CỘT CHI TIẾT EM ĐƯỢC CHỌN (8 Cột) */}
          <div className="lg:col-span-7 space-y-4">
            {currentSelectedStudent ? (
              <div className="bg-white/55 backdrop-blur-md border border-white/50 p-4 md:p-5 rounded-3xl shadow-md space-y-5" id="admin-detail-view">
                
                {/* PROFILE CHUNG HỌC VIÊN */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-indigo-950/15 pb-4 gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-white/80 border-2 border-indigo-200 rounded-2xl flex items-center justify-center text-3xl shadow-sm">
                      {currentSelectedStudent.archetype === 'warrior' ? '⚔️' : currentSelectedStudent.archetype === 'mage' ? '🔮' : currentSelectedStudent.archetype === 'stem' ? '⚙️' : '🥷'}
                    </div>
                    <div>
                      <h3 className="text-base font-black text-indigo-950 flex items-center gap-2">
                        {currentSelectedStudent.name}
                        {currentSelectedStudent.id === activePlayer.id && (
                          <span className="text-[9px] bg-indigo-100 text-indigo-800 py-0.5 px-2 rounded-full border border-indigo-300 font-sans font-black">
                            Đang Hoạt Động (Em)
                          </span>
                        )}
                      </h3>
                      <p className="text-xs text-slate-500 font-semibold flex flex-wrap gap-x-2 items-center leading-normal">
                        <span>Lớp: <strong className="text-indigo-900">{currentSelectedStudent.grade === 'grade_1' ? 'Lớp 1' : currentSelectedStudent.grade === 'grade_2' ? 'Lớp 2' : currentSelectedStudent.grade === 'grade_3' ? 'Lớp 3' : currentSelectedStudent.grade === 'grade_4' ? 'Lớp 4' : 'Lớp 5'}</strong></span>
                        <span>•</span>
                        <span>ID: <strong className="font-mono text-zinc-700">{currentSelectedStudent.id}</strong></span>
                        {currentSelectedStudent.phoneNumber && (
                          <>
                            <span>•</span>
                            <span>SĐT: <strong className="text-teal-700 font-mono">{currentSelectedStudent.phoneNumber}</strong></span>
                          </>
                        )}
                        {currentSelectedStudent.classCode && (
                          <>
                            <span>•</span>
                            <span>Mã Lớp: <strong className="text-slate-600 font-mono font-bold">{currentSelectedStudent.classCode.split(' ')[0]}</strong></span>
                          </>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="bg-indigo-600/10 border border-indigo-600/20 px-3 py-1 bg-white/40 rounded-xl text-center self-stretch sm:self-auto">
                    <span className="block text-[8px] font-black text-slate-500 uppercase tracking-widest font-mono">BẬC THÁM HIỂM</span>
                    <span className="text-indigo-900 font-mono font-black text-base">Cấp Độ {currentSelectedStudent.level}</span>
                  </div>
                </div>

                {/* KPI CHĨ SỐ THẤP - KHUNG CHUYÊN CẦN */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="bg-white/70 p-3 rounded-2xl border border-white/55 text-center shadow-xs">
                    <span className="text-lg block mb-0.5">🪙</span>
                    <span className="block text-[8px] text-zinc-500 font-black font-mono">VÀNG CHĂM HỌC</span>
                    <span className="font-mono font-black text-sm text-yellow-700">{currentSelectedStudent.gold}</span>
                  </div>

                  <div className="bg-white/70 p-3 rounded-2xl border border-white/55 text-center shadow-xs">
                    <span className="text-lg block mb-0.5">💎</span>
                    <span className="block text-[8px] text-zinc-500 font-black font-mono">KIM CƯƠNG TRÍ THỨC</span>
                    <span className="font-mono font-black text-sm text-rose-600">{currentSelectedStudent.gem}</span>
                  </div>

                  <div className="bg-white/70 p-3 rounded-2xl border border-white/55 text-center shadow-xs">
                    <span className="text-lg block mb-0.5">📅</span>
                    <span className="block text-[8px] text-zinc-500 font-black font-mono">THÀM HIỂM HÀNG KHÔNG</span>
                    <span className="font-mono font-black text-xs text-indigo-950">{currentSelectedStudent.totalDays} ngày học</span>
                  </div>

                  <div className="bg-white/70 p-3 rounded-2xl border border-white/55 text-center shadow-xs">
                    <span className="text-lg block mb-0.5">✅</span>
                    <span className="block text-[8px] text-zinc-500 font-black font-mono">VƯỢT ẢI CHIẾN BẠT</span>
                    <span className="font-mono font-black text-xs text-emerald-700">
                      {Object.values(currentSelectedStudent.completedStages || {}).reduce((a: number, b: any) => a + Number(b || 0), 0)}/90 Màn
                    </span>
                  </div>
                </div>

                {/* SẮP XẾP KHUNG GIỜ HỌC ĐĂNG KÝ VÀ NÚT ĐIỂM DANH */}
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-3.5 border border-indigo-100 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                      📅
                    </div>
                    <div>
                      <span className="block text-[10px] font-black text-indigo-950 uppercase tracking-wider">Khung Giờ Đăng Ký Học Sao Việt</span>
                      <div className="flex items-center gap-1.5 flex-wrap mt-1">
                        <span className="bg-indigo-100 text-indigo-900 border border-indigo-250 text-[10px] font-black py-0.5 px-2 rounded-lg">
                          Thứ {currentSelectedStudent.studyScheduleDays || 'Chưa chọn'}
                        </span>
                        <span className="bg-purple-100 text-purple-900 border border-purple-250 text-[10px] font-black py-0.5 px-2 rounded-lg">
                          {currentSelectedStudent.studyScheduleShift || 'Chưa chọn'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white px-3.5 py-2 border border-indigo-150 rounded-xl flex items-center justify-between sm:justify-start gap-4 shadow-sm">
                    <div>
                      <span className="block text-[8px] font-black text-slate-500 uppercase font-mono">TÍCH LŨY CHUYÊN CẦN</span>
                      <span className="text-indigo-950 font-black text-xs block leading-tight">{currentSelectedStudent.attendanceCount || 0} buổi đi học</span>
                    </div>
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

                {/* TABS TRÌNH ĐIỀU KHIỂN CHI TIẾT */}
                <div className="flex border-b border-indigo-950/10 gap-1 mt-2">
                  <button
                    type="button"
                    onClick={() => { sound.playClick(); setActiveDetailTab('manage'); }}
                    className={`py-2 px-3 border-b-2 text-xs font-black uppercase transition-all duration-150 cursor-pointer ${
                      activeDetailTab === 'manage'
                        ? 'border-indigo-600 text-indigo-700 font-extrabold'
                        : 'border-transparent text-slate-500 hover:text-slate-700 font-bold'
                    }`}
                  >
                    🛠️ Quản lý & Cấp giáo trình
                  </button>
                  <button
                    type="button"
                    onClick={() => { sound.playClick(); setActiveDetailTab('edit_profile'); }}
                    className={`py-2 px-3 border-b-2 text-xs font-black uppercase transition-all duration-150 cursor-pointer ${
                      activeDetailTab === 'edit_profile'
                        ? 'border-indigo-600 text-indigo-700 font-extrabold'
                        : 'border-transparent text-slate-500 hover:text-slate-700 font-bold'
                    }`}
                  >
                    ✏️ Sửa Lịch Trình & Chỉ số
                  </button>
                  <button
                    type="button"
                    onClick={() => { sound.playClick(); setActiveDetailTab('redeemed_gifts'); }}
                    className={`py-2 px-3 border-b-2 text-xs font-black uppercase transition-all duration-150 cursor-pointer relative ${
                      activeDetailTab === 'redeemed_gifts'
                        ? 'border-indigo-600 text-indigo-700 font-extrabold'
                        : 'border-transparent text-slate-500 hover:text-slate-700 font-bold'
                    }`}
                  >
                    🎁 Quà Đã Đổi Sao Việt
                    {(currentSelectedStudent.isActivePlayer || currentSelectedStudent.id === activePlayer.id
                      ? purchaseHistory.filter(h => !h.claimed).length
                      : (simulatedRedemptions[currentSelectedStudent.id] || []).filter(h => !h.claimed).length) > 0 && (
                      <span className="absolute top-1 right-[-4px] w-2 h-2 bg-rose-600 rounded-full animate-pulse" />
                    )}
                  </button>
                </div>

                {/* TAB DETAIL 1: QUẢN LÝ TIẾN TRÌNH & ĐỘ KHÓ GIÁO ÁN */}
                {activeDetailTab === 'manage' && (
                  <div className="space-y-4 animate-fade-in">
                    
                    {/* Cài đặt bậc năng lực */}
                    <div className="space-y-2 bg-indigo-50/50 p-3.5 border border-indigo-100 rounded-2xl">
                      <h4 className="font-black text-xs text-indigo-950 uppercase tracking-wider flex items-center gap-1.5 font-mono">
                        <GraduationCap className="w-4.5 h-4.5 text-indigo-700" />
                        Độ Khó Giáo Trình Bé Học Luật
                      </h4>
                      <p className="text-[10px] text-slate-500 font-semibold leading-normal">
                        Hao sâm với trình lực của bé lớp {currentSelectedStudent.grade.slice(-1)}. Hãy dịch đổi bậc ôn luyện học thuật dưới đây để câu hỏi trắc nghiệm tự động đồng bộ theo đúng form kỹ năng:
                      </p>

                      <div className="grid grid-cols-5 gap-1.5 pt-1.5" id="teacher-grade-buttons">
                        {[1, 2, 3, 4, 5].map((gNum) => {
                          const gradeKey = `grade_${gNum}` as 'grade_1' | 'grade_2' | 'grade_3' | 'grade_4' | 'grade_5';
                          const isCurrent = currentSelectedStudent.grade === gradeKey;
                          
                          return (
                            <button
                              key={gNum}
                              onClick={() => handleTeacherChangeGrade(gradeKey)}
                              className={`py-2 text-xs font-black rounded-xl transition cursor-pointer text-center select-none ${
                                isCurrent
                                  ? 'bg-amber-400 text-slate-950 shadow-md scale-105 border border-amber-400'
                                  : 'bg-white text-slate-800 border border-slate-300 hover:border-slate-400 hover:bg-slate-50'
                              }`}
                            >
                              Lớp {gNum}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* TIẾN ĐỘ BUỔI HỌC CỦA CHÍNH TÀI KHOẢN HỌC VIÊN NÀY QUA 6 VÙNG BẢN ĐỒ */}
                    <div className="space-y-3 bg-slate-50 p-4 border border-indigo-50 rounded-2xl shadow-inner">
                      <div className="flex items-center justify-between border-b border-indigo-100 pb-2">
                        <h4 className="font-black text-xs text-indigo-950 uppercase tracking-wider flex items-center gap-1.5">
                          <Sliders className="w-4 h-4 text-indigo-700" />
                          Tiến Độ Vượt Màn của {currentSelectedStudent.name} (Từng Đảo)
                        </h4>
                        <span className="text-[10px] font-black text-indigo-700">Can thiệp Giáo Viên</span>
                      </div>
                      
                      <div className="space-y-3 pt-1">
                        {GAME_REGIONS.map((region) => {
                          const cleared = (currentSelectedStudent.completedStages || {})[region.id] || 0;
                          const pct = (cleared / region.maxStages) * 100;
                          
                          return (
                            <div key={region.id} className="bg-white/80 p-3 rounded-xl border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                              
                              {/* Thông tin Ải */}
                              <div className="flex items-center gap-2.5 shrink-0 min-w-[200px]">
                                <span className="text-xl">{region.icon}</span>
                                <div>
                                  <span className="text-xs font-black text-slate-800 block leading-tight">{region.name}</span>
                                  <span className="text-[9px] font-mono font-bold text-slate-500">Mã vùng: {region.id}</span>
                                </div>
                              </div>

                              {/* Thanh Tiến Độ */}
                              <div className="flex-1 w-full sm:w-auto">
                                <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 mb-1 font-mono">
                                  <span>{cleared} / {region.maxStages} Ải hoàn thành</span>
                                  <span className={cleared === 15 ? 'text-emerald-700' : cleared > 0 ? 'text-indigo-600' : 'text-slate-400'}>
                                    {pct.toFixed(0)}%
                                  </span>
                                </div>
                                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200/40">
                                  <div 
                                    className={`h-full rounded-full transition-all duration-200 ${cleared === 15 ? 'bg-gradient-to-r from-emerald-500 to-green-600' : 'bg-gradient-to-r from-indigo-500 to-indigo-600'}`}
                                    style={{ width: `${pct}%` }}
                                  />
                                </div>
                              </div>

                              {/* Bộ Nút Điều Chỉnh Tiến Độ */}
                              <div className="flex items-center gap-1 self-end sm:self-auto shrink-0">
                                <button
                                  type="button"
                                  disabled={cleared === 0}
                                  onClick={() => handleUpdateRegionProgress(region.id, -1)}
                                  className="w-7 h-7 bg-slate-100 border border-slate-300 rounded-lg flex items-center justify-center font-bold text-xs hover:bg-slate-200 disabled:opacity-40 transition-all select-none cursor-pointer"
                                  title="Giảm 1 màn"
                                >
                                  -
                                </button>
                                <button
                                  type="button"
                                  disabled={cleared === 15}
                                  onClick={() => handleUpdateRegionProgress(region.id, 1)}
                                  className="py-1 px-2.5 bg-indigo-100 hover:bg-indigo-200 border border-indigo-200 text-indigo-900 rounded-lg text-[10px] font-bold transition-all select-none cursor-pointer"
                                  title="Tăng 1 màn (+1 Stage)"
                                >
                                  +1 màn
                                </button>
                                <button
                                  type="button"
                                  disabled={cleared === 15}
                                  onClick={() => handleCompleteRegionStages(region.id)}
                                  className="py-1 px-2 bg-indigo-600 hover:bg-indigo-550 active:scale-95 text-white rounded-lg text-[10px] font-black uppercase transition-all select-none cursor-pointer"
                                  title="Duyệt Hoàn Thành Đảo 15/15"
                                >
                                  Duyệt Xong
                                </button>
                              </div>

                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* KHEN THƯỞNG COINS / GEMS ĐỘNG VIÊN */}
                    <div className="space-y-2.5 bg-amber-50/50 p-3.5 border border-amber-200 rounded-2xl">
                      <h4 className="font-black text-xs text-indigo-950 uppercase tracking-wider flex items-center gap-1.5 font-mono">
                        <Award className="w-4 h-4 text-amber-600 animate-bounce" />
                        Khen Thưởng Khích Lệ Chăm Chỉ
                      </h4>
                      <p className="text-[10px] text-slate-500 font-medium">
                        Khi bé giải bài tập nhanh hoặc có thái độ gõ phím 10 ngón tốt trên lớp, giáo viên hãy phát thưởng trực tiếp lượng Vàng/Kim cương động viên em:
                      </p>

                      <div className="flex flex-wrap gap-2 pt-1 font-mono">
                        <button
                          onClick={() => handleAddReward(100, 0)}
                          className="flex-1 py-2 px-3 bg-white hover:bg-amber-100 border border-amber-300 text-amber-900 font-black text-xs rounded-xl transition cursor-pointer text-center flex items-center justify-center gap-1 shadow-xs"
                        >
                          🪙 +100 Vàng
                        </button>
                        <button
                          onClick={() => handleAddReward(500, 0)}
                          className="flex-1 py-2 px-3 bg-white hover:bg-amber-100 border border-amber-300 text-amber-900 font-black text-xs rounded-xl transition cursor-pointer text-center flex items-center justify-center gap-1 shadow-xs"
                        >
                          🪙 +500 Vàng
                        </button>
                        <button
                          onClick={() => handleAddReward(0, 5)}
                          className="flex-1 py-1 px-3 bg-white hover:bg-rose-100 border border-rose-300 text-rose-800 font-black text-xs rounded-xl transition cursor-pointer text-center flex items-center justify-center gap-1 shadow-xs"
                        >
                          💎 +5 Kim Cương
                        </button>
                        <button
                          onClick={() => handleAddReward(0, 20)}
                          className="flex-1 py-1 px-3 bg-white hover:bg-rose-100 border border-rose-300 text-rose-800 font-black text-xs rounded-xl transition cursor-pointer text-center flex items-center justify-center gap-1 shadow-xs"
                        >
                          💎 +20 Kim Cương
                        </button>
                      </div>
                    </div>

                    {/* Reset cooldown (Simulate next day) */}
                    <div className="space-y-2 bg-emerald-50/50 p-3.5 border border-emerald-250 rounded-2xl">
                      <h4 className="font-black text-xs text-emerald-950 uppercase tracking-wider flex items-center gap-1.5 font-mono">
                        <Sparkles className="w-4 h-4 text-emerald-600 animate-pulse" />
                        Mở Khóa Ngày Điểm Danh Kế Tiếp
                      </h4>
                      <p className="text-[10px] text-slate-500 font-semibold leading-normal">
                        Bỏ qua cooldown 24 tiếng. Thuận tiện cho giáo án giảng bài điểm danh demo tại lớp Sao Việt hoặc cho bé thăng tiến chuyên cần:
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          if (onSimulateNextDay) {
                            onSimulateNextDay();
                          } else {
                            alert("Không tìm thấy hàm callback hệ thống!");
                          }
                        }}
                        className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase rounded-xl transition cursor-pointer text-center flex items-center justify-center gap-1.5 shadow-sm"
                      >
                        ☀️ Kích Hoạt Sang Ngày Đi Học Tiếp Theo (Bỏ Qua Chầu Có Sẵn)
                      </button>
                    </div>

                  </div>
                )}

                {/* TAB DETAIL 2: CHỈNH SỬA THÔNG TIN CHI TIẾT */}
                {activeDetailTab === 'edit_profile' && (
                  <form onSubmit={handleSavePersonalInfo} className="space-y-4 bg-indigo-50/30 p-4 border border-indigo-100 rounded-2xl">
                    <h4 className="font-black text-xs text-indigo-950 uppercase tracking-wider flex items-center gap-1.5 font-mono">
                      <Edit3 className="w-4 h-4 text-indigo-700" />
                      Chỉnh Sửa Toàn Bộ Chỉ Số Học Sinh
                    </h4>
                    <p className="text-[10px] text-slate-500 font-medium">
                      Khi trẻ đổi số điện thoại hoặc thay đổi lịch phân ca học chính thức, thầy cô Sao Việt hãy cập nhật chuẩn xác dữ liệu tại đây:
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                      <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase mb-1">Họ tên học viên:</label>
                        <input
                          type="text"
                          required
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-505 bg-white font-extrabold text-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase mb-1">Độ khó giáo án (Lớp):</label>
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
                        <label className="block text-[10px] font-black text-slate-500 uppercase mb-1">Hệ đấu võ:</label>
                        <select
                          value={editArchetype}
                          onChange={(e) => setEditArchetype(e.target.value as any)}
                          className="w-full p-2 rounded-xl border border-slate-300 text-xs font-bold bg-white"
                        >
                          <option value="warrior">Chiến Binh ⚔️</option>
                          <option value="mage">Phù Thủy 🔮</option>
                          <option value="stem">STEM Nhà Phát Minh ⚙️</option>
                          <option value="ninja">Bàn Phím Ninja 🥷</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase mb-1">Level học viên:</label>
                        <input
                          type="number"
                          min="1"
                          max="100"
                          value={editLevel}
                          onChange={(e) => setEditLevel(parseInt(e.target.value) || 1)}
                          className="w-full px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-bold bg-white font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase mb-1">Số lượng vàng gặt tích lũy:</label>
                        <input
                          type="number"
                          min="0"
                          value={editGold}
                          onChange={(e) => setEditGold(parseInt(e.target.value) || 0)}
                          className="w-full px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-bold bg-white font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase mb-1">Số lượng kim cương sở hữu:</label>
                        <input
                          type="number"
                          min="0"
                          value={editGem}
                          onChange={(e) => setEditGem(parseInt(e.target.value) || 0)}
                          className="w-full px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-bold bg-white font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase mb-1">📅 Ngày học cố định xếp phân:</label>
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
                        <label className="block text-[10px] font-black text-slate-500 uppercase mb-1">⏰ Ca học đăng ký Sao Việt:</label>
                        <select
                          value={editShift}
                          onChange={(e) => setEditShift(e.target.value)}
                          className="w-full p-2 rounded-xl border border-slate-300 text-xs font-bold bg-white"
                        >
                          {SHIFT_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase mb-1">📝 Sửa số buổi đi học (Chuyên cần):</label>
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

                    <div className="text-right pt-2 border-t border-indigo-950/5">
                      <button
                        type="submit"
                        className="py-2 px-5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black uppercase transition inline-flex items-center gap-1.5 cursor-pointer shadow-xs hover:shadow-md"
                      >
                        <Save className="w-3.5 h-3.5" /> Lưu Thay Đổi Chỉ Số
                      </button>
                    </div>
                  </form>
                )}

                {/* TAB DETAIL 3: DANH SÁCH QUÀ ĐÃ QUY ĐỔI TRÊN KHUNG TIỆM CỦA BÉ */}
                {activeDetailTab === 'redeemed_gifts' && (
                  <div className="space-y-3 bg-amber-50/20 p-4 border border-amber-100 rounded-2xl animate-fade-in text-sans">
                    <h4 className="font-black text-xs text-indigo-950 uppercase tracking-wider flex items-center gap-1.5 font-mono">
                      <Gift className="w-4 h-4 text-indigo-700 font-black" />
                      Lịch Sử Nhận Đồ Thực Tế của Trẻ
                    </h4>
                    <p className="text-[10px] text-slate-500 font-semibold leading-normal">
                      Khi các bé Sao Việt chăm thám hiểm, các em sẽ đổi Quà Thực Tế (Bút vẽ STEM, balo, bình nước Sao Việt) từ điểm vàng. Giáo viên hãy kiểm tra mã code và phát quà, sau đó bấm phê duyệt:
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
                          <div key={item.id} className="p-3 bg-white/70 border border-slate-200 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs font-sans">
                            <div>
                              <div className="text-xs font-black text-indigo-950">{item.name}</div>
                              <div className="flex flex-wrap items-center gap-x-2 text-[10px] text-slate-500 font-bold mt-1">
                                <span>Ngày đổi: {item.date}</span>
                                <span>•</span>
                                <span>Mã gạt nhận: <span className="text-indigo-900 font-mono font-black">{item.code}</span></span>
                              </div>
                            </div>

                            <div>
                              {item.claimed ? (
                                <span className="inline-flex items-center gap-1 text-[10px] font-black text-emerald-700 bg-emerald-50 border border-emerald-250 px-2.5 py-1 rounded-lg">
                                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600 font-black" /> Đã Phát Quà
                                </span>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => handleApproveRealGift(item.id)}
                                  className="py-1 px-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-[10px] font-black uppercase transition cursor-pointer flex items-center gap-1 shadow-xs"
                                >
                                  Xác Thực Trao Quà
                                </button>
                              )}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-6 text-xs text-slate-400 font-semibold bg-white/20 rounded-xl border border-dashed border-slate-300">
                          Học sinh này chưa có ghi nhận quy đổi quà Sao Việt thực tế nào.
                        </div>
                      )}
                    </div>
                  </div>
                )}

              </div>
            ) : (
              <div className="bg-white/30 rounded-3xl p-8 text-center text-slate-500 font-bold border border-white/40">
                ⚠️ Hãy bóc chọn 1 Học viên Sao Việt từ cột danh sách bên trái để bắt đầu rà xét thông tin ca dạy và căn chỉnh năng lực.
              </div>
            )}
          </div>

        </div>
      )}

      {/* ======================= TAB 3: PHÁT THÔNG ĐIỆP TOÀN LỚP CÓ ĐÍNH KÈM QUÀ ======================= */}
      {activeMainTab === 'broadcast' && (
        <div className="max-w-xl mx-auto bg-white/55 backdrop-blur-md border border-white/50 p-5 rounded-3xl shadow-md space-y-4 animate-fade-in" id="panel-broadcast">
          <div className="text-center max-w-md mx-auto mb-4">
            <MailIcon className="w-10 h-10 text-indigo-700 mx-auto mb-2 animate-bounce" />
            <h3 className="font-black text-base text-indigo-950 uppercase tracking-widest">
              Bảng Thông Điệp & Phát Quà Toàn Lớp
            </h3>
            <p className="text-[11px] text-slate-500 font-semibold leading-normal mt-1">
              Soạn thảo thư dặn dò hoặc nộp bài tập thử thách hàng tuần cho bậc học Sao Việt. Tin nhắn chứa điểm thưởng sẽ tự động bay dội thẳng vào hòm thư các bé!
            </p>
          </div>

          {mailSuccess && (
            <div className="bg-emerald-100 border border-emerald-400 text-emerald-800 rounded-xl p-3 text-xs font-bold flex items-center gap-2 animate-pulse">
              <CheckCircle className="w-4 h-4 shrink-0" />
              Gửi thư phát quà thành công! Đã đồng bộ tin báo và thưởng quà (Coi/Gem) đến rương thư của tất cả các em học sinh.
            </div>
          )}

          <form onSubmit={handleSendNotification} className="space-y-4">
            <div>
              <label className="block text-xs font-black text-indigo-950 uppercase mb-1">
                Tiêu đề thư dặn dò/Giao bài:
              </label>
              <input
                type="text"
                required
                placeholder="Ví dụ: Thử thách gõ phím 10 ngón cuối tuần hoặc giải toán nhân chia"
                value={mailTitle}
                onChange={(e) => setMailTitle(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-slate-850 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-indigo-501 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-indigo-950 uppercase mb-1">
                Nội dung thư cụ thể phát sóng:
              </label>
              <textarea
                required
                rows={4}
                placeholder="Ví dụ: Chào các em dũng sĩ thông thái! Tuần này thầy cô giao dặn dò các bé vượt qua màn 5 ở đảo 3 gõ chuột. Phần quà khích lệ khổng lồ tặng kèm nhé..."
                value={mailContent}
                onChange={(e) => setMailContent(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-850 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-indigo-501 bg-white"
              />
            </div>

            {/* Quà kèm theo */}
            <div className="grid grid-cols-2 gap-3.5" id="mail-rewards-box">
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase flex items-center gap-1 mb-1 font-mono">
                  🪙 Đính Kèm Vàng Thưởng Học (+):
                </label>
                <input
                  type="number"
                  min="0"
                  placeholder="Nhập số vàng (nêu có)"
                  value={mailGoldReward || ''}
                  onChange={(e) => setMailGoldReward(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-300 text-slate-800 text-xs font-semibold bg-white font-mono"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase flex items-center gap-1 mb-1 font-mono">
                  💎 Đính Kèm Kim Cương Thưởng (+):
                </label>
                <input
                  type="number"
                  min="0"
                  placeholder="Nhập số kim cương"
                  value={mailGemReward || ''}
                  onChange={(e) => setMailGemReward(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-300 text-slate-800 text-xs font-semibold bg-white font-mono"
                />
              </div>
            </div>

            <div className="text-right pt-2 border-t border-indigo-950/5">
              <button
                type="submit"
                className="py-2.5 px-5 bg-indigo-600 hover:bg-indigo-505 active:scale-[0.98] text-white rounded-xl text-xs font-black uppercase transition flex items-center gap-1.5 cursor-pointer ml-auto shadow-md hover:shadow-lg inline-flex select-none"
              >
                <Send className="w-3.5 h-3.5" /> Phát sóng Tin nhắn & Quà đến cả lớp
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL ĐỔI MẬT KHẨU QUẢN TRỊ VIÊN */}
      {showChangePasswordModal && (
        <div className="fixed inset-0 bg-indigo-950/40 backdrop-blur-md flex items-center justify-center z-50 p-4" id="change-password-modal-container">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 border border-slate-200 shadow-2xl relative animate-fade-in">
            <h3 className="text-lg font-black text-indigo-950 uppercase mb-4 flex items-center gap-2">
              <Key className="w-5 h-5 text-indigo-600 animate-pulse" /> Đổi Mật Khẩu Admin
            </h3>
            
            {changePasswordError && (
              <div className="mb-3 bg-rose-50 border border-rose-200 text-rose-800 px-3 py-2.5 rounded-xl text-xs font-bold leading-relaxed">
                ⚠️ {changePasswordError}
              </div>
            )}
            
            {changePasswordSuccess && (
              <div className="mb-3 bg-emerald-50 border border-emerald-200 text-emerald-800 px-3 py-2.5 rounded-xl text-xs font-bold leading-relaxed">
                {changePasswordSuccess}
              </div>
            )}

            <form onSubmit={handleChangePasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider mb-1">
                  Mật khẩu hiện tại:
                </label>
                <input
                  required
                  type="password"
                  placeholder="Mật khẩu đang sử dụng"
                  value={currentPasswordInput}
                  onChange={(e) => setCurrentPasswordInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-slate-800 text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider mb-1">
                  Mật khẩu mới:
                </label>
                <input
                  required
                  type="password"
                  placeholder="Tối thiểu 4 ký tự"
                  value={newPasswordInput}
                  onChange={(e) => setNewPasswordInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-slate-800 text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider mb-1">
                  Xác nhận mật khẩu mới:
                </label>
                <input
                  required
                  type="password"
                  placeholder="Nhập lại mật khẩu mới"
                  value={confirmPasswordInput}
                  onChange={(e) => setConfirmPasswordInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-slate-800 text-xs"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setShowChangePasswordModal(false);
                    setChangePasswordError('');
                    setChangePasswordSuccess('');
                  }}
                  className="flex-1 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black rounded-xl text-xs uppercase cursor-pointer transition text-center"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 px-3 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-xl text-xs uppercase cursor-pointer transition text-center"
                >
                  Cập nhật
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
