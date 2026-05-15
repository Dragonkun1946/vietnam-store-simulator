import { useState, useEffect, useRef, useCallback } from "react";

// ─── PRODUCT DATABASE ───────────────────────────────────────────────────────
const PRODUCTS = [
  { id: "mi_goi", name: "Mì Gói", emoji: "🍜", category: "food", baseCost: 3500, basePrice: 5000, demand: 0.8, icon: "🍜", weatherBoost: "rainy" },
  { id: "nuoc_ngot", name: "Nước Ngọt", emoji: "🥤", category: "drink", baseCost: 6000, basePrice: 9000, demand: 0.7, icon: "🥤", weatherBoost: "hot" },
  { id: "banh_gao", name: "Bánh Gạo", emoji: "🍘", category: "snack", baseCost: 4000, basePrice: 6000, demand: 0.5, icon: "🍘" },
  { id: "sua_tuoi", name: "Sữa Tươi", emoji: "🥛", category: "drink", baseCost: 8000, basePrice: 12000, demand: 0.6, icon: "🥛" },
  { id: "ca_phe", name: "Cà Phê", emoji: "☕", category: "drink", baseCost: 5000, basePrice: 8000, demand: 0.65, icon: "☕", weatherBoost: "rainy" },
  { id: "nuoc_tang_luc", name: "Nước Tăng Lực", emoji: "⚡", category: "drink", baseCost: 7000, basePrice: 11000, demand: 0.55, icon: "⚡" },
  { id: "keo_cuoi", name: "Kẹo Cứng", emoji: "🍬", category: "snack", baseCost: 2000, basePrice: 4000, demand: 0.45, icon: "🍬" },
  { id: "thuoc_la", name: "Thuốc Lá", emoji: "🚬", category: "adult", baseCost: 20000, basePrice: 28000, demand: 0.4, icon: "🚬" },
  { id: "do_hop", name: "Đồ Hộp", emoji: "🥫", category: "food", baseCost: 12000, basePrice: 18000, demand: 0.35, icon: "🥫" },
  { id: "giay_ve_sinh", name: "Giấy Vệ Sinh", emoji: "🧻", category: "household", baseCost: 9000, basePrice: 14000, demand: 0.3, icon: "🧻" },
  { id: "dau_goi", name: "Dầu Gội", emoji: "🧴", category: "household", baseCost: 18000, basePrice: 25000, demand: 0.25, icon: "🧴" },
  { id: "tra_da", name: "Trà Đá Pha Sẵn", emoji: "🧊", category: "drink", baseCost: 4000, basePrice: 7000, demand: 0.7, icon: "🧊", weatherBoost: "hot" },
];

const WEATHER_TYPES = ["rainy", "cloudy", "sunny", "hot"];
const WEATHER_ICONS = { rainy: "🌧️", cloudy: "☁️", sunny: "☀️", hot: "🔥" };

const CUSTOMER_NAMES = ["Minh", "Lan", "Hùng", "Thảo", "Tuấn", "Hoa", "Đức", "Mai", "Long", "Nga", "Phong", "Linh"];
const CUSTOMER_MOODS = ["😊", "😐", "😤", "🤑", "😍", "🙂"];

const UPGRADES = [
  { id: "second_shelf", name: "Kệ Hàng 2", desc: "+4 shelf slots", cost: 50000, icon: "🗄️", effect: { shelfSlots: 4 } },
  { id: "fridge", name: "Tủ Lạnh", desc: "+20% drink demand", cost: 120000, icon: "❄️", effect: { drinkDemand: 0.2 } },
  { id: "sign", name: "Biển Hiệu LED", desc: "+15% foot traffic", cost: 80000, icon: "💡", effect: { traffic: 0.15 } },
  { id: "cctv", name: "Camera CCTV", desc: "-10% theft events", cost: 65000, icon: "📹", effect: { theft: -0.1 } },
  { id: "fan", name: "Quạt Trần", desc: "+10% hot weather sales", cost: 40000, icon: "💨", effect: { hotBoost: 0.1 } },
  { id: "pos", name: "Máy Tính Tiền", desc: "+5% revenue efficiency", cost: 150000, icon: "🖥️", effect: { efficiency: 0.05 } },
];

const DAILY_TASKS = [
  { id: "sell_10", desc: "Bán 10 sản phẩm", target: 10, type: "sales_count", reward: 5000 },
  { id: "earn_50k", desc: "Kiếm 50,000đ hôm nay", target: 50000, type: "daily_revenue", reward: 8000 },
  { id: "serve_5", desc: "Phục vụ 5 khách hàng", target: 5, type: "customers_served", reward: 6000 },
  { id: "restock", desc: "Nhập hàng 3 loại", target: 3, type: "restock_types", reward: 4000 },
];

const RANDOM_EVENTS = [
  { id: "power_cut", desc: "⚡ Cúp điện! Chi phí sửa chữa", effect: -15000, type: "cost" },
  { id: "rush_hour", desc: "🎉 Giờ cao điểm! Khách tăng gấp đôi", effect: 2, type: "traffic_mult", duration: 3 },
  { id: "trending_mi", desc: "📱 Mì gói lên trending TikTok!", effect: "mi_goi", type: "trending" },
  { id: "supplier_sale", desc: "🚚 Nhà cung cấp giảm giá 20%!", effect: 0.8, type: "cost_mult", duration: 1 },
  { id: "health_inspector", desc: "👮 Kiểm tra vệ sinh! Chi phí dọn dẹp", effect: -8000, type: "cost" },
  { id: "good_review", desc: "⭐ Review 5 sao trên Google!", effect: 10, type: "reputation" },
];

// ─── FORMAT UTILS ────────────────────────────────────────────────────────────
const fmt = (n) => new Intl.NumberFormat("vi-VN").format(Math.round(n)) + "đ";
const fmtShort = (n) => {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + "tr";
  if (n >= 1000) return Math.round(n / 1000) + "k";
  return Math.round(n) + "đ";
};

// ─── INITIAL STATE ──────────────────────────────────────────────────────────
const createInitialState = () => ({
  money: 250000,
  day: 1,
  hour: 8,
  minute: 0,
  weather: "rainy",
  reputation: 50,
  storeLevel: 1,
  customersToday: 0,
  salesToday: 0,
  revenueToday: 0,
  totalRevenue: 0,
  totalDays: 0,
  shopOpen: true,
  inventory: Object.fromEntries(PRODUCTS.map(p => [p.id, { stock: 0, shelf: 0, price: p.basePrice }])),
  upgrades: [],
  trendingProduct: null,
  activeEvent: null,
  costMultiplier: 1,
  trafficMultiplier: 1,
  dailyTasks: DAILY_TASKS.slice(0, 3).map(t => ({ ...t, progress: 0, done: false })),
  taskReset: 1,
  notifications: [],
  customers: [],
  dailySummaries: [],
  dayPhase: "morning", // morning, afternoon, evening, night
  lastSaveTime: Date.now(),
});

// ─── SAVE SYSTEM ────────────────────────────────────────────────────────────
const SAVE_SLOTS = 3;
const getSaveKey = (slot) => `vss_save_slot_${slot}`;
const getAutosaveKey = () => "vss_autosave";

function saveGame(state, slot) {
  const saveData = { ...state, customers: [], notifications: [], savedAt: Date.now(), version: 1 };
  try {
    if (slot === "auto") localStorage.setItem(getAutosaveKey(), JSON.stringify(saveData));
    else localStorage.setItem(getSaveKey(slot), JSON.stringify(saveData));
    return true;
  } catch { return false; }
}

function loadGame(slot) {
  try {
    const raw = slot === "auto"
      ? localStorage.getItem(getAutosaveKey())
      : localStorage.getItem(getSaveKey(slot));
    if (!raw) return null;
    return { ...createInitialState(), ...JSON.parse(raw), customers: [], notifications: [] };
  } catch { return null; }
}

function getSaveMetadata(slot) {
  try {
    const raw = slot === "auto"
      ? localStorage.getItem(getAutosaveKey())
      : localStorage.getItem(getSaveKey(slot));
    if (!raw) return null;
    const d = JSON.parse(raw);
    return { day: d.day, money: d.money, savedAt: d.savedAt, storeLevel: d.storeLevel };
  } catch { return null; }
}

function deleteSave(slot) {
  try {
    if (slot === "auto") localStorage.removeItem(getAutosaveKey());
    else localStorage.removeItem(getSaveKey(slot));
    return true;
  } catch { return false; }
}

