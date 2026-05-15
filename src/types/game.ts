export type GameScreen = 'menu' | 'game' | 'settings';
export type GamePanel = 'none' | 'inventory' | 'orders' | 'upgrades' | 'staff' | 'management';

export interface SaveSlot {
  id: number;
  isEmpty: boolean;
  storeName?: string;
  day?: number;
  money?: number;
  storeLevel?: number;
  playtime?: string;
  popularity?: number;
  thumbnail?: string;
}

export interface Product {
  id: string;
  name: string;
  nameVi: string;
  category: 'drinks' | 'snacks' | 'instant' | 'tobacco' | 'household' | 'fresh';
  stock: number;
  maxStock: number;
  price: number;
  cost: number;
  icon: string;
}

export interface Customer {
  id: string;
  name: string;
  mood: 'happy' | 'neutral' | 'annoyed' | 'delighted';
  thought?: string;
  reaction?: string;
  x: number;
  y: number;
}

export interface FeedItem {
  id: string;
  type: 'sale' | 'alert' | 'arrival' | 'trend' | 'notification';
  message: string;
  amount?: number;
  time: string;
  icon: string;
}

export interface Objective {
  id: string;
  label: string;
  current: number;
  target: number;
  reward: number;
  completed: boolean;
}

export interface GameState {
  screen: GameScreen;
  panel: GamePanel;
  saveOverlay: boolean;
  day: number;
  hour: number;
  minute: number;
  money: number;
  dailyRevenue: number;
  customerCount: number;
  popularity: number;
  storeLevel: number;
  storeName: string;
  weather: 'rainy' | 'storm' | 'drizzle';
  electricity: number;
  cleanliness: number;
  reputation: number;
  satisfaction: number;
}
