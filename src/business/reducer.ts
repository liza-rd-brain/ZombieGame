import { initialState } from "./initialState";
import waitingStartPhase from "./phases/waitingStart";
import trownDice from "./phases/gameStarted/trownDice";
import clickArrow from "./phases/gameStarted/clickArrow";
import takeHealthCard from "./phases/gameStarted/takeHealthCard";
import getOrder from "./phases/gameStarted/getOrder";
import endGame from "./phases/endGame";
import { MoveDirection, State } from "./types";
import { openHealthCardType } from "./types";

export type ActionType =
  | { type: "clickStartButton" }
  | DiceThrownAction
  | ArrowPressAction
  | { type: "openedHealthCard" }
  | { type: "changedManHealth" }
  | { type: "changedHealthList" }
  | { type: "receivedNextMan" }
  | { type: "getEndScreen" };

export type ArrowPressAction = { type: "arrowPressed"; payload: MoveDirection };

export type DiceThrownAction = { type: "diceThrown"; payload: number };

export const reducer = (
  state: State = initialState,
  action: ActionType
): State => {
  const [phaseOuter, phaseInner] = state.gameState.type.split(".");

  switch (phaseOuter) {
    case "waitingStart": {
      return waitingStartPhase(action, state);
    }

    case "gameStarted": {
      switch (phaseInner) {
        case "trownDice": {
          return trownDice(action, state);
        }

        case "clickArrow": {
          return clickArrow(action, state);
        }

        case "takeHealthCard": {
          const gameState = state.gameState as openHealthCardType;
          return takeHealthCard(action, state, gameState);
        }
        case "getOrder": {
          return getOrder(action, state);
        }
        default:
          return state;
      }
    }

    case "endGame": {
      endGame(action, state);
    }
    default:
      return state;
  }
};
