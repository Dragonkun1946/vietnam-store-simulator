import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, Calendar, DollarSign, Star, TrendingUp, Plus } from 'lucide-react';
import { SAVE_SLOTS, formatMoney } from '../data/gameData';
import type { SaveSlot } from '../types/game';

interface Props {
  open: boolean;
  onClose: () => void;
  onLoad: (slot: SaveSlot) => void;
}

function SlotCard({ slot, onLoad, index }: { slot: SaveSlot; onLoad: (s: SaveSlot) => void; index: number }) {
  if (slot.isEmpty) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0, transition: { delay: index * 0.1 + 0.2 } }}
        className="group relative rounded cursor-pointer overflow-hidden h-40"
        style={{
          background: 'rgba(8, 18, 35, 0.6)',
          border: '1px dashed rgba(0, 212, 255, 0.15)',
          backdropFilter: 'blur(8px)',
        }}
        whileHover={{ scale: 1.01, borderColor: 'rgba(0,212,255,0.35)' }}
        onClick={() => onLoad(slot)}
      >
        <div className="flex flex-col items-center justify-center h-full gap-2 opacity-30 group-hover:opacity-60 transition-opacity">
          <Plus size={28} className="text-[#00d4ff]" />
          <span className="text-[#00d4ff] text-sm tracking-widest uppercase" style={{ fontFamily: '"Rajdhani", sans-serif' }}>
            Slot trống
          </span>
        </div>
        <div
          className="absolute bottom-2 right-3 text-[10px] tracking-widest text-[#1a2e3e]"
          style={{ fontFamily: '"Rajdhani", sans-serif' }}
        >
          SLOT {slot.id}
        </div>
      </motion.div>
    );
  }

  const popLevel = slot.popularity ?? 0;
  const popColor = popLevel > 70 ? '#00ff88' : popLevel > 40 ? '#ffcc00' : '#ff6644';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0, transition: { delay: index * 0.1 + 0.2 } }}
      className="group relative rounded overflow-hidden cursor-pointer h-40"
      style={{
        background: 'rgba(6, 14, 28, 0.85)',
        border: '1px solid rgba(0, 212, 255, 0.2)',
        backdropFilter: 'blur(12px)',
      }}
      whileHover={{ scale: 1.01 }}
      onClick={() => onLoad(slot)}
    >
      {/* Hover glow */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: 'linear-gradient(135deg, rgba(0,212,255,0.06), transparent)' }}
      />

      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#00d4ff60] to-transparent" />

      {/* Thumbnail area */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, #030810 0%, #061525 40%, #0a1e30 100%)',
          }}
        />
        {/* Mini store icon in bg */}
        <div className="absolute inset-0 flex items-center justify-center opacity-5">
          <span className="text-8xl">🏪</span>
        </div>
        {/* Neon street lights effect */}
        <div className="absolute bottom-0 left-0 right-0 h-16"
          style={{ background: 'linear-gradient(to top, #0a1520, transparent)' }}
        />
        <div className="absolute bottom-4 left-1/4 w-8 h-8 rounded-full bg-[#ff3366]/20 blur-xl" />
        <div className="absolute bottom-4 right-1/3 w-8 h-8 rounded-full bg-[#00d4ff]/20 blur-xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 p-4 flex flex-col justify-between h-full">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-[10px] text-[#00d4ff] tracking-widest mb-1 opacity-70" style={{ fontFamily: '"Rajdhani", sans-serif' }}>
              SLOT {slot.id} • LVL {slot.storeLevel}
            </div>
            <div className="text-white font-bold text-base leading-tight" style={{ fontFamily: '"Rajdhani", sans-serif' }}>
              {slot.storeName}
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1 justify-end">
              <Star size={10} style={{ color: popColor }} />
              <span className="text-xs font-bold" style={{ color: popColor, fontFamily: '"Rajdhani", sans-serif' }}>
                {slot.popularity}%
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 mt-auto">
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-1">
              <Calendar size={9} className="text-[#00d4ff] opacity-60" />
              <span className="text-[9px] text-[#4a7a8a] tracking-wider uppercase" style={{ fontFamily: '"Rajdhani", sans-serif' }}>Ngày</span>
            </div>
            <span className="text-[#88ccee] text-xs font-bold" style={{ fontFamily: '"Rajdhani", sans-serif' }}>
              {slot.day}
            </span>
          </div>
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-1">
              <DollarSign size={9} className="text-[#ffcc00] opacity-60" />
              <span className="text-[9px] text-[#4a7a8a] tracking-wider uppercase" style={{ fontFamily: '"Rajdhani", sans-serif' }}>Tiền</span>
            </div>
            <span className="text-[#ffcc00] text-xs font-bold" style={{ fontFamily: '"Rajdhani", sans-serif' }}>
              {formatMoney(slot.money ?? 0)}
            </span>
          </div>
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-1">
              <Clock size={9} className="text-[#ff8844] opacity-60" />
              <span className="text-[9px] text-[#4a7a8a] tracking-wider uppercase" style={{ fontFamily: '"Rajdhani", sans-serif' }}>Giờ</span>
            </div>
            <span className="text-[#ff8844] text-xs font-bold" style={{ fontFamily: '"Rajdhani", sans-serif' }}>
              {slot.playtime}
            </span>
          </div>
        </div>
      </div>

      {/* Level badge */}
      <div
        className="absolute top-3 right-3 px-2 py-0.5 rounded text-[9px] font-bold tracking-wider"
        style={{
          background: 'rgba(0,212,255,0.15)',
          border: '1px solid rgba(0,212,255,0.3)',
          color: '#00d4ff',
          fontFamily: '"Rajdhani", sans-serif',
        }}
      >
        CẤP {slot.storeLevel}
      </div>
    </motion.div>
  );
}

