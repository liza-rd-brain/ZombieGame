export type CoordItem = { hor: number; vert: number };

export type MoveDirection = "top" | "bottom" | "left" | "right";
export type MoveDirectionList = MoveDirection[];

export type BarrierName = "wall" | "window" | "door" | null;
/* export type BarrierDirection = "bottom" | "left"; */

export type BarrierItem = {
  name: BarrierName;
  direction: MoveDirection;
  isOpen: boolean;
};

export type BarrierList = BarrierItem[];

export type CellsBarrierType = {
  coord: CoordItem;
  barrierList: BarrierList;
};

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
  inventory: CardItemList;
};

export type CardItem = HealthCardType | BoardsCardType | null;

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

export type BoardsCardType = {
  name: "boards";
  apperance: "closed" | "open";
  isSelected?: boolean;
};

export type CommonCell = {
  name: "commonCell";
  cardItem: CardItemList;
  barrierList?: BarrierList;
};

export type CellType = CommonCell | FinishCell | StartCell;

export type GameField = {
  order: Array<string>;
  values: GameFieldCells;
};

export type GameFieldCells = Record<string, CellType>;

export type TypeEffect =
  | { type: "!openCard" }
  | { type: "!takeCard" }
  | { type: "!changePlayerHealth" }
  | { type: "!deleteCard" }
  | { type: "!getNextPlayer" }
  | { type: "!checkApperanceEnemyCard" }
  | { type: "!openEnemyCard" }
  | { type: "!throwBattleDice" }
  | { type: "!getBattleResult" }
  | { type: "!checkAvailableNeighboringCell" }
  | { type: "!cleanMarkedCell" }
  | { type: "!getPlayerMoveResult" }
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
  availableCellsCoords?: string[] | null;
};

export type GameState =
  | { type: "waitingStart" }
  | { type: "gameStarted.trownDice" }
  | {
      type: "gameStarted.playerMove";
    }
  | {
      type: "gameStarted.takeCard";
    }
  | {
      type: "gameStarted.applyCard";
    }
  | { type: "gameStarted.interactEnemyCard" }
  | { type: "gameStarted.getPlayersOrder" }
  | { type: "endGame" }
  | { type: "getEndScreen" };
