export type CoordItem = { hor: number; vert: number };

export type MoveDirection = "top" | "bottom" | "left" | "right";
export type MoveDirectionList = MoveDirection[];
// BarrierType. Later add "boards"
export type SurfaceKind = "wall" | "window" | "door" | null;

export type SurfaceDirection = MoveDirection;

// Kind of surfaces of cell
export type SurfacesType = Record<SurfaceDirection, SurfaceKind>;

export type CellsSurfaceType = { coord: CoordItem; surfaces: SurfacesType };

export type CellsSurfaceListType = Array<CellsSurfaceType>;

export type AvailableCellType = {
  direction: MoveDirection;
  coord: string;
};
export type AvailableCellListType = AvailableCellType[];

export type PlayerCardType = {
  name: "player";
  health: number;
  orderNumber: number;
  coord: string;
  availableCellsCoords?: string[];
  inventory: CardType[];
};

export type CardType = HealthCardType;

export type PlayerListType = Record<string, PlayerCardType>;

export type EnemyCardType = {
  name: "enemy";
  power: number;
  coord: string;
  apperance: "closed" | "open";
};

export type EnemyListType = Record<string, EnemyCardType>;

export type FinishCell = {
  name: "finish";
  cardItem: { healthItem?: HealthCardType };
};

export type StartCell = {
  name: "start";
  cardItem: { healthItem?: HealthCardType };
};

export type HealthCardType = {
  name: "health";
  apperance: "closed" | "open";
  highlighting?: boolean;
};

// TODO: нужен ли отдельный тип, похоже на переусложнение
export type HealthCell = {
  name: "commonCell";
  cardItem: { healthItem: HealthCardType };
  surfaceItem?: SurfacesType;
};

export type CommonCell = {
  name: "commonCell";
  cardItem: { healthItem?: HealthCardType };
  surfaceItem?: SurfacesType;
};

export type CellType = CommonCell | FinishCell | StartCell | HealthCell;

export type GameField = {
  order: Array<string>;
  values: GameFieldCells;
};

export type GameFieldCells = Record<string, CellType>;

export type TypeEffect =
  | { type: "!openHealthCard" }
  | { type: "!changePlayerHealth" }
  | { type: "!deleteHealthCard" }
  | { type: "!getNextPlayer" }
  | { type: "!checkApperanceEnemyCard" }
  | { type: "!openEnemyCard" }
  | { type: "!throwBattleDice" }
  | { type: "!getBattleResult" }
  | { type: "!checkAvailableNeighboringCell" }
  | { type: "!cleanMarkedCell" }
  | { type: "!getPlayerMoveResult" }
  | { type: "!takeHealthCard" }
  | null;

export type State = {
  gameState: GameState;
  dice: number;
  gameResult: "" | "Вы выиграли" | "Вы проиграли";
  playerList: PlayerListType;
  enemyList: EnemyListType;
  gameField: GameField;
  doEffect: TypeEffect;
  numberOfPlayer: number;
};

export type GameState =
  | { type: "waitingStart" }
  | { type: "gameStarted.trownDice" }
  | {
      type: "gameStarted.playerMove";
    }
  | openHealthCardType
  | { type: "gameStarted.interactEnemyCard" }
  | { type: "gameStarted.getOrder" }
  | { type: "endGame" }
  | { type: "getEndScreen" };

export type openHealthCardType = {
  type: "gameStarted.takeHealthCard";
};
