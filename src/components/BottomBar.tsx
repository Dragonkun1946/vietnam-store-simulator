import { motion } from 'framer-motion';
import { Package, ShoppingCart, Zap, Users, Settings } from 'lucide-react';
import type { GamePanel } from '../types/game';

interface Props {
  activePanel: GamePanel;
  onPanel: (p: GamePanel) => void;
}

const BUTTONS: { panel: GamePanel; icon: React.ElementType; label: string; color: string }[] = [
  { panel: 'inventory', icon: Package, label: 'Kho Hàng', color: '#00d4ff' },
  { panel: 'orders', icon: ShoppingCart, label: 'Đặt Hàng', color: '#00ff88' },
  { panel: 'upgrades', icon: Zap, label: 'Nâng Cấp', color: '#ffcc00' },
  { panel: 'staff', icon: Users, label: 'Nhân Viên', color: '#ff8844' },
  { panel: 'management', icon: Settings, label: 'Quản Lý', color: '#cc88ff' },
];

export default function BottomBar({ activePanel, onPanel }: Props) {
  return (
    <motion.div
      className="fixed bottom-0 left-0 right-0 z-30 flex items-center justify-center px-4 py-2"
      style={{
        background: 'linear-gradient(to top, rgba(2,6,15,0.98) 0%, rgba(2,6,15,0.8) 70%, transparent 100%)',
        backdropFilter: 'blur(4px)',
      }}
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.3, duration: 0.5, ease: 'easeOut' }}
    >
      <div className="flex items-center gap-2">
        {BUTTONS.map(({ panel, icon: Icon, label, color }) => {
          const active = activePanel === panel;
          return (
            <motion.button
              key={panel}
              onClick={() => onPanel(panel)}
              className="relative flex flex-col items-center gap-1 px-5 py-2.5 rounded overflow-hidden transition-all duration-200"
              style={{
                background: active ? `rgba(${color === '#00d4ff' ? '0,212,255' : color === '#00ff88' ? '0,255,136' : color === '#ffcc00' ? '255,204,0' : color === '#ff8844' ? '255,136,68' : '204,136,255'},0.15)` : 'rgba(4, 10, 22, 0.85)',
                border: `1px solid ${active ? color + '60' : color + '20'}`,
                boxShadow: active ? `0 0 20px ${color}25, 0 0 40px ${color}10` : 'none',
              }}
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.96 }}
            >
              {active && (
                <motion.div
                  className="absolute inset-0"
                  style={{ background: `radial-gradient(ellipse at center, ${color}10, transparent)` }}
                  layoutId="activePanelBg"
                />
              )}
              <Icon
                size={16}
                style={{
                  color: active ? color : '#2a4a5e',
                  filter: active ? `drop-shadow(0 0 6px ${color})` : 'none',
                  transition: 'all 0.2s',
                }}
              />
              <span
                className="text-[9px] tracking-widest uppercase"
                style={{
                  fontFamily: '"Rajdhani", sans-serif',
                  color: active ? color : '#2a4a5e',
                  fontWeight: active ? 700 : 500,
                  textShadow: active ? `0 0 8px ${color}80` : 'none',
                  transition: 'all 0.2s',
                }}
              >
                {label}
              </span>

              {/* Active indicator dot */}
              {active && (
                <motion.div
                  className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                  style={{ background: color, boxShadow: `0 0 4px ${color}` }}
                  layoutId="activeDot"
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}
