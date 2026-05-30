/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Player, ShopItem } from '../types';
import { SHOP_ITEMS } from '../data/gameData';
import { sound } from './SoundManager';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingCart, Award, Check, Sparkles, AlertCircle, History, Gift, HeartHandshake } from 'lucide-react';

interface ShopProps {
  player: Player;
  onPurchaseItem: (item: ShopItem) => void;
  onPurchaseRealGift: (gift: ShopItem) => void;
  purchaseHistory: Array<{ id: string; name: string; date: string; code: string; claimed: boolean }>;
}

export default function Shop({ player, onPurchaseItem, onPurchaseRealGift, purchaseHistory }: ShopProps) {
  const [activeTab, setActiveTab] = useState<'virtual' | 'real' | 'history'>('virtual');
  const [selectedItem, setSelectedItem] = useState<ShopItem | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const virtualItems = SHOP_ITEMS.filter((s) => s.type !== 'real_gift');
  const realGifts = SHOP_ITEMS.filter((s) => s.type === 'real_gift');

  const handleBuyClick = (item: ShopItem) => {
    sound.playClick();
    setSelectedItem(item);
  };

  const confirmPurchase = () => {
    if (!selectedItem) return;

    // Kiểm tra dòng tiền tệ
    const cost = selectedItem.price;
    const currency = selectedItem.currency;

    if (currency === 'gold' && player.gold < cost) {
      sound.playIncorrect();
      alert('Không đủ vàng rồi dũng sĩ ơi! Hãy cố gắng hoàn thành nhiệm vụ và giải thêm câu hỏi nhé.');
      setSelectedItem(null);
      return;
    }

    if (currency === 'gem' && player.gem < cost) {
      sound.playIncorrect();
      alert('Không đủ Kim Cương quý giá rồi! Hãy hạ gục thêm Boss vùng đất để giành lấy Kim Cương.');
      setSelectedItem(null);
      return;
    }

    // Tiến hành mua hàng
    sound.playLevelUp();
    sound.playReward();

    if (selectedItem.type === 'real_gift') {
      onPurchaseRealGift(selectedItem);
      setSuccessMsg(`Đổi quà thành công! Đã lưu mã nhận quà "${selectedItem.name}". Hãy đến quầy văn thư gặp thầy cô Sao Việt để nhận quà nhé.`);
    } else {
      onPurchaseItem(selectedItem);
      setSuccessMsg(`Chúc mừng! Em đã mở khóa thành công trang bị võ học "${selectedItem.name}" cực ngầu.`);
    }

    setShowSuccessModal(true);
    setSelectedItem(null);
  };

  const getRarityBadge = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-zinc-800 text-zinc-400';
      case 'rare': return 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
      case 'epic': return 'bg-purple-500/10 text-purple-400 border border-purple-500/20';
      case 'legendary': return 'bg-amber-500/20 text-amber-400 border border-amber-500/30';
      default: return 'bg-zinc-700';
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'border-zinc-800 bg-zinc-950/40 text-zinc-400';
      case 'rare': return 'border-blue-500/40 bg-blue-950/30 text-blue-400';
      case 'epic': return 'border-purple-500/40 bg-purple-950/30 text-purple-400';
      case 'legendary': return 'border-amber-400/40 bg-amber-950/30 text-amber-400';
      default: return 'border-zinc-800 bg-slate-900';
    }
  };

  return (
    <div className="p-4 max-w-6xl mx-auto" id="shop-wrapper">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-black text-indigo-950 font-sans tracking-wide uppercase flex items-center justify-center gap-2">
          🏪 CỬA HÀNG ĐỔI THƯỞNG SAO VIỆT
        </h2>
        <p className="text-sm text-slate-700 mt-1 font-medium">
          Dùng Vàng và Kim cương tích lũy từ học tập để sắm trang bị hoặc quy đổi QUÀ THẬT ĐỜI THỰC tại Trung tâm nhé!
        </p>
      </div>

      {/* Tabs thanh chọn */}
      <div className="flex justify-center gap-3 mb-8" id="shop-tabs">
        <button
          onClick={() => {
            sound.playClick();
            setActiveTab('virtual');
          }}
          className={`px-5 py-2.5 rounded-xl font-black text-xs uppercase cursor-pointer border transition ${
            activeTab === 'virtual'
              ? 'bg-indigo-600 text-white border-indigo-500 shadow-md'
              : 'bg-white/55 border-white/45 text-slate-700 hover:text-indigo-950'
          }`}
        >
          ⚔️ Trang Bị Ảo RPG
        </button>
        <button
          onClick={() => {
            sound.playClick();
            setActiveTab('real');
          }}
          className={`px-5 py-2.5 rounded-xl font-black text-xs uppercase cursor-pointer border transition ${
            activeTab === 'real'
              ? 'bg-indigo-600 text-white border-indigo-500 shadow-md'
              : 'bg-white/55 border-white/45 text-slate-700 hover:text-indigo-950'
          }`}
        >
          🎁 Quà Tặng Đời Thực
        </button>
        <button
          onClick={() => {
            sound.playClick();
            setActiveTab('history');
          }}
          className={`px-5 py-2.5 rounded-xl font-black text-xs uppercase cursor-pointer border transition flex items-center gap-1.5 ${
            activeTab === 'history'
              ? 'bg-indigo-600 text-white border-indigo-500 shadow-md'
              : 'bg-white/55 border-white/45 text-slate-700 hover:text-indigo-950'
          }`}
        >
          <History className="w-4 h-4" /> Lịch sử đổi quà ({purchaseHistory.length})
        </button>
      </div>

      {/* HIỂN THỊ DANH SÁCH SẢN PHẨM */}
      <AnimatePresence mode="wait">
        {activeTab === 'virtual' && (
          <motion.div
            key="virtual-grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            id="virtual-list"
          >
            {virtualItems.map((item) => {
              const owned = player.inventory.includes(item.id);

              return (
                <div
                  key={item.id}
                  className={`relative p-5 rounded-3xl border bg-white/55 backdrop-blur-md shadow-md flex flex-col justify-between`}
                  id={`shop-item-${item.id}`}
                >
                  <div className="text-slate-900">
                    {/* Badge Rarity */}
                    <div className="flex justify-between items-center mb-3">
                      <span className={`text-[9px] font-black font-mono tracking-widest uppercase px-2 py-0.5 rounded ${getRarityBadge(item.rarity)}`}>
                        {item.rarity}
                      </span>
                      {owned && (
                        <span className="bg-emerald-100 text-emerald-800 font-black text-[9px] px-2 py-0.5 rounded border border-emerald-300 uppercase">
                          Đã sở hữu
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="text-5xl filter drop-shadow select-none">{item.image}</span>
                      <div>
                        <h3 className="font-extrabold text-sm text-indigo-950">{item.name}</h3>
                        <p className="text-xs text-slate-600 mt-1 leading-relaxed line-clamp-2 font-medium">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    {/* Dòng bonus stats */}
                    {item.statsEffect && (
                      <div className="mt-4 bg-white/40 p-2 rounded-xl border border-white/50 grid grid-cols-2 gap-x-2 text-[10px] font-sans shadow-inner">
                        {item.statsEffect.attack && <span className="text-amber-700 font-bold">⚔️ ATK +{item.statsEffect.attack}</span>}
                        {item.statsEffect.defense && <span className="text-indigo-800 font-bold">🛡️ DEF +{item.statsEffect.defense}</span>}
                        {item.statsEffect.intelligence && <span className="text-indigo-800 font-bold">🔮 INT +{item.statsEffect.intelligence}</span>}
                        {item.statsEffect.luck && <span className="text-emerald-700 font-bold">🍀 LUK +{item.statsEffect.luck}</span>}
                      </div>
                    )}
                  </div>

                  <div className="mt-5 pt-3 border-t border-white/40 flex justify-between items-center">
                    <div className="flex items-center gap-1 font-mono font-black">
                      <span>{item.currency === 'gold' ? '🪙' : '💎'}</span>
                      <span className={`text-md ${item.currency === 'gold' ? 'text-amber-700' : 'text-rose-600'}`}>
                        {item.price.toLocaleString()}
                      </span>
                    </div>

                    <button
                      disabled={owned}
                      onClick={() => handleBuyClick(item)}
                      className={`px-4 py-2 border rounded-xl text-xs font-black transition cursor-pointer disabled:opacity-40 select-none ${
                        owned 
                          ? 'bg-white/40 border-white/20 text-slate-400' 
                          : 'bg-indigo-600 hover:bg-indigo-700 border-indigo-500 text-white'
                      }`}
                    >
                      {owned ? 'Đã sắm' : 'Mua ngay'}
                    </button>
                  </div>
                </div>
              );
            })}
          </motion.div>
        )}

        {activeTab === 'real' && (
          <motion.div
            key="real-grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            id="real-list"
          >
            {realGifts.map((item) => (
              <div
                key={item.id}
                className="p-5 rounded-3xl border border-white/50 bg-white/55 backdrop-blur-md shadow-md flex flex-col justify-between"
                id={`shop-real-${item.id}`}
              >
                <div className="text-slate-900">
                  <div className="flex justify-between items-center mb-3">
                    <span className="bg-indigo-100 text-indigo-800 border border-indigo-200 text-[9px] font-black tracking-widest uppercase px-2 py-0.5 rounded">
                      QUÀ THẬT SAO VIỆT
                    </span>
                    <span className="text-[10px] text-slate-500 font-bold italic">Nhận tại quầy</span>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-5xl filter drop-shadow select-none">{item.image}</span>
                    <div>
                      <h3 className="font-extrabold text-sm text-indigo-950">{item.name}</h3>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed line-clamp-3 leading-tight font-sans font-medium">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-white/45 flex justify-between items-center">
                  <div className="flex items-center gap-1 font-mono font-black text-amber-700 text-md">
                    <span>🪙</span>
                    <span>{item.price.toLocaleString()}</span>
                  </div>

                  <button
                    onClick={() => handleBuyClick(item)}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 border border-indigo-550 text-white rounded-xl text-xs font-black shadow-md transition cursor-pointer"
                  >
                    Đổi Quà Thật
                  </button>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {activeTab === 'history' && (
          <motion.div
            key="history-list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="max-w-3xl mx-auto space-y-4"
          >
            {purchaseHistory.length > 0 ? (
              purchaseHistory.map((hist) => (
                <div
                  key={hist.id}
                  className="p-4 bg-white/55 backdrop-blur-md rounded-2xl border border-white/50 shadow flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  id={`purchase-hist-${hist.id}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-white/60 flex items-center justify-center text-2xl border border-white select-none">
                      🎁
                    </div>
                    <div>
                      <h4 className="font-black text-sm text-indigo-950">{hist.name}</h4>
                      <p className="text-[10px] text-slate-600 font-mono font-bold mt-0.5">
                        Ngày đổi: {hist.date} | Mã xác minh: <strong className="text-indigo-600">{hist.code}</strong>
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 w-full sm:w-auto text-right">
                    <span className="inline-flex items-center justify-center gap-1.5 bg-amber-100 border border-amber-300 text-amber-800 font-extrabold text-xs px-3 py-1.5 rounded-xl select-none cursor-default font-sans w-full sm:w-auto">
                      <HeartHandshake className="w-4 h-4 text-amber-700" /> CHỜ NHẬN QUÀ THẬT
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="h-44 flex flex-col items-center justify-center text-center text-slate-600 border border-white/50 rounded-2xl bg-white/30 p-4">
                <span className="text-3xl">📭</span>
                <span className="text-xs font-bold mt-2 text-indigo-950">Chưa có lịch sử đổi quà đời thực.</span>
                <span className="text-[10px] text-slate-500 mt-1 font-bold">Hãy thu thập thật nhiều Vàng chăm chỉ để đổi lấy Sticker, Kẻ thước hay Áo Sao Việt nhé!</span>
              </div>
            )}
            
            <div className="bg-white/40 p-4 rounded-2xl border border-white/50 flex gap-3 text-xs leading-normal font-sans text-slate-700 font-medium max-w-2xl mx-auto shadow-inner">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <p>
                <strong>Hướng dẫn học viên:</strong> Để nhận quà thực tế, em chỉ cần mang điện thoại hoặc máy tính đến tìm thầy cô ở bàn Lễ tân Trung tâm Sao Việt và đưa cho thầy cô xem mục <strong>Lịch sử đổi quà</strong> này. Thầy cô sẽ kiểm tra mã xác minh và trao tận tay phần thưởng thật cho em nhé!
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL MUA XÁC NHẬN MỤC TIÊU */}
      <AnimatePresence>
        {selectedItem && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm bg-white/90 backdrop-blur-xl border border-white rounded-3xl p-6 text-center shadow-2xl"
            >
              <span className="text-6xl filter drop-shadow select-none">{selectedItem.image}</span>
              <h3 className="text-lg font-black text-indigo-950 mt-3 leading-tight">{selectedItem.name}</h3>
              <p className="text-xs text-slate-600 mt-2 font-sans font-medium px-4">
                Em có chắc chắn muốn bỏ ra <strong className="text-amber-750 text-indigo-950">{selectedItem.price.toLocaleString()} {selectedItem.currency === 'gold' ? 'Vàng' : 'Kim cương'}</strong> để đổi lấy vật phẩm này không?
              </p>

              <div className="grid grid-cols-2 gap-3 mt-6">
                <button
                  onClick={() => {
                    sound.playClick();
                    setSelectedItem(null);
                  }}
                  className="py-2.5 border border-slate-200 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-50 hover:text-slate-900 transition cursor-pointer"
                >
                  Bỏ qua
                </button>
                <button
                  onClick={confirmPurchase}
                  className="py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-xl text-xs uppercase cursor-pointer shadow-md"
                >
                  Xác nhận đổi
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL THÔNG BÁO THÀNH CÔNG RỰC RỠ */}
      <AnimatePresence>
        {showSuccessModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm bg-white/95 backdrop-blur-xl border border-white rounded-3xl p-6 text-center shadow-2xl"
            >
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3 border border-emerald-300">
                <Check className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-lg font-black text-emerald-800 uppercase">Đổi Quà Thành Công!</h3>
              <p className="text-xs text-slate-700 mt-2 leading-relaxed font-sans font-medium px-2">
                {successMsg}
              </p>

              <button
                onClick={() => {
                  sound.playClick();
                  setShowSuccessModal(false);
                }}
                className="mt-6 w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-black tracking-wider uppercase rounded-xl text-xs cursor-pointer shadow-lg transition"
              >
                Nhận lấy & Trở lại
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
