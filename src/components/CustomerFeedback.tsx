import { motion } from 'framer-motion';
import type { Customer } from '../types/game';

interface Props {
  customer: Customer;
}

const moodColors: Record<Customer['mood'], string> = {
  happy: '#00ff88',
  delighted: '#ffcc00',
  neutral: '#88aacc',
  annoyed: '#ff4444',
};

export default function CustomerFeedback({ customer }: Props) {
  const color = moodColors[customer.mood];

  return (
    <motion.div
      className="absolute"
      style={{ left: `${customer.x}%`, top: `${customer.y}%` }}
      initial={{ opacity: 0, scale: 0.5, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.5, y: -20 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
    >
      {/* Thought bubble */}
      <motion.div
        className="relative mb-1"
        initial={{ opacity: 0, y: -8, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.4 }}
      >
        <div
          className="px-2.5 py-1.5 rounded-2xl text-[10px] font-semibold whitespace-nowrap relative"
          style={{
            background: 'rgba(4, 10, 22, 0.92)',
            border: `1px solid ${color}40`,
            color: color,
            fontFamily: '"Rajdhani", sans-serif',
            backdropFilter: 'blur(8px)',
            boxShadow: `0 0 12px ${color}20`,
          }}
        >
          {customer.thought}
          {/* Bubble tail */}
          <div
            className="absolute left-1/2 -translate-x-1/2 -bottom-1.5 w-2 h-2 rotate-45"
            style={{ background: 'rgba(4, 10, 22, 0.92)', borderRight: `1px solid ${color}40`, borderBottom: `1px solid ${color}40` }}
          />
        </div>
      </motion.div>

      {/* Customer avatar */}
      <div className="flex flex-col items-center">
        <motion.div
          className="relative"
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 1.8 + Math.random(), repeat: Infinity, ease: 'easeInOut' }}
        >
          {/* Mood ring */}
          <div
            className="absolute -inset-1 rounded-full opacity-40"
            style={{ background: `radial-gradient(circle, ${color}40, transparent)` }}
          />
          <div className="text-2xl relative z-10">{customer.reaction}</div>
        </motion.div>

        {/* Shadow */}
        <div
          className="w-6 h-1 rounded-full opacity-30 mt-0.5"
          style={{ background: color }}
        />
      </div>

      {/* Floating purchase reaction */}
      <motion.div
        className="absolute -top-2 -right-3"
        initial={{ opacity: 0, y: 0, scale: 0.5 }}
        animate={{ opacity: [0, 1, 1, 0], y: [-4, -14, -20, -28], scale: [0.5, 1, 1, 0.8] }}
        transition={{ duration: 2.5, delay: 0.8, repeat: Infinity, repeatDelay: 4 }}
      >
        {customer.mood === 'delighted' || customer.mood === 'happy' ? (
          <span className="text-xs font-bold" style={{ color: '#ffcc00', fontFamily: '"Rajdhani", sans-serif', textShadow: '0 0 8px #ffcc00' }}>
            +{Math.floor(Math.random() * 30 + 5)}K
          </span>
        ) : null}
      </motion.div>
    </motion.div>
  );
}
