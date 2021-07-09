import { initialState } from "./initialState";
import { waitingStart } from "./phases/waitingStart";
import {
  trownDice,
  playerMove,
  takeCard,
  interactWithEnemy,
  applyCard,
} from "./phases/gameStarted";
import { getPlayersOrder } from "./phases/gameStarted";
import { endGame } from "./phases/endGame";
import {
  ContextMenuButtonType,
  MoveDirection,
  PlayerCardType,
  State,
  TypeOfCard,
} from "./types";

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
  | { type: "req-checkAvailableNeighboringCards" }
  | { type: "req-getPlayerMoveResult" }
  | { type: "req-takeCard" }
  | {
      type: "cardChoosed";
      payload: { type: TypeOfCard };
    }
  | { type: "req-choosePlayer" }
  | {
      type: "req-fillHole";
      payload: { coord: number; direction: MoveDirection };
    }
  | { type: "req-defeatEnemy" }
  | { type: "req-removeEnemyCard" }
  | { type: "clickedPlayer"; payload: PlayerCardType }
  | {
      type: "clickedContextMenu";
      payload: { card: PlayerCardType; buttonType: ContextMenuButtonType };
    };

export const reducer = (
  state: State = initialState,
  action: ActionType
): State => {
  const [phaseOuter, phaseInner] = state.gameState.type.split(".");

  switch (phaseOuter) {
    case "waitingStart": {
      return waitingStart(state, action);
    }

    case "gameStarted": {
      switch (phaseInner) {
        case "trownDice": {
          return trownDice(state, action);
        }

        case "playerMove": {
          return playerMove(state, action);
        }

        case "takeCard": {
          return takeCard(state, action);
        }
        case "applyCard": {
          return applyCard(state, action);
        }

        case "getPlayersOrder": {
          return getPlayersOrder(state, action);
        }

        default:
          return state;
      }
    }
    case "interactWithEnemy": {
      return interactWithEnemy(state, action);
    }

    case "endGame": {
      return endGame(state, action);
    }

    default:
      return state;
  }
};
