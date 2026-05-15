import { motion, AnimatePresence } from 'framer-motion';
import { X, Zap, Settings, TrendingUp, ShoppingCart, Users } from 'lucide-react';
import type { GamePanel } from '../types/game';
import { formatMoney } from '../data/gameData';

interface Props {
  panel: GamePanel;
  onClose: () => void;
}

const UPGRADES = [
  { id: 'u1', icon: '💡', label: 'Đèn LED tiết kiệm', desc: 'Giảm 15% điện hàng tháng', cost: 200000, owned: true },
  { id: 'u2', icon: '🧹', label: 'Robot dọn dẹp', desc: 'Tự động làm sạch mỗi giờ', cost: 500000, owned: false },
  { id: 'u3', icon: '📷', label: 'Camera an ninh', desc: 'Giảm tỉ lệ trộm cắp 80%', cost: 350000, owned: false },
  { id: 'u4', icon: '🖥️', label: 'Màn hình quảng cáo', desc: 'Tăng 12% lượt khách', cost: 450000, owned: false },
  { id: 'u5', icon: '❄️', label: 'Tủ lạnh lớn', desc: 'Mở khóa đồ uống cao cấp', cost: 1200000, owned: false },
  { id: 'u6', icon: '🎵', label: 'Hệ thống âm thanh', desc: 'Tăng 8% độ hài lòng', cost: 150000, owned: true },
];

const STAFF = [
  { id: 's1', name: 'Nguyễn Lan', role: 'Thu ngân', mood: '😊', shift: '18:00 - 02:00', wage: 120000, active: true },
  { id: 's2', name: 'Trần Hùng', role: 'Kho vận', mood: '😐', shift: '08:00 - 16:00', wage: 100000, active: false },
  { id: 's3', name: 'Lê Mai', role: 'Bảo vệ', mood: '😊', shift: '22:00 - 06:00', wage: 110000, active: true },
];

const ORDERS = [
  { id: 'o1', supplier: 'Vinamilk', items: 'Sữa, Kem', status: 'Đang giao', eta: '23:30', cost: 450000 },
  { id: 'o2', supplier: 'Saigon Beer', items: 'Bia Saigon x48', status: 'Chờ xác nhận', eta: '07:00', cost: 420000 },
  { id: 'o3', supplier: 'Masan', items: 'Mì Hảo Hảo x60', status: 'Đã giao', eta: '—', cost: 165000 },
];

