import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import CustomerFeedback from './CustomerFeedback';
import type { Customer } from '../types/game';
import { CUSTOMER_THOUGHTS } from '../data/gameData';

let custId = 0;

function generateCustomer(): Customer {
  const thought = CUSTOMER_THOUGHTS[Math.floor(Math.random() * CUSTOMER_THOUGHTS.length)];
  return {
    id: `c${++custId}`,
    name: `Khách ${custId}`,
    mood: thought.mood,
    thought: thought.thought,
    reaction: thought.reaction,
    x: 15 + Math.random() * 70,
    y: 40 + Math.random() * 35,
  };
}

export default function StoreScene() {
  const [customers, setCustomers] = useState<Customer[]>([
    generateCustomer(),
    generateCustomer(),
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCustomers(prev => {
        // randomly remove or add
        if (Math.random() < 0.4 && prev.length > 0) {
          const idx = Math.floor(Math.random() * prev.length);
          return prev.filter((_, i) => i !== idx);
        }
        if (prev.length < 5) {
          return [...prev, generateCustomer()];
        }
        return prev;
      });
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-5 overflow-hidden" style={{ top: '52px', bottom: '72px' }}>
      {/* Store interior background */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to bottom, #060e1c 0%, #080f1e 30%, #0a1222 60%, #050c18 100%)',
        }}
      />

      {/* Floor reflection */}
      <div
        className="absolute bottom-0 left-0 right-0 h-1/3"
        style={{
          background: 'linear-gradient(to top, rgba(0,20,40,0.9), transparent)',
        }}
      />

      {/* Ceiling lights */}
      {[15, 35, 55, 75, 90].map((x, i) => (
        <div key={i} className="absolute top-0" style={{ left: `${x}%` }}>
          <div
            className="w-px h-8"
            style={{ background: 'linear-gradient(to bottom, #88aacc20, transparent)' }}
          />
          <div
            className="absolute top-2 -left-6 w-12 h-20 rounded-b-full opacity-20"
            style={{ background: `radial-gradient(ellipse, ${i % 2 === 0 ? '#ffeecc' : '#aaddff'}, transparent)` }}
          />
        </div>
      ))}

      {/* Shelves */}
      <div className="absolute" style={{ left: '5%', top: '15%', width: '25%' }}>
        <div className="h-2 rounded" style={{ background: 'linear-gradient(90deg, #1a2535, #0d1825)', boxShadow: '0 2px 8px rgba(0,0,0,0.8)' }} />
        <div className="flex gap-1 px-1 py-1">
          {['🍺', '🥤', '🍜', '🍪', '🥤'].map((e, i) => (
            <span key={i} className="text-lg opacity-80">{e}</span>
          ))}
        </div>
        <div className="h-1.5 rounded mt-1" style={{ background: '#1a2535' }} />
        <div className="flex gap-1 px-1 py-1">
          {['🫙', '🍬', '🌭', '🍵', '🍶'].map((e, i) => (
            <span key={i} className="text-lg opacity-80">{e}</span>
          ))}
        </div>
        <div className="h-1.5 rounded mt-1" style={{ background: '#1a2535' }} />
      </div>

      <div className="absolute" style={{ right: '5%', top: '15%', width: '25%' }}>
        <div className="h-2 rounded" style={{ background: 'linear-gradient(90deg, #0d1825, #1a2535)', boxShadow: '0 2px 8px rgba(0,0,0,0.8)' }} />
        <div className="flex gap-1 px-1 py-1">
          {['🚬', '🍺', '🍿', '🥤', '🍜'].map((e, i) => (
            <span key={i} className="text-lg opacity-80">{e}</span>
          ))}
        </div>
        <div className="h-1.5 rounded mt-1" style={{ background: '#1a2535' }} />
        <div className="flex gap-1 px-1 py-1">
          {['🍪', '🫙', '🌭', '🍬', '🥤'].map((e, i) => (
            <span key={i} className="text-lg opacity-80">{e}</span>
          ))}
        </div>
        <div className="h-1.5 rounded mt-1" style={{ background: '#1a2535' }} />
      </div>

      {/* Counter */}
      <div
        className="absolute"
        style={{
          left: '38%',
          right: '38%',
          bottom: '20%',
          height: '12%',
          background: 'linear-gradient(to bottom, #1a2535, #0d1825)',
          borderTop: '2px solid #2a3a50',
          borderRadius: '4px 4px 0 0',
          boxShadow: '0 -4px 20px rgba(0,212,255,0.06)',
        }}
      >
        <div className="absolute top-1 left-1/2 -translate-x-1/2 text-2xl">💻</div>
        <div
          className="absolute top-0 left-0 right-0 h-0.5"
          style={{ background: 'linear-gradient(90deg, transparent, #00d4ff40, transparent)' }}
        />
      </div>

      {/* Neon store sign */}
      <motion.div
        className="absolute top-4 left-1/2 -translate-x-1/2"
        animate={{ opacity: [1, 0.85, 1, 0.9, 1] }}
        transition={{ duration: 4, repeat: Infinity }}
      >
        <div
          className="px-6 py-2 rounded text-sm font-black tracking-widest"
          style={{
            fontFamily: '"Rajdhani", sans-serif',
            color: '#ff3366',
            textShadow: '0 0 10px #ff3366, 0 0 20px #ff3366, 0 0 40px #ff3366',
            border: '1px solid #ff336640',
            background: 'rgba(255,51,102,0.05)',
            boxShadow: '0 0 20px #ff336620, inset 0 0 20px #ff336608',
          }}
        >
          CỬA HÀNG SAO MAI
        </div>
      </motion.div>

      {/* Fridge glow on right wall */}
      <div
        className="absolute right-4 top-10 bottom-16 w-8"
        style={{
          background: 'linear-gradient(to bottom, #001830, #002040, #001830)',
          border: '1px solid #00d4ff20',
          boxShadow: '0 0 30px #00d4ff15, -10px 0 40px #00d4ff08',
        }}
      >
        <div className="absolute inset-0 flex flex-col justify-around items-center py-2">
          {['🥤', '🍺', '🥤', '🍵'].map((e, i) => (
            <span key={i} className="text-xs opacity-60">{e}</span>
          ))}
        </div>
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to right, rgba(0,212,255,0.03), transparent)' }}
        />
      </div>

      {/* Customers */}
      <AnimatePresence>
        {customers.map(customer => (
          <CustomerFeedback key={customer.id} customer={customer} />
        ))}
      </AnimatePresence>

      {/* Wet floor reflections */}
      <div
        className="absolute bottom-0 left-0 right-0 h-12 opacity-20"
        style={{
          background: 'linear-gradient(to top, rgba(0,212,255,0.1), transparent)',
        }}
      />
    </div>
  );
}
