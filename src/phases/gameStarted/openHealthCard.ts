import {
  State,
  ActionType,
  GameList,
  CellType,
  FieldItem,
  ManItem,
  HealthItem,
  HealthItemType,
  ObjGameList,
} from "./../../app";

export const getManHealth = (gameList: GameList, manCoordIndex: string) => {
  const cellWithMan = gameList.flat()[parseInt(manCoordIndex)];

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

export const getManHealthObj = (
  gameList: ObjGameList,
  manCoordIndex: string
) => {
  const cellWithMan = gameList[manCoordIndex];

  if (cellWithMan.name === "field") {
    if (cellWithMan.cardItem.manItem) {
      return cellWithMan.cardItem.manItem.health;
    } else return 0;
  } else return 0;
};

function openHealthCard(action: ActionType, state: State): State {
  const gameList = state.gameList;
  const objGameList = state.objGameList;
  const manCoordIndex = state.cardInteractIndex;
  switch (action.type) {
    case "needOpenHealthCard": {
      const newListObj = openHealthItemListObj(objGameList, manCoordIndex);
      console.log(newListObj);
      const newList = openHealthItemList(gameList, manCoordIndex);

      return {
        ...state,
        gameList: newList,
        objGameList: newListObj,
      };
    }

    case "changeManHealth": {
      const objResult = changeManHealthObj(objGameList, manCoordIndex);
      console.log(objResult);
      return {
        ...state,
        gameList: changeManHealth(gameList, manCoordIndex),
        objGameList: objResult,
      };
    }

    case "changeHealthList": {
      const isManLive = getManHealth(gameList, manCoordIndex) > 0;

      const isManLiveObj = getManHealthObj(objGameList, manCoordIndex) > 0;

      switch (true) {
        case isManLiveObj: {
          return {
            ...state,
            gameList: changeHealthList(gameList, manCoordIndex),
            objGameList: changeHealthListObj(objGameList, manCoordIndex),
            gameState: "gameStarted.trownDice",
            dice: 0,
          };
        }
        case !isManLiveObj: {
          return {
            ...state,
            gameList: changeHealthList(gameList, manCoordIndex),
            objGameList: changeHealthListObj(objGameList, manCoordIndex),

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

const openHealthItemList = (
  gameList: GameList,
  manCoordIndex: string
): GameList => {
  const newList = [...gameList];
  const cellNeedOpen = newList.flat()[parseInt(manCoordIndex)];
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
      newList.flat()[parseInt(manCoordIndex)] = cellNeedOpen;

      return newList;
    }
    default:
      return gameList;
  }
};

const openHealthItemListObj = (
  gameList: ObjGameList,
  manCoordIndex: string
): ObjGameList => {
  const cardNeedOpen = gameList[manCoordIndex];
  switch (cardNeedOpen.name) {
    case "field": {
      if (cardNeedOpen.cardItem.healthItem) {
        return {
          ...gameList,
          [manCoordIndex]: {
            ...cardNeedOpen,
            cardItem: {
              ...cardNeedOpen.cardItem,
              healthItem: {
                ...cardNeedOpen.cardItem.healthItem,
                apperance: "open",
              },
            },
          },
        };
      } else return gameList;
    }
    default:
      return gameList;
  }
};
const changeHealthList = (gameList: GameList, manCoordIndex: string) => {
  const newList = [...gameList];
  const cellNeedDeleteHealth = newList.flat()[parseInt(manCoordIndex)];

  switch (cellNeedDeleteHealth.name) {
    case "field": {
      cellNeedDeleteHealth.cardItem = cellNeedDeleteHealth.cardItem.filter(
        (item) => item.name != "health"
      );

      newList.flat()[parseInt(manCoordIndex)] = cellNeedDeleteHealth;
      /*  console.log(newList); */
      return newList;
    }
    default:
      return gameList;
  }
};

const changeHealthListObj = (gameList: ObjGameList, manCoordIndex: string) => {
  const cellNeedDeleteHealth = gameList[manCoordIndex];
  switch (cellNeedDeleteHealth.name) {
    case "field": {
      delete cellNeedDeleteHealth.cardItem.healthItem;

      const objResult = {
        ...gameList,
        [manCoordIndex]: {
          ...cellNeedDeleteHealth,
        },
      };
      console.log(objResult);
      return objResult;
    }
    default:
      return gameList;
  }
};

const changeManHealth = (gameList: GameList, manCoordIndex: string) => {
  const newList = [...gameList];
  const cellWithMan = newList.flat()[parseInt(manCoordIndex)];
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
      newList.flat()[parseInt(manCoordIndex)] = cellWithMan;

      return newList;
    }
    default:
      return gameList;
  }
};

const changeManHealthObj = (
  gameList: ObjGameList,
  manCoordIndex: string
): ObjGameList => {
  const cellWithMan = gameList[manCoordIndex];
  switch (cellWithMan.name) {
    case "field": {
      const sign = cellWithMan.cardItem.healthItem?.type;
      if (cellWithMan.cardItem.healthItem && cellWithMan.cardItem.manItem) {
        switch (sign) {
          case "decrement": {
            return {
              ...gameList,
              [manCoordIndex]: {
                ...cellWithMan,
                cardItem: {
                  ...cellWithMan.cardItem,
                  manItem: {
                    ...cellWithMan.cardItem.manItem,
                    health: cellWithMan.cardItem.manItem.health - 1,
                  },
                },
              },
            };
          }
          case "increment": {
            return {
              ...gameList,
              [manCoordIndex]: {
                ...cellWithMan,
                cardItem: {
                  ...cellWithMan.cardItem,
                  manItem: {
                    ...cellWithMan.cardItem.manItem,
                    health: cellWithMan.cardItem.manItem.health + 1,
                  },
                },
              },
            };
          }
          default: {
            return gameList;
          }
        }
      } else return gameList;
    }
    default: {
      return gameList;
    }
  }
};

export default openHealthCard;
