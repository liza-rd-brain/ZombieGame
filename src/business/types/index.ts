export type CoordItem = { hor: number; vert: number };

export type HealthItemType = "increment" | "decrement";

export type HealthItemTypeArr = ["increment", "decrement"];

export type MoveDirection = "top" | "bottom" | "left" | "right";

export type WallItem = {
  name: "wall";
};

export type PlayersCard = {
  name: "player";
  health: number;
  orderNumber: number;
};

export type PlayersCardList = PlayersCard[];

export type FinishCell = {
  name: "finish";
  cardItem: { playerList?: PlayersCardList };
};

export type StartCell = {
  name: "start";
  cardItem: { playerList?: PlayersCardList };
};

export type HealthCard = {
  name: "health";
  type: HealthItemType;
  apperance: "closed" | "open";
};

export type InteractCards = PlayersCardList | HealthCard;

// TODO: нужен ли отдельный тип, похоже на переусложнение
export type PlayerAndHealthCell = {
  name: "commonCell";
  cardItem: { playerList: PlayersCardList; healthItem: HealthCard };
};

export type СommonCell = {
  name: "commonCell";
  cardItem: { playerList?: PlayersCardList; healthItem?: HealthCard };
};

export type CellType = СommonCell | WallItem | FinishCell | StartCell;

export type GameList = Map<string, CellType>;

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
  GameList: GameList;
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
