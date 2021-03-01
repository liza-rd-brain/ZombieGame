export type CoordItem = { hor: number; vert: number };

export type HealthItemType = "increment" | "decrement";

export type HealthItemTypeArr = ["increment", "decrement"];

export type MoveDirection = "top" | "bottom" | "left" | "right";

export type WallItem = {
  name: "wall";
};

export type ManItem = {
  name: "man";
  health: number;
  orderNumber: number;
};

export type ManList = ManItem[];

export type FinishCell = {
  name: "finish";
  cardItem: { manList?: ManList };
};
export type StartCell = {
  name: "start";
  cardItem: { manList?: ManList };
};

export type HealthItem = {
  name: "health";
  type: HealthItemType;
  apperance: "closed" | "open";
};

export type CardInteract = ManList | HealthItem;

export type ObjHealthItem = {
  hor: number;
  vert: number;
  name: "field";
  cardItem: { healthItem: HealthItem };
};

export type ManAndHealthFieldItem = {
  name: "field";
  cardItem: { manList: ManList; healthItem: HealthItem };
};

export type ObjFieldItem = {
  name: "field";
  cardItem: { manList?: ManList; healthItem?: HealthItem };
};

export type ObjCellType = ObjFieldItem | WallItem | FinishCell | StartCell;

export type GameList = Map<string, ObjCellType>;

export type TypeEffect =
  | { type: "!needOpenHealthCard" }
  | { type: "!changeManHealth" }
  | { type: "!changeHealthList" }
  | { type: "!getNextMan" }
  | null;

  
  export type State = {
    gameState: GameState;
    dice: number;
    gameResult: "" | "Вы выиграли" | "Вы проиграли";
    cardInteractIndex: string[];
    GameList: GameList;
    doEffect: TypeEffect;
    numberOfMan: number;
  };



export type GameState =
  | { type: "waitingStart" /* context: {}  */ }
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
  /*   gameStartedContext: any; */
  context: any;
};
