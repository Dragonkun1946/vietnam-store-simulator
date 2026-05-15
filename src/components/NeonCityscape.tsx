import { motion } from 'framer-motion';

export default function NeonCityscape() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      {/* Deep night sky gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#020810] via-[#060d1a] to-[#0a1020]" />

      {/* Far city glow */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#0a1530]/80 via-[#061020]/40 to-transparent" />

      {/* Neon sign reflections on wet ground */}
      <div className="absolute bottom-0 left-0 right-0 h-32">
        <div className="absolute bottom-0 left-[10%] w-40 h-24 bg-[#ff3366]/8 blur-2xl rounded-full" />
        <div className="absolute bottom-0 left-[30%] w-32 h-20 bg-[#00d4ff]/10 blur-2xl rounded-full" />
        <div className="absolute bottom-0 left-[55%] w-48 h-28 bg-[#ffcc00]/8 blur-2xl rounded-full" />
        <div className="absolute bottom-0 right-[10%] w-36 h-22 bg-[#ff6600]/8 blur-2xl rounded-full" />
      </div>

      {/* Building silhouettes - background layer */}
      <svg className="absolute bottom-0 left-0 right-0 w-full" viewBox="0 0 1440 300" preserveAspectRatio="xMidYMax meet">
        <defs>
          <linearGradient id="bgBuildingGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0a1525" />
            <stop offset="100%" stopColor="#030810" />
          </linearGradient>
        </defs>
        {/* Far buildings */}
        <rect x="0" y="180" width="80" height="120" fill="url(#bgBuildingGrad)" />
        <rect x="70" y="140" width="60" height="160" fill="url(#bgBuildingGrad)" />
        <rect x="120" y="160" width="50" height="140" fill="url(#bgBuildingGrad)" />
        <rect x="180" y="120" width="90" height="180" fill="url(#bgBuildingGrad)" />
        <rect x="260" y="150" width="70" height="150" fill="url(#bgBuildingGrad)" />
        <rect x="320" y="130" width="55" height="170" fill="url(#bgBuildingGrad)" />
        <rect x="380" y="100" width="100" height="200" fill="url(#bgBuildingGrad)" />
        <rect x="470" y="145" width="65" height="155" fill="url(#bgBuildingGrad)" />
        <rect x="530" y="110" width="85" height="190" fill="url(#bgBuildingGrad)" />
        <rect x="600" y="155" width="60" height="145" fill="url(#bgBuildingGrad)" />
        <rect x="670" y="125" width="95" height="175" fill="url(#bgBuildingGrad)" />
        <rect x="750" y="90" width="110" height="210" fill="url(#bgBuildingGrad)" />
        <rect x="850" y="140" width="75" height="160" fill="url(#bgBuildingGrad)" />
        <rect x="910" y="115" width="85" height="185" fill="url(#bgBuildingGrad)" />
        <rect x="990" y="130" width="70" height="170" fill="url(#bgBuildingGrad)" />
        <rect x="1060" y="100" width="100" height="200" fill="url(#bgBuildingGrad)" />
        <rect x="1150" y="150" width="65" height="150" fill="url(#bgBuildingGrad)" />
        <rect x="1200" y="120" width="80" height="180" fill="url(#bgBuildingGrad)" />
        <rect x="1280" y="140" width="90" height="160" fill="url(#bgBuildingGrad)" />
        <rect x="1360" y="110" width="80" height="190" fill="url(#bgBuildingGrad)" />

        {/* Neon window lights - scattered */}
        {[
          [90, 148], [95, 165], [100, 182],
          [200, 130], [205, 148], [225, 160],
          [400, 110], [415, 128], [420, 145],
          [550, 120], [560, 138], [570, 155],
          [690, 135], [700, 152], [720, 140],
          [770, 100], [785, 118], [800, 136],
          [930, 125], [945, 142], [960, 158],
          [1080, 110], [1095, 128], [1110, 145],
          [1210, 130], [1225, 148],
        ].map(([x, y], i) => (
          <rect
            key={i}
            x={x}
            y={y}
            width="4"
            height="3"
            fill={i % 5 === 0 ? '#00d4ff' : i % 3 === 0 ? '#ff3366' : i % 4 === 0 ? '#ffcc00' : '#88ccff'}
            opacity={0.4 + (i % 4) * 0.1}
          />
        ))}
      </svg>

      {/* Animated neon sign glows */}
      <motion.div
        className="absolute top-[45%] left-[15%] w-3 h-3 rounded-full bg-[#ff3366]"
        style={{ boxShadow: '0 0 20px 8px #ff336680, 0 0 40px 16px #ff336630' }}
        animate={{ opacity: [1, 0.6, 1, 0.8, 1] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute top-[38%] left-[42%] w-2 h-2 rounded-full bg-[#00d4ff]"
        style={{ boxShadow: '0 0 20px 8px #00d4ff80, 0 0 40px 16px #00d4ff30' }}
        animate={{ opacity: [1, 0.7, 0.9, 1] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
      />
      <motion.div
        className="absolute top-[50%] right-[22%] w-2 h-2 rounded-full bg-[#ffcc00]"
        style={{ boxShadow: '0 0 16px 6px #ffcc0080, 0 0 32px 12px #ffcc0030' }}
        animate={{ opacity: [0.8, 1, 0.7, 1] }}
        transition={{ duration: 4.1, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
      />

      {/* Fog / mist layer */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#04080f]/60 via-transparent to-transparent pointer-events-none" />
    </div>
  );
}
