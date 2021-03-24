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
};

export type PlayersCardListType = PlayersCardType[];

export type FinishCell = {
  name: "finish";
  cardItem: { playerList?: PlayersCardListType };
};

export type StartCell = {
  name: "start";
  cardItem: { playerList?: PlayersCardListType };
};

export type HealthCardType = {
  name: "health";
  type: HealthItemType;
  apperance: "closed" | "open";
};

export type InteractCards = PlayersCardListType | HealthCardType;

// TODO: нужен ли отдельный тип, похоже на переусложнение
export type PlayerAndHealthCell = {
  name: "commonCell";
  cardItem: { playerList: PlayersCardListType; healthItem: HealthCardType };
};

export type CommonCell = {
  name: "commonCell";
  cardItem: { playerList?: PlayersCardListType; healthItem?: HealthCardType };
};

export type CellType = CommonCell | WallItem | FinishCell | StartCell;

export type GameList = Map<string, CellType>;

export type GameField = {
  order: Array<string>;
  values: GameValues;
};

/* export type GameValues = { [key: string]: CellType };
 */
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
  cardInteractIndex: string[];
  gameField: GameField;
  doEffect: TypeEffect;
  numberOfPlayer: number;
};

export type GameState =
  | { type: "waitingStart" }
  | { type: "gameStarted.trownDice"; context: any; gameStartedContext: any }
  | {
      type: "gameStarted.clickArrow";
      gameStartedContext: any;
      context: any;
    }
  | openHealthCardType
  | { type: "gameStarted.getOrder" }
  | { type: "endGame"; context: any }
  | { type: "getEndScreen"; context: any };

export type openHealthCardType = {
  type: "gameStarted.takeHealthCard";
  context: any;
};