// ─── MAIN APP ───────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState("main_menu"); // main_menu, game, end_day
  const [gameState, setGameState] = useState(null);
  const [activeTab, setActiveTab] = useState("store");
  const [showSaveMenu, setShowSaveMenu] = useState(false);
  const [showLoadMenu, setShowLoadMenu] = useState(false);
  const [showUpgrades, setShowUpgrades] = useState(false);
  const [showEndDay, setShowEndDay] = useState(false);
  const [orderProduct, setOrderProduct] = useState(null);
  const [orderQty, setOrderQty] = useState(10);
  const [saveStatus, setSaveStatus] = useState("");
  const [trendingCelebration, setTrendingCelebration] = useState(null);
  const tickRef = useRef(null);
  const autosaveRef = useRef(null);

  // ── GAME TICK ──
  const gameTick = useCallback(() => {
    setGameState(prev => {
      if (!prev || !prev.shopOpen) return prev;
      let s = { ...prev };
      s.notifications = [...(s.notifications || [])].filter(n => Date.now() - n.time < 4000);

      // Advance time
      s.minute += 1;
      if (s.minute >= 60) { s.minute = 0; s.hour += 1; }
      if (s.hour >= 23) {
        // END OF DAY
        return triggerEndOfDay(s);
      }

      // Day phase
      if (s.hour < 12) s.dayPhase = "morning";
      else if (s.hour < 17) s.dayPhase = "afternoon";
      else if (s.hour < 20) s.dayPhase = "evening";
      else s.dayPhase = "night";

      // Spawn customers
      const trafficBase = getTrafficRate(s);
      if (Math.random() < trafficBase) {
        s = spawnCustomer(s);
      }

      // Process existing customers
      s = processCustomers(s);

      // Random event chance (rare)
      if (Math.random() < 0.002 && !s.activeEvent) {
        s = triggerRandomEvent(s);
      }

      return s;
    });
  }, []);

  useEffect(() => {
    if (screen !== "game") return;
    tickRef.current = setInterval(gameTick, 800);
    autosaveRef.current = setInterval(() => {
      setGameState(prev => {
        if (prev) saveGame(prev, "auto");
        return prev;
      });
    }, 30000);
    return () => { clearInterval(tickRef.current); clearInterval(autosaveRef.current); };
  }, [screen, gameTick]);

  const startNewGame = () => {
    setGameState(createInitialState());
    setScreen("game");
    setActiveTab("store");
  };

  const continueGame = (slot) => {
    const saved = loadGame(slot);
    if (saved) { setGameState(saved); setScreen("game"); setShowLoadMenu(false); }
  };

  const handleSave = (slot) => {
    if (gameState) {
      const ok = saveGame(gameState, slot);
      setSaveStatus(ok ? `✓ Đã lưu slot ${slot}` : "✗ Lỗi lưu");
      setTimeout(() => setSaveStatus(""), 2000);
      setShowSaveMenu(false);
    }
  };

  const addNotification = (msg, type = "info") => {
    setGameState(prev => ({
      ...prev,
      notifications: [...(prev.notifications || []).slice(-4), { id: Date.now() + Math.random(), msg, type, time: Date.now() }]
    }));
  };

  const handleOrder = (productId, qty) => {
    setGameState(prev => {
      const product = PRODUCTS.find(p => p.id === productId);
      if (!product) return prev;
      const cost = Math.round(product.baseCost * qty * (prev.costMultiplier || 1));
      if (prev.money < cost) return { ...prev, notifications: [...(prev.notifications || []), { id: Date.now(), msg: "❌ Không đủ tiền!", type: "error", time: Date.now() }] };
      const inv = { ...prev.inventory };
      inv[productId] = { ...inv[productId], stock: (inv[productId].stock || 0) + qty };
      const tasks = prev.dailyTasks.map(t => {
        if (t.type === "restock_types" && !t.done) {
          const newProg = Math.min(t.progress + 1, t.target);
          return { ...t, progress: newProg, done: newProg >= t.target };
        }
        return t;
      });
      const notif = [{ id: Date.now(), msg: `📦 +${qty} ${product.name} (${fmt(cost)})`, type: "order", time: Date.now() }];
      return { ...prev, money: prev.money - cost, inventory: inv, dailyTasks: tasks, notifications: [...(prev.notifications || []).slice(-4), ...notif] };
    });
    setOrderProduct(null);
  };

  const handleStock = (productId, qty) => {
    setGameState(prev => {
      const inv = { ...prev.inventory };
      const item = inv[productId];
      const toShelf = Math.min(qty, item.stock || 0);
      if (toShelf <= 0) return prev;
      inv[productId] = { ...item, stock: item.stock - toShelf, shelf: (item.shelf || 0) + toShelf };
      return { ...prev, inventory: inv };
    });
  };

  const handlePriceChange = (productId, newPrice) => {
    setGameState(prev => {
      const inv = { ...prev.inventory };
      inv[productId] = { ...inv[productId], price: newPrice };
      return { ...prev, inventory: inv };
    });
  };

  const handleBuyUpgrade = (upgrade) => {
    setGameState(prev => {
      if (prev.money < upgrade.cost || prev.upgrades.includes(upgrade.id)) return prev;
      const notif = { id: Date.now(), msg: `✨ Mua ${upgrade.name}!`, type: "upgrade", time: Date.now() };
      return {
        ...prev,
        money: prev.money - upgrade.cost,
        upgrades: [...prev.upgrades, upgrade.id],
        notifications: [...(prev.notifications || []).slice(-4), notif]
      };
    });
    setShowUpgrades(false);
  };

  const handleEndDayContinue = () => {
    setShowEndDay(false);
    setGameState(prev => ({
      ...prev,
      day: prev.day + 1,
      hour: 8,
      minute: 0,
      customersToday: 0,
      salesToday: 0,
      revenueToday: 0,
      shopOpen: true,
      weather: WEATHER_TYPES[Math.floor(Math.random() * WEATHER_TYPES.length)],
      dailyTasks: DAILY_TASKS.slice(0, 3).map(t => ({ ...t, progress: 0, done: false })),
      activeEvent: null,
      trafficMultiplier: 1,
      costMultiplier: 1,
    }));
  };

  if (screen === "main_menu") return <MainMenu
    onNew={startNewGame}
    onLoad={() => setShowLoadMenu(true)}
    showLoadMenu={showLoadMenu}
    setShowLoadMenu={setShowLoadMenu}
    onContinue={continueGame}
    onDelete={deleteSave}
  />;

  if (!gameState) return null;

  return (
    <div className="game-root">
      <RainBackground weather={gameState.weather} />
      <div className="game-overlay">
        {/* TOP HUD */}
        <TopHUD state={gameState} onSave={() => setShowSaveMenu(true)} onLoad={() => setShowLoadMenu(true)} saveStatus={saveStatus} />

        {/* NOTIFICATIONS */}
        <NotificationStack notifications={gameState.notifications || []} />

        {/* EVENT BANNER */}
        {gameState.activeEvent && <EventBanner event={gameState.activeEvent} />}

        {/* TRENDING BANNER */}
        {gameState.trendingProduct && <TrendingBanner productId={gameState.trendingProduct} />}

        {/* MAIN CONTENT */}
        <div className="game-content">
          {/* CUSTOMER AREA */}
          <CustomerArea customers={gameState.customers || []} />

          {/* TABS */}
          <div className="tab-bar">
            {["store", "inventory", "tasks", "stats"].map(tab => (
              <button key={tab} className={`tab-btn ${activeTab === tab ? "active" : ""}`} onClick={() => setActiveTab(tab)}>
                {tab === "store" && "🏪 Cửa Hàng"}
                {tab === "inventory" && "📦 Nhập Hàng"}
                {tab === "tasks" && "📋 Nhiệm Vụ"}
                {tab === "stats" && "📊 Thống Kê"}
              </button>
            ))}
            <button className="tab-btn upgrade-btn" onClick={() => setShowUpgrades(true)}>⚙️ Nâng Cấp</button>
          </div>

          {/* TAB CONTENT */}
          <div className="tab-content">
            {activeTab === "store" && <StoreTab state={gameState} onStock={handleStock} onPriceChange={handlePriceChange} />}
            {activeTab === "inventory" && <InventoryTab state={gameState} onOrder={(pid) => { setOrderProduct(pid); setOrderQty(10); }} />}
            {activeTab === "tasks" && <TasksTab state={gameState} />}
            {activeTab === "stats" && <StatsTab state={gameState} />}
          </div>
        </div>

        {/* MODALS */}
        {showSaveMenu && <SaveModal onClose={() => setShowSaveMenu(false)} onSave={handleSave} />}
        {showLoadMenu && <LoadModal onClose={() => setShowLoadMenu(false)} onLoad={continueGame} onDelete={deleteSave} />}
        {showUpgrades && <UpgradesModal state={gameState} onClose={() => setShowUpgrades(false)} onBuy={handleBuyUpgrade} />}
        {orderProduct && <OrderModal product={PRODUCTS.find(p => p.id === orderProduct)} qty={orderQty} setQty={setOrderQty} costMult={gameState.costMultiplier} onConfirm={() => handleOrder(orderProduct, orderQty)} onClose={() => setOrderProduct(null)} />}
        {showEndDay && <EndDayModal state={gameState} onContinue={handleEndDayContinue} />}
      </div>

      <style>{GAME_CSS}</style>
    </div>
  );

  function triggerEndOfDay(s) {
    const electricityBill = 15000 + (s.storeLevel * 5000);
    const newMoney = s.money - electricityBill;
    const summary = {
      day: s.day,
      revenue: s.revenueToday,
      customers: s.customersToday,
      sales: s.salesToday,
      electricityBill,
      profit: s.revenueToday - electricityBill,
    };
    setShowEndDay(true);
    return {
      ...s,
      money: Math.max(0, newMoney),
      shopOpen: false,
      hour: 23,
      minute: 59,
      totalRevenue: s.totalRevenue + s.revenueToday,
      totalDays: s.totalDays + 1,
      dailySummaries: [...(s.dailySummaries || []).slice(-6), summary],
      reputation: Math.min(100, s.reputation + (s.customersToday > 5 ? 2 : 0)),
    };
  }
}

