/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ShopItem, Region, AchievementItem, Mail, LeaderboardEntry, Guild } from '../types';

export const REGIONS: Region[] = [
  {
    id: 'region_1',
    name: '1. Rừng Toán Học',
    minLevel: 1,
    description: 'Thử thách phép tính thần tốc, rèn luyện tư duy nhạy bén cùng các loài muông thú.',
    bgGradient: 'from-emerald-950 via-emerald-900 to-green-950',
    accentColor: 'text-emerald-400 border-emerald-500',
    stagesCount: 15,
    bossName: 'Quái Thú Lười Tính',
    bossAvatar: '🦖'
  },
  {
    id: 'region_2',
    name: '2. Lâu Đài Tin Học',
    minLevel: 3,
    description: 'Nơi ngự trị của các Phím tắt Hoàng gia và trận pháp chuột - bàn phím điêu luyện.',
    bgGradient: 'from-blue-950 via-blue-900 to-sky-950',
    accentColor: 'text-sky-400 border-sky-500',
    stagesCount: 15,
    bossName: 'Vua Cưa Cẩm Gõ Phím',
    bossAvatar: '🧛'
  },
  {
    id: 'region_3',
    name: '3. Vùng Băng Giá Logic',
    minLevel: 5,
    description: 'Vượt qua mê cung thuật toán đóng băng và bẫy rẽ nhánh thông minh của vương quốc tuyết.',
    bgGradient: 'from-cyan-950 via-cyan-900 to-teal-950',
    accentColor: 'text-cyan-400 border-cyan-500',
    stagesCount: 15,
    bossName: 'Khổng Lồ Lặp Vô Tận',
    bossAvatar: '❄️'
  },
  {
    id: 'region_4',
    name: '4. Núi Lửa Tư Duy',
    minLevel: 7,
    description: 'Giải mã bí mật vật lý, thiên văn và các dòng dung nham STEM sục sôi năng lượng sáng tạo.',
    bgGradient: 'from-amber-950 via-red-950 to-orange-950',
    accentColor: 'text-orange-400 border-orange-500',
    stagesCount: 15,
    bossName: 'Hỏa Thần Lười Đọc Sách',
    bossAvatar: '🔥'
  },
  {
    id: 'region_5',
    name: '5. Đảo Rồng MOS',
    minLevel: 9,
    description: 'Chinh phục chứng chỉ tin học quốc tế cùng các Boss rồng giữ kho báu Word, Excel, PowerPoint.',
    bgGradient: 'from-violet-950 via-purple-900 to-indigo-950',
    accentColor: 'text-purple-400 border-purple-500',
    stagesCount: 15,
    bossName: 'Hắc Long Lười Định Dạng',
    bossAvatar: '🐉'
  },
  {
    id: 'region_6',
    name: '6. Vương Quốc AI',
    minLevel: 12,
    description: 'Vùng đất tương lai, nơi trí tuệ nhân tạo và mật mã Python tối thượng dẫn dắt nhân loại.',
    bgGradient: 'from-pink-950 via-rose-900 to-zinc-950',
    accentColor: 'text-pink-400 border-pink-500',
    stagesCount: 15,
    bossName: 'Siêu Robot Trí Tuệ Ảo',
    bossAvatar: '🤖'
  }
];

