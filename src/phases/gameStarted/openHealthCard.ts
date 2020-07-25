import {
  State,
  ActionType,
  GameList,
  CellType,
  FieldItem,
  ManItem,
  HealthItem,
  HealthItemType,
} from "./../../app";

export const getItemWithMan = (gameList: GameList) => {
  return gameList.flat().find((item) => {
    switch (item.name) {
      case "field": {
        return item.cardItem.find((item) => item.name === "man");
      }
      default:
        return null;
    }
  });
};

export const getManHealth = (gameList: GameList) => {
  const itemWithMan = getItemWithMan(gameList);

  if (itemWithMan != undefined && itemWithMan.name === "field") {
    let health = 0;
    itemWithMan.cardItem.find((item) => {
      if (item.name === "man") {
        health = item.health;
      } else return null;
    });
    return health;
  } else return 0;
};

const getHealthInc = (gameList: GameList) => {
  const itemWithMan = getItemWithMan(gameList);

  if (itemWithMan != undefined && itemWithMan.name === "field") {
    let sign = "";
    itemWithMan.cardItem.find((item) => {
      if (item.name === "health") {
        sign = item.type;
      } else return null;
    });
    /*  return sign; */
    switch (sign) {
      case "increment":
        return +1;
      case "decrement":
        return -1;
      default:
        return 0;
    }
  } else return 0;
};

function openHealthCard(action: ActionType, state: State): State {
  const gameList = state.gameList;
  const manCoord = state.cardInteractIndex;
  switch (action.type) {
    case "needOpenHealthCard": {
      const newList = openHealthItemList(gameList, manCoord);

      return {
        ...state,
        gameList: newList,
      };
    }
    case "changeManHealth": {
      return {
        ...state,
        gameList: changeManHealth(gameList, manCoord),
      };
    }

    case "changeHealthList": {
      const isManLive = getManHealth(state.gameList) > 0;

      switch (true) {
        case isManLive: {
          const isNextTrowLast = state.dice === 0;

          return {
            ...state,
            gameList: changeHealthList(state.gameList),
            gameState: "gameStarted.trownDice",
            dice: 0,
          };
        }
        /* default:  */ case !isManLive: {
          return {
            ...state,
            gameList: changeHealthList(state.gameList),

            gameState: "endGame",
            gameResult: "Вы проиграли",
          };
        }
      }
    }
    default:
      return { ...state };
  }
}

/* const getNew; */

const openHealthItemList = (gameList: GameList, manCoord: string): GameList => {
  const newList = [...gameList];
  const cellNeedOpen = newList.flat()[parseInt(manCoord)];
  switch (cellNeedOpen.name) {
    case "field": {
      const healthItemIndex = cellNeedOpen.cardItem.findIndex(
        (item) => (item.name = "health")
      );

      cellNeedOpen.cardItem.find((item) => {
        if (item.name === "health") {
          item.apperance = "open";
          cellNeedOpen.cardItem[healthItemIndex] = item;
        }
      });
      newList.flat()[parseInt(manCoord)] = cellNeedOpen;

      console.log("newList", newList);
      return newList;
    }
    default:
      return gameList;
  }
};

const changeHealthList = (gameList: GameList) => {
  /*удалить клетку со здоровьем там, где стоит человек  и вернуть массив*/
  return gameList.map((item: CellType[]) => {
    return item.map((item: CellType) => {
      switch (item.name) {
        case "field": {
          const helthCell = item.cardItem.some((item) => item.name === "man");
          if (helthCell) {
            return {
              ...item,
              cardItem: item.cardItem.filter((item) => item.name != "health"),
            };
          } else return item;
        }
        default:
          return item;
      }
    });
  });
};

const changeManHealth = (gameList: GameList, manCoord: string) => {
  /* достать карточку с человечком и поменят здоровье!!!
  знак здоровья лежит в клетке здоровья */
  const newList = [...gameList];
  const cellWithMan = newList.flat()[parseInt(manCoord)];
  let sign: HealthItemType | "" = "";

  switch (cellWithMan.name) {
    case "field": {
      const manItemIndex = cellWithMan.cardItem.findIndex(
        (item) => item.name === "man"
      );

      cellWithMan.cardItem.some((item) => {
        if (item.name === "health") {
          sign = item.type;
        }
      });

      cellWithMan.cardItem.map((item) => {
        switch (item.name) {
          case "man": {
            switch (sign) {
              case "decrement": {
                item.health = item.health - 1;
                cellWithMan.cardItem[manItemIndex] = item;
                break;
              }
              case "increment": {
                item.health = item.health + 1;
                cellWithMan.cardItem[manItemIndex] = item;
                break;
              }
              default: {
                cellWithMan.cardItem[manItemIndex] = item;
              }
            }
          }
        }
      });
      newList.flat()[parseInt(manCoord)] = cellWithMan;
      console.log("cellWithMan", cellWithMan);
      console.log(newList);
      return newList;
    }
    default:
      return gameList;
  }
};

export default openHealthCard;
