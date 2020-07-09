import {
  State,
  ActionType,
  HealthItem,
  HealthItemType,
  CurrentHealthItem,
} from "./../../app";

function openHealthCard(action: ActionType, state: State): State {
  switch (action.type) {
    case "needOpenHealthCard": {
      return {
        ...state,
        gameList: openHealthItemList(state.gameList),
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

const openHealthItemList = (gameList: Array<any>): Array<CurrentHealthItem> => {
  return gameList.map((item: any, index) => {
    return item.map((item: any) => {
      if (item.man) {
        return {
          ...item,
          health: {
            ...item.health,
            apperance: "open",
          },
        };
      } else return item;
    });
  });
};

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