// ─── GAME LOGIC HELPERS ─────────────────────────────────────────────────────
function getTrafficRate(s) {
  let base = 0.08;
  if (s.dayPhase === "morning") base = 0.06;
  if (s.dayPhase === "afternoon") base = 0.10;
  if (s.dayPhase === "evening") base = 0.14;
  if (s.dayPhase === "night") base = 0.04;
  if (s.weather === "rainy") base *= 0.8;
  base *= (s.trafficMultiplier || 1);
  if (s.upgrades?.includes("sign")) base *= 1.15;
  base *= (1 + (s.reputation - 50) / 200);
  return Math.min(base, 0.3);
}

function spawnCustomer(s) {
  const mood = CUSTOMER_MOODS[Math.floor(Math.random() * CUSTOMER_MOODS.length)];
  const customer = {
    id: Date.now() + Math.random(),
    name: CUSTOMER_NAMES[Math.floor(Math.random() * CUSTOMER_NAMES.length)],
    mood,
    phase: "entering", // entering, browsing, buying, leaving
    timer: 0,
    x: Math.random() * 80 + 10,
    thought: "🛒",
    budget: Math.floor(Math.random() * 60000) + 15000,
    spent: 0,
    wantsToBuy: pickCustomerProducts(s),
  };
  return { ...s, customers: [...(s.customers || []).slice(-6), customer] };
}

function pickCustomerProducts(s) {
  const wants = [];
  PRODUCTS.forEach(p => {
    const inv = s.inventory[p.id];
    if (!inv || (inv.shelf || 0) <= 0) return;
    let demand = p.demand;
    if (s.trendingProduct === p.id) demand += 0.3;
    if (s.weather === p.weatherBoost) demand += 0.2;
    if (s.upgrades?.includes("fridge") && p.category === "drink") demand += 0.2;
    if (Math.random() < demand) {
      const qty = Math.floor(Math.random() * 3) + 1;
      wants.push({ productId: p.id, qty: Math.min(qty, inv.shelf) });
    }
  });
  return wants;
}

function processCustomers(s) {
  let state = { ...s };
  const newCustomers = [];
  let moneyGained = 0;
  let salesCount = 0;
  const newNotifs = [...(state.notifications || [])];

  for (const c of state.customers || []) {
    const updated = { ...c, timer: c.timer + 1 };
    if (c.phase === "entering" && c.timer > 2) {
      updated.phase = "browsing";
      updated.timer = 0;
      updated.thought = ["👀", "🤔", "🛒", "😊"][Math.floor(Math.random() * 4)];
    } else if (c.phase === "browsing" && c.timer > 5) {
      updated.phase = "buying";
      updated.timer = 0;
    } else if (c.phase === "buying" && c.timer > 2) {
      // Process purchase
      let purchaseTotal = 0;
      const inv = { ...state.inventory };
      for (const want of c.wantsToBuy || []) {
        const item = inv[want.productId];
        if (!item || item.shelf <= 0) continue;
        const product = PRODUCTS.find(p => p.id === want.productId);
        const qty = Math.min(want.qty, item.shelf);
        const price = item.price || product.basePrice;
        const total = price * qty;
        if (c.budget - c.spent >= total) {
          purchaseTotal += total;
          salesCount += qty;
          inv[want.productId] = { ...item, shelf: item.shelf - qty };
        }
      }
      if (purchaseTotal > 0) {
        moneyGained += purchaseTotal;
        updated.spent = purchaseTotal;
        updated.thought = `+${fmtShort(purchaseTotal)}`;
        if (Math.random() < 0.4) {
          newNotifs.push({ id: Date.now() + Math.random(), msg: `${c.mood} ${c.name} mua ${fmtShort(purchaseTotal)}`, type: "sale", time: Date.now() });
        }
      } else {
        updated.thought = "😕";
      }
      updated.phase = "leaving";
      updated.timer = 0;
      state = { ...state, inventory: inv };
    } else if (c.phase === "leaving" && c.timer > 3) {
      continue; // Remove customer
    }
    newCustomers.push(updated);
  }

  // Update daily task progress
  let tasks = state.dailyTasks || [];
  tasks = tasks.map(t => {
    if (t.done) return t;
    if (t.type === "sales_count") {
      const np = Math.min(t.progress + salesCount, t.target);
      return { ...t, progress: np, done: np >= t.target };
    }
    if (t.type === "daily_revenue") {
      const np = Math.min(t.progress + moneyGained, t.target);
      return { ...t, progress: np, done: np >= t.target };
    }
    if (t.type === "customers_served") {
      const served = (state.customers || []).filter(c => c.phase === "leaving").length;
      const np = Math.min(t.progress + served, t.target);
      return { ...t, progress: np, done: np >= t.target };
    }
    return t;
  });

  const completedTasks = tasks.filter(t => t.done && !(state.dailyTasks || []).find(ot => ot.id === t.id)?.done);
  completedTasks.forEach(t => {
    newNotifs.push({ id: Date.now() + Math.random(), msg: `✅ Nhiệm vụ hoàn thành! +${fmtShort(t.reward)}`, type: "task", time: Date.now() });
    moneyGained += t.reward;
  });

  const customersServed = (state.customers || []).filter(c => c.phase === "leaving").length;

  return {
    ...state,
    customers: newCustomers,
    money: state.money + moneyGained,
    salesToday: (state.salesToday || 0) + salesCount,
    revenueToday: (state.revenueToday || 0) + moneyGained,
    customersToday: (state.customersToday || 0) + customersServed,
    notifications: newNotifs.slice(-5),
    dailyTasks: tasks,
  };
}

function triggerRandomEvent(s) {
  const event = RANDOM_EVENTS[Math.floor(Math.random() * RANDOM_EVENTS.length)];
  let state = { ...s, activeEvent: event };
  const notif = { id: Date.now(), msg: event.desc, type: "event", time: Date.now() };
  state.notifications = [...(s.notifications || []).slice(-3), notif];
  if (event.type === "cost") state.money = Math.max(0, s.money + event.effect);
  if (event.type === "traffic_mult") state.trafficMultiplier = event.effect;
  if (event.type === "trending") state.trendingProduct = event.effect;
  if (event.type === "cost_mult") state.costMultiplier = event.effect;
  if (event.type === "reputation") state.reputation = Math.min(100, s.reputation + event.effect);
  return state;
}

// ─── COMPONENTS ─────────────────────────────────────────────────────────────
function RainBackground({ weather }) {
  const drops = Array.from({ length: weather === "rainy" ? 60 : weather === "cloudy" ? 20 : 5 }, (_, i) => i);
  return (
    <div className="rain-bg">
      <div className={`sky-gradient sky-${weather}`} />
      {(weather === "rainy" || weather === "cloudy") && drops.map(i => (
        <div key={i} className="rain-drop" style={{ left: `${(i * 1.7 + 3) % 100}%`, animationDuration: `${0.4 + (i % 5) * 0.15}s`, animationDelay: `${(i * 0.08) % 1}s`, opacity: weather === "rainy" ? 0.6 : 0.2 }} />
      ))}
      <div className="street-glow" />
      <div className="neon-reflection" />
    </div>
  );
}

