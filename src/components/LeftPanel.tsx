import { motion } from 'framer-motion';
import { CheckCircle, Circle, Gift } from 'lucide-react';
import { OBJECTIVES } from '../data/gameData';
import { formatMoney } from '../data/gameData';

export default function LeftPanel() {
  return (
    <motion.div
      className="fixed left-3 top-16 bottom-20 z-20 w-60 flex flex-col gap-2 overflow-hidden"
      initial={{ x: -80, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 0.4, duration: 0.5, ease: 'easeOut' }}
    >
      {/* Objectives */}
      <div
        className="rounded overflow-hidden flex flex-col"
        style={{
          background: 'rgba(4, 10, 22, 0.88)',
          border: '1px solid rgba(0, 212, 255, 0.15)',
          backdropFilter: 'blur(12px)',
        }}
      >
        {/* Header */}
        <div
          className="px-3 py-2 border-b border-[#0a1830] flex items-center gap-2"
          style={{ background: 'rgba(0, 212, 255, 0.05)' }}
        >
          <div className="w-1 h-4 rounded" style={{ background: '#00d4ff', boxShadow: '0 0 6px #00d4ff' }} />
          <span
            className="text-[10px] font-bold tracking-widest uppercase text-[#00d4ff]"
            style={{ fontFamily: '"Rajdhani", sans-serif', textShadow: '0 0 8px #00d4ff60' }}
          >
            Nhiệm Vụ
          </span>
        </div>

        {/* Objectives list */}
        <div className="p-2 flex flex-col gap-1.5">
          {OBJECTIVES.map((obj, i) => {
            const pct = Math.min((obj.current / obj.target) * 100, 100);
            const done = pct >= 100;
            return (
              <motion.div
                key={obj.id}
                className="rounded p-2 relative overflow-hidden"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0, transition: { delay: i * 0.08 + 0.5 } }}
                style={{
                  background: done ? 'rgba(0,255,136,0.06)' : 'rgba(8, 20, 38, 0.7)',
                  border: `1px solid ${done ? 'rgba(0,255,136,0.25)' : 'rgba(255,255,255,0.05)'}`,
                }}
              >
                <div className="flex items-start gap-2 mb-1.5">
                  {done ? (
                    <CheckCircle size={12} className="text-[#00ff88] shrink-0 mt-0.5" style={{ filter: 'drop-shadow(0 0 4px #00ff88)' }} />
                  ) : (
                    <Circle size={12} className="text-[#2a4a5e] shrink-0 mt-0.5" />
                  )}
                  <span
                    className="text-[11px] leading-tight"
                    style={{
                      color: done ? '#00ff88' : '#8ab0c0',
                      fontFamily: '"Rajdhani", sans-serif',
                      fontWeight: 600,
                    }}
                  >
                    {obj.label}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="ml-4">
                  <div className="h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
                    <motion.div
                      className="h-full rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ delay: i * 0.1 + 0.6, duration: 0.8, ease: 'easeOut' }}
                      style={{
                        background: done
                          ? 'linear-gradient(90deg, #00ff88, #00cc66)'
                          : 'linear-gradient(90deg, #00d4ff, #0088cc)',
                        boxShadow: done ? '0 0 6px #00ff88' : '0 0 4px #00d4ff',
                      }}
                    />
                  </div>
                  <div className="flex justify-between mt-0.5">
                    <span className="text-[9px] text-[#2a4a5e]" style={{ fontFamily: '"Rajdhani", sans-serif' }}>
                      {obj.current}/{obj.target}
                    </span>
                    <div className="flex items-center gap-0.5">
                      <Gift size={8} className="text-[#ffcc00]" />
                      <span className="text-[9px] text-[#ffcc00]" style={{ fontFamily: '"Rajdhani", sans-serif' }}>
                        {formatMoney(obj.reward)}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Store status mini */}
      <div
        className="rounded p-3 flex flex-col gap-2"
        style={{
          background: 'rgba(4, 10, 22, 0.88)',
          border: '1px solid rgba(255, 204, 0, 0.15)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <div className="flex items-center gap-2">
          <div className="w-1 h-4 rounded" style={{ background: '#ffcc00', boxShadow: '0 0 6px #ffcc00' }} />
          <span className="text-[10px] font-bold tracking-widest uppercase text-[#ffcc00]" style={{ fontFamily: '"Rajdhani", sans-serif' }}>
            Trạng Thái
          </span>
        </div>
        {[
          { label: 'Điện', value: 85, color: '#00d4ff' },
          { label: 'Vệ sinh', value: 62, color: '#88cc88' },
          { label: 'Uy tín', value: 74, color: '#ffcc00' },
          { label: 'Hài lòng', value: 81, color: '#ff8844' },
        ].map(s => (
          <div key={s.label}>
            <div className="flex justify-between mb-0.5">
              <span className="text-[10px] text-[#4a7a8a]" style={{ fontFamily: '"Rajdhani", sans-serif' }}>{s.label}</span>
              <span className="text-[10px] font-bold" style={{ color: s.color, fontFamily: '"Rajdhani", sans-serif' }}>{s.value}%</span>
            </div>
            <div className="h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
              <motion.div
                className="h-full rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${s.value}%` }}
                transition={{ duration: 0.8, ease: 'easeOut', delay: 0.8 }}
                style={{ background: s.color, boxShadow: `0 0 4px ${s.color}` }}
              />
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
