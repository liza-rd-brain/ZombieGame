import { State, ActionType, GameList } from "./../../app";



export const getManHealthObj = (
  gameList: GameList,
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
  const manCoordIndex = state.cardInteractIndex;
  switch (action.type) {
    case "needOpenHealthCard": {
      const newListObj = openHealthItemListObj(gameList, manCoordIndex);
      console.log(newListObj);

      return {
        ...state,
        gameList: newListObj,
      };
    }

    case "changeManHealth": {
      const objResult = changeManHealthObj(gameList, manCoordIndex);
      console.log(objResult);
      return {
        ...state,
        gameList: objResult,
      };
    }

    case "changeHealthList": {
      const isManLiveObj = getManHealthObj(gameList, manCoordIndex) > 0;

      switch (true) {
        case isManLiveObj: {
          return {
            ...state,
            gameList: changeHealthListObj(gameList, manCoordIndex),
            gameState: "gameStarted.trownDice",
            dice: 0,
          };
        }
        case !isManLiveObj: {
          return {
            ...state,
            gameList: changeHealthListObj(gameList, manCoordIndex),
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

const openHealthItemListObj = (
  gameList: GameList,
  manCoordIndex: string
): GameList => {
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

const changeHealthListObj = (gameList: GameList, manCoordIndex: string) => {
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

const changeManHealthObj = (
  gameList: GameList,
  manCoordIndex: string
): GameList => {
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
