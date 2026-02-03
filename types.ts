export enum GamePhase {
  START = 'START',
  PLAYING = 'PLAYING',
  EVENT = 'EVENT',
  ENDING = 'ENDING',
}

export interface CatStats {
  health: number; // 健康
  stamina: number; // 体力
  mood: number; // 心情
  hunger: number; // 饱腹
  trust: number; // 信任值
  wildness: number; // 野性/人性残留
  dignity: number; // 尊严
}

export interface DailyActions {
  forage: number;
  rest: number;
  ponder: number;
  radio: number;
}

export interface GameState {
  phase: GamePhase;
  day: number;
  catName: string;
  stats: CatStats;
  logs: string[];
  dailyActions: DailyActions;
  isAiMode: boolean;
  apiKey: string;
  gameOverReason?: string;
  isWin?: boolean;
}

export interface GameEvent {
  id: string;
  title: string;
  description: string;
  choices: EventChoice[];
}

export interface EventChoice {
  text: string;
  effectDescription: string;
  statChanges: Partial<CatStats>;
  isDeath?: boolean;
}
