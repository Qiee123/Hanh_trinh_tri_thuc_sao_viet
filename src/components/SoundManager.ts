/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

class SoundManager {
  private ctx: AudioContext | null = null;
  private bgmOscillator: OscillatorNode | null = null;
  private bgmGain: GainNode | null = null;
  private isMuted: boolean = false;
  private isBgmPlaying: boolean = false;
  private bgmIntervalId: any = null;

  constructor() {
    // Trì hoãn khởi tạo AudioContext cho đến khi tương tác người dùng
  }

  private initCtx() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMute(mute: boolean) {
    this.isMuted = mute;
    if (mute) {
      this.stopBgm();
    } else {
      if (this.isBgmPlaying) {
        this.playBgm();
      }
    }
  }

  public getMutedState(): boolean {
    return this.isMuted;
  }

  // Phát nhạc nền RPG nhẹ nhàng bằng chuỗi nốt tổng hợp
  public playBgm() {
    this.isBgmPlaying = true;
    if (this.isMuted) return;

    try {
      this.initCtx();
      this.stopBgm(); // Reset trước khi chạy

      const ctx = this.ctx!;
      const notes = [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25]; // Đô Rê Mi Pha Sol La Si Đô
      // Chuỗi giai điệu RPG thanh bình
      const melody = [2, 4, 5, 4, 2, 0, 1, 2, 4, 3, 2, 1, 0, 2, 4, 7];
      let melodyIndex = 0;

      const playNextTone = () => {
        if (!this.isBgmPlaying || this.isMuted) return;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        // Lấy nốt từ giai điệu
        const freq = notes[melody[melodyIndex % melody.length]];
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        const duration = 0.8; // độ dài nốt nhạc
        gain.gain.setValueAtTime(0.04, ctx.currentTime); // Âm lượng cực nhỏ nhẹ để không phiền học sinh
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration - 0.05);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + duration);

        melodyIndex++;
        this.bgmIntervalId = setTimeout(playNextTone, duration * 1000);
      };

      playNextTone();
    } catch (e) {
      console.warn("AudioContext failed to startbgm: ", e);
    }
  }

  public stopBgm() {
    if (this.bgmIntervalId) {
      clearTimeout(this.bgmIntervalId);
      this.bgmIntervalId = null;
    }
    if (this.bgmOscillator) {
      try {
        this.bgmOscillator.stop();
      } catch {}
      this.bgmOscillator = null;
    }
    if (this.bgmGain) {
      this.bgmGain.disconnect();
      this.bgmGain = null;
    }
  }

  // Âm click nút giòn giã
  public playClick() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      const ctx = this.ctx!;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(450, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.1);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.12);
    } catch {}
  }

  // Trả lời đúng (Bíp bíp dồn dập tích cực)
  public playCorrect() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      const ctx = this.ctx!;
      
      const playTone = (freq: number, startDelay: number, duration: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + startDelay);
        gain.gain.setValueAtTime(0.08, ctx.currentTime + startDelay);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + startDelay + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + startDelay);
        osc.stop(ctx.currentTime + startDelay + duration);
      };

      playTone(523.25, 0, 0.15); // Đô
      playTone(659.25, 0.1, 0.25); // Mi
    } catch {}
  }

  // Trả lời sai (u u út u sầu)
  public playIncorrect() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      const ctx = this.ctx!;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(180, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(100, ctx.currentTime + 0.3);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } catch {}
  }

  // Kiếm chém xẹt xẹt (chiến đấu Boss)
  public playAttack() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      const ctx = this.ctx!;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(80, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.2);

      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.22);
    } catch {}
  }

  // Nhận thưởng lấp lánh (tiền vàng rơi leng keng)
  public playReward() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      const ctx = this.ctx!;
      const playCoin = (delay: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(987.77, ctx.currentTime + delay); // Si (B5)
        gain.gain.setValueAtTime(0.06, ctx.currentTime + delay);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 0.15);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + delay);
        osc.stop(ctx.currentTime + delay + 0.15);
      };
      playCoin(0);
      playCoin(0.08);
      playCoin(0.16);
    } catch {}
  }

  // Lên cấp hoành tráng (Chùm âm thanh thăng hoa)
  public playLevelUp() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      const ctx = this.ctx!;
      const tones = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50]; // Đô - Mi - Sol - Đô - Mi - Sol - Đô (C4 to C6)
      tones.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);
        gain.gain.setValueAtTime(0.08, ctx.currentTime + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.08 + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.08);
        osc.stop(ctx.currentTime + idx * 0.08 + 0.3);
      });
    } catch {}
  }
}

export const sound = new SoundManager();
