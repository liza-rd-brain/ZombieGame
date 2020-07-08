import { State, ActionType, HealthItem, HealthItemType } from "./../../app";

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
          manHealth: changeHealth(state.cardInteract.type, state.manHealth),
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
          /* switch (true) {
                case isNextTrowLast: {
                  if (state.cardInteract != false) {
                    return {
                      ...state,
                      healthList: changeHealthList(
                        state.cardInteract,
                        state.healthList
                      ),
                      gameState: "gameStarted.trownDice",
                      cardInteract: false,
                    };
                  } else return { ...state };
                }

                case !isNextTrowLast: {
                  if (state.cardInteract != false) {
                    return {
                      ...state,
                      healthList: changeHealthList(
                        state.cardInteract,
                        state.healthList
                      ),
                      cardInteract: false,
                      gameState: "gameStarted.clickArrow",
                    };
                  } else return { ...state };
                }
              } */
        }
        case !isManLive: {
          if (state.cardInteract != false) {
            return {
              ...state,
              gameList: changeHealthList(
                state.cardInteract,
                state.gameList
              ),
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
  card: HealthItem,
  gameList: Array<any>
): Array<HealthItem> => {
  return gameList.map((item: any, index) => {
    return item.map((item: any) => {
      if (card.hor === item.hor && card.vert === item.vert) {
        card.apperance = "open";
        return {
          ...card,
          apperance: "open",
        };
      } else return item;
    });
  });
};

const changeHealthList = (coord: HealthItem, gameList: Array<any>) => {
  return gameList.map((item) => {
    return item.filter((item:any) => {
      return !(coord.hor === item.hor && coord.vert === item.vert);
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
