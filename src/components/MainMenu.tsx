import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Play, RotateCcw, Save, Settings, LogOut, Store, Zap } from 'lucide-react';

interface Props {
  onContinue: () => void;
  onNewGame: () => void;
  onLoadSave: () => void;
  onSettings: () => void;
  onExit: () => void;
}

const buttonVariants = {
  idle: { scale: 1, x: 0 },
  hover: { scale: 1.02, x: 6 },
  tap: { scale: 0.98 },
};

function MenuButton({
  icon: Icon,
  label,
  onClick,
  accent = '#00d4ff',
  delay = 0,
  disabled = false,
}: {
  icon: React.ElementType;
  label: string;
  onClick: () => void;
  accent?: string;
  delay?: number;
  disabled?: boolean;
}) {
  return (
    <motion.button
      variants={buttonVariants}
      initial={{ opacity: 0, x: -40 }}
      animate={{ opacity: 1, x: 0, transition: { delay, duration: 0.5, ease: 'easeOut' } }}
      whileHover={disabled ? undefined : 'hover'}
      whileTap={disabled ? undefined : 'tap'}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className="group relative w-72 flex items-center gap-4 px-6 py-4 rounded-sm overflow-hidden transition-all duration-200"
      style={{
        background: 'rgba(8, 18, 35, 0.75)',
        border: `1px solid ${disabled ? '#1a2535' : accent}28`,
        backdropFilter: 'blur(12px)',
        cursor: disabled ? 'not-allowed' : 'pointer',
      }}
    >
      {/* Hover glow */}
      {!disabled && (
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ background: `linear-gradient(90deg, ${accent}15, transparent)` }}
        />
      )}
      {/* Left accent bar */}
      <div
        className="absolute left-0 top-0 bottom-0 w-0.5 transition-all duration-300"
        style={{
          background: disabled ? '#1a2535' : accent,
          boxShadow: disabled ? 'none' : `0 0 8px ${accent}`,
        }}
      />

      <Icon
        size={18}
        className="relative z-10 transition-all duration-200"
        style={{ color: disabled ? '#2a3a50' : accent }}
      />
      <span
        className="relative z-10 font-semibold tracking-widest text-sm uppercase transition-colors duration-200"
        style={{
          color: disabled ? '#2a3a50' : '#b8cce0',
          fontFamily: '"Rajdhani", sans-serif',
          letterSpacing: '0.15em',
        }}
      >
        {label}
      </span>

      {!disabled && (
        <motion.div
          className="absolute right-4 opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ color: accent }}
        >
          ›
        </motion.div>
      )}
    </motion.button>
  );
}

export default function MainMenu({ onContinue, onNewGame, onLoadSave, onSettings, onExit }: Props) {
  const [hoverEffect, setHoverEffect] = useState(false);

  return (
    <motion.div
      className="relative z-10 flex flex-col items-center justify-center min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.96, filter: 'blur(8px)' }}
      transition={{ duration: 0.6 }}
    >
      {/* Title Section */}
      <motion.div
        className="mb-16 text-center"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        {/* Store icon with glow */}
        <motion.div
          className="flex items-center justify-center mb-4"
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className="relative">
            <Store
              size={48}
              className="text-[#00d4ff]"
              style={{ filter: 'drop-shadow(0 0 16px #00d4ff) drop-shadow(0 0 32px #00d4ff60)' }}
            />
            <motion.div
              className="absolute -inset-4 rounded-full"
              style={{ background: 'radial-gradient(circle, #00d4ff15, transparent)' }}
              animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.2, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>

        {/* Vietnamese sub-title */}
        <motion.div
          className="text-[#00d4ff] text-xs tracking-[0.4em] uppercase mb-2 font-medium"
          style={{ fontFamily: '"Rajdhani", sans-serif', textShadow: '0 0 20px #00d4ff80' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Trò Chơi Mô Phỏng
        </motion.div>

        {/* Main title */}
        <h1
          className="text-6xl font-black tracking-tight leading-none mb-2"
          style={{
            fontFamily: '"Rajdhani", sans-serif',
            background: 'linear-gradient(135deg, #ffffff 0%, #88ccff 40%, #00d4ff 70%, #0099cc 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            textShadow: 'none',
            filter: 'drop-shadow(0 0 30px #00d4ff40)',
          }}
        >
          PHỐ TIỆN LỢI
        </h1>
        <h2
          className="text-xl tracking-[0.3em] uppercase"
          style={{
            fontFamily: '"Rajdhani", sans-serif',
            color: '#4a8aaa',
            letterSpacing: '0.35em',
          }}
        >
          Convenience Store
        </h2>

        {/* Decorative line */}
        <div className="flex items-center justify-center gap-3 mt-5">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#00d4ff40]" />
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          >
            <Zap size={10} className="text-[#00d4ff]" style={{ filter: 'drop-shadow(0 0 4px #00d4ff)' }} />
          </motion.div>
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#00d4ff40]" />
        </div>

        {/* Version tag */}
        <div className="mt-3 text-[#1e3a4a] text-xs tracking-widest" style={{ fontFamily: '"Rajdhani", sans-serif' }}>
          VERSION 1.0.0 • EARLY ACCESS
        </div>
      </motion.div>

      {/* Menu Buttons */}
      <div
        className="flex flex-col gap-3"
        onMouseEnter={() => setHoverEffect(true)}
        onMouseLeave={() => setHoverEffect(false)}
      >
        <MenuButton icon={Play} label="Tiếp tục" onClick={onContinue} accent="#00d4ff" delay={0.1} />
        <MenuButton icon={RotateCcw} label="Trò chơi mới" onClick={onNewGame} accent="#ff3366" delay={0.2} />
        <MenuButton icon={Save} label="Tải Game" onClick={onLoadSave} accent="#ffcc00" delay={0.3} />
        <MenuButton icon={Settings} label="Cài đặt" onClick={onSettings} accent="#88cc88" delay={0.4} />
        <MenuButton icon={LogOut} label="Thoát" onClick={onExit} accent="#664444" delay={0.5} disabled />
      </div>

      {/* Bottom decorative text */}
      <motion.div
        className="absolute bottom-8 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
      >
        <div className="text-[#1a2e3e] text-xs tracking-widest" style={{ fontFamily: '"Rajdhani", sans-serif' }}>
          © 2024 SAIGON NIGHT STUDIOS • ALL RIGHTS RESERVED
        </div>
        <div className="text-[#0a1825] text-xs mt-1">Hà Nội • Sài Gòn • 2AM</div>
      </motion.div>

      {/* Ambient corner glows */}
      <AnimatePresence>
        {hoverEffect && (
          <motion.div
            className="fixed bottom-0 left-0 w-96 h-96 pointer-events-none"
            style={{ background: 'radial-gradient(circle at bottom left, #00d4ff05, transparent)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
