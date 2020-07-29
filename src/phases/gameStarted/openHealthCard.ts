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

export const getManHealth = (gameList: GameList, manCoord: string) => {
  const cellWithMan = gameList.flat()[parseInt(manCoord)];

  if (cellWithMan.name === "field") {
    let health = 0;
    cellWithMan.cardItem.find((item) => {
      if (item.name === "man") {
        health = item.health;
      } else return null;
    });
    return health;
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
      const isManLive = getManHealth(gameList, manCoord) > 0;

      /*   console.log(isManLive); */

      switch (true) {
        case isManLive: {
          return {
            ...state,
            gameList: changeHealthList(gameList, manCoord),
            gameState: "gameStarted.trownDice",
            dice: 0,
          };
        }
        case !isManLive: {
          return {
            ...state,
            gameList: changeHealthList(gameList, manCoord),

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

      return newList;
    }
    default:
      return gameList;
  }
};

const changeHealthList = (gameList: GameList, manCoord: string) => {
  const newList = [...gameList];
  const cellNeedDeleteHealth = newList.flat()[parseInt(manCoord)];

  switch (cellNeedDeleteHealth.name) {
    case "field": {
      cellNeedDeleteHealth.cardItem = cellNeedDeleteHealth.cardItem.filter(
        (item) => item.name != "health"
      );

      newList.flat()[parseInt(manCoord)] = cellNeedDeleteHealth;
      /*  console.log(newList); */
      return newList;
    }
    default:
      return gameList;
  }
};

const changeManHealth = (gameList: GameList, manCoord: string) => {
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

      return newList;
    }
    default:
      return gameList;
  }
};

export default openHealthCard;
