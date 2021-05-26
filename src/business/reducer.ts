import { initialState } from "./initialState";
import { waitingStart } from "./phases/waitingStart";
import {
  trownDice,
  playerMove,
  takeCard,
  getOrder,
  interactEnemyCard,
  applyCard,
} from "./phases/gameStarted";
import { endGame } from "./phases/endGame";
import { MoveDirection, State, HealthCardType } from "./types";
import { DOMElement } from "react";

export type ActionType =
  | { type: "clickedStartButton" }
  | { type: "diceThrown"; payload: number }
  | { type: "playerMoved"; payload: MoveDirection }
  | { type: "req-openCard" }
  | { type: "req-changePlayerHealth" }
  | { type: "req-deleteCard" }
  | { type: "req-getNextPlayer" }
  | { type: "req-checkEnemyCard" }
  | { type: "req-openEnemyCard" }
  | { type: "req-getBattleResult" }
  | { type: "req-getEndScreen" }
  | { type: "req-checkAvailableNeighboringCell" }
  | { type: "req-cleanAvailableCells" }
  | { type: "req-getPlayerMoveResult" }
  | { type: "req-takeCard" }
  | { type: "cardChoosed"; payload: number }
  | { type: "req-choosePlayer" }
  | { type: "req-healPlayer"; payload: number }
  | {
      type: "req-fillHole";
      payload: { coord: number; direction: MoveDirection };
    }
  | { type: "req-shareCard"; payload: number };

export const reducer = (
  state: State = initialState,
  action: ActionType
): State => {
  const [phaseOuter, phaseInner] = state.gameState.type.split(".");

  switch (phaseOuter) {
    case "waitingStart": {
      return waitingStart(action, state);
    }

    case "gameStarted": {
      switch (phaseInner) {
        case "trownDice": {
          return trownDice(action, state);
        }

        case "playerMove": {
          return playerMove(action, state);
        }

        case "takeCard": {
          return takeCard(action, state);
        }
        case "applyCard": {
          return applyCard(action, state);
        }

        case "interactEnemyCard": {
          return interactEnemyCard(action, state);
        }

        case "getOrder": {
          return getOrder(action, state);
        }

        default:
          return state;
      }
    }

    case "endGame": {
      return endGame(action, state);
    }

    default:
      return state;
  }
};