export const SHOP_ITEMS: ShopItem[] = [
  // Vũ khí ảo
  {
    id: 'w1',
    name: 'Kiếm Tri Thức',
    type: 'weapon',
    price: 800,
    currency: 'gold',
    image: '⚔️',
    rarity: 'rare',
    description: 'Cực bén, được tôi luyện từ niềm khát khao học hỏi tối thượng.',
    statsEffect: { attack: 25, luck: 5 }
  },
  {
    id: 'w2',
    name: 'Trượng Toán Học',
    type: 'weapon',
    price: 1500,
    currency: 'gold',
    image: '🔮',
    rarity: 'epic',
    description: 'Bắn ra những tia sáng số học trừu tượng có sức công phá cực mạnh.',
    statsEffect: { attack: 40, intelligence: 20 }
  },
  {
    id: 'w3',
    name: 'Mật Mã Siêu Viết',
    type: 'weapon',
    price: 30,
    currency: 'gem',
    image: '✨',
    rarity: 'legendary',
    description: 'Vũ khí tối cao chứa mã nguồn mở giúp hack sập mọi cơ chế của quái vật lười học.',
    statsEffect: { attack: 75, intelligence: 50, luck: 25 }
  },

  // Áo giáp ảo
  {
    id: 'a1',
    name: 'Áo Giáp Chăm Chỉ',
    type: 'armor',
    price: 600,
    currency: 'gold',
    image: '🛡️',
    rarity: 'common',
    description: 'Bảo vệ bạn trước mọi luồng cám dỗ ham chơi xung quanh.',
    statsEffect: { defense: 20 }
  },
  {
    id: 'a2',
    name: 'Choàng Siêng Năng',
    type: 'armor',
    price: 1200,
    currency: 'gold',
    image: '🧥',
    rarity: 'epic',
    description: 'Tỏa ra khí chất học tập ngời ngời, nâng cao đáng kể sinh mệnh.',
    statsEffect: { defense: 45, luck: 10 }
  },

  // Khiên ảo
  {
    id: 's1',
    name: 'Khiên Chuyên Cần',
    type: 'shield',
    price: 500,
    currency: 'gold',
    image: '🔰',
    rarity: 'common',
    description: 'Được chế tạo từ những buổi đi học đúng giờ liên tiếp.',
    statsEffect: { defense: 15, luck: 5 }
  },
  {
    id: 's2',
    name: 'Sách Vạn Năng',
    type: 'shield',
    price: 20,
    currency: 'gem',
    image: '📖',
    rarity: 'epic',
    description: 'Hấp thụ bớt sát thương vật lý và phản lại bằng đòn phản công tri thức cực gắt.',
    statsEffect: { defense: 35, intelligence: 30 }
  },

  // Nhẫn tư duy
  {
    id: 'r1',
    name: 'Nhẫn Logic Thần Tốc',
    type: 'ring',
    price: 900,
    currency: 'gold',
    image: '💍',
    rarity: 'rare',
    description: 'Giúp người đeo suy nghĩ mạch lạc, đưa ra câu trả lời thần tốc.',
    statsEffect: { intelligence: 25, luck: 15 }
  },

  // Thú cưng ảo
  {
    id: 'p_rabbit',
    name: 'Bí Ẩn Trứng Pet',
    type: 'pet',
    price: 400,
    currency: 'gold',
    image: '🥚',
    rarity: 'rare',
    description: 'Ấp ủ sinh mệnh mầu nhiệm của loài đồng hành dễ thương.'
  },
  {
    id: 'p_fox',
    name: 'Cáo Tri Thức',
    type: 'pet',
    price: 1500,
    currency: 'gold',
    image: '🦊',
    rarity: 'epic',
    description: 'Pet đồng hành tăng 15% lượng vàng nhận được khi giải bài đố.'
  },
  {
    id: 'p_dragon',
    name: 'Rồng Học Viện',
    type: 'pet',
    price: 50,
    currency: 'gem',
    image: '🐉',
    rarity: 'legendary',
    description: 'Đồng hành thần thoại tối cao tăng 25% EXP và 25% Vàng vượt ải!'
  },

  // Quà tặng đời thực (Đổi điểm tích lũy lấy quà thật tại trung tâm Sao Việt)
  {
    id: 'g1',
    name: 'Sticker Sao Việt dễ thương',
    type: 'real_gift',
    price: 300,
    currency: 'gold',
    image: '⭐',
    rarity: 'common',
    description: 'Nhãn dán decal Chibi đẹp tuyệt vời dán sách vở.'
  },
  {
    id: 'g2',
    name: 'Bút Chì Gỗ Sao Việt',
    type: 'real_gift',
    price: 600,
    currency: 'gold',
    image: '✏️',
    rarity: 'common',
    description: 'Bút chì viết siêu êm, thân bút in logo Chuyên cần.'
  },
  {
    id: 'g3',
    name: 'Thước Kẻ Sao Việt',
    type: 'real_gift',
    price: 600,
    currency: 'gold',
    image: '📏',
    rarity: 'common',
    description: 'Thước đo milimet dẻo không gãy, hình phiêu lưu Chibi cực ngầu.'
  },
  {
    id: 'g4',
    name: 'Huy Hiệu Ngôi Sao Danh Dự',
    type: 'real_gift',
    price: 1000,
    currency: 'gold',
    image: '🏅',
    rarity: 'rare',
    description: 'Huy hiệu cài cài áo kim loại sáng bóng của học viên giỏi.'
  },
  {
    id: 'g5',
    name: 'Phiếu Nước Uống/Trà sữa',
    type: 'real_gift',
    price: 1500,
    currency: 'gold',
    image: '🥤',
    rarity: 'rare',
    description: 'Thẻ đổi trà sữa hoặc coca thơm ngon tại quầy căn tin trung tâm.'
  },
  {
    id: 'g6',
    name: 'Vé Quay Thưởng May Mắn',
    type: 'real_gift',
    price: 2000,
    currency: 'gold',
    image: '🎟️',
    rarity: 'epic',
    description: 'Nhận 1 lượt quay lồng cầu bốc thăm trúng chuột Gaming trị giá 300k.'
  },
  {
    id: 'g7',
    name: 'Áo Thun Sao Việt',
    type: 'real_gift',
    price: 5000,
    currency: 'gold',
    image: '👕',
    rarity: 'legendary',
    description: 'Áo phông đồng phục cổ tròn dệt cotton thoáng khí.'
  },
  {
    id: 'g8',
    name: 'Rương Quà Bí Mật',
    type: 'real_gift',
    price: 15,
    currency: 'gem',
    image: '🎁',
    rarity: 'legendary',
    description: 'Hộp quà tuyệt mật do Giám đốc trung tâm đích thân gói tặng (bút viết, vở, bình giữ nhiệt xịn).'
  }
];

