import { State, ActionType, HealthItem, HealthItemType } from "./../../app";

function openHealthCard(action: ActionType, state: State): State {
  switch (action.type) {
    case "needOpenHealthCard": {
      if (state.cardInteract != false) {
        console.log(state.cardInteract);
        return {
          ...state,
          healthList: openHealthItemList(state.cardInteract, state.healthList),
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
              healthList: changeHealthList(
                state.cardInteract,
                state.healthList
              ),
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
              healthList: changeHealthList(
                state.cardInteract,
                state.healthList
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
  healthList: Array<HealthItem>
): Array<HealthItem> => {
  return healthList.map((item, index) => {
    if (card.hor === item.hor && card.vert === item.vert) {
      card.apperance = "open";
      return {
        ...card,
        apperance: "open",
      };
    } else return item;
  });
};

const changeHealthList = (coord: HealthItem, healthList: Array<HealthItem>) => {
  return healthList.filter((item) => {
    return !(coord.hor === item.hor && coord.vert === item.vert);
  });
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
