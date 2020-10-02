import { State, ActionType, amountMen /* , minNumerbMan */ } from "./../../app";

function getOrder(action: ActionType, state: State): State {
  //индексы начинаются с нуля
  const currentNumber = state.numberOfMan;
  const maxNumber = amountMen - 1;
  const minNumerbMan = 0;
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
