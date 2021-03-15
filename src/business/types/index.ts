export type CoordItem = { hor: number; vert: number };

export type HealthItemType = "increment" | "decrement";

export type HealthItemTypeArr = ["increment", "decrement"];

export type MoveDirection = "top" | "bottom" | "left" | "right";

export type WallItem = {
  name: "wall";
};

export type PlayerItem = {
  name: "player";
  health: number;
  orderNumber: number;
};

export type PlayerList = PlayerItem[];

export type FinishCell = {
  name: "finish";
  cardItem: { playerList?: PlayerList };
};

export type StartCell = {
  name: "start";
  cardItem: { playerList?: PlayerList };
};

export type HealthItem = {
  name: "health";
  type: HealthItemType;
  apperance: "closed" | "open";
};

export type CardInteract = PlayerList | HealthItem;

export type ObjHealthItem = {
  hor: number;
  vert: number;
  name: "field";
  cardItem: { healthItem: HealthItem };
};

export type PlayerAndHealthFieldItem = {
  name: "field";
  cardItem: { playerList: PlayerList; healthItem: HealthItem };
};

export type ObjFieldItem = {
  name: "field";
  cardItem: { playerList?: PlayerList; healthItem?: HealthItem };
};

export type ObjCellType = ObjFieldItem | WallItem | FinishCell | StartCell;

export type GameList = Map<string, ObjCellType>;

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
