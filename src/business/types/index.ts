export type CoordItem = { hor: number; vert: number };

export type MoveDirection = "top" | "bottom" | "left" | "right";
export type MoveDirectionList = MoveDirection[];
// BarrierType. Later add "boards"
export type BarrierKind = "wall" | "window" | "door" | null;

export type BarrierDirection = MoveDirection;

// Kind of barriers of cell
export type BarrierType = Record<BarrierDirection, BarrierKind>;

export type CellsBarrierType = { coord: CoordItem; barrier: BarrierType };

export type CellsBarrierListType = Array<CellsBarrierType>;

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
  inventory: CardItemList;
};

export type CardItem = HealthCardType | null;
export type CardItemList = CardItem[];

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
  cardItem: CardItemList;
};

export type StartCell = {
  name: "start";
  cardItem: CardItemList;
};

export type HealthCardType = {
  name: "health";
  apperance: "closed" | "open";
  isSelected?: boolean;
};

// TODO: нужен ли отдельный тип, похоже на переусложнение
export type HealthCell = {
  name: "commonCell";
  cardItem: CardItemList;
  barrierItem?: BarrierType;
};

export type CommonCell = {
  name: "commonCell";
  cardItem: CardItemList;
  barrierItem?: BarrierType;
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
  | { type: "!healPlayer" }
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
  | {
      type: "gameStarted.takeHealthCard";
    }
  | {
      type: "gameStarted.applyCard";
    }
  | {
      type: "gameStarted.applyCard.contextMenu";
    }
  | { type: "gameStarted.interactEnemyCard" }
  | { type: "gameStarted.getOrder" }
  | { type: "endGame" }
  | { type: "getEndScreen" };
