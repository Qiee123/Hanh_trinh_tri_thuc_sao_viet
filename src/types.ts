/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Định nghĩa các Archetype (Class nhân vật)
export type Archetype = 'warrior' | 'mage' | 'stem' | 'ninja';

export interface CharacterStats {
  attack: number;
  defense: number;
  intelligence: number;
  luck: number;
}

export interface Player {
  id: string;
  name: string;
  grade: 'grade_1' | 'grade_2' | 'grade_3' | 'grade_4' | 'grade_5'; // Lớp học của bé (Lớp 1 đến 5)
  archetype: Archetype;
  level: number;
  exp: number;
  expToNextLevel: number;
  hp: number;
  maxHp: number;
  gold: number;
  gem: number;
  title: string;
  consecutiveDays: number;
  totalDays: number;
  lastCheckInDate: string | null;
  checkedInToday: boolean;
  checkInHistory: string[]; // Các ngày đã điểm danh dạng YYYY-MM-DD
  stats: CharacterStats;
  inventory: string[]; // Danh sách ID các vật phẩm sở hữu
  equipped: {
    weapon: string | null;
    armor: string | null;
    shield: string | null;
    ring: string | null;
  };
  pet: string | null; // ID của pet hiện tại
  petLevel: number;
  petExp: number;
  unlockedRegions: string[]; // ['region_1', 'region_2', ...]
  completedStages: Record<string, number>; // { 'region_1': 14, 'region_2': 5 } - số màn đã vượt qua
  achievements: string[]; // Danh sách ID thành tích đã hoàn thành
  unlockedTitles: string[]; // Danh sách các danh hiệu đã mở khóa
  mailRead: string[]; // ID thư đã đọc
  mailClaimed: string[]; // ID thư đã nhận quà đính kèm
  guildId: string | null;
  phoneNumber?: string;
  password?: string;
  classCode?: string;
  studyScheduleDays?: '2-4-6' | '3-5-7';
  studyScheduleShift?: 'Ca 1: 08:30 – 10:00' | 'Ca 2: 10:00 – 11:30' | 'Ca 3: 14:00 – 15:30' | 'Ca 4: 17:00 – 18:30' | 'Ca 5: 19:00 – 20:30' | string;
  attendanceCount?: number;
}

export interface ShopItem {
  id: string;
  name: string;
  type: 'weapon' | 'armor' | 'shield' | 'ring' | 'pet' | 'real_gift';
  price: number;
  currency: 'gold' | 'gem';
  image: string; // Tên biểu tượng hoặc mô tả
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  description: string;
  statsEffect?: {
    attack?: number;
    defense?: number;
    intelligence?: number;
    luck?: number;
  };
}

export interface Quest {
  id: string;
  description: string;
  progress: number;
  target: number;
  rewardExp: number;
  rewardGold: number;
  rewardGem?: number;
  completed: boolean;
  claimed: boolean;
  category: 'math' | 'typing' | 'english' | 'attendance';
}

export interface Question {
  id: string;
  question: string;
  answers: string[];
  correct: number; // Index câu hỏi đúng (0-3)
  exp: number;
  gold: number;
  hint?: string;
}

export interface Region {
  id: string;
  name: string;
  minLevel: number;
  description: string;
  bgGradient: string; // Màu nền Tailwind
  accentColor: string;
  stagesCount: number; // Mặc định 15
  bossName: string;
  bossAvatar: string;
}

export interface AchievementItem {
  id: string;
  name: string;
  description: string;
  target: number;
  type: 'questions' | 'attendance' | 'boss_kills' | 'level' | 'gold_spent';
  rewardGold: number;
  rewardGem: number;
  rewardTitle?: string;
}

export interface Mail {
  id: string;
  title: string;
  sender: string;
  content: string;
  date: string;
  reward?: {
    gold?: number;
    gem?: number;
    item?: string;
  };
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  archetype: Archetype;
  level: number;
  exp: number;
  consecutiveDays: number;
  guildName?: string;
  isCurrentUser?: boolean;
}

export interface Guild {
  id: string;
  name: string;
  logo: string;
  membersCount: number;
  totalExp: number;
  level: number;
  leader: string;
}
