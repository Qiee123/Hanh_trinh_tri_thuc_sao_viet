/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Player, ShopItem } from '../types';
import { SHOP_ITEMS } from '../data/gameData';
import { sound } from './SoundManager';
import { motion } from 'motion/react';
import { Swords, Shield, Sparkles, Star, Plus, Eye, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';

interface InventoryProps {
  player: Player;
  onEquipItem: (itemId: string, itemType: 'weapon' | 'armor' | 'shield' | 'ring') => void;
  onUnequipItem: (itemType: 'weapon' | 'armor' | 'shield' | 'ring') => void;
}

export default function Inventory({ player, onEquipItem, onUnequipItem }: InventoryProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'weapon' | 'armor' | 'shield' | 'ring'>('all');
  const [selectedItem, setSelectedItem] = useState<ShopItem | null>(null);

  // Lấy danh sách item thực tế của người chơi từ list ID
  const playerItems = player.inventory
    .map((id) => SHOP_ITEMS.find((s) => s.id === id)!)
    .filter(Boolean);

  const filteredItems = playerItems.filter((it) => {
    if (activeTab === 'all') return true;
    return it.type === activeTab;
  });

  const handleItemClick = (it: ShopItem) => {
    sound.playClick();
    setSelectedItem(it);
  };

  const handleEquipAndClick = (it: ShopItem) => {
    sound.playLevelUp();
    if (it.type === 'weapon' || it.type === 'armor' || it.type === 'shield' || it.type === 'ring') {
      onEquipItem(it.id, it.type);
    }
  };

  const handleUnequipAndClick = (type: 'weapon' | 'armor' | 'shield' | 'ring') => {
    sound.playClick();
    onUnequipItem(type);
  };

  const getEquippedItem = (slot: 'weapon' | 'armor' | 'shield' | 'ring') => {
    const itemId = player.equipped[slot];
    if (!itemId) return null;
    return SHOP_ITEMS.find((s) => s.id === itemId) || null;
  };

  const isEquipped = (itemId: string) => {
    return Object.values(player.equipped).includes(itemId);
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'border-zinc-700 bg-zinc-900/60 text-zinc-400';
      case 'rare': return 'border-blue-500 bg-blue-950/40 text-blue-400';
      case 'epic': return 'border-purple-500 bg-purple-950/40 text-purple-400';
      case 'legendary': return 'border-amber-400 bg-amber-950/40 text-amber-400';
      default: return 'border-zinc-800 bg-slate-900';
    }
  };

  const getRarityLabel = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'Thường';
      case 'rare': return 'Hiếm';
      case 'epic': return 'Sử Thi';
      case 'legendary': return 'Huyền Thoại';
      default: return '';
    }
  };

  return (
    <div className="p-4 max-w-6xl mx-auto" id="inventory-wrapper">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-black text-indigo-950 font-sans tracking-wide uppercase flex items-center justify-center gap-2">
          🎒 THƯ KHỐ TRANG BỊ & BALO
        </h2>
        <p className="text-sm text-slate-700 mt-1 font-medium">
          Trang bị vũ khí thần binh, khiên bảo hộ siêng năng để gia tăng chỉ số đấu Boss dễ dàng.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="inventory-main-grid">
        
        {/* KHU VỰC 1: TRANG BỊ ĐANG MẶC TRÊN NGƯỜI (4 SLOTS) - (Lg: col-span-4) */}
        <div className="lg:col-span-4 bg-white/55 backdrop-blur-md rounded-2xl border border-white/50 p-5 flex flex-col justify-between shadow-md" id="equipped-equipment-display">
          <div>
            <h3 className="font-extrabold text-sm text-indigo-950 uppercase tracking-wider mb-4 border-b border-white/40 pb-2 flex items-center gap-1">
              <Swords className="w-4 h-4 text-indigo-600" /> TRANG BỊ TRÊN NGƯỜI
            </h3>

            {/* Thống kê chỉ số nhân vật đã cộng phụ trội */}
            <div className="bg-white/40 p-4 rounded-xl border border-white/40 space-y-2.5 mb-6 shadow-inner text-slate-900">
              <span className="block text-[10px] text-slate-500 uppercase font-mono font-black leading-none mb-1">CHỈ SỐ SỨC MẠNH:</span>
              <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
                <div className="flex justify-between border-b border-white/30 pb-1">
                  <span className="text-slate-500">⚔️ Tấn công:</span>
                  <span className="font-mono text-indigo-950 font-black">{player.stats.attack}</span>
                </div>
                <div className="flex justify-between border-b border-white/30 pb-1">
                  <span className="text-slate-500">🛡️ Phòng thủ:</span>
                  <span className="font-mono text-indigo-950 font-black">{player.stats.defense}</span>
                </div>
                <div className="flex justify-between border-b border-white/30 pb-1">
                  <span className="text-slate-500">🔮 Trí tuệ:</span>
                  <span className="font-mono text-indigo-950 font-black">{player.stats.intelligence}</span>
                </div>
                <div className="flex justify-between border-b border-white/30 pb-1">
                  <span className="text-slate-500">🍀 May mắn:</span>
                  <span className="font-mono text-indigo-950 font-black">{player.stats.luck}</span>
                </div>
              </div>
            </div>

            {/* Slots trang bị hình ảnh */}
            <div className="grid grid-cols-2 gap-4" id="equipped-grid">
              {(['weapon', 'armor', 'shield', 'ring'] as const).map((slot) => {
                const item = getEquippedItem(slot);
                const slotNameMap = {
                  weapon: 'Vũ Khí ⚔️',
                  armor: 'Áo Giáp 🧥',
                  shield: 'Khiên bảo hộ 🔰',
                  ring: 'Trang Sức 💍'
                };

                return (
                  <div key={slot} className="bg-white/40 p-3 rounded-2xl border border-white/40 flex flex-col items-center justify-center text-center relative group">
                    <span className="text-[10px] text-slate-500 font-bold block mb-2">{slotNameMap[slot]}</span>
                    {item ? (
                      <>
                        <span className="text-3.5xl filter drop-shadow">{item.image}</span>
                        <span className="text-[10px] text-indigo-950 mt-2 truncate max-w-[100px] font-black">{item.name}</span>
                        <button
                          onClick={() => handleUnequipAndClick(slot)}
                          className="mt-2.5 px-2 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-[8px] font-black cursor-pointer transition uppercase"
                        >
                          Tháo ra
                        </button>
                      </>
                    ) : (
                      <div className="h-16 flex items-center justify-center text-2xl text-slate-300 select-none">
                        ❌
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          <p className="text-[9px] text-slate-500 font-bold italic mt-4 text-center">
            * Nhận trang bị mới từ Điển Tích Cửa Hàng hoặc rương quà thành tích.
          </p>
        </div>

        {/* KHU VỰC 2: BALO VẬT PHẨM (Lg: col-span-8) */}
        <div className="lg:col-span-8 bg-white/55 backdrop-blur-md rounded-2xl border border-white/50 p-5 flex flex-col shadow-md" id="inventory-items-grid">
          
          {/* Tabs Filter */}
          <div className="flex flex-wrap gap-2 border-b border-white/30 pb-3 mb-4">
            {(['all', 'weapon', 'armor', 'shield', 'ring'] as const).map((tab) => {
              const labelMap = { all: 'Tất cả Balo', weapon: 'Vũ khí', armor: 'Giáp', shield: 'Khiên bảo vệ', ring: 'Trang sức' };
              return (
                <button
                  key={tab}
                  onClick={() => {
                    sound.playClick();
                    setActiveTab(tab);
                    setSelectedItem(null);
                  }}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-black border transition cursor-pointer ${
                    activeTab === tab
                      ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                      : 'bg-white/50 border-white/35 text-slate-705 hover:text-indigo-950'
                  }`}
                >
                  {labelMap[tab]}
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
            {/* LƯỚI DANH SÁCH ITEMS */}
            <div className="grid grid-cols-4 gap-2.5 max-h-[340px] overflow-y-auto pr-1.5 custom-scrollbar align-start" id="inventory-grid-list">
              {filteredItems.length > 0 ? (
                filteredItems.map((it, idx) => {
                  const equipped = isEquipped(it.id);
                  const rarityStyle = getRarityColor(it.rarity);

                  return (
                    <button
                      key={`${it.id}-${idx}`}
                      onClick={() => handleItemClick(it)}
                      className={`h-16 flex items-center justify-center text-3xl rounded-2xl border-2 bg-white/40 backdrop-blur-sm transition transform relative hover:scale-105 active:scale-95 cursor-pointer ${rarityStyle} ${
                        selectedItem?.id === it.id ? 'ring-2 ring-indigo-500' : ''
                      }`}
                    >
                      {it.image}
                      {equipped && (
                        <span className="absolute -top-1.5 -right-1.5 bg-emerald-500 text-white rounded-full w-4 h-4 flex items-center justify-center border border-white text-[8px] font-black" title="Đang mang">
                          E
                        </span>
                      )}
                    </button>
                  );
                })
              ) : (
                <div className="col-span-4 h-44 flex flex-col items-center justify-center text-center text-slate-500 border border-white/30 rounded-2xl bg-white/20 p-4">
                  <span className="text-3xl">🎒</span>
                  <span className="text-xs font-bold mt-2 text-indigo-950">Balo của em hiện tại trống rỗng.</span>
                  <span className="text-[10px] text-slate-500 mt-1 font-bold">Hãy tích lũy Vàng và ghé thăm Cửa Hàng để sắm sửa nhé!</span>
                </div>
              )}
            </div>

            {/* BẢNG CHI TIẾT VẬT PHẨM ĐƯỢC CHỌN TRÊN GRID */}
            <div className="bg-white/55 p-4 rounded-2xl border border-white/50 flex flex-col justify-between shadow-sm" id="item-details-view">
              {selectedItem ? (
                <div className="space-y-4 flex flex-col h-full justify-between">
                  <div className="space-y-2">
                    <div className="flex gap-3 items-center">
                      <div className={`w-12 h-12 flex items-center justify-center text-3xl border-2 rounded-2xl bg-white/40`}>
                        {selectedItem.image}
                      </div>
                      <div>
                        <h4 className="font-extrabold text-sm text-indigo-950 leading-tight">{selectedItem.name}</h4>
                        <span className="text-[9px] uppercase font-mono tracking-wider font-black text-indigo-600">
                          {getRarityLabel(selectedItem.rarity)}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 font-medium leading-relaxed font-sans mt-2">
                      {selectedItem.description}
                    </p>

                    {/* Hiển thị dòng bonus chỉ số của item */}
                    {selectedItem.statsEffect && (
                      <div className="pt-2 bg-white/40 p-2.5 rounded-xl border border-white/50 shadow-inner">
                        <span className="block text-[8px] text-slate-500 uppercase font-mono font-black mb-1">CỘNG HƯỞNG CHỈ SỐ:</span>
                        <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 text-[10px] font-mono">
                          {selectedItem.statsEffect.attack && <span className="text-amber-700 font-bold">⚔️ Tấn công +{selectedItem.statsEffect.attack}</span>}
                          {selectedItem.statsEffect.defense && <span className="text-indigo-800 font-bold">🛡️ Phòng thủ +{selectedItem.statsEffect.defense}</span>}
                          {selectedItem.statsEffect.intelligence && <span className="text-indigo-800 font-bold">🔮 Trí lực +{selectedItem.statsEffect.intelligence}</span>}
                          {selectedItem.statsEffect.luck && <span className="text-emerald-700 font-bold">🍀 May mắn +{selectedItem.statsEffect.luck}</span>}
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    {isEquipped(selectedItem.id) ? (
                      <button
                        onClick={() => handleUnequipAndClick(selectedItem.type as any)}
                        className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 border border-rose-500 font-bold text-white rounded-xl text-xs uppercase cursor-pointer shadow-md"
                      >
                        Tháo trang bị ra
                      </button>
                    ) : (
                      <button
                        onClick={() => handleEquipAndClick(selectedItem)}
                        className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 font-black text-white rounded-xl text-xs uppercase cursor-pointer flex items-center justify-center gap-1 shadow-md"
                      >
                        <CheckCircle2 className="w-4 h-4" /> TRANG BỊ VẬT PHẨM
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center text-slate-500 p-4 font-bold">
                  <span className="text-4xl">🔍</span>
                  <span className="text-xs font-semibold text-indigo-950 mt-2">Hãy chạm vào bất kỳ vật phẩm nào trong balo để xem sức mạnh tác dụng.</span>
                </div>
              )}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
