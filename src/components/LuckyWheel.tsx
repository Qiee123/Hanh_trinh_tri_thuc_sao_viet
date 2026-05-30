/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Player } from '../types';
import { sound } from './SoundManager';
import { Sparkles, HelpCircle, AlertCircle, Award, Compass, Gift } from 'lucide-react';
import { motion } from 'motion/react';

// Định nghĩa cơ cấu giải thưởng mốc của Vòng Quay
const PRIZES = [
  { text: '🪙 +50 Vàng', type: 'gold', amount: 50, color: 'bg-amber-100 text-amber-850', deg: 0 },
  { text: '💎 +2 Kim Cương', type: 'gem', amount: 2, color: 'bg-rose-50 text-rose-805', deg: 45 },
  { text: '⚡ +50 EXP', type: 'exp', amount: 50, color: 'bg-indigo-50 text-indigo-905', deg: 90 },
  { text: '🥤 Vé Trà Sữa Thật', type: 'real_gift', giftId: 'g5', name: 'Thẻ Đổi Nước Thần Tốc (Quà từ Vòng Quay)', color: 'bg-emerald-50 text-emerald-900', deg: 135 },
  { text: '🪙 +150 Vàng', type: 'gold', amount: 150, color: 'bg-amber-200 text-amber-900', deg: 180 },
  { text: '💎 +5 Kim Cương', type: 'gem', amount: 5, color: 'bg-rose-100 text-rose-900', deg: 225 },
  { text: '⭐ Huy Hiệu Sao', type: 'real_gift', giftId: 'g1', name: 'Sticker Ngôi Sao May Mắn (Quà từ Vòng Quay)', color: 'bg-amber-50 text-amber-700', deg: 270 },
  { text: '🥀 May Mắn Lần Sau', type: 'try_again', amount: 0, color: 'bg-slate-100 text-slate-500', deg: 315 },
];

interface LuckyWheelProps {
  player: Player;
  onRewardWon: (reward: { type: string; amount: number; name?: string; giftId?: string }) => void;
  onBackToShop: () => void;
}

