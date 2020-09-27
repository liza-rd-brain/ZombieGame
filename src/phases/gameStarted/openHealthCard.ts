import {
  State,
  ActionType,
  ObjCellType,
  GameList,
  ObjFieldItem,
  ManItem,
  HealthItem,
} from "./../../app";

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

function openHealthCard(action: ActionType, state: State): State {
  const GameList = state.GameList;
  const manCoordIndex = state.cardInteractIndex;
  switch (action.type) {
    case "openedHealthCard": {
      const newList = openHealthItemList(GameList, manCoordIndex);
      return {
        ...state,
        GameList: newList,
        doEffect: { type: "!changeManHealth" },
      };
    }

    case "changedManHealth": {
      const objResult = changeManHealth(GameList, manCoordIndex);
      return {
        ...state,
        GameList: objResult,
        doEffect: { type: "!changeHealthList" },
      };
    }

    case "changedHealthList": {
      const isManLiveObj = getManHealth(GameList, manCoordIndex) > 0;

      switch (true) {
        case isManLiveObj: {
          return {
            ...state,

            GameList: changeHealthList(GameList, manCoordIndex),
            gameState: "gameStarted.trownDice",
            dice: 0,
            doEffect: null,
          };
        }
        case !isManLiveObj: {
          return {
            ...state,

            GameList: changeHealthList(GameList, manCoordIndex),
            gameState: "endGame",
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
  manCoordIndex: string
): GameList => {
  const cardNeedOpen = gameList.get(manCoordIndex);
  //  в clickArrows мы уже проверили что карточка с healthItem!!!!
  //карточка которую нужно открыть  - где стоит человек,т.е. там точно будет field
  /*  switch(true){
    case cardNeedOpen:ManHealthFieldItem
  } */
  /* if( cardNeedOpen ::"ManHealthFieldItem" ) */

  if (cardNeedOpen) {
    switch (cardNeedOpen.name) {
      case "field": {
        if (cardNeedOpen.cardItem.healthItem) {
          const openedItem: ObjFieldItem = {
            ...cardNeedOpen,
            cardItem: {
              ...cardNeedOpen.cardItem,
              healthItem: {
                ...cardNeedOpen.cardItem.healthItem,
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
        } else return gameList;
      }
      default:
        return gameList;
    }
  } else return gameList;
};

const changeHealthList = (gameList: GameList, manCoordIndex: string) => {
  const cellNeedDeleteHealth = gameList.get(manCoordIndex);

  if (cellNeedDeleteHealth && cellNeedDeleteHealth.name === "field") {
    const { healthItem, ...otherCardItem } = cellNeedDeleteHealth.cardItem;
    const cellWithoutHealth: ObjCellType = {
      ...cellNeedDeleteHealth,
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
  } else return gameList;
};

const changeManHealth = (
  gameList: GameList,
  manCoordIndex: string
): GameList => {
  const cellWithMan = gameList.get(manCoordIndex);
  //по идее уже сразу должна получить клетку с человеком!
  //написать отд тип для клетки с человеком?!
  if (
    cellWithMan &&
    cellWithMan.name === "field" &&
    cellWithMan.cardItem.healthItem &&
    cellWithMan.cardItem.manItem
  ) {
    const sign = cellWithMan.cardItem.healthItem.type;
    const currHealth = cellWithMan.cardItem.manItem.health;

    const incHealth = currHealth + 1;
    const decHealth = currHealth - 1;

    const chagedManItem: ObjFieldItem = {
      ...cellWithMan,
      cardItem: {
        ...cellWithMan.cardItem,
        manItem: {
          ...cellWithMan.cardItem.manItem,
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
  } else return gameList;
};

export default openHealthCard;
