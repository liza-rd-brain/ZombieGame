import {
  State,
  ActionType,
  HealthItem,
  HealthItemType,
  GameList,
  CellType,
  CardInteract,
  FieldItem,
  ManItem,
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
  switch (action.type) {
    case "needOpenHealthCard": {
      const newList = openHealthItemList(state.gameList);

      return {
        ...state,
        gameList: newList,
      };
    }
    case "changeManHealth": {
      return {
        ...state,
        gameList: changeManHealth(state.gameList),
        /*      manHealth: changeHealth(state.gameList, state.manHealth), */
      };
    }

    case "changeHealthList": {
      /*  const manItem=state.gameList.find().map(item=>
        switch(item.name){
          case "field":{
            const hasMan = item.cardItem.find((item) => item.name === "man");
          }
          else return false;
        }
        )
      const manHealth; */

      /* const isManLive = state.manHealth > 0; */
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

const openHealthItemList = (gameList: GameList): GameList => {
  return gameList.map((item: CellType[]) => {
    return item.map((item: CellType) => {
      switch (item.name) {
        case "field": {
          const helthCell = item.cardItem.some((item) => item.name === "man");
          if (helthCell) {
            return {
              ...item,
              cardItem: item.cardItem.map((item) => {
                switch (item.name) {
                  case "health": {
                    return {
                      ...item,
                      apperance: "open",
                    };
                  }
                  case "man":
                    return item;
                }
              }),
            };
          } else {
            return item;
          }
        }
        default: {
          return item;
        }
      }
    });
  });
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

/* const changeHealth = (gameList: GameList, manHealth: number) => {

  let sign = "";

  const newList = gameList.flat().map((item: CellType) => {
    switch (item.name) {
      case "field": {
        const hasMan = item.cardItem.find((item) => item.name === "man");

        if (hasMan) {
          item.cardItem.filter((item) => {
            switch (item.name) {
              case "health":
                sign = item.type;
            }
          });
        } else return false;
      }
      default:
        return false;
    }
  });

  switch (sign) {
    case "increment":
      return manHealth + 1;
    case "decrement":
      return manHealth - 1;
    default:
      return manHealth;
  }
}; */

const changeManHealth = (gameList: GameList) => {
  return gameList.map((item: CellType[]) => {
    return item.map((item: CellType) => {
      switch (item.name) {
        case "field": {
          const cardWithMan = item.cardItem.some((item) => {
            return item.name === "man";
          });

          if (cardWithMan) {
            const newManItem: ManItem = {
              name: "man",
              health: getManHealth(gameList) + getHealthInc(gameList),
            };

            const newFieldItem: FieldItem = {
              ...item,
              cardItem: [...item.cardItem, newManItem],
            };
            return newFieldItem;
          } else return item;
        }
        default:
          return item;
      }
    });
  });

  let sign = "";

  const newList = gameList.flat().map((item: CellType) => {
    switch (item.name) {
      case "field": {
        const hasMan = item.cardItem.find((item) => item.name === "man");

        if (hasMan) {
          item.cardItem.filter((item) => {
            switch (item.name) {
              case "health":
                sign = item.type;
            }
          });
        } else return false;
      }
      default:
        return false;
    }
  });

  /*  switch (sign) {
    case "increment":
      return manHealth + 1;
    case "decrement":
      return manHealth - 1;
    default:
      return manHealth;
  } */
  /* return gameList; */
};

export default openHealthCard;