export const DAILY_QUESTS_TEMPLATE = [
  {
    id: 'q1',
    description: 'Trả lời đúng liên tục 5 câu hỏi Toán học ngẫu nhiên',
    progress: 0,
    target: 5,
    rewardExp: 40,
    rewardGold: 60,
    rewardGem: 2,
    completed: false,
    claimed: false,
    category: 'math'
  },
  {
    id: 'q2',
    description: 'Thực hành gõ bàn phím tốc độ 10 phút tại Trung tâm',
    progress: 0,
    target: 10,
    rewardExp: 30,
    rewardGold: 50,
    completed: false,
    claimed: false,
    category: 'typing'
  },
  {
    id: 'q3',
    description: 'Giải đáp chính xác 3 câu đố Tin học an toàn',
    progress: 0,
    target: 3,
    rewardExp: 35,
    rewardGold: 45,
    completed: false,
    claimed: false,
    category: 'english' // mượn tag
  },
  {
    id: 'q4',
    description: 'Có mặt đúng giờ và điểm danh chuyên cần hôm nay',
    progress: 0,
    target: 1,
    rewardExp: 20,
    rewardGold: 30,
    rewardGem: 1,
    completed: false,
    claimed: false,
    category: 'attendance'
  }
] as const;

export const ACHIEVEMENTS: AchievementItem[] = [
  {
    id: 'a_q_50',
    name: 'Nhà Hiền Triết Tập Sự',
    description: 'Trả lời đúng tổng cộng 50 câu hỏi luyện tập',
    target: 50,
    type: 'questions',
    rewardGold: 500,
    rewardGem: 15
  },
  {
    id: 'a_q_150',
    name: 'Thượng Sĩ Vạn Năng',
    description: 'Trả lời đúng tổng cộng 150 câu hỏi luyện tập',
    target: 150,
    type: 'questions',
    rewardGold: 1500,
    rewardGem: 45,
    rewardTitle: 'Học Giả Bách Khoa'
  },
  {
    id: 'a_days_7',
    name: 'Siêu Sao Chuyên Cần',
    description: 'Đi học đều đặn và điểm danh liên tục 7 ngày',
    target: 7,
    type: 'attendance',
    rewardGold: 600,
    rewardGem: 10,
    rewardTitle: 'Vua Đi Học Đúng Giờ'
  },
  {
    id: 'a_days_30',
    name: 'Thần Độc Chuyên Cần',
    description: 'Tích lũy tổng điểm danh chuyên cần đạt 30 ngày',
    target: 30,
    type: 'attendance',
    rewardGold: 2000,
    rewardGem: 50,
    rewardTitle: 'Giáo Hoàng Chuyên Cần'
  },
  {
    id: 'a_boss_5',
    name: 'Hiệp Sĩ Quả Cảm',
    description: 'Đánh bại quái vật lười của 5 màn chơi Boss cuối',
    target: 5,
    type: 'boss_kills',
    rewardGold: 1000,
    rewardGem: 25,
    rewardTitle: 'Kiếm Sĩ Tri Thức Vô Song'
  },
  {
    id: 'a_lvl_15',
    name: 'Cao Thủ Sao Việt',
    description: 'Đạt cấp độ phiêu lưu tối thượng cấp 15',
    target: 15,
    type: 'level',
    rewardGold: 1500,
    rewardGem: 35,
    rewardTitle: 'Huyền Thoại Chibi Sao Việt'
  }
];

