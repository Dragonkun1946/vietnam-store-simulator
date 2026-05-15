import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { INITIAL_FEED } from '../data/gameData';
import type { FeedItem } from '../types/game';
import { formatMoney } from '../data/gameData';

const NEW_EVENTS: Omit<FeedItem, 'id' | 'time'>[] = [
  { type: 'sale', message: 'Phạm Minh C mua Bia Saigon x2', amount: 30000, icon: '💰' },
  { type: 'alert', message: 'Bánh Oreo sắp hết hàng!', icon: '⚠️' },
  { type: 'trend', message: 'Snack tăng mạnh cuối tuần', icon: '📈' },
  { type: 'sale', message: 'Lê Thị D mua Mì + Nước', amount: 17000, icon: '💰' },
  { type: 'notification', message: 'Khách hàng thân thiết quay lại!', icon: '⭐' },
  { type: 'arrival', message: 'Xe giao hàng Pepsi đến cổng', icon: '🚚' },
];

const typeColors: Record<FeedItem['type'], string> = {
  sale: '#00ff88',
  alert: '#ff4444',
  arrival: '#ffcc00',
  trend: '#00d4ff',
  notification: '#ff8844',
};

export default function RightPanel() {
  const [feed, setFeed] = useState<FeedItem[]>(INITIAL_FEED);

  useEffect(() => {
    const interval = setInterval(() => {
      const event = NEW_EVENTS[Math.floor(Math.random() * NEW_EVENTS.length)];
      const now = new Date();
      const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      const newItem: FeedItem = {
        ...event,
        id: `f${Date.now()}`,
        time: timeStr,
      };
      setFeed(prev => [newItem, ...prev].slice(0, 12));
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      className="fixed right-3 top-16 bottom-20 z-20 w-60 flex flex-col gap-2"
      initial={{ x: 80, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 0.4, duration: 0.5, ease: 'easeOut' }}
    >
      <div
        className="rounded overflow-hidden flex flex-col flex-1 min-h-0"
        style={{
          background: 'rgba(4, 10, 22, 0.88)',
          border: '1px solid rgba(255, 136, 68, 0.15)',
          backdropFilter: 'blur(12px)',
        }}
      >
        {/* Header */}
        <div
          className="px-3 py-2 border-b border-[#0a1830] flex items-center gap-2 shrink-0"
          style={{ background: 'rgba(255, 136, 68, 0.05)' }}
        >
          <div className="w-1 h-4 rounded" style={{ background: '#ff8844', boxShadow: '0 0 6px #ff8844' }} />
          <span
            className="text-[10px] font-bold tracking-widest uppercase text-[#ff8844] flex-1"
            style={{ fontFamily: '"Rajdhani", sans-serif', textShadow: '0 0 8px #ff884460' }}
          >
            Hoạt Động
          </span>
          <motion.div
            className="w-1.5 h-1.5 rounded-full bg-[#ff8844]"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
          <span className="text-[9px] text-[#ff8844] opacity-60 ml-1" style={{ fontFamily: '"Rajdhani", sans-serif' }}>LIVE</span>
        </div>

        {/* Feed */}
        <div className="flex-1 overflow-hidden p-2 flex flex-col gap-1.5">
          <AnimatePresence initial={false}>
            {feed.map((item) => {
              const color = typeColors[item.type];
              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: -12, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.94, height: 0, marginBottom: 0 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  className="rounded p-2 relative overflow-hidden"
                  style={{
                    background: `rgba(${color === '#ff4444' ? '255,68,68' : color === '#00ff88' ? '0,255,136' : color === '#ffcc00' ? '255,204,0' : color === '#ff8844' ? '255,136,68' : '0,212,255'},0.06)`,
                    border: `1px solid ${color}20`,
                  }}
                >
                  <div className="flex items-start gap-1.5">
                    <span className="text-sm shrink-0 leading-none mt-0.5">{item.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div
                        className="text-[10px] leading-tight"
                        style={{ color: '#8ab0c0', fontFamily: '"Rajdhani", sans-serif' }}
                      >
                        {item.message}
                      </div>
                      <div className="flex items-center justify-between mt-0.5">
                        <span className="text-[9px] text-[#1a3040]" style={{ fontFamily: '"Rajdhani", sans-serif' }}>
                          {item.time}
                        </span>
                        {item.amount && (
                          <span
                            className="text-[10px] font-bold"
                            style={{ color: '#00ff88', fontFamily: '"Rajdhani", sans-serif', textShadow: '0 0 6px #00ff8860' }}
                          >
                            +{formatMoney(item.amount)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div
                    className="absolute left-0 top-0 bottom-0 w-0.5"
                    style={{ background: color, opacity: 0.6 }}
                  />
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
