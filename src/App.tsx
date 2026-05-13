import { Game } from './components/Game';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 
        className="text-2xl mb-8 text-cyan-400 pixel-text"
        style={{ fontFamily: '"Press Start 2P", monospace' }}
      >
        PIXEL MECH BATTLE
      </h1>
      <Game />
    </div>
  );
}
