import { motion } from 'framer-motion';
import TopHUD from './TopHUD';
import LeftPanel from './LeftPanel';
import RightPanel from './RightPanel';
import BottomBar from './BottomBar';
import StoreScene from './StoreScene';
import InventoryPanel from './InventoryPanel';
import ShopManagementPanel from './ShopManagementPanel';
import type { GameState, GamePanel } from '../types/game';

interface Props {
  state: GameState;
  onPanel: (p: GamePanel) => void;
  onSave: () => void;
}

export default function GameScreen({ state, onPanel, onSave }: Props) {
  const showInventory = state.panel === 'inventory';

  return (
    <motion.div
      className="fixed inset-0 z-10"
      initial={{ opacity: 0, scale: 1.04 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96, filter: 'blur(8px)' }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      {/* Store Scene - the main game world */}
      <StoreScene />

      {/* HUD overlay layer */}
      <TopHUD state={state} onSave={onSave} />
      <LeftPanel />
      <RightPanel />
      <BottomBar activePanel={state.panel} onPanel={onPanel} />

      {/* Panel overlays */}
      <InventoryPanel open={showInventory} onClose={() => onPanel('none')} />
      <ShopManagementPanel panel={state.panel} onClose={() => onPanel('none')} />

      {/* Vignette overlay for depth */}
      <div
        className="fixed inset-0 pointer-events-none z-25"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,4,12,0.7) 100%)',
        }}
      />
    </motion.div>
  );
}
