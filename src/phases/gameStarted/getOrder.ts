import { State, ActionType, amountMen, minNumerbMan } from "./../../app";

function getOrder(action: ActionType, state: State): State {
  const currentNumber = state.numberOfMan;
  const maxNumber = amountMen;
  const nextNumber =
    currentNumber + 1 > maxNumber ? minNumerbMan : currentNumber + 1;
  //проверяем сколько всего
  //возвращать нужно типа  по порядку
  console.log(nextNumber);
  switch (action.type) {
    case "receivedNextMan": {
      return {
        ...state,
        numberOfMan: nextNumber,
        gameState: {
          type: "gameStarted.trownDice",
          gameStartedContext: {},
          context: {},
        },
      };
    }
    default:
      return state;
  }
}

export default getOrder;
