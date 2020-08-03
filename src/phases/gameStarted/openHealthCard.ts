import {
  State,
  ActionType,
 
  GameList,
  ObjFieldItem,
} from "./../../app";



export const getManHealth = (
  gameList: GameList,
  manCoordIndex: string
) => {
  const cellWithMan = gameList.get(manCoordIndex);

  if (cellWithMan && cellWithMan.name === "field") {
    if (cellWithMan.cardItem.manItem) {
      return cellWithMan.cardItem.manItem.health;
    } else return 0;
  } else return 0;
};

function openHealthCard(action: ActionType, state: State): State {


  const GameList = state.GameList;
  const manCoordIndex = state.cardInteractIndex;
  switch (action.type) {
    case "needOpenHealthCard": {
      const newList = openHealthItemList(GameList, manCoordIndex);
      return {
        ...state,
        GameList: newList,
      };
    }

    case "changeManHealth": {
      const objResult = changeManHealth(GameList, manCoordIndex);
      return {
        ...state,
        GameList: objResult,
      };
    }

    case "changeHealthList": {
      const isManLiveObj = getManHealth(GameList, manCoordIndex) > 0;

      switch (true) {
        case isManLiveObj: {
          return {
            ...state,

            GameList: changeHealthList(GameList, manCoordIndex),
            gameState: "gameStarted.trownDice",
            dice: 0,
          };
        }
        case !isManLiveObj: {
          return {
            ...state,

            GameList: changeHealthList(GameList, manCoordIndex),
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
  const cardNeedOpen = gameList.get(manCoordIndex);

  if (cardNeedOpen) {
    switch (cardNeedOpen.name) {
      case "field": {
        if (cardNeedOpen.cardItem.healthItem) {
          const mapWithOpenCards = new Map(gameList);
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
          mapWithOpenCards.set(manCoordIndex, openedItem);

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
  if (cellNeedDeleteHealth) {
    switch (cellNeedDeleteHealth.name) {
      case "field": {
        delete cellNeedDeleteHealth.cardItem.healthItem;

        const objResult = new Map(gameList);
        objResult.set(manCoordIndex, cellNeedDeleteHealth);

        return objResult;
      }
      default:
        return gameList;
    }
  } else return gameList;
};


const changeManHealth = (
  gameList: GameList,
  manCoordIndex: string
): GameList => {
  const cellWithMan = gameList.get(manCoordIndex);
  if (cellWithMan) {
    switch (cellWithMan.name) {
      case "field": {
        const sign = cellWithMan.cardItem.healthItem?.type;
        if (cellWithMan.cardItem.healthItem && cellWithMan.cardItem.manItem) {
          switch (sign) {
            case "decrement": {
              const mapWithChangedHealth = new Map(gameList);
              const chagedHelthItem: ObjFieldItem = {
                ...cellWithMan,
                cardItem: {
                  ...cellWithMan.cardItem,
                  manItem: {
                    ...cellWithMan.cardItem.manItem,
                    health: cellWithMan.cardItem.manItem.health - 1,
                  },
                },
              };
              mapWithChangedHealth.set(manCoordIndex, chagedHelthItem);

              return mapWithChangedHealth;
            }
            case "increment": {
              const mapWithChangedHealth = new Map(gameList);
              const chagedHelthItem: ObjFieldItem = {
                ...cellWithMan,
                cardItem: {
                  ...cellWithMan.cardItem,
                  manItem: {
                    ...cellWithMan.cardItem.manItem,
                    health: cellWithMan.cardItem.manItem.health + 1,
                  },
                },
              };
              mapWithChangedHealth.set(manCoordIndex, chagedHelthItem);
              return mapWithChangedHealth;
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
  } else return gameList;
};

export default openHealthCard;
