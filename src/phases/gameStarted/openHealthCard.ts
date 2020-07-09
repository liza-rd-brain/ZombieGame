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
      if (state.cardInteract != false) {
        console.log(state.cardInteract);
        return {
          ...state,
          gameList: openHealthItemList(state.cardInteract, state.gameList),
        };
      } else return { ...state };
    }
    case "changeManHealth": {
      if (state.cardInteract != false) {
        return {
          ...state,
          manHealth: changeHealth(state.cardInteract.health.type, state.manHealth),
        };
      } else return { ...state };
    }

    case "changeHealthList": {
      debugger;
      const isManLive = state.manHealth > 0;

      switch (true) {
        case isManLive: {
          const isNextTrowLast = state.dice === 0;
          /*взял карточку -закончен ход! */
          if (state.cardInteract != false) {
            return {
              ...state,
              gameList: changeHealthList(state.cardInteract, state.gameList),
              gameState: "gameStarted.trownDice",
              dice: null,
              cardInteract: false,
            };
          } else return { ...state };
        }
        case !isManLive: {
          if (state.cardInteract != false) {
            return {
              ...state,
              gameList: changeHealthList(state.cardInteract, state.gameList),
              cardInteract: false,
              gameState: "endGame",
              gameResult: "Вы проиграли",
            };
          } else return { ...state };
        }
      }
    }
    default:
      return { ...state };
  }
}

const openHealthItemList = (
  card: CurrentHealthItem,
  gameList: Array<any>
): Array<CurrentHealthItem> => {
  return gameList.map((item: any, index) => {
    return item.map((item: any) => {
      if (card.hor === item.hor && card.vert === item.vert) {
        /* card.health.apperance = "open"; */
        return {
          ...card,
          health: {
            ...card.health,
            apperance: "open",
          },
        };
      } else return item;
    });
  });
};

const changeHealthList = (coord: HealthItem, gameList: Array<any>) => {
  return gameList.map((item) => {
    return item.map((item: any) => {
      if (coord.hor === item.hor && coord.vert === item.vert) {
        delete item.health;
        return item;
      } else return item;
      /* return !(coord.hor === item.hor && coord.vert === item.vert); */
    });
  });
  /* удаляем карточку*/

  /* return healthList.filter((item) => {
    return !(coord.hor === item.hor && coord.vert === item.vert);
  }); */
};

const changeHealth = (sign: HealthItemType, manHealth: number) => {
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
