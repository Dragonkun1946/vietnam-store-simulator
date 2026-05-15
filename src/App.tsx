import { AnimatePresence } from 'framer-motion';
import { useGameState } from './hooks/useGameState';

import NeonCityscape from './components/NeonCityscape';
import RainBackground from './components/RainBackground';

import MainMenu from './components/MainMenu';
import SaveSlotOverlay from './components/SaveSlotOverlay';
import GameScreen from './components/GameScreen';

import type { SaveSlot } from './types/game';

export default function App() {
  const {
    state,
    setScreen,
    setPanel,
    setSaveOverlay,
    setSettingsOverlay,
    startNewGame,
    continueGame,
  } = useGameState();

  const handleLoadSave = (slot: SaveSlot) => {
    if (!slot.isEmpty) {
      continueGame(slot);
    }

    setSaveOverlay(false);
  };

  return (
    <div
      className="fixed inset-0 overflow-hidden text-white"
      style={{
        background: '#020810',
      }}
    >
      {/* Persistent Atmospheric Background */}
      <div className="absolute inset-0 z-0">
        <NeonCityscape />
        <RainBackground />
      </div>

      {/* Global Atmospheric Overlay */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at center, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.55) 100%)',
        }}
      />

      {/* Main Screen Flow */}
      <div className="relative z-10 w-full h-full">
        <AnimatePresence mode="wait">
          {state.screen === 'menu' && (
            <MainMenu
              key="menu"
              onContinue={() => setSaveOverlay(true)}
              onNewGame={startNewGame}
              onLoadSave={() => setSaveOverlay(true)}
              onSettings={() => setSettingsOverlay(true)}
              onExit={() => window.close()}
            />
          )}

          {state.screen === 'game' && (
            <GameScreen
              key="game"
              state={state}
              onPanel={setPanel}
              onSave={() => setSaveOverlay(true)}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Save Overlay */}
      <SaveSlotOverlay
        open={state.saveOverlay}
        onClose={() => setSaveOverlay(false)}
        onLoad={handleLoadSave}
      />

      {/* Settings Overlay */}
      <SettingsOverlay
        open={state.settingsOverlay}
        onClose={() => setSettingsOverlay(false)}
      />
    </div>
  );
}
