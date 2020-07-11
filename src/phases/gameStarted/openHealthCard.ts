import {
  State, ActionType, HealthItem,
  HealthItemType, GameList, CellType, CardInteract
} from "./../../app";

function openHealthCard(action: ActionType, state: State): State {
  switch (action.type) {
    case "needOpenHealthCard": {
      const newList = openHealthItemList(state.gameList)
      console.log(newList)
      return {
        ...state,
        gameList: /* openHealthItemList(state.gameList), */newList
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
          const helthCell = item.cardItem.some(item => item.name === "man")
          if (helthCell) {
            return {
              ...item,
              cardItem: item.cardItem.map((item) => {
                switch (item.name) {
                  case "health": {
                    return { ...item, apperance:"open"/* : !item.apperance  *//* , item.apperance: "open"  */ }
                  }
                  case "man": return item
                }
              })

            }
            /*  ищем поле, где есть человек
             в этом поле в кардАйтэм меняем вид клетки здоровья */

            /*  return {
               ...item,
               cardItem: item.cardItem.find(item => {
                 item.name = "man"
               }) ? item.cardItem.map(item => {
                 item.name === "health" ?
                   { ...item, apperance: "open" } : item
               }) : item
             } */
            /*найдем карточку где стоит человек и в ней меняем apperance */
          }
          else { return item };
        }
        case "wall": {
          return item;
        }

      }

    });

  })
}


const changeHealthList = (gameList: Array<any>) => {
  return gameList.map((item) => {
    return item.map((item: any) => {
      if (item.man) {
        delete item.health;
        return item;
      } else return item;
    });
  });
};

const changeHealth = (gameList: any, manHealth: number) => {
  const sign = gameList.flat().find((item: any) => {
    item.man ? item.health.type : false;
  });

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