function TopHUD({ state, onSave, onLoad, saveStatus }) {
  const timeStr = `${String(state.hour).padStart(2, "0")}:${String(state.minute).padStart(2, "0")}`;
  const phaseColors = { morning: "#ffd700", afternoon: "#ff8c00", evening: "#ff4500", night: "#4169e1" };
  return (
    <div className="top-hud">
      <div className="hud-left">
        <div className="store-name">🏪 CHỢ ĐÊM MINI</div>
        <div className="store-level">Cấp {state.storeLevel} · Danh Tiếng {state.reputation}⭐</div>
      </div>
      <div className="hud-center">
        <div className="time-display" style={{ color: phaseColors[state.dayPhase] || "#fff" }}>
          {timeStr}
        </div>
        <div className="day-weather">Ngày {state.day} · {WEATHER_ICONS[state.weather]} {state.weather === "rainy" ? "Mưa" : state.weather === "hot" ? "Nắng Nóng" : state.weather === "sunny" ? "Nắng" : "Mây"}</div>
      </div>
      <div className="hud-right">
        <div className="money-display">{fmt(state.money)}</div>
        <div className="revenue-today">Hôm nay: +{fmtShort(state.revenueToday || 0)}</div>
        <div className="hud-buttons">
          <button className="hud-btn" onClick={onSave}>💾 Lưu</button>
          <button className="hud-btn" onClick={onLoad}>📂 Tải</button>
        </div>
        {saveStatus && <div className="save-status">{saveStatus}</div>}
      </div>
    </div>
  );
}

function NotificationStack({ notifications }) {
  return (
    <div className="notif-stack">
      {notifications.map(n => (
        <div key={n.id} className={`notif notif-${n.type}`}>{n.msg}</div>
      ))}
    </div>
  );
}

function EventBanner({ event }) {
  return <div className="event-banner">{event.desc}</div>;
}

function TrendingBanner({ productId }) {
  const p = PRODUCTS.find(p => p.id === productId);
  if (!p) return null;
  return <div className="trending-banner">🔥 {p.emoji} {p.name} đang HOT! Nhu cầu tăng vọt!</div>;
}

