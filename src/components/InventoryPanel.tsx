import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { X, Package, AlertTriangle, TrendingUp } from 'lucide-react';
import { PRODUCTS } from '../data/gameData';
import { formatMoney } from '../data/gameData';
import type { Product } from '../types/game';

interface Props {
  open: boolean;
  onClose: () => void;
}

const CATEGORIES = ['all', 'drinks', 'snacks', 'instant', 'tobacco', 'household', 'fresh'] as const;
type Cat = typeof CATEGORIES[number];

const catLabels: Record<Cat, string> = {
  all: 'Tất cả',
  drinks: 'Đồ uống',
  snacks: 'Bánh kẹo',
  instant: 'Mì gói',
  tobacco: 'Thuốc lá',
  household: 'Gia dụng',
  fresh: 'Tươi sống',
};

function StockBar({ product }: { product: Product }) {
  const pct = (product.stock / product.maxStock) * 100;
  const color = pct === 0 ? '#ff4444' : pct < 25 ? '#ff8844' : pct < 60 ? '#ffcc00' : '#00ff88';

  return (
    <div className="h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
      <motion.div
        className="h-full rounded-full"
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        style={{ background: color, boxShadow: `0 0 4px ${color}` }}
      />
    </div>
  );
}

function ProductRow({ product, index }: { product: Product; index: number }) {
  const pct = (product.stock / product.maxStock) * 100;
  const low = pct < 25;
  const empty = product.stock === 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0, transition: { delay: index * 0.04 } }}
      className="group relative flex items-center gap-3 p-3 rounded cursor-pointer transition-all duration-200"
      style={{
        background: empty ? 'rgba(255,68,68,0.05)' : low ? 'rgba(255,136,68,0.05)' : 'rgba(8, 20, 38, 0.6)',
        border: `1px solid ${empty ? 'rgba(255,68,68,0.2)' : low ? 'rgba(255,136,68,0.15)' : 'rgba(255,255,255,0.04)'}`,
      }}
      whileHover={{ scale: 1.01, x: 2 }}
    >
      <div className="text-2xl">{product.icon}</div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-0.5">
          <span
            className="text-xs font-bold text-white truncate"
            style={{ fontFamily: '"Rajdhani", sans-serif' }}
          >
            {product.nameVi}
          </span>
          {empty && <AlertTriangle size={10} className="text-[#ff4444] shrink-0" />}
          {!empty && low && <AlertTriangle size={10} className="text-[#ff8844] shrink-0" />}
        </div>
        <StockBar product={product} />
        <div className="flex items-center justify-between mt-0.5">
          <span className="text-[9px] text-[#2a4a5e]" style={{ fontFamily: '"Rajdhani", sans-serif' }}>
            {product.stock}/{product.maxStock} sản phẩm
          </span>
          <span className="text-[9px] text-[#2a4a5e]" style={{ fontFamily: '"Rajdhani", sans-serif' }}>
            {empty ? 'HẾT HÀNG' : low ? 'SẮP HẾT' : 'ĐỦ HÀNG'}
          </span>
        </div>
      </div>

      <div className="text-right shrink-0">
        <div className="text-xs font-bold text-[#ffcc00]" style={{ fontFamily: '"Rajdhani", sans-serif', textShadow: '0 0 6px #ffcc0060' }}>
          {formatMoney(product.price)}
        </div>
        <div className="text-[9px] text-[#1a3040]" style={{ fontFamily: '"Rajdhani", sans-serif' }}>
          Vốn: {formatMoney(product.cost)}
        </div>
        <div className="flex items-center gap-0.5 justify-end mt-0.5">
          <TrendingUp size={8} className="text-[#00ff88]" />
          <span className="text-[9px] text-[#00ff88]" style={{ fontFamily: '"Rajdhani", sans-serif' }}>
            {Math.round(((product.price - product.cost) / product.cost) * 100)}%
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export default function InventoryPanel({ open, onClose }: Props) {
  const [cat, setCat] = useState<Cat>('all');

  const filtered = cat === 'all' ? PRODUCTS : PRODUCTS.filter(p => p.category === cat);
  const lowStock = PRODUCTS.filter(p => p.stock / p.maxStock < 0.25).length;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-x-64 bottom-16 top-14 z-40 flex"
          initial={{ opacity: 0, y: 30, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 300, damping: 28 }}
        >
          <div
            className="flex-1 rounded overflow-hidden flex flex-col"
            style={{
              background: 'rgba(3, 8, 18, 0.97)',
              border: '1px solid rgba(0, 212, 255, 0.2)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 0 40px rgba(0,212,255,0.06)',
            }}
          >
            {/* Top glow */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00d4ff80] to-transparent" />

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-[#0a1830]">
              <div className="flex items-center gap-3">
                <Package size={16} className="text-[#00d4ff]" style={{ filter: 'drop-shadow(0 0 6px #00d4ff)' }} />
                <div>
                  <h2 className="text-white font-black text-base leading-none" style={{ fontFamily: '"Rajdhani", sans-serif' }}>
                    Kho Hàng
                  </h2>
                  <div className="text-[9px] text-[#2a4a5e] tracking-wider mt-0.5" style={{ fontFamily: '"Rajdhani", sans-serif' }}>
                    {PRODUCTS.length} SẢN PHẨM • {lowStock} CẦN NHẬP THÊM
                  </div>
                </div>
              </div>
              <motion.button onClick={onClose} className="text-[#2a4a5e] hover:text-[#00d4ff] transition-colors p-1" whileHover={{ rotate: 90 }}>
                <X size={16} />
              </motion.button>
            </div>

            {/* Category filter */}
            <div className="flex items-center gap-1.5 px-4 py-2 border-b border-[#060f20] overflow-x-auto shrink-0">
              {CATEGORIES.map(c => (
                <motion.button
                  key={c}
                  onClick={() => setCat(c)}
                  className="px-3 py-1 rounded text-[10px] font-bold tracking-wider uppercase whitespace-nowrap transition-all"
                  style={{
                    fontFamily: '"Rajdhani", sans-serif',
                    background: cat === c ? 'rgba(0,212,255,0.15)' : 'rgba(8,20,38,0.6)',
                    border: `1px solid ${cat === c ? 'rgba(0,212,255,0.4)' : 'rgba(255,255,255,0.05)'}`,
                    color: cat === c ? '#00d4ff' : '#2a4a5e',
                    boxShadow: cat === c ? '0 0 12px rgba(0,212,255,0.2)' : 'none',
                  }}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                >
                  {catLabels[c]}
                </motion.button>
              ))}
            </div>

            {/* Product list */}
            <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-1.5">
              {filtered.map((p, i) => (
                <ProductRow key={p.id} product={p} index={i} />
              ))}
            </div>

            {/* Footer summary */}
            <div className="px-4 py-2 border-t border-[#060f20] flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-[#00ff88]" />
                  <span className="text-[9px] text-[#2a4a5e]" style={{ fontFamily: '"Rajdhani", sans-serif' }}>Đủ hàng</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-[#ff8844]" />
                  <span className="text-[9px] text-[#2a4a5e]" style={{ fontFamily: '"Rajdhani", sans-serif' }}>Sắp hết</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-[#ff4444]" />
                  <span className="text-[9px] text-[#2a4a5e]" style={{ fontFamily: '"Rajdhani", sans-serif' }}>Hết hàng</span>
                </div>
              </div>
              <span className="text-[9px] text-[#1a2e3e]" style={{ fontFamily: '"Rajdhani", sans-serif' }}>
                KHO HÀNG • THỜI GIAN THỰC
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
