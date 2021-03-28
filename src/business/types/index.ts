export type CoordItem = { hor: number; vert: number };

export type HealthItemType = "increment" | "decrement";

export type HealthItemTypeArr = ["increment", "decrement"];

export type MoveDirection = "top" | "bottom" | "left" | "right";

export type WallItem = {
  name: "wall";
};

export type PlayersCardType = {
  name: "player";
  health: number;
  orderNumber: number;
  coord: string;
};

export type PlayersList = Record<string, PlayersCardType>;

export type FinishCell = {
  name: "finish";
  cardItem: { playerList?: PlayersCardType[] };
};

export type StartCell = {
  name: "start";
  cardItem: { playerList?: PlayersCardType[] };
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
  values: GameValues;
};


export type GameValues = Record<string, CellType>;

export type TypeEffect =
  | { type: "!needOpenHealthCard" }
  | { type: "!changePlayerHealth" }
  | { type: "!changeHealthList" }
  | { type: "!getNextPlayer" }
  | null;

export type State = {
  gameState: GameState;
  dice: number;
  gameResult: "" | "Вы выиграли" | "Вы проиграли";
  playersList: PlayersList;
  cardInteractIndex: string[];
  gameField: GameField;
  doEffect: TypeEffect;
  numberOfPlayer: number;
};

export type GameState =
  | { type: "waitingStart" }
  | { type: "gameStarted.trownDice" }
  | {
      type: "gameStarted.clickArrow";
    }
  | openHealthCardType
  | { type: "gameStarted.getOrder" }
  | { type: "endGame" }
  | { type: "getEndScreen" };

export type openHealthCardType = {
  type: "gameStarted.takeHealthCard";
};
