import { GameState, Mech, Position } from '../types/game';
import { MAX_HEALTH, ATTACK_MIN_DAMAGE, ATTACK_MAX_DAMAGE, DEFENSE_REDUCTION, ATTACK_RANGE, MOVE_DISTANCE, GRID_WIDTH, GRID_HEIGHT } from './constants';

export const createInitialMech = (id: string, x: number, y: number, direction: 'left' | 'right'): Mech => ({
  id,
  x,
  y,
  health: MAX_HEALTH,
  maxHealth: MAX_HEALTH,
  isDefending: false,
  animationFrame: 0,
  animationType: 'idle',
  direction,
});

export const createInitialState = (): GameState => ({
  mech1: createInitialMech('mech1', 4, 7, 'right'),
  mech2: createInitialMech('mech2', 15, 7, 'left'),
  currentTurn: 'player1',
  gamePhase: 'playing',
  winner: null,
  actionLog: ['Game Start! Player 1 goes first.'],
  isAnimating: false,
});

export const calculateDistance = (pos1: Position, pos2: Position): number => {
  return Math.abs(pos1.x - pos2.x) + Math.abs(pos1.y - pos2.y);
};

export const isValidMove = (x: number, y: number): boolean => {
  return x >= 0 && x < GRID_WIDTH && y >= 0 && y < GRID_HEIGHT;
};

export const canAttack = (attacker: Mech, defender: Mech): boolean => {
  const distance = calculateDistance({ x: attacker.x, y: attacker.y }, { x: defender.x, y: defender.y });
  return distance <= ATTACK_RANGE;
};

export const moveMech = (state: GameState, dx: number, dy: number): GameState => {
  const currentMech = state.currentTurn === 'player1' ? 'mech1' : 'mech2';
  const opponentMech = state.currentTurn === 'player1' ? 'mech2' : 'mech1';
  
  const newX = state[currentMech].x + dx * MOVE_DISTANCE;
  const newY = state[currentMech].y + dy * MOVE_DISTANCE;
  
  if (!isValidMove(newX, newY)) {
    return {
      ...state,
      actionLog: [...state.actionLog, `Player ${state.currentTurn === 'player1' ? '1' : '2'} cannot move there!`],
    };
  }
  
  const newDirection = dx > 0 ? 'right' : dx < 0 ? 'left' : state[currentMech].direction;
  
  return {
    ...state,
    [currentMech]: {
      ...state[currentMech],
      x: newX,
      y: newY,
      direction: newDirection,
      animationType: 'walk',
      animationFrame: 0,
    },
    actionLog: [...state.actionLog, `Player ${state.currentTurn === 'player1' ? '1' : '2'} moved.`],
    isAnimating: true,
  };
};

export const attackMech = (state: GameState): GameState => {
  const attacker = state.currentTurn === 'player1' ? 'mech1' : 'mech2';
  const defender = state.currentTurn === 'player1' ? 'mech2' : 'mech1';
  
  if (!canAttack(state[attacker], state[defender])) {
    return {
      ...state,
      actionLog: [...state.actionLog, `Player ${state.currentTurn === 'player1' ? '1' : '2'} is too far to attack!`],
    };
  }
  
  const baseDamage = Math.floor(Math.random() * (ATTACK_MAX_DAMAGE - ATTACK_MIN_DAMAGE + 1)) + ATTACK_MIN_DAMAGE;
  const actualDamage = state[defender].isDefending 
    ? Math.floor(baseDamage * DEFENSE_REDUCTION) 
    : baseDamage;
  
  const newHealth = Math.max(0, state[defender].health - actualDamage);
  
  const updatedState = {
    ...state,
    [attacker]: {
      ...state[attacker],
      animationType: 'attack',
      animationFrame: 0,
    },
    [defender]: {
      ...state[defender],
      health: newHealth,
      animationType: 'hit',
      animationFrame: 0,
      isDefending: false,
    },
    actionLog: [...state.actionLog, 
      `Player ${state.currentTurn === 'player1' ? '1' : '2'} attacked! ${actualDamage} damage!${state[defender].isDefending ? ' (Defended!)' : ''}`
    ],
    isAnimating: true,
  };
  
  if (newHealth <= 0) {
    return {
      ...updatedState,
      gamePhase: 'victory',
      winner: state.currentTurn,
      actionLog: [...updatedState.actionLog, `Player ${state.currentTurn === 'player1' ? '1' : '2'} wins!`],
    };
  }
  
  return updatedState;
};

export const defendMech = (state: GameState): GameState => {
  const currentMech = state.currentTurn === 'player1' ? 'mech1' : 'mech2';
  
  return {
    ...state,
    [currentMech]: {
      ...state[currentMech],
      isDefending: true,
      animationType: 'defend',
      animationFrame: 0,
    },
    actionLog: [...state.actionLog, `Player ${state.currentTurn === 'player1' ? '1' : '2'} is defending.`],
    isAnimating: true,
  };
};

export const endTurn = (state: GameState): GameState => {
  return {
    ...state,
    currentTurn: state.currentTurn === 'player1' ? 'player2' : 'player1',
    isAnimating: false,
    mech1: {
      ...state.mech1,
      animationType: 'idle',
      animationFrame: 0,
    },
    mech2: {
      ...state.mech2,
      animationType: 'idle',
      animationFrame: 0,
    },
  };
};

export const resetGame = (): GameState => createInitialState();