export default function SaveSlotOverlay({ open, onClose, onLoad }: Props) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 cursor-pointer"
            style={{ background: 'rgba(0, 5, 15, 0.85)', backdropFilter: 'blur(8px)' }}
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            className="relative z-10 w-full max-w-xl mx-6"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 10 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            style={{
              background: 'rgba(4, 10, 22, 0.96)',
              border: '1px solid rgba(0, 212, 255, 0.2)',
              borderRadius: '4px',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 0 60px rgba(0,212,255,0.08), 0 30px 60px rgba(0,0,0,0.8)',
            }}
          >
            {/* Top glow bar */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00d4ff80] to-transparent" />

            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-[#0a1830]">
              <div>
                <div className="flex items-center gap-2">
                  <TrendingUp size={14} className="text-[#00d4ff]" style={{ filter: 'drop-shadow(0 0 6px #00d4ff)' }} />
                  <span
                    className="text-[#00d4ff] text-xs tracking-widest uppercase font-medium"
                    style={{ fontFamily: '"Rajdhani", sans-serif', textShadow: '0 0 12px #00d4ff60' }}
                  >
                    Tải / Lưu Game
                  </span>
                </div>
                <h3
                  className="text-white text-lg font-bold mt-0.5"
                  style={{ fontFamily: '"Rajdhani", sans-serif', letterSpacing: '0.05em' }}
                >
                  Chọn Slot Lưu
                </h3>
              </div>
              <motion.button
                onClick={onClose}
                className="p-2 rounded text-[#2a4a5e] hover:text-[#00d4ff] transition-colors"
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
              >
                <X size={18} />
              </motion.button>
            </div>

            {/* Save Slots */}
            <div className="p-5 grid gap-3">
              {SAVE_SLOTS.map((slot, i) => (
                <SlotCard key={slot.id} slot={slot} onLoad={onLoad} index={i} />
              ))}
            </div>

            {/* Footer */}
            <div className="px-5 pb-4 flex items-center justify-between">
              <div className="text-[#1a2e3e] text-xs tracking-wider" style={{ fontFamily: '"Rajdhani", sans-serif' }}>
                3 SLOTS AVAILABLE
              </div>
              <div className="text-[#1a2e3e] text-xs" style={{ fontFamily: '"Rajdhani", sans-serif' }}>
                Nhấn slot để tải
              </div>
            </div>

            {/* Bottom glow bar */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00d4ff30] to-transparent" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
