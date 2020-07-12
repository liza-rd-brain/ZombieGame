import {
  State,
  ActionType,
  HealthItem,
  HealthItemType,
  GameList,
  CellType,
  CardInteract,
  FieldItem,
} from "./../../app";

function openHealthCard(action: ActionType, state: State): State {
  switch (action.type) {
    case "needOpenHealthCard": {
      const newList = openHealthItemList(state.gameList);
      console.log(newList);
      return {
        ...state,
        gameList: /* openHealthItemList(state.gameList), */ newList,
      };
    }
    case "changeManHealth": {
      return {
        ...state,
        manHealth: changeHealth(state.gameList, state.manHealth),
      };
    }

    case "changeHealthList": {
      debugger;
      const isManLive = state.manHealth > 0;

      switch (true) {
        case isManLive: {
          const isNextTrowLast = state.dice === 0;

          return {
            ...state,
            gameList: changeHealthList(state.gameList),
            gameState: "gameStarted.trownDice",
            dice: null,
          };
        }
        case !isManLive: {
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
        case "wall": {
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

      /*    if (item.man) {
        delete item.health;
        return item;
      } else return item; */
    });
  });
};

const changeHealth = (gameList: GameList, manHealth: number) => {
  /*можно попробовать отдать общий state */
  let sign = "";
  const newList = gameList.flat().forEach((item: CellType) => {
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

  console.log(newList);

  switch (sign) {
    case "increment":
      return manHealth + 1;
    case "decrement":
      return manHealth - 1;
    default:
      return manHealth;
  }
};

export default openHealthCard;