function CustomerArea({ customers }) {
  return (
    <div className="customer-area">
      <div className="store-scene">
        <div className="shelf-visual">
          {[0, 1, 2].map(row => (
            <div key={row} className="shelf-row">
              {PRODUCTS.slice(row * 4, row * 4 + 4).map(p => (
                <div key={p.id} className="shelf-product">{p.emoji}</div>
              ))}
            </div>
          ))}
        </div>
        <div className="customer-floor">
          {customers.filter(c => c.phase !== "leaving").map(c => (
            <div key={c.id} className="customer-sprite" style={{ left: `${c.x}%` }}>
              <div className="thought-bubble">{c.thought}</div>
              <div className="customer-avatar">{c.mood}</div>
              <div className="customer-name">{c.name}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StoreTab({ state, onStock, onPriceChange }) {
  return (
    <div className="store-tab">
      <div className="section-title">🗄️ Kệ Hàng — Quản lý sản phẩm</div>
      <div className="product-grid">
        {PRODUCTS.map(p => {
          const inv = state.inventory[p.id];
          const shelf = inv?.shelf || 0;
          const stock = inv?.stock || 0;
          const price = inv?.price || p.basePrice;
          const isTrending = state.trendingProduct === p.id;
          const isLow = shelf > 0 && shelf < 3;
          const isEmpty = shelf === 0;
          return (
            <div key={p.id} className={`product-card ${isTrending ? "trending" : ""} ${isEmpty ? "empty" : ""} ${isLow ? "low-stock" : ""}`}>
              <div className="product-header">
                <span className="product-emoji">{p.emoji}</span>
                <div className="product-info">
                  <div className="product-name">{p.name}</div>
                  {isTrending && <div className="trending-tag">🔥 HOT</div>}
                  {isLow && !isEmpty && <div className="low-tag">⚠️ Sắp hết</div>}
                  {isEmpty && <div className="empty-tag">❌ Hết hàng</div>}
                </div>
              </div>
              <div className="product-stats">
                <div className="stat-row">
                  <span>Kệ:</span><span className={`stock-num ${isLow ? "low" : ""}`}>{shelf}</span>
                </div>
                <div className="stat-row">
                  <span>Kho:</span><span>{stock}</span>
                </div>
                <div className="stat-row">
                  <span>Giá:</span>
                  <input
                    className="price-input"
                    type="number"
                    value={price}
                    step={500}
                    onChange={e => onPriceChange(p.id, parseInt(e.target.value) || price)}
                  />
                </div>
              </div>
              <button
                className={`stock-btn ${stock <= 0 ? "disabled" : ""}`}
                disabled={stock <= 0}
                onClick={() => onStock(p.id, Math.min(5, stock))}
              >
                📤 Xếp Kệ {stock > 0 ? `(${Math.min(5, stock)})` : ""}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function InventoryTab({ state, onOrder }) {
  return (
    <div className="inventory-tab">
      <div className="section-title">📦 Nhập Hàng — Đặt Mua Sản Phẩm</div>
      {state.costMultiplier < 1 && (
        <div className="discount-banner">🚚 Nhà cung cấp đang giảm giá {Math.round((1 - state.costMultiplier) * 100)}%!</div>
      )}
      <div className="order-grid">
        {PRODUCTS.map(p => {
          const inv = state.inventory[p.id];
          const stock = inv?.stock || 0;
          const shelf = inv?.shelf || 0;
          const costPer = Math.round(p.baseCost * (state.costMultiplier || 1));
          return (
            <div key={p.id} className="order-card">
              <div className="order-header">
                <span>{p.emoji}</span>
                <div>
                  <div className="order-name">{p.name}</div>
                  <div className="order-category">{p.category}</div>
                </div>
              </div>
              <div className="order-details">
                <div>Giá vốn: <b>{fmt(costPer)}</b></div>
                <div>Giá bán: <b>{fmt(inv?.price || p.basePrice)}</b></div>
                <div>Tồn kho: <b>{stock}</b> · Kệ: <b>{shelf}</b></div>
              </div>
              <button className="order-btn" onClick={() => onOrder(p.id)}>
                🛒 Đặt Hàng
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TasksTab({ state }) {
  return (
    <div className="tasks-tab">
      <div className="section-title">📋 Nhiệm Vụ Hôm Nay — Ngày {state.day}</div>
      <div className="tasks-list">
        {(state.dailyTasks || []).map(t => {
          const pct = Math.min(100, Math.round((t.progress / t.target) * 100));
          return (
            <div key={t.id} className={`task-card ${t.done ? "done" : ""}`}>
              <div className="task-header">
                <span className="task-icon">{t.done ? "✅" : "📌"}</span>
                <div className="task-info">
                  <div className="task-desc">{t.desc}</div>
                  <div className="task-reward">Thưởng: {fmt(t.reward)}</div>
                </div>
                {t.done && <div className="task-done-badge">Hoàn Thành!</div>}
              </div>
              <div className="progress-bar-wrap">
                <div className="progress-bar" style={{ width: `${pct}%` }} />
              </div>
              <div className="task-progress-text">
                {t.type === "sales_count" && `${Math.round(t.progress)}/${t.target} sản phẩm`}
                {t.type === "daily_revenue" && `${fmtShort(t.progress)}/${fmtShort(t.target)}`}
                {t.type === "customers_served" && `${Math.round(t.progress)}/${t.target} khách`}
                {t.type === "restock_types" && `${Math.round(t.progress)}/${t.target} loại`}
              </div>
            </div>
          );
        })}
      </div>
      <div className="section-title" style={{ marginTop: 20 }}>🏆 Thành Tích</div>
      <div className="achievements-list">
        {[
          { icon: "💰", name: "Triệu Phú Nhỏ", desc: "Kiếm 1,000,000đ tổng", done: (state.totalRevenue || 0) >= 1000000 },
          { icon: "👥", name: "Cửa Hàng Nổi Tiếng", desc: "Danh tiếng 80+", done: state.reputation >= 80 },
          { icon: "📦", name: "Siêu Cần Cù", desc: "Nhập hàng 10 lần", done: false },
          { icon: "⭐", name: "5 Sao", desc: "Được 5 đánh giá tốt", done: false },
        ].map(a => (
          <div key={a.name} className={`achievement-card ${a.done ? "unlocked" : "locked"}`}>
            <span className="ach-icon">{a.icon}</span>
            <div>
              <div className="ach-name">{a.name}</div>
              <div className="ach-desc">{a.desc}</div>
            </div>
            {a.done && <div className="ach-badge">✓</div>}
          </div>
        ))}
      </div>
    </div>
  );
}

function StatsTab({ state }) {
  const summaries = state.dailySummaries || [];
  const totalRevenue = state.totalRevenue || 0;
  const avgCustomers = summaries.length > 0 ? Math.round(summaries.reduce((a, s) => a + s.customers, 0) / summaries.length) : 0;
  const bestDay = summaries.length > 0 ? summaries.reduce((best, s) => s.revenue > best.revenue ? s : best, summaries[0]) : null;

  return (
    <div className="stats-tab">
      <div className="section-title">📊 Thống Kê</div>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Tổng Doanh Thu</div>
          <div className="stat-value">{fmt(totalRevenue)}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Hôm Nay</div>
          <div className="stat-value">{fmt(state.revenueToday || 0)}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Khách TB/Ngày</div>
          <div className="stat-value">{avgCustomers}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Ngày Tốt Nhất</div>
          <div className="stat-value">{bestDay ? fmt(bestDay.revenue) : "—"}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Danh Tiếng</div>
          <div className="stat-value">{state.reputation}/100 ⭐</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Cấp Cửa Hàng</div>
          <div className="stat-value">Cấp {state.storeLevel}</div>
        </div>
      </div>

      <div className="section-title" style={{ marginTop: 20 }}>📅 Lịch Sử Các Ngày</div>
      <div className="history-list">
        {summaries.length === 0 && <div className="empty-history">Chưa có dữ liệu ngày nào.</div>}
        {[...summaries].reverse().map(s => (
          <div key={s.day} className="history-row">
            <span className="history-day">Ngày {s.day}</span>
            <span className="history-revenue">+{fmt(s.revenue)}</span>
            <span className="history-customers">{s.customers} khách</span>
            <span className={`history-profit ${s.profit >= 0 ? "pos" : "neg"}`}>
              {s.profit >= 0 ? "+" : ""}{fmt(s.profit)} lãi
            </span>
          </div>
        ))}
      </div>

      <div className="section-title" style={{ marginTop: 20 }}>🗄️ Tình Trạng Kho</div>
      <div className="inventory-status">
        {PRODUCTS.map(p => {
          const inv = state.inventory[p.id];
          const total = (inv?.stock || 0) + (inv?.shelf || 0);
          return (
            <div key={p.id} className="inv-status-row">
              <span>{p.emoji} {p.name}</span>
              <div className="inv-bar-wrap">
                <div className="inv-bar" style={{ width: `${Math.min(100, total * 2)}%` }} />
              </div>
              <span className="inv-total">{total}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function UpgradesModal({ state, onClose, onBuy }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="modal-title">⚙️ Nâng Cấp Cửa Hàng</div>
        <div className="upgrades-list">
          {UPGRADES.map(u => {
            const owned = state.upgrades?.includes(u.id);
            const canAfford = state.money >= u.cost;
            return (
              <div key={u.id} className={`upgrade-card ${owned ? "owned" : ""}`}>
                <span className="upgrade-icon">{u.icon}</span>
                <div className="upgrade-info">
                  <div className="upgrade-name">{u.name}</div>
                  <div className="upgrade-desc">{u.desc}</div>
                  <div className="upgrade-cost">{owned ? "✓ Đã mua" : fmt(u.cost)}</div>
                </div>
                {!owned && (
                  <button className={`buy-btn ${!canAfford ? "cant" : ""}`} disabled={!canAfford} onClick={() => onBuy(u)}>
                    {canAfford ? "Mua" : "Thiếu tiền"}
                  </button>
                )}
              </div>
            );
          })}
        </div>
        <button className="modal-close-btn" onClick={onClose}>Đóng</button>
      </div>
    </div>
  );
}

function OrderModal({ product, qty, setQty, costMult, onConfirm, onClose }) {
  if (!product) return null;
  const costPer = Math.round(product.baseCost * (costMult || 1));
  const total = costPer * qty;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box small" onClick={e => e.stopPropagation()}>
        <div className="modal-title">{product.emoji} Đặt Hàng: {product.name}</div>
        <div className="order-modal-body">
          <div className="order-info-row">Giá vốn/cái: <b>{fmt(costPer)}</b></div>
          <div className="order-info-row">Số lượng:</div>
          <div className="qty-control">
            <button onClick={() => setQty(q => Math.max(1, q - 5))}>-5</button>
            <button onClick={() => setQty(q => Math.max(1, q - 1))}>-1</button>
            <span className="qty-num">{qty}</span>
            <button onClick={() => setQty(q => q + 1)}>+1</button>
            <button onClick={() => setQty(q => q + 5)}>+5</button>
            <button onClick={() => setQty(q => q + 20)}>+20</button>
          </div>
          <div className="order-total">Tổng: <b>{fmt(total)}</b></div>
        </div>
        <div className="modal-actions">
          <button className="confirm-btn" onClick={onConfirm}>✓ Xác Nhận</button>
          <button className="cancel-btn" onClick={onClose}>✗ Hủy</button>
        </div>
      </div>
    </div>
  );
}

function SaveModal({ onClose, onSave }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box small" onClick={e => e.stopPropagation()}>
        <div className="modal-title">💾 Lưu Game</div>
        <div className="save-slots">
          {[1, 2, 3].map(slot => {
            const meta = getSaveMetadata(slot);
            return (
              <div key={slot} className="save-slot">
                <div className="slot-info">
                  <b>Slot {slot}</b>
                  {meta ? (
                    <span>Ngày {meta.day} · {fmt(meta.money)}</span>
                  ) : (
                    <span className="empty-slot">Trống</span>
                  )}
                </div>
                <button className="save-slot-btn" onClick={() => onSave(slot)}>Lưu</button>
              </div>
            );
          })}
        </div>
        <button className="modal-close-btn" onClick={onClose}>Đóng</button>
      </div>
    </div>
  );
}

function LoadModal({ onClose, onLoad, onDelete }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box small" onClick={e => e.stopPropagation()}>
        <div className="modal-title">📂 Tải Game</div>
        <div className="save-slots">
          {["auto", 1, 2, 3].map(slot => {
            const meta = getSaveMetadata(slot);
            return (
              <div key={slot} className="save-slot">
                <div className="slot-info">
                  <b>{slot === "auto" ? "Tự Động" : `Slot ${slot}`}</b>
                  {meta ? (
                    <span>Ngày {meta.day} · {fmt(meta.money)}</span>
                  ) : (
                    <span className="empty-slot">Trống</span>
                  )}
                </div>
                <div className="slot-actions">
                  {meta && <button className="load-slot-btn" onClick={() => onLoad(slot)}>Tải</button>}
                  {meta && slot !== "auto" && <button className="delete-slot-btn" onClick={() => { onDelete(slot); }}>🗑️</button>}
                </div>
              </div>
            );
          })}
        </div>
        <button className="modal-close-btn" onClick={onClose}>Đóng</button>
      </div>
    </div>
  );
}

function EndDayModal({ state, onContinue }) {
  const s = (state.dailySummaries || []).slice(-1)[0] || {};
  const tasksDone = (state.dailyTasks || []).filter(t => t.done).length;
  const taskRewards = (state.dailyTasks || []).filter(t => t.done).reduce((a, t) => a + t.reward, 0);
  return (
    <div className="modal-overlay">
      <div className="modal-box end-day">
        <div className="end-day-title">🌙 Kết Thúc Ngày {state.day}</div>
        <div className="end-day-stats">
          <div className="end-stat"><span>💰 Doanh thu</span><b>+{fmt(s.revenue || 0)}</b></div>
          <div className="end-stat"><span>👥 Khách hàng</span><b>{s.customers || 0} người</b></div>
          <div className="end-stat"><span>🛒 Sản phẩm bán</span><b>{s.sales || 0} cái</b></div>
          <div className="end-stat neg"><span>⚡ Hóa đơn điện</span><b>-{fmt(s.electricityBill || 0)}</b></div>
          <div className="end-stat task"><span>✅ Nhiệm vụ ({tasksDone}/{(state.dailyTasks || []).length})</span><b>+{fmt(taskRewards)}</b></div>
          <div className={`end-stat total ${(s.profit || 0) >= 0 ? "pos" : "neg"}`}>
            <span>📊 Lãi/Lỗ</span><b>{(s.profit || 0) >= 0 ? "+" : ""}{fmt(s.profit || 0)}</b>
          </div>
        </div>
        <div className="end-day-message">
          {(s.profit || 0) > 50000 ? "🎉 Xuất sắc! Cửa hàng ngày hôm nay kinh doanh rất tốt!" :
           (s.profit || 0) > 0 ? "👍 Tốt lắm! Ngày mai tiếp tục cố gắng nhé!" :
           "😅 Khó khăn hôm nay... Cần nhập thêm hàng và điều chỉnh giá cả!"}
        </div>
        <button className="continue-btn" onClick={onContinue}>🌅 Bắt Đầu Ngày {state.day + 1}</button>
      </div>
    </div>
  );
}

function MainMenu({ onNew, onLoad, showLoadMenu, setShowLoadMenu, onContinue, onDelete }) {
  const autosave = getSaveMetadata("auto");
  return (
    <div className="main-menu">
      <RainBackground weather="rainy" />
      <div className="menu-overlay">
        <div className="menu-title">
          <div className="title-vn">CHỢ ĐÊM MINI</div>
          <div className="title-sub">Vietnam Convenience Store Simulator</div>
          <div className="title-tagline">🌧️ Một đêm mưa Sài Gòn...</div>
        </div>
        <div className="menu-buttons">
          <button className="menu-btn primary" onClick={onNew}>🆕 Bắt Đầu Mới</button>
          {autosave && (
            <button className="menu-btn" onClick={() => onContinue("auto")}>
              ▶️ Tiếp Tục (Ngày {autosave.day})
            </button>
          )}
          <button className="menu-btn" onClick={() => setShowLoadMenu(true)}>📂 Tải Game</button>
        </div>
        <div className="menu-credits">
          <p>Inspired by Supermarket Simulator · TCG Card Shop Simulator</p>
          <p>🎮 Quản lý cửa hàng · Phục vụ khách hàng · Làm giàu!</p>
        </div>
      </div>
      {showLoadMenu && <LoadModal onClose={() => setShowLoadMenu(false)} onLoad={onContinue} onDelete={onDelete} />}
      <style>{GAME_CSS}</style>
    </div>
  );
}

// ─── CSS ─────────────────────────────────────────────────────────────────────
const GAME_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;700;900&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .game-root, .main-menu {
    font-family: 'Be Vietnam Pro', sans-serif;
    width: 100%; min-height: 600px; position: relative;
    background: #0a0a1a; overflow: hidden; color: #e8e0d0;
  }

  /* RAIN */
  .rain-bg { position: absolute; inset: 0; pointer-events: none; z-index: 0; overflow: hidden; }
  .sky-gradient { position: absolute; inset: 0; }
  .sky-rainy { background: linear-gradient(180deg, #0d0d1a 0%, #1a1a2e 40%, #16213e 70%, #0f3460 100%); }
  .sky-cloudy { background: linear-gradient(180deg, #1a1a2e 0%, #2d2d44 50%, #1e2a3a 100%); }
  .sky-sunny { background: linear-gradient(180deg, #0d1b2a 0%, #1b2a4a 50%, #1a3a5c 100%); }
  .sky-hot { background: linear-gradient(180deg, #1a0d0d 0%, #2e1a0d 50%, #3a1a0d 100%); }
  .rain-drop {
    position: absolute; width: 1px; background: rgba(180,220,255,0.7);
    animation: rain-fall linear infinite;
    height: 20px; top: -20px;
  }
  @keyframes rain-fall { to { transform: translateY(120vh) translateX(10px); } }
  .street-glow {
    position: absolute; bottom: 0; left: 0; right: 0; height: 120px;
    background: linear-gradient(0deg, rgba(255,120,30,0.15) 0%, transparent 100%);
  }
  .neon-reflection {
    position: absolute; bottom: 30px; left: 20%; width: 60%; height: 8px;
    background: linear-gradient(90deg, transparent, rgba(255,60,120,0.3), rgba(0,200,255,0.3), transparent);
    filter: blur(4px);
  }

  /* GAME OVERLAY */
  .game-overlay { position: relative; z-index: 1; display: flex; flex-direction: column; min-height: 600px; }

  /* TOP HUD */
  .top-hud {
    display: flex; justify-content: space-between; align-items: center;
    padding: 8px 16px;
    background: linear-gradient(90deg, rgba(10,10,26,0.95), rgba(20,10,40,0.95));
    border-bottom: 1px solid rgba(255,150,50,0.3);
    backdrop-filter: blur(8px);
  }
  .store-name { font-size: 16px; font-weight: 900; color: #ff6b35; letter-spacing: 2px; }
  .store-level { font-size: 11px; color: #aaa; margin-top: 2px; }
  .time-display { font-size: 28px; font-weight: 900; font-variant-numeric: tabular-nums; text-align: center; text-shadow: 0 0 10px currentColor; }
  .day-weather { font-size: 11px; color: #ccc; text-align: center; margin-top: 2px; }
  .money-display { font-size: 20px; font-weight: 700; color: #4dff91; text-align: right; font-variant-numeric: tabular-nums; }
  .revenue-today { font-size: 11px; color: #4dff91; opacity: 0.7; text-align: right; }
  .hud-buttons { display: flex; gap: 6px; margin-top: 4px; justify-content: flex-end; }
  .hud-btn {
    padding: 3px 10px; font-size: 11px; font-family: inherit;
    background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.2);
    color: #ddd; border-radius: 4px; cursor: pointer;
  }
  .hud-btn:hover { background: rgba(255,255,255,0.12); }
  .save-status { font-size: 11px; color: #4dff91; text-align: right; margin-top: 2px; }

  /* NOTIFICATIONS */
  .notif-stack {
    position: absolute; top: 60px; right: 12px; z-index: 100;
    display: flex; flex-direction: column; gap: 4px; max-width: 260px;
  }
  .notif {
    padding: 6px 12px; border-radius: 6px; font-size: 12px; font-weight: 500;
    animation: notif-in 0.3s ease;
    backdrop-filter: blur(8px);
  }
  @keyframes notif-in { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: none; } }
  .notif-sale { background: rgba(77,255,145,0.2); border: 1px solid rgba(77,255,145,0.4); color: #4dff91; }
  .notif-order { background: rgba(100,150,255,0.2); border: 1px solid rgba(100,150,255,0.4); color: #aaccff; }
  .notif-event { background: rgba(255,200,50,0.2); border: 1px solid rgba(255,200,50,0.4); color: #ffdd66; }
  .notif-task { background: rgba(255,100,200,0.2); border: 1px solid rgba(255,100,200,0.4); color: #ff99dd; }
  .notif-upgrade { background: rgba(200,100,255,0.2); border: 1px solid rgba(200,100,255,0.4); color: #cc88ff; }
  .notif-error { background: rgba(255,80,80,0.2); border: 1px solid rgba(255,80,80,0.4); color: #ff8888; }
  .notif-info { background: rgba(100,100,150,0.2); border: 1px solid rgba(100,100,150,0.3); color: #aaaacc; }

  /* BANNERS */
  .event-banner {
    background: linear-gradient(90deg, rgba(255,200,50,0.15), rgba(255,150,0,0.15));
    border-bottom: 1px solid rgba(255,200,50,0.3); border-top: 1px solid rgba(255,200,50,0.3);
    padding: 6px 16px; font-size: 13px; color: #ffdd66; text-align: center;
  }
  .trending-banner {
    background: linear-gradient(90deg, rgba(255,50,100,0.2), rgba(255,100,50,0.2));
    border-bottom: 1px solid rgba(255,80,80,0.4);
    padding: 5px 16px; font-size: 12px; color: #ff8888; text-align: center;
    animation: pulse 1s infinite alternate;
  }
  @keyframes pulse { from { opacity: 0.7; } to { opacity: 1; } }

  /* GAME CONTENT */
  .game-content { flex: 1; display: flex; flex-direction: column; }

  /* CUSTOMER AREA */
  .customer-area {
    height: 140px; position: relative;
    background: linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.3) 100%);
    border-bottom: 1px solid rgba(255,150,50,0.2);
    overflow: hidden;
  }
  .store-scene { position: absolute; inset: 0; display: flex; }
  .shelf-visual {
    width: 45%; padding: 8px; display: flex; flex-direction: column; gap: 4px;
  }
  .shelf-row {
    display: flex; gap: 4px; align-items: center;
    background: rgba(100,70,30,0.3); border-radius: 2px;
    border-bottom: 2px solid rgba(120,80,40,0.6); padding: 2px 6px;
  }
  .shelf-product { font-size: 18px; }
  .customer-floor { position: absolute; bottom: 0; left: 45%; right: 0; height: 110px; }
  .customer-sprite {
    position: absolute; bottom: 4px;
    display: flex; flex-direction: column; align-items: center;
    transition: left 0.5s ease;
    animation: bob 1s ease-in-out infinite alternate;
  }
  @keyframes bob { from { transform: translateY(0); } to { transform: translateY(-3px); } }
  .thought-bubble {
    background: rgba(255,255,255,0.9); color: #333;
    padding: 2px 6px; border-radius: 10px; font-size: 11px;
    margin-bottom: 2px; white-space: nowrap;
    box-shadow: 0 1px 4px rgba(0,0,0,0.3);
  }
  .customer-avatar { font-size: 24px; }
  .customer-name { font-size: 9px; color: #aaa; }

  /* TAB BAR */
  .tab-bar {
    display: flex; gap: 2px; padding: 6px 10px;
    background: rgba(10,10,20,0.8); border-bottom: 1px solid rgba(255,150,50,0.2);
    flex-wrap: wrap;
  }
  .tab-btn {
    padding: 5px 12px; font-size: 11px; font-family: inherit; font-weight: 500;
    background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1);
    color: #aaa; border-radius: 4px; cursor: pointer; transition: all 0.15s;
  }
  .tab-btn:hover { background: rgba(255,255,255,0.1); color: #ddd; }
  .tab-btn.active { background: rgba(255,100,50,0.2); border-color: rgba(255,100,50,0.5); color: #ff8866; }
  .upgrade-btn { margin-left: auto; background: rgba(150,100,255,0.1); border-color: rgba(150,100,255,0.3); color: #bb88ff; }

  /* TAB CONTENT */
  .tab-content { flex: 1; overflow-y: auto; padding: 10px; }
  .tab-content::-webkit-scrollbar { width: 4px; }
  .tab-content::-webkit-scrollbar-track { background: rgba(255,255,255,0.02); }
  .tab-content::-webkit-scrollbar-thumb { background: rgba(255,150,50,0.3); border-radius: 2px; }

  .section-title { font-size: 13px; font-weight: 700; color: #ff8866; margin-bottom: 10px; letter-spacing: 1px; }

  /* PRODUCT GRID */
  .product-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(155px, 1fr)); gap: 8px; }
  .product-card {
    background: rgba(20,15,40,0.8); border: 1px solid rgba(255,255,255,0.1);
    border-radius: 8px; padding: 10px; transition: all 0.2s;
  }
  .product-card:hover { border-color: rgba(255,150,50,0.4); background: rgba(30,20,50,0.9); }
  .product-card.trending { border-color: rgba(255,80,80,0.5); background: rgba(40,15,15,0.9); }
  .product-card.low-stock { border-color: rgba(255,200,50,0.4); }
  .product-card.empty { opacity: 0.6; }
  .product-header { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
  .product-emoji { font-size: 24px; }
  .product-name { font-size: 12px; font-weight: 600; color: #e0d8c8; }
  .trending-tag { font-size: 9px; color: #ff6666; font-weight: 700; }
  .low-tag { font-size: 9px; color: #ffcc44; }
  .empty-tag { font-size: 9px; color: #ff6666; }
  .product-stats { font-size: 11px; margin-bottom: 8px; }
  .stat-row { display: flex; justify-content: space-between; padding: 1px 0; color: #999; }
  .stat-row span:last-child { color: #ccc; font-weight: 600; }
  .stock-num.low { color: #ffcc44 !important; }
  .price-input {
    width: 80px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.15);
    color: #fff; border-radius: 3px; padding: 1px 4px; font-size: 11px; font-family: inherit;
    text-align: right;
  }
  .price-input:focus { outline: none; border-color: rgba(255,150,50,0.5); }
  .stock-btn {
    width: 100%; padding: 5px; font-size: 11px; font-family: inherit; font-weight: 600;
    background: rgba(50,150,255,0.15); border: 1px solid rgba(50,150,255,0.3);
    color: #88bbff; border-radius: 4px; cursor: pointer; transition: all 0.15s;
  }
  .stock-btn:hover:not(.disabled) { background: rgba(50,150,255,0.3); }
  .stock-btn.disabled { opacity: 0.4; cursor: not-allowed; }

  /* ORDER GRID */
  .discount-banner {
    background: rgba(50,200,100,0.1); border: 1px solid rgba(50,200,100,0.3);
    color: #66ff99; padding: 6px 12px; border-radius: 6px; font-size: 12px; margin-bottom: 10px;
  }
  .order-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 8px; }
  .order-card {
    background: rgba(20,15,40,0.8); border: 1px solid rgba(255,255,255,0.08);
    border-radius: 8px; padding: 10px;
  }
  .order-header { display: flex; align-items: center; gap: 8px; margin-bottom: 6px; font-size: 20px; }
  .order-name { font-size: 12px; font-weight: 600; color: #e0d8c8; }
  .order-category { font-size: 10px; color: #888; }
  .order-details { font-size: 11px; color: #aaa; margin-bottom: 8px; line-height: 1.6; }
  .order-details b { color: #ddd; }
  .order-btn {
    width: 100%; padding: 5px; font-size: 11px; font-family: inherit; font-weight: 600;
    background: rgba(255,150,50,0.15); border: 1px solid rgba(255,150,50,0.3);
    color: #ffaa66; border-radius: 4px; cursor: pointer; transition: all 0.15s;
  }
  .order-btn:hover { background: rgba(255,150,50,0.3); }

  /* TASKS */
  .tasks-list { display: flex; flex-direction: column; gap: 8px; margin-bottom: 10px; }
  .task-card {
    background: rgba(20,15,40,0.8); border: 1px solid rgba(255,255,255,0.08);
    border-radius: 8px; padding: 10px; transition: all 0.2s;
  }
  .task-card.done { border-color: rgba(77,255,145,0.3); background: rgba(10,30,20,0.8); }
  .task-header { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
  .task-icon { font-size: 18px; }
  .task-desc { font-size: 13px; font-weight: 600; color: #e0d8c8; }
  .task-reward { font-size: 11px; color: #4dff91; }
  .task-done-badge { margin-left: auto; background: rgba(77,255,145,0.2); border: 1px solid rgba(77,255,145,0.4); color: #4dff91; font-size: 10px; padding: 2px 8px; border-radius: 10px; white-space: nowrap; }
  .progress-bar-wrap { height: 4px; background: rgba(255,255,255,0.1); border-radius: 2px; margin-bottom: 4px; overflow: hidden; }
  .progress-bar { height: 100%; background: linear-gradient(90deg, #4dff91, #00bb66); border-radius: 2px; transition: width 0.5s ease; }
  .task-progress-text { font-size: 10px; color: #888; }

  /* ACHIEVEMENTS */
  .achievements-list { display: flex; flex-direction: column; gap: 6px; }
  .achievement-card {
    display: flex; align-items: center; gap: 10px;
    background: rgba(20,15,40,0.8); border: 1px solid rgba(255,255,255,0.06);
    border-radius: 6px; padding: 8px 12px;
  }
  .achievement-card.unlocked { border-color: rgba(255,200,50,0.4); background: rgba(30,20,10,0.9); }
  .achievement-card.locked { opacity: 0.5; }
  .ach-icon { font-size: 20px; }
  .ach-name { font-size: 12px; font-weight: 600; color: #e0d8c8; }
  .ach-desc { font-size: 10px; color: #888; }
  .ach-badge { margin-left: auto; color: #ffd700; font-size: 16px; }

  /* STATS */
  .stats-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 8px; }
  .stat-card {
    background: rgba(20,15,40,0.8); border: 1px solid rgba(255,255,255,0.08);
    border-radius: 8px; padding: 12px; text-align: center;
  }
  .stat-label { font-size: 10px; color: #888; margin-bottom: 4px; }
  .stat-value { font-size: 16px; font-weight: 700; color: #e0d8c8; }
  .history-list { display: flex; flex-direction: column; gap: 4px; }
  .empty-history { font-size: 12px; color: #666; text-align: center; padding: 10px; }
  .history-row {
    display: flex; align-items: center; gap: 8px;
    background: rgba(20,15,40,0.6); border-radius: 4px; padding: 6px 10px; font-size: 11px;
  }
  .history-day { color: #888; width: 60px; }
  .history-revenue { color: #4dff91; font-weight: 600; flex: 1; }
  .history-customers { color: #aaa; }
  .history-profit { font-weight: 600; }
  .history-profit.pos { color: #4dff91; }
  .history-profit.neg { color: #ff6666; }
  .inventory-status { display: flex; flex-direction: column; gap: 4px; }
  .inv-status-row { display: flex; align-items: center; gap: 8px; font-size: 11px; }
  .inv-status-row > span:first-child { width: 120px; color: #aaa; }
  .inv-bar-wrap { flex: 1; height: 4px; background: rgba(255,255,255,0.08); border-radius: 2px; overflow: hidden; }
  .inv-bar { height: 100%; background: linear-gradient(90deg, #5588ff, #88bbff); border-radius: 2px; transition: width 0.5s ease; }
  .inv-total { width: 30px; text-align: right; color: #ccc; }

  /* MODALS */
  .modal-overlay {
    position: fixed; inset: 0; background: rgba(0,0,0,0.8);
    display: flex; align-items: center; justify-content: center; z-index: 200;
  }
  .modal-box {
    background: linear-gradient(160deg, #0d0d20, #1a0d2e);
    border: 1px solid rgba(255,150,50,0.3); border-radius: 12px;
    padding: 20px; max-width: 480px; width: 90%; max-height: 80vh; overflow-y: auto;
  }
  .modal-box.small { max-width: 360px; }
  .modal-title { font-size: 16px; font-weight: 800; color: #ff8866; margin-bottom: 16px; letter-spacing: 1px; }
  .modal-close-btn {
    width: 100%; margin-top: 12px; padding: 8px; font-family: inherit; font-size: 12px;
    background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.15);
    color: #aaa; border-radius: 6px; cursor: pointer;
  }
  .modal-close-btn:hover { background: rgba(255,255,255,0.1); }

  /* UPGRADES */
  .upgrades-list { display: flex; flex-direction: column; gap: 8px; }
  .upgrade-card {
    display: flex; align-items: center; gap: 10px;
    background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1);
    border-radius: 8px; padding: 10px 12px;
  }
  .upgrade-card.owned { border-color: rgba(77,255,145,0.3); opacity: 0.7; }
  .upgrade-icon { font-size: 24px; }
  .upgrade-info { flex: 1; }
  .upgrade-name { font-size: 13px; font-weight: 700; color: #e0d8c8; }
  .upgrade-desc { font-size: 11px; color: #888; }
  .upgrade-cost { font-size: 11px; color: #4dff91; margin-top: 2px; }
  .buy-btn {
    padding: 6px 14px; font-family: inherit; font-size: 11px; font-weight: 700;
    background: rgba(255,150,50,0.2); border: 1px solid rgba(255,150,50,0.5);
    color: #ffaa66; border-radius: 6px; cursor: pointer; white-space: nowrap;
  }
  .buy-btn:hover:not(.cant) { background: rgba(255,150,50,0.4); }
  .buy-btn.cant { opacity: 0.4; cursor: not-allowed; }

  /* ORDER MODAL */
  .order-modal-body { margin-bottom: 12px; }
  .order-info-row { font-size: 13px; color: #ccc; margin-bottom: 8px; }
  .order-info-row b { color: #ffaa66; }
  .qty-control { display: flex; align-items: center; gap: 4px; margin-bottom: 12px; }
  .qty-control button {
    padding: 4px 10px; font-family: inherit; font-size: 13px;
    background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.15);
    color: #ccc; border-radius: 4px; cursor: pointer;
  }
  .qty-control button:hover { background: rgba(255,255,255,0.15); }
  .qty-num { font-size: 20px; font-weight: 700; min-width: 48px; text-align: center; color: #fff; }
  .order-total { font-size: 14px; color: #ccc; }
  .order-total b { color: #4dff91; font-size: 18px; }
  .modal-actions { display: flex; gap: 8px; }
  .confirm-btn {
    flex: 1; padding: 8px; font-family: inherit; font-size: 13px; font-weight: 700;
    background: rgba(50,200,100,0.2); border: 1px solid rgba(50,200,100,0.4);
    color: #4dff91; border-radius: 6px; cursor: pointer;
  }
  .confirm-btn:hover { background: rgba(50,200,100,0.35); }
  .cancel-btn {
    padding: 8px 16px; font-family: inherit; font-size: 13px;
    background: rgba(255,80,80,0.1); border: 1px solid rgba(255,80,80,0.3);
    color: #ff8888; border-radius: 6px; cursor: pointer;
  }

  /* SAVE/LOAD */
  .save-slots { display: flex; flex-direction: column; gap: 8px; }
  .save-slot {
    display: flex; align-items: center; justify-content: space-between;
    background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1);
    border-radius: 6px; padding: 10px 12px;
  }
  .slot-info { display: flex; flex-direction: column; gap: 2px; }
  .slot-info b { font-size: 12px; color: #e0d8c8; }
  .slot-info span { font-size: 11px; color: #aaa; }
  .empty-slot { color: #555 !important; font-style: italic; }
  .slot-actions { display: flex; gap: 6px; }
  .save-slot-btn, .load-slot-btn {
    padding: 4px 12px; font-family: inherit; font-size: 11px; font-weight: 700;
    background: rgba(255,150,50,0.15); border: 1px solid rgba(255,150,50,0.4);
    color: #ffaa66; border-radius: 4px; cursor: pointer;
  }
  .save-slot-btn:hover, .load-slot-btn:hover { background: rgba(255,150,50,0.3); }
  .delete-slot-btn {
    padding: 4px 8px; font-size: 11px;
    background: rgba(255,50,50,0.1); border: 1px solid rgba(255,50,50,0.3);
    color: #ff8888; border-radius: 4px; cursor: pointer;
  }

  /* END DAY */
  .modal-box.end-day { max-width: 400px; }
  .end-day-title { font-size: 22px; font-weight: 900; color: #ffd700; margin-bottom: 16px; text-align: center; letter-spacing: 2px; }
  .end-day-stats { display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px; }
  .end-stat {
    display: flex; justify-content: space-between; align-items: center;
    padding: 8px 12px; background: rgba(255,255,255,0.04); border-radius: 6px; font-size: 13px;
  }
  .end-stat span { color: #aaa; }
  .end-stat b { color: #e0d8c8; font-size: 15px; }
  .end-stat.neg b { color: #ff8888; }
  .end-stat.task b { color: #4dff91; }
  .end-stat.total { border: 1px solid rgba(255,255,255,0.15); background: rgba(255,255,255,0.07); }
  .end-stat.total.pos b { color: #4dff91; font-size: 18px; }
  .end-stat.total.neg b { color: #ff6666; font-size: 18px; }
  .end-day-message { text-align: center; font-size: 13px; color: #aaa; margin-bottom: 16px; font-style: italic; }
  .continue-btn {
    width: 100%; padding: 14px; font-family: inherit; font-size: 14px; font-weight: 800;
    background: linear-gradient(90deg, rgba(255,150,50,0.3), rgba(255,80,150,0.3));
    border: 1px solid rgba(255,150,50,0.5); color: #ffaa66;
    border-radius: 8px; cursor: pointer; letter-spacing: 1px;
    transition: all 0.2s;
  }
  .continue-btn:hover { background: linear-gradient(90deg, rgba(255,150,50,0.5), rgba(255,80,150,0.5)); transform: translateY(-1px); }

  /* MAIN MENU */
  .main-menu { display: flex; flex-direction: column; min-height: 500px; position: relative; }
  .menu-overlay {
    position: relative; z-index: 1; display: flex; flex-direction: column;
    align-items: center; justify-content: center; min-height: 500px; padding: 40px 20px;
  }
  .menu-title { text-align: center; margin-bottom: 48px; }
  .title-vn {
    font-size: 48px; font-weight: 900; letter-spacing: 6px;
    background: linear-gradient(90deg, #ff6b35, #ff3080, #00d4ff);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
    text-shadow: none;
    margin-bottom: 8px;
  }
  .title-sub { font-size: 16px; color: #aaa; letter-spacing: 3px; margin-bottom: 8px; }
  .title-tagline { font-size: 14px; color: #668; font-style: italic; }
  .menu-buttons { display: flex; flex-direction: column; gap: 10px; width: 280px; margin-bottom: 32px; }
  .menu-btn {
    padding: 14px 24px; font-family: inherit; font-size: 14px; font-weight: 700;
    background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.15);
    color: #e0d8c8; border-radius: 8px; cursor: pointer; letter-spacing: 1px;
    transition: all 0.2s;
  }
  .menu-btn:hover { background: rgba(255,255,255,0.12); border-color: rgba(255,150,50,0.4); transform: translateY(-2px); }
  .menu-btn.primary {
    background: linear-gradient(90deg, rgba(255,100,50,0.25), rgba(255,50,120,0.25));
    border-color: rgba(255,100,50,0.5); color: #ff8866;
  }
  .menu-credits { text-align: center; color: #445; font-size: 11px; line-height: 1.8; }
`;
