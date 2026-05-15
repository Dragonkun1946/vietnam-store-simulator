import type { SaveSlot, Product, FeedItem, Objective } from '../types/game';

export const SAVE_SLOTS: SaveSlot[] = [
  {
    id: 1,
    isEmpty: false,
    storeName: 'Cửa Hàng Sao Mai',
    day: 47,
    money: 2_840_000,
    storeLevel: 3,
    playtime: '12h 34m',
    popularity: 78,
  },
  {
    id: 2,
    isEmpty: false,
    storeName: 'Mini Mart Hà Nội',
    day: 12,
    money: 540_000,
    storeLevel: 1,
    playtime: '3h 02m',
    popularity: 42,
  },
  { id: 3, isEmpty: true },
];

export const PRODUCTS: Product[] = [
  { id: 'p1', name: 'Bia Saigon', nameVi: 'Bia Sài Gòn', category: 'drinks', stock: 24, maxStock: 48, price: 15000, cost: 9000, icon: '🍺' },
  { id: 'p2', name: 'Red Bull', nameVi: 'Nước Tăng Lực', category: 'drinks', stock: 8, maxStock: 36, price: 12000, cost: 7500, icon: '🥤' },
  { id: 'p3', name: 'Mì Hảo Hảo', nameVi: 'Mì Hảo Hảo', category: 'instant', stock: 52, maxStock: 60, price: 5000, cost: 2800, icon: '🍜' },
  { id: 'p4', name: 'Bánh Oreo', nameVi: 'Bánh Oreo', category: 'snacks', stock: 3, maxStock: 24, price: 22000, cost: 14000, icon: '🍪' },
  { id: 'p5', name: 'Thuốc Lá Thăng Long', nameVi: 'Thuốc Lá', category: 'tobacco', stock: 15, maxStock: 30, price: 28000, cost: 20000, icon: '🚬' },
  { id: 'p6', name: 'Nước Mắm', nameVi: 'Nước Mắm', category: 'household', stock: 9, maxStock: 20, price: 35000, cost: 22000, icon: '🫙' },
  { id: 'p7', name: 'Trà Lipton', nameVi: 'Trà Lipton', category: 'drinks', stock: 0, maxStock: 30, price: 8000, cost: 4500, icon: '🍵' },
  { id: 'p8', name: 'Kẹo Dừa', nameVi: 'Kẹo Dừa', category: 'snacks', stock: 18, maxStock: 40, price: 3000, cost: 1500, icon: '🍬' },
  { id: 'p9', name: 'Xúc Xích', nameVi: 'Xúc Xích', category: 'fresh', stock: 6, maxStock: 15, price: 18000, cost: 11000, icon: '🌭' },
  { id: 'p10', name: 'C2 Trà Xanh', nameVi: 'C2 Trà Xanh', category: 'drinks', stock: 20, maxStock: 40, price: 7000, cost: 4000, icon: '🍶' },
  { id: 'p11', name: 'Pepsi', nameVi: 'Pepsi', category: 'drinks', stock: 12, maxStock: 48, price: 10000, cost: 6000, icon: '🥤' },
  { id: 'p12', name: 'Snack Oishi', nameVi: 'Snack Oishi', category: 'snacks', stock: 28, maxStock: 36, price: 5000, cost: 2500, icon: '🍿' },
];

export const INITIAL_FEED: FeedItem[] = [
  { id: 'f1', type: 'sale', message: 'Nguyễn Văn A mua Mì Hảo Hảo x3', amount: 15000, time: '22:41', icon: '💰' },
  { id: 'f2', type: 'alert', message: 'Hết hàng! Trà Lipton cần nhập thêm', time: '22:39', icon: '⚠️' },
  { id: 'f3', type: 'arrival', message: 'Nhà cung cấp Vinamilk sắp đến', time: '22:38', icon: '🚚' },
  { id: 'f4', type: 'trend', message: 'Xu hướng: Bia tăng 40% tối nay', time: '22:35', icon: '📈' },
  { id: 'f5', type: 'sale', message: 'Trần Thị B mua Bia Saigon x6', amount: 90000, time: '22:33', icon: '💰' },
  { id: 'f6', type: 'notification', message: 'Khách hàng mới để lại 5 sao ⭐', time: '22:30', icon: '⭐' },
];

export const OBJECTIVES: Objective[] = [
  { id: 'o1', label: 'Bổ sung hàng kệ', current: 3, target: 5, reward: 50000, completed: false },
  { id: 'o2', label: 'Dọn dẹp cửa hàng', current: 0, target: 1, reward: 20000, completed: false },
  { id: 'o3', label: 'Đạt doanh thu ngày', current: 840000, target: 1000000, reward: 100000, completed: false },
  { id: 'o4', label: 'Phục vụ 20 khách', current: 14, target: 20, reward: 30000, completed: false },
];

export const CUSTOMER_THOUGHTS = [
  { mood: 'happy' as const, thought: 'Giá hợp lý!', reaction: '😊' },
  { mood: 'delighted' as const, thought: 'Tuyệt vời!', reaction: '🤩' },
  { mood: 'neutral' as const, thought: 'Bình thường...', reaction: '😐' },
  { mood: 'annoyed' as const, thought: 'Hết hàng rồi!', reaction: '😤' },
  { mood: 'happy' as const, thought: 'Lần sau quay lại!', reaction: '👍' },
  { mood: 'delighted' as const, thought: 'Rẻ quá!', reaction: '😍' },
  { mood: 'annoyed' as const, thought: 'Chờ lâu quá...', reaction: '😒' },
];

export const formatMoney = (amount: number): string => {
  if (amount >= 1_000_000) return `${(amount / 1_000_000).toFixed(1)}M ₫`;
  if (amount >= 1_000) return `${(amount / 1_000).toFixed(0)}K ₫`;
  return `${amount} ₫`;
};
