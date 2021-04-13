export type CoordItem = { hor: number; vert: number };

export type HealthItemType = "increment" | "decrement";

export type HealthItemTypeArr = ["increment", "decrement"];

export type MoveDirection = "top" | "bottom" | "left" | "right";

export type WallItem = {
  name: "wall";
};

export type PlayerCardType = {
  name: "player";
  health: number;
  orderNumber: number;
  coord: string;
};

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
  cardItem: { playerList?: PlayerCardType[] };
};

export type StartCell = {
  name: "start";
  cardItem: { playerList?: PlayerCardType[] };
};

export type HealthCardType = {
  name: "health";
  type: HealthItemType;
  apperance: "closed" | "open";
};

// TODO: нужен ли отдельный тип, похоже на переусложнение
export type HealthCell = {
  name: "commonCell";
  cardItem: { healthItem: HealthCardType };
};

export type CommonCell = {
  name: "commonCell";
  cardItem: { healthItem?: HealthCardType };
};

export type CellType =
  | CommonCell
  | WallItem
  | FinishCell
  | StartCell
  | HealthCell;

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
