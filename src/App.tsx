import { AnimatePresence } from 'framer-motion';
import { useGameState } from './hooks/useGameState';
import NeonCityscape from './components/NeonCityscape';
import RainBackground from './components/RainBackground';
import MainMenu from './components/MainMenu';
import SaveSlotOverlay from './components/SaveSlotOverlay';
import GameScreen from './components/GameScreen';
import type { SaveSlot } from './types/game';

export default function App() {
  const { state, setScreen, setPanel, setSaveOverlay, startNewGame, continueGame } = useGameState();

  const handleLoadSave = (slot: SaveSlot) => {
    if (!slot.isEmpty) {
      continueGame();
    }
    setSaveOverlay(false);
  };

  return (
    <div className="fixed inset-0 overflow-hidden" style={{ background: '#020810' }}>
      {/* Persistent atmospheric background */}
      <NeonCityscape />
      <RainBackground />

      {/* Screen routing with cinematic transitions */}
      <AnimatePresence mode="wait">
        {state.screen === 'menu' && (
          <MainMenu
            key="menu"
            onContinue={() => setSaveOverlay(true)}
            onNewGame={startNewGame}
            onLoadSave={() => setSaveOverlay(true)}
            onSettings={() => setScreen('settings')}
            onExit={() => {}}
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

      {/* Save slot overlay - works on both screens */}
      <SaveSlotOverlay
        open={state.saveOverlay}
        onClose={() => setSaveOverlay(false)}
        onLoad={handleLoadSave}
      />
    </div>
  );
}