export default function ShopManagementPanel({ panel, onClose }: Props) {
  const isOpen = panel === 'upgrades' || panel === 'staff' || panel === 'orders' || panel === 'management';

  const panelTitle: Record<string, string> = {
    upgrades: 'Nâng Cấp Cửa Hàng',
    staff: 'Quản Lý Nhân Viên',
    orders: 'Đặt Hàng Nhà Cung Cấp',
    management: 'Quản Lý Tổng Hợp',
  };

  const panelIcon: Record<string, React.ElementType> = {
    upgrades: Zap,
    staff: Users,
    orders: ShoppingCart,
    management: Settings,
  };

  const Icon = panelIcon[panel] ?? Settings;
  const color = panel === 'upgrades' ? '#ffcc00' : panel === 'staff' ? '#ff8844' : panel === 'orders' ? '#00ff88' : '#cc88ff';

  return (
    <AnimatePresence>
      {isOpen && (
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
              border: `1px solid ${color}25`,
              backdropFilter: 'blur(20px)',
              boxShadow: `0 0 40px ${color}08`,
            }}
          >
            <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${color}80, transparent)` }} />

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-[#0a1830]">
              <div className="flex items-center gap-3">
                <Icon size={16} style={{ color, filter: `drop-shadow(0 0 6px ${color})` }} />
                <h2 className="text-white font-black text-base" style={{ fontFamily: '"Rajdhani", sans-serif' }}>
                  {panelTitle[panel]}
                </h2>
              </div>
              <motion.button onClick={onClose} className="text-[#2a4a5e] hover:text-white transition-colors p-1" whileHover={{ rotate: 90 }}>
                <X size={16} />
              </motion.button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {panel === 'upgrades' && (
                <div className="grid grid-cols-2 gap-3">
                  {UPGRADES.map((u, i) => (
                    <motion.div
                      key={u.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0, transition: { delay: i * 0.06 } }}
                      className="relative rounded p-3 cursor-pointer group overflow-hidden"
                      style={{
                        background: u.owned ? 'rgba(0,255,136,0.06)' : 'rgba(8,20,38,0.7)',
                        border: `1px solid ${u.owned ? 'rgba(0,255,136,0.25)' : 'rgba(255,204,0,0.1)'}`,
                      }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ background: `linear-gradient(135deg, ${color}08, transparent)` }}
                      />
                      <div className="flex items-start gap-2 relative z-10">
                        <span className="text-2xl">{u.icon}</span>
                        <div className="flex-1">
                          <div className="text-white text-xs font-bold" style={{ fontFamily: '"Rajdhani", sans-serif' }}>{u.label}</div>
                          <div className="text-[9px] text-[#3a6a7a] mt-0.5" style={{ fontFamily: '"Rajdhani", sans-serif' }}>{u.desc}</div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-2 relative z-10">
                        {u.owned ? (
                          <span className="text-[9px] text-[#00ff88] font-bold tracking-wider" style={{ fontFamily: '"Rajdhani", sans-serif' }}>
                            ✓ ĐÃ SỞ HỮU
                          </span>
                        ) : (
                          <motion.button
                            className="px-2 py-1 rounded text-[9px] font-bold tracking-wider"
                            style={{
                              background: 'rgba(255,204,0,0.12)',
                              border: '1px solid rgba(255,204,0,0.3)',
                              color: '#ffcc00',
                              fontFamily: '"Rajdhani", sans-serif',
                            }}
                            whileHover={{ scale: 1.05, boxShadow: '0 0 12px rgba(255,204,0,0.2)' }}
                            whileTap={{ scale: 0.97 }}
                          >
                            MUA {formatMoney(u.cost)}
                          </motion.button>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {panel === 'staff' && (
                <div className="flex flex-col gap-3">
                  {STAFF.map((s, i) => (
                    <motion.div
                      key={s.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0, transition: { delay: i * 0.08 } }}
                      className="rounded p-3 flex items-center gap-4"
                      style={{
                        background: s.active ? 'rgba(255,136,68,0.06)' : 'rgba(8,20,38,0.6)',
                        border: `1px solid ${s.active ? 'rgba(255,136,68,0.2)' : 'rgba(255,255,255,0.04)'}`,
                      }}
                    >
                      <div className="text-3xl">{s.mood}</div>
                      <div className="flex-1">
                        <div className="text-white font-bold text-sm" style={{ fontFamily: '"Rajdhani", sans-serif' }}>{s.name}</div>
                        <div className="text-[10px] text-[#3a6a7a]" style={{ fontFamily: '"Rajdhani", sans-serif' }}>
                          {s.role} • Ca: {s.shift}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-[#ffcc00] text-xs font-bold" style={{ fontFamily: '"Rajdhani", sans-serif' }}>
                          {formatMoney(s.wage)}/ca
                        </div>
                        <div
                          className="text-[9px] font-bold tracking-wider mt-0.5"
                          style={{ color: s.active ? '#00ff88' : '#3a6a7a', fontFamily: '"Rajdhani", sans-serif' }}
                        >
                          {s.active ? '● ĐANG LÀM' : '○ NGHỈ'}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  <motion.button
                    className="w-full py-2.5 rounded text-xs font-bold tracking-widest uppercase mt-1"
                    style={{
                      background: 'rgba(255,136,68,0.08)',
                      border: '1px dashed rgba(255,136,68,0.25)',
                      color: '#ff8844',
                      fontFamily: '"Rajdhani", sans-serif',
                    }}
                    whileHover={{ scale: 1.01, background: 'rgba(255,136,68,0.12)' }}
                  >
                    + Tuyển nhân viên mới
                  </motion.button>
                </div>
              )}

              {panel === 'orders' && (
                <div className="flex flex-col gap-3">
                  {ORDERS.map((o, i) => (
                    <motion.div
                      key={o.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0, transition: { delay: i * 0.08 } }}
                      className="rounded p-3"
                      style={{
                        background: 'rgba(8,20,38,0.7)',
                        border: '1px solid rgba(0,255,136,0.1)',
                      }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <div className="text-white font-bold text-sm" style={{ fontFamily: '"Rajdhani", sans-serif' }}>{o.supplier}</div>
                          <div className="text-[9px] text-[#3a6a7a]" style={{ fontFamily: '"Rajdhani", sans-serif' }}>{o.items}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-[#ffcc00] text-xs font-bold" style={{ fontFamily: '"Rajdhani", sans-serif' }}>
                            {formatMoney(o.cost)}
                          </div>
                          <div className="text-[9px] text-[#3a6a7a] mt-0.5" style={{ fontFamily: '"Rajdhani", sans-serif' }}>
                            ETA: {o.eta}
                          </div>
                        </div>
                      </div>
                      <div
                        className="text-[9px] font-bold tracking-wider px-2 py-1 rounded inline-block"
                        style={{
                          background: o.status === 'Đã giao' ? 'rgba(0,255,136,0.1)' : o.status === 'Đang giao' ? 'rgba(0,212,255,0.1)' : 'rgba(255,204,0,0.1)',
                          color: o.status === 'Đã giao' ? '#00ff88' : o.status === 'Đang giao' ? '#00d4ff' : '#ffcc00',
                          border: `1px solid ${o.status === 'Đã giao' ? 'rgba(0,255,136,0.25)' : o.status === 'Đang giao' ? 'rgba(0,212,255,0.25)' : 'rgba(255,204,0,0.25)'}`,
                          fontFamily: '"Rajdhani", sans-serif',
                        }}
                      >
                        {o.status.toUpperCase()}
                      </div>
                    </motion.div>
                  ))}
                  <motion.button
                    className="w-full py-3 rounded text-xs font-bold tracking-widest uppercase mt-1"
                    style={{
                      background: 'rgba(0,255,136,0.08)',
                      border: '1px dashed rgba(0,255,136,0.25)',
                      color: '#00ff88',
                      fontFamily: '"Rajdhani", sans-serif',
                    }}
                    whileHover={{ scale: 1.01 }}
                  >
                    + Đặt hàng mới
                  </motion.button>
                </div>
              )}

              {panel === 'management' && (
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { icon: '📊', label: 'Báo cáo doanh thu', desc: 'Xem thống kê chi tiết', color: '#00d4ff' },
                    { icon: '🎯', label: 'Mục tiêu kinh doanh', desc: 'Đặt và theo dõi KPIs', color: '#ffcc00' },
                    { icon: '📦', label: 'Quản lý nhà cung cấp', desc: 'Thêm/xóa đối tác', color: '#00ff88' },
                    { icon: '💰', label: 'Kế toán', desc: 'Thu chi, lợi nhuận', color: '#ff8844' },
                    { icon: '🌟', label: 'Chương trình khuyến mại', desc: 'Tạo ưu đãi cho khách', color: '#ff3366' },
                    { icon: '📱', label: 'Mạng xã hội', desc: 'Quảng bá cửa hàng', color: '#cc88ff' },
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1, transition: { delay: i * 0.06 } }}
                      className="rounded p-3 cursor-pointer group"
                      style={{
                        background: 'rgba(8,20,38,0.7)',
                        border: `1px solid ${item.color}18`,
                      }}
                      whileHover={{ scale: 1.02, borderColor: `${item.color}40` }}
                    >
                      <span className="text-2xl block mb-2">{item.icon}</span>
                      <div className="text-white font-bold text-xs" style={{ fontFamily: '"Rajdhani", sans-serif' }}>{item.label}</div>
                      <div className="text-[9px] text-[#2a4a5e] mt-0.5" style={{ fontFamily: '"Rajdhani", sans-serif' }}>{item.desc}</div>
                      <div className="mt-2 flex items-center gap-1">
                        <TrendingUp size={8} style={{ color: item.color }} />
                        <span className="text-[9px]" style={{ color: item.color, fontFamily: '"Rajdhani", sans-serif' }}>Mở</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
