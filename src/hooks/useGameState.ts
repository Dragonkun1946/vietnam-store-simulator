import { useState, useEffect, useCallback } from 'react';
import type { GameState, GamePanel } from '../types/game';

const INITIAL_STATE: GameState = {
  screen: 'menu',
  panel: 'none',
  saveOverlay: false,
  day: 47,
  hour: 22,
  minute: 41,
  money: 2_840_000,
  dailyRevenue: 840_000,
  customerCount: 14,
  popularity: 78,
  storeLevel: 3,
  storeName: 'Cửa Hàng Sao Mai',
  weather: 'rainy',
  electricity: 85,
  cleanliness: 62,
  reputation: 74,
  satisfaction: 81,
};

export function useGameState() {
  const [state, setState] = useState<GameState>(INITIAL_STATE);

  useEffect(() => {
    if (state.screen !== 'game') return;
    const interval = setInterval(() => {
      setState(prev => {
        let minute = prev.minute + 1;
        let hour = prev.hour;
        let day = prev.day;
        if (minute >= 60) { minute = 0; hour = (hour + 1) % 24; }
        if (hour === 0 && minute === 0) day += 1;

        const revIncrease = Math.random() < 0.3 ? Math.floor(Math.random() * 25000) : 0;
        const custIncrease = Math.random() < 0.15 ? 1 : 0;

        return {
          ...prev,
          minute,
          hour,
          day,
          dailyRevenue: prev.dailyRevenue + revIncrease,
          money: prev.money + revIncrease,
          customerCount: prev.customerCount + custIncrease,
        };
      });
    }, 800);
    return () => clearInterval(interval);
  }, [state.screen]);

  const setScreen = useCallback((screen: GameState['screen']) => {
    setState(prev => ({ ...prev, screen }));
  }, []);

  const setPanel = useCallback((panel: GamePanel) => {
    setState(prev => ({ ...prev, panel: prev.panel === panel ? 'none' : panel }));
  }, []);

  const setSaveOverlay = useCallback((open: boolean) => {
    setState(prev => ({ ...prev, saveOverlay: open }));
  }, []);

  const startNewGame = useCallback(() => {
    setState({
      ...INITIAL_STATE,
      screen: 'game',
      day: 1,
      money: 500_000,
      dailyRevenue: 0,
      customerCount: 0,
      storeLevel: 1,
      storeName: 'Cửa Hàng Của Tôi',
    });
  }, []);

  const continueGame = useCallback(() => {
    setState(prev => ({ ...prev, screen: 'game' }));
  }, []);

  return { state, setScreen, setPanel, setSaveOverlay, startNewGame, continueGame };
}
