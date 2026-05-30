/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Player, Mail } from '../types';
import { sound } from './SoundManager';
import { motion, AnimatePresence } from 'motion/react';
import { MailOpen, Mail as MailClosed, Calendar, Trash2, Gift, Send, X, Check } from 'lucide-react';

interface MailboxProps {
  player: Player;
  mails: Mail[];
  onReadMail: (mailId: string) => void;
  onClaimMailReward: (mailId: string, reward: { gold?: number; gem?: number }) => void;
  onDeleteMail: (mailId: string) => void;
}

export default function Mailbox({ player, mails, onReadMail, onClaimMailReward, onDeleteMail }: MailboxProps) {
  const [selectedMail, setSelectedMail] = useState<Mail | null>(null);

  const handleRead = (mail: Mail) => {
    sound.playClick();
    onReadMail(mail.id);
    setSelectedMail(mail);
  };

  const handleClaim = (mail: Mail) => {
    if (!mail.reward) return;
    sound.playReward();
    sound.playLevelUp();
    onClaimMailReward(mail.id, mail.reward);
    setMailClaimStatus(mail.id);
  };

  const setMailClaimStatus = (mailId: string) => {
    if (selectedMail && selectedMail.id === mailId) {
      // Cập nhật trạng thái nhận ngay trong UI Chi Tiết
      setSelectedMail((prev) => prev ? { ...prev } : null);
    }
  };

  const isRead = (id: string) => player.mailRead.includes(id);
  const isClaimed = (id: string) => player.mailClaimed.includes(id);

  return (
    <div className="p-4 max-w-4xl mx-auto" id="mailbox-wrapper">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-black text-indigo-950 font-sans tracking-wide uppercase flex items-center justify-center gap-2">
          📬 HÒM THƯ KHUYẾN HỌC SAO VIỆT
        </h2>
        <p className="text-sm text-slate-700 mt-1 font-medium">
          Nhận các thông báo, thư khen ngợi thi đua và bưu kiện chứa kim cương, kẹo Pet từ thầy cô giáo chủ nhiệm quý mến!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6" id="mailbox-grid">
        
        {/* CỘT TRÁI: DANH SÁCH THƯ (Col-span-7) */}
        <div className="md:col-span-7 space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar" id="mails-list">
          {mails.length > 0 ? (
            mails.map((mail) => {
              const read = isRead(mail.id);
              const claimed = isClaimed(mail.id);
              const active = selectedMail?.id === mail.id;

              return (
                <div
                  key={mail.id}
                  onClick={() => handleRead(mail)}
                  className={`p-4 rounded-xl border transition cursor-pointer flex items-center justify-between gap-3 ${
                    active
                      ? 'border-indigo-400 bg-indigo-50/75 text-indigo-950 font-black shadow-sm'
                      : read
                      ? 'border-white/30 bg-white/30 text-slate-600 hover:border-slate-300'
                      : 'border-indigo-200 bg-indigo-50/30 text-indigo-950 font-extrabold hover:bg-indigo-50/50'
                  }`}
                  id={`mail-card-${mail.id}`}
                >
                  <div className="flex items-center gap-3 truncate">
                    <span className="text-2xl shrink-0">
                      {read ? <MailOpen className="w-5 h-5 text-slate-500" /> : <MailClosed className="w-5 h-5 text-indigo-600 animate-pulse" />}
                    </span>
                    <div className="truncate">
                      <h4 className={`text-xs truncate ${read ? 'font-medium text-slate-650' : 'font-extrabold text-indigo-950'}`}>
                        {mail.title}
                      </h4>
                      <p className="text-[10px] text-slate-500 mt-0.5 truncate font-sans font-bold">
                        Gửi từ: {mail.sender} | {mail.date}
                      </p>
                    </div>
                  </div>

                  {mail.reward && (
                    <div className="shrink-0 flex items-center">
                      <span className={`text-lg filter drop-shadow select-none ${claimed ? 'opacity-40' : 'animate-bounce'}`}>
                        🎁
                      </span>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="h-44 flex flex-col items-center justify-center text-center text-slate-500 border border-white/30 rounded-2xl bg-white/20 p-4">
              <span className="text-4xl">📭</span>
              <span className="text-xs font-bold mt-2 text-indigo-950">Hòm thư hiện tại trống rỗng.</span>
              <span className="text-[10px] text-slate-500 mt-1 font-bold">Thường xuyên vượt ải và chờ đợi thư bổ ích từ thầy cô gửi đến nhé!</span>
            </div>
          )}
        </div>

        {/* CỘT PHẢI: CHI TIẾT THƯ ĐỌC (Col-span-5) */}
        <div className="md:col-span-12 lg:col-span-5 bg-white/55 backdrop-blur-md border border-white/50 rounded-3xl p-5 flex flex-col justify-between shadow-md" id="mail-reader-view">
          {selectedMail ? (
            <div className="space-y-4 flex flex-col h-full justify-between">
              
              <div className="space-y-3">
                {/* Meta thư */}
                <div className="border-b border-white/35 pb-3">
                  <span className="text-[10px] font-mono font-black text-slate-500 uppercase flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" /> Thống kê bưu kiện | {selectedMail.date}
                  </span>
                  <h3 className="text-sm font-black text-indigo-950 mt-1.5 leading-snug">
                    {selectedMail.title}
                  </h3>
                  <p className="text-[10px] text-indigo-600 font-sans mt-1 font-bold">
                    Người gửi: <strong>{selectedMail.sender}</strong>
                  </p>
                </div>

                {/* Nội dung chính */}
                <p className="text-xs text-slate-800 leading-relaxed font-sans tracking-wide bg-white/45 p-3 rounded-xl border border-white/45 whitespace-pre-line font-medium shadow-inner">
                  {selectedMail.content}
                </p>

                {/* Phần bưu phẩm đính kèm */}
                {selectedMail.reward && (
                  <div className="bg-white/40 p-3 rounded-xl border border-white/45 flex items-center justify-between shadow-sm">
                    <div>
                      <span className="block text-[8px] text-slate-500 uppercase font-mono font-black">VẬT PHẨM ĐÍNH KÈM:</span>
                      <div className="flex gap-3 text-xs font-bold mt-1.5 font-mono">
                        {selectedMail.reward.gold && <span className="text-amber-700 font-black">🪙 +{selectedMail.reward.gold} Vàng</span>}
                        {selectedMail.reward.gem && <span className="text-rose-600 font-black">💎 +{selectedMail.reward.gem} KC</span>}
                      </div>
                    </div>

                    <div>
                      {isClaimed(selectedMail.id) ? (
                        <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-[10px] px-3 py-1.5 rounded-lg border border-emerald-200 select-none cursor-default font-bold">
                          ĐÃ NHẬN
                        </span>
                      ) : (
                        <button
                          onClick={() => handleClaim(selectedMail)}
                          className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-[10px] uppercase rounded-lg border border-indigo-500 cursor-pointer shadow-sm"
                        >
                          🎁 Nhận quà
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Nút xóa thư */}
              <div className="pt-4 border-t border-white/35 flex justify-end">
                <button
                  onClick={() => {
                    sound.playClick();
                    onDeleteMail(selectedMail.id);
                    setSelectedMail(null);
                  }}
                  className="flex items-center gap-1 text-[11px] font-black text-rose-600 hover:text-rose-700 cursor-pointer"
                  title="Xóa thư này"
                >
                  <Trash2 className="w-4 h-4" /> Xóa thư khỏi hòm
                </button>
              </div>

            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center text-slate-500 p-6 font-bold">
              <span className="text-4xl">📬</span>
              <span className="text-xs font-semibold text-indigo-950 mt-2.5">Hãy chọn một bức thư ở cột trái để bóc đọc nội dung và nhận quà đính kèm nhé!</span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
