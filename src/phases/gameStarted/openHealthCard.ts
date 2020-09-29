import {
  State,
  GameState,
  ActionType,
  ObjCellType,
  GameList,
  ObjFieldItem,
  ManItem,
  HealthItem,
  TypeEffect,
  openHealthCardType,
  ManAndHealthFieldItem,
} from "./../../app";

//пока нужно для вывода здоровья на экране
export const getManHealth = (gameList: GameList, manCoordIndex: string) => {
  const cellWithMan = gameList.get(manCoordIndex);

  if (cellWithMan && cellWithMan.name === "field") {
    if (cellWithMan.cardItem.manItem) {
      return cellWithMan.cardItem.manItem.health;
    } else return 0;
  } else return 0;
};

//карточка у  которой нужно открыть здоровье - это будет карточка уже с человеком и здоровьем!!!

type ManHealthFieldItem = {
  name: "field";
  cardItem: { manItem: ManItem; healthItem: HealthItem };
};

type ManFieldItem = {
  name: "field";
  cardItem: { manItem: ManItem };
};

//приниметь не целый state, a его кусок
function openHealthCard(
  action: ActionType,
  state: State,
  gameState: openHealthCardType
  /* : GameState */
  /*  gameList: GameList,
  doEffect: TypeEffect,
  */
): State {
  const GameList = state.GameList;
  /*   const manCoordIndex = state.cardInteractIndex; */
  const manCoordIndex = gameState.context.index;
  const manAndHealthCell: ManAndHealthFieldItem =
    gameState.context.manAndHealthCell;

  switch (action.type) {
    case "openedHealthCard": {
      const newList = openHealthItemList(
        GameList,
        manCoordIndex,
        manAndHealthCell
      );
      return {
        ...state,
        GameList: newList,
        doEffect: { type: "!changeManHealth" },
      };
    }

    case "changedManHealth": {
      const objResult = changeManHealth(
        GameList,
        manCoordIndex,
        manAndHealthCell
      );
      return {
        ...state,
        GameList: objResult,
        doEffect: { type: "!changeHealthList" },
      };
    }

    case "changedHealthList": {
      //проверка на потерю жизней
      const isManLiveObj = manAndHealthCell.cardItem.manItem.health > 0;

      switch (true) {
        case isManLiveObj: {
          return {
            ...state,

            GameList: changeHealthList(
              GameList,
              manCoordIndex,
              manAndHealthCell
            ),
            gameState: { type: "gameStarted.trownDice", context: {} },
            dice: 0,
            doEffect: null,
          };
        }
        case !isManLiveObj: {
          return {
            ...state,

            GameList: changeHealthList(
              GameList,
              manCoordIndex,
              manAndHealthCell
            ),
            gameState: { type: "endGame", context: {} },
            gameResult: "Вы проиграли",
            doEffect: null,
          };
        }
      }
    }
    default:
      return { ...state };
  }
}

const openHealthItemList = (
  gameList: GameList,
  manCoordIndex: string,
  manAndHealthCell: ManAndHealthFieldItem
): GameList => {
  /* const cardNeedOpen = gameList.get(manCoordIndex); */

  //  в clickArrows мы уже проверили что карточка с healthItem!!!!
  //карточка которую нужно открыть  - где стоит человек,т.е. там точно будет field

  const openedItem: ManAndHealthFieldItem = {
    ...manAndHealthCell,
    cardItem: {
      ...manAndHealthCell.cardItem,
      healthItem: {
        ...manAndHealthCell.cardItem.healthItem,
        apperance: "open",
      },
    },
  };

  const newGameList: [string, ObjCellType][] = Array.from(gameList).map(
    (item) => {
      const [index, elem] = item;
      if (index === manCoordIndex) {
        return [index, openedItem];
      } else return item;
    }
  );
  const mapWithOpenCards = new Map(newGameList);
  console.log("mapWithOpenCards", mapWithOpenCards);
  return mapWithOpenCards;
};

const changeHealthList = (
  gameList: GameList,
  manCoordIndex: string,
  manAndHealthCell: ManAndHealthFieldItem
) => {
  /* const cellNeedDeleteHealth = gameList.get(manCoordIndex); */

  /*  if (cellNeedDeleteHealth && cellNeedDeleteHealth.name === "field") { */
  const { healthItem, ...otherCardItem } = manAndHealthCell.cardItem;
  const cellWithoutHealth: ObjCellType = {
    ...manAndHealthCell,
    cardItem: { ...otherCardItem },
  };

  const newGameList: [string, ObjCellType][] = Array.from(gameList).map(
    (item) => {
      const [index, elem] = item;
      if (index === manCoordIndex) {
        return [index, cellWithoutHealth];
      } else return item;
    }
  );
  const newMap = new Map(newGameList);
  return newMap;
  /*   } else return gameList; */
};

const changeManHealth = (
  gameList: GameList,
  manCoordIndex: string,
  manAndHealthCell: ManAndHealthFieldItem
): GameList => {
  /* const cellWithMan = gameList.get(manCoordIndex); */
  //по идее уже сразу должна получить клетку с человеком!b
  //написать отд тип для клетки с человеком?!
  /* if (
    cellWithMan &&
    cellWithMan.name === "field" &&
    cellWithMan.cardItem.healthItem &&
    cellWithMan.cardItem.manItem
  ) { */
  const sign = manAndHealthCell.cardItem.healthItem.type;
  const currHealth = manAndHealthCell.cardItem.manItem.health;

  const incHealth = currHealth + 1;
  const decHealth = currHealth - 1;

  const chagedManItem: ObjFieldItem = {
    ...manAndHealthCell,
    cardItem: {
      ...manAndHealthCell.cardItem,
      manItem: {
        ...manAndHealthCell.cardItem.manItem,
        health: sign === "decrement" ? decHealth : incHealth,
      },
    },
  };

  const newGameList: [string, ObjCellType][] = Array.from(gameList).map(
    (item) => {
      const [index, elem] = item;
      if (index === manCoordIndex) {
        return [index, chagedManItem];
      } else return item;
    }
  );
  console.log(newGameList);
  const newMap = new Map(newGameList);
  return newMap;
  /*  } else return gameList; */
};

export default openHealthCard;
