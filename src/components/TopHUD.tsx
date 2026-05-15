import { motion } from 'framer-motion';
import { DollarSign, TrendingUp, Users, Star, Cloud, Clock } from 'lucide-react';
import { formatMoney } from '../data/gameData';
import type { GameState } from '../types/game';

interface Props {
  state: GameState;
  onSave: () => void;
}

function HUDChip({
  icon: Icon,
  label,
  value,
  color = '#00d4ff',
  pulse = false,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  color?: string;
  pulse?: boolean;
}) {
  return (
    <div
      className="flex items-center gap-2 px-3 py-2 rounded relative overflow-hidden"
      style={{
        background: 'rgba(4, 10, 22, 0.85)',
        border: `1px solid ${color}25`,
        backdropFilter: 'blur(10px)',
      }}
    >
      <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${color}08, transparent)` }} />
      <Icon size={12} style={{ color, filter: `drop-shadow(0 0 4px ${color})` }} className="relative z-10 shrink-0" />
      <div className="relative z-10 flex flex-col leading-none">
        <span className="text-[9px] tracking-widest uppercase opacity-50" style={{ color, fontFamily: '"Rajdhani", sans-serif' }}>
          {label}
        </span>
        <span className="text-xs font-bold" style={{ color, fontFamily: '"Rajdhani", sans-serif', textShadow: `0 0 8px ${color}60` }}>
          {value}
        </span>
      </div>
      {pulse && (
        <motion.div
          className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full"
          style={{ background: color }}
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 1.2, repeat: Infinity }}
        />
      )}
    </div>
  );
}

export default function TopHUD({ state, onSave }: Props) {
  const timeStr = `${String(state.hour).padStart(2, '0')}:${String(state.minute).padStart(2, '0')}`;

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-4 py-2"
      style={{
        background: 'linear-gradient(to bottom, rgba(2,6,15,0.95) 0%, rgba(2,6,15,0.7) 80%, transparent 100%)',
        backdropFilter: 'blur(4px)',
      }}
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2, duration: 0.5, ease: 'easeOut' }}
    >
      {/* Left: Store name + day */}
      <div className="flex items-center gap-3">
        <div>
          <div
            className="text-xs font-black tracking-wider text-white leading-none"
            style={{ fontFamily: '"Rajdhani", sans-serif', textShadow: '0 0 12px rgba(0,212,255,0.5)' }}
          >
            {state.storeName}
          </div>
          <div className="text-[9px] tracking-widest text-[#2a4a5e] uppercase" style={{ fontFamily: '"Rajdhani", sans-serif' }}>
            Ngày {state.day} • Cấp {state.storeLevel}
          </div>
        </div>
        <div
          className="h-6 w-px"
          style={{ background: 'linear-gradient(to bottom, transparent, #00d4ff30, transparent)' }}
        />
      </div>

      {/* Center: HUD chips */}
      <div className="flex items-center gap-2">
        <HUDChip icon={DollarSign} label="Tiền" value={formatMoney(state.money)} color="#ffcc00" pulse />
        <HUDChip icon={TrendingUp} label="Hôm nay" value={formatMoney(state.dailyRevenue)} color="#00ff88" />
        <HUDChip icon={Users} label="Khách" value={String(state.customerCount)} color="#00d4ff" pulse={state.customerCount > 0} />
        <HUDChip icon={Star} label="Nổi tiếng" value={`${state.popularity}%`} color="#ff8844" />
        <HUDChip icon={Cloud} label="Thời tiết" value="Mưa 🌧" color="#88aacc" />
        <HUDChip icon={Clock} label="Giờ" value={timeStr} color="#cc88ff" pulse />
      </div>

      {/* Right: Save button */}
      <motion.button
        onClick={onSave}
        className="px-4 py-2 rounded text-xs font-bold tracking-widest uppercase relative overflow-hidden"
        style={{
          background: 'rgba(0, 212, 255, 0.1)',
          border: '1px solid rgba(0, 212, 255, 0.3)',
          color: '#00d4ff',
          fontFamily: '"Rajdhani", sans-serif',
        }}
        whileHover={{ scale: 1.04, boxShadow: '0 0 16px rgba(0,212,255,0.3)' }}
        whileTap={{ scale: 0.97 }}
      >
        <span style={{ textShadow: '0 0 8px #00d4ff' }}>Lưu</span>
      </motion.button>
    </motion.div>
  );
}