export const INITIAL_MAILS: Mail[] = [
  {
    id: 'mail_1',
    title: 'Thư mời phiêu lưu Vương quốc học thuật',
    sender: 'Thầy Hiệu Trưởng Sao Việt',
    content: 'Chào mừng em đã chính thức gia nhập hội những Nhà Thám Hiểm xuất sắc! Hãy đi học thật chuyên cần, hoàn thành đầy đủ bài kiểm tra để tích lũy lượng lớn trang bị và vàng thực tế. Chúc em học thật vui!',
    date: '2026-05-30',
    reward: { gold: 200, gem: 5 }
  },
  {
    id: 'mail_2',
    title: 'Huy hiệu chuyên cần tuần đầu tiên',
    sender: 'Cô giáo Chủ nhiệm',
    content: 'Khen ngợi em đã đi học đúng giờ 3 buổi liên tục trong tuần này! Sáng tạo thêm nhiều kiến thức mới và giữ vững phong độ nhé.',
    date: '2026-05-29',
    reward: { gold: 300 }
  },
  {
    id: 'mail_3',
    title: 'Quà tặng tân binh từ Trung tâm Sao Việt',
    sender: 'Hội đồng Khoa học',
    content: 'Gửi tới chiến hữu dũng cảm: Một chút kim cương làm hành trang tậu vũ khí mới tại Cửa Hàng. Cố lên nhé!',
    date: '2026-05-28',
    reward: { gem: 15 }
  }
];

export const SAMPLE_LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, name: 'Nguyễn Minh Quân', archetype: 'warrior', level: 15, exp: 2450, consecutiveDays: 14, guildName: 'Hiệp Sĩ Tri Thức' },
  { rank: 2, name: 'Lê Quỳnh Chi', archetype: 'mage', level: 14, exp: 2150, consecutiveDays: 12, guildName: 'Đội Rồng Lửa' },
  { rank: 3, name: 'Vũ Nam Khánh', archetype: 'ninja', level: 13, exp: 1980, consecutiveDays: 10, guildName: 'Sấm Sét' },
  { rank: 4, name: 'Phạm Minh Trí', archetype: 'stem', level: 13, exp: 1870, consecutiveDays: 11, guildName: 'Hiệp Sĩ Tri Thức' },
  { rank: 5, name: 'Hoàng Hải Đăng', archetype: 'warrior', level: 12, exp: 1650, consecutiveDays: 8, guildName: 'Đội Rồng Lửa' },
  { rank: 6, name: 'Trần Mỹ Dung', archetype: 'mage', level: 11, exp: 1420, consecutiveDays: 9, guildName: 'Sấm Sét' },
  { rank: 7, name: 'Đỗ Tiến Đạt', archetype: 'ninja', level: 10, exp: 1210, consecutiveDays: 7, guildName: 'Đội Rồng Lửa' }
];

export const GUILDS: Guild[] = [
  { id: 'g_dragons', name: 'Đội Rồng Lửa', logo: '🔥', membersCount: 15, totalExp: 32000, level: 5, leader: 'Lê Quỳnh Chi' },
  { id: 'g_lightning', name: 'Đội Sấm Sét', logo: '⚡', membersCount: 12, totalExp: 28000, level: 4, leader: 'Vũ Nam Khánh' },
  { id: 'g_knights', name: 'Hiệp Sĩ Tri Thức', logo: '🛡️', membersCount: 18, totalExp: 41000, level: 6, leader: 'Nguyễn Minh Quân' }
];