export default function LuckyWheel({ player, onRewardWon, onBackToShop }: LuckyWheelProps) {
  const [isRotating, setIsRotating] = useState(false);
  const [rotationDegree, setRotationDegree] = useState(0);
  const [winningIndex, setWinningIndex] = useState<number | null>(null);
  const [isFreeSpinAvailable, setIsFreeSpinAvailable] = useState(true);
  const [showWinBanner, setShowWinBanner] = useState(false);

  // Đồng bộ trạng thái Lượt khôi phục miễn phí theo ngày từ LocalStorage
  useEffect(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    const lastSpinDate = localStorage.getItem('stv_last_spin_date');
    if (lastSpinDate === todayStr) {
      setIsFreeSpinAvailable(false);
    } else {
      setIsFreeSpinAvailable(true);
    }
  }, [player.checkedInToday]);

  const handleSpinClick = () => {
    if (isRotating) return;

    // Kiểm tra chi phí nếu lượt miễn phí đã hết
    if (!isFreeSpinAvailable && player.gold < 150) {
      sound.playIncorrect();
      alert('Không đủ vàng! Lượt quay thêm cần tốn 150 Vàng chăm chỉ.');
      return;
    }

    sound.playClick();
    setIsRotating(true);
    setShowWinBanner(false);
    setWinningIndex(null);

    // Trừ 150 vàng nếu không quay miễn phí
    if (!isFreeSpinAvailable) {
      player.gold -= 150;
    }

    // Chọn ngẫu nhiên một ô quà ngẫu nhiên
    const randIdx = Math.floor(Math.random() * PRIZES.length);
    const selectedPrize = PRIZES[randIdx];

    // Tạo góc quay mượt mà (Xoay tối thiểu 6 vòng = 2160 độ để tạo hưng phấn)
    const baseSpins = 3600;
    const destDegree = baseSpins + (360 - selectedPrize.deg);
    setRotationDegree(destDegree);

    // Kích hoạt chuỗi âm gõ phím / gõ nhịp giả lập tiếng kim quay
    let spinSoundInterval = setInterval(() => {
      sound.playClick();
    }, 150);

    setTimeout(() => {
      clearInterval(spinSoundInterval);
    }, 2800);

    setTimeout(() => {
      sound.playLevelUp();
      setIsRotating(false);
      setWinningIndex(randIdx);
      setShowWinBanner(true);

      // Nhận thưởng
      onRewardWon({
        type: selectedPrize.type,
        amount: selectedPrize.amount || 0,
        name: selectedPrize.name,
        giftId: selectedPrize.giftId,
      });

      // Nếu quay lượt miễn phí, đánh dấu đã dùng hôm nay
      if (isFreeSpinAvailable) {
        const todayStr = new Date().toISOString().split('T')[0];
        localStorage.setItem('stv_last_spin_date', todayStr);
        setIsFreeSpinAvailable(false);
      }
    }, 3500);
  };

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto text-slate-800" id="wheel-wrapper">
      
      {/* KHUNG TIÊU ĐỀ */}
      <div className="flex justify-between items-center pb-4 border-b border-white/35 mb-6" id="wheel-header">
        <div>
          <span className="text-[10px] font-mono tracking-widest text-indigo-900 uppercase font-black bg-indigo-50 px-2.5 py-1 rounded">
            Hành Trình Tri Thức
          </span>
          <h2 className="text-xl md:text-2xl font-black text-indigo-950 mt-1 flex items-center gap-2">
            🎡 VÒNG QUAY SÁCH VỞ MAY MẮN
          </h2>
        </div>
        <button
          onClick={() => {
            sound.playClick();
            onBackToShop();
          }}
          className="px-4 py-2 bg-white/50 text-xs font-black rounded-xl text-indigo-950 border border-white/35 hover:bg-white/80 cursor-pointer"
        >
          Trở lại Cửa hàng
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-white/55 backdrop-blur-md rounded-3xl p-6 border border-white/50 shadow-md">
        
        {/* VIEW 1: VÒNG QUAY QUAY HOẠT HÌNH */}
        <div className="flex flex-col items-center relative py-6" id="wheel-canvas-container">
          {/* Mũi tên chỉ chuẩn xác hướng đỉnh 12h */}
          <div className="absolute top-1 z-35 text-4xl filter drop-shadow select-none animate-bounce">
            👇
          </div>

          {/* Vòng quay SVG xoay tròn lồng lộng */}
          <div className="w-72 h-72 md:w-80 md:h-80 rounded-full border-8 border-indigo-900 relative shadow-2xl overflow-hidden bg-indigo-950 flex items-center justify-center">
            
            <div 
              className="absolute inset-0 w-full h-full rounded-full"
              style={{
                transform: `rotate(${rotationDegree}deg)`,
                transition: isRotating ? 'transform 3.5s cubic-bezier(0.25, 0.1, 0.1, 1)' : 'none'
              }}
              id="physic-wheel"
            >
              {/* Vẽ các hình quạt nan từ PRIZES */}
              <svg viewBox="0 0 100 100" className="w-full h-full transform rotate-[-22.5deg]">
                {PRIZES.map((prize, idx) => {
                  const angle = 45;
                  const rotateStr = `rotate(${idx * angle} 50 50)`;
                  
                  // Phân biệt màu sắc rực rỡ để trẻ em thích thú
                  let fanColor = '#FFFFFF';
                  if (idx % 2 === 0) fanColor = '#F5FEFD'; // Off white
                  if (idx === 1 || idx === 5) fanColor = '#FFE4E6'; // Rose
                  if (idx === 3) fanColor = '#D1FAE5'; // Emerald
                  if (idx === 7) fanColor = '#E2E8F0'; // Ngưng nghỉ
                  if (idx === 0 || idx === 4) fanColor = '#FEF3C7'; // Amber

                  return (
                    <g key={idx} transform={rotateStr}>
                      {/* Path cung tròn 45 độ */}
                      <path 
                        d="M50,50 L50,0 A50,50 0 0,1 85.35,14.64 Z" 
                        fill={fanColor}
                        stroke="#6366F1"
                        strokeWidth="0.4"
                      />
                      
                      {/* Thẻ biểu tượng / Text đặt rẽ hướng tâm dọc */}
                      <text 
                        x="62" 
                        y="28" 
                        fill="#000" 
                        fontSize="3.8" 
                        fontWeight="900"
                        fontFamily="sans-serif"
                        transform="rotate(22.5 62 28)" 
                        textAnchor="middle"
                      >
                        {prize.text.split(' ')[0]}
                      </text>
                      <text 
                        x="62" 
                        y="34" 
                        fill="#4F46E5" 
                        fontSize="2.5" 
                        fontWeight="800"
                        fontFamily="sans-serif"
                        transform="rotate(22.5 62 34)" 
                        textAnchor="middle"
                      >
                        {prize.text.split(' ').slice(1).join(' ')}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Núm tròn Core ở trung tâm */}
            <div className="absolute w-12 h-12 bg-indigo-900 border-4 border-white rounded-full flex items-center justify-center text-xl text-white font-black hover:scale-105 duration-100 z-30 select-none shadow-md">
              ⭐
            </div>
          </div>
        </div>

        {/* VIEW 2: KHU BẢNG ĐIỀU KHIỂN & MÔ TẢ ĐỐI CHỈ */}
        <div className="space-y-6" id="wheel-control-board">
          <div className="bg-white/40 p-5 rounded-2xl border border-white/50 space-y-3 shadow-inner">
            <h3 className="font-extrabold text-indigo-950 text-md">LƯỢT QUAY HÔM NAY</h3>
            <div className="flex items-center gap-3">
              <span className="text-3xl">🎰</span>
              <div>
                {isFreeSpinAvailable ? (
                  <p className="text-emerald-700 font-black text-sm">
                    Chúc mừng! Bạn có 1 Lượt Quay Miễn Phí rực rỡ!
                  </p>
                ) : (
                  <p className="text-amber-800 font-extrabold text-sm">
                    Lượt miễn phí kết thúc. Mở quay tiếp theo tốn 150 Vàng.
                  </p>
                )}
                <p className="text-[11px] text-slate-500 font-medium">
                  * Lượt xoay miễn phí sẽ tự động hồi lại sau khi em nhấn nút <strong>"MÔ PHỎNG SANG NGÀY MỚI"</strong>.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <button
              disabled={isRotating}
              onClick={handleSpinClick}
              className={`w-full py-4 rounded-xl text-md tracking-wider font-sans font-black uppercase text-center cursor-pointer transition transform active:scale-95 border-b-4 ${
                isRotating
                  ? 'bg-slate-400 text-slate-200 border-slate-650 pointer-events-none'
                  : 'bg-amber-500 hover:bg-amber-600 border-amber-600 text-slate-950 shadow-lg'
              }`}
            >
              {isRotating ? '🎰 Đang Xoay Vòng Quay...' : isFreeSpinAvailable ? '🎫 XOAY MIỄN PHÍ NGAY 🎫' : '🪙 XOAY THÊM (TỐN 150 VÀNG)'}
            </button>
            
            <p className="text-[11.5px] text-center text-slate-500 font-bold">
              Lượt tích lũy hiện có của dũng sĩ: <strong className="text-amber-700">🪙 {player.gold} Vàng</strong> | <strong className="text-rose-600">💎 {player.gem} Kim Cương</strong>
            </p>
          </div>

          {/* HIỆN BANNER KHI TRÚNG QUÀ THỰC TẾ/ẢO */}
          {showWinBanner && winningIndex !== null && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`p-4 rounded-2xl text-center border-2 ${PRIZES[winningIndex].color} animate-fade-in shadow-md`}
              id="win-banner"
            >
              <span className="text-xl inline-block mr-1">🎁</span>
              <span className="text-xs font-black font-sans uppercase">
                XUẤT SẮC: EM ĐÃ TRÚNG: <strong className="underline">{PRIZES[winningIndex].text}</strong>!
              </span>
              <p className="text-[10px] mt-1 font-medium font-sans">
                {PRIZES[winningIndex].type === 'real_gift' 
                  ? 'Quẹt quà thật đã tự động thêm vào Lịch sử đổi quà, em chỉ cần đem mã này cho thầy cô nhé!'
                  : 'Phần quà tương ứng đã được cộng dồn trực tiếp vào số dư của em.'}
              </p>
            </motion.div>
          )}

          <div className="p-3 bg-indigo-50/70 border border-indigo-150 text-indigo-950 font-sans text-xs rounded-xl flex gap-2.5 shadow-sm">
            <AlertCircle className="w-4 h-4 text-indigo-700 shrink-0 mt-0.5" />
            <span className="font-semibold text-slate-650">
              Vòng quay tri thức Sao Việt là mốc bổ ích sau giờ học chính, giúp các em gặt hái thêm nhiều vàng, kim cương hoặc thậm chí trúng quà thật như Sticker đặc biệt hay Thẻ Trà Sữa may mắn!
            </span>
          </div>

        </div>

      </div>
    </div>
  );
}
