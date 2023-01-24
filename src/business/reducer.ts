import { initialState } from "./initialState";
import { waitingStart } from "./phases/waitingStart";
import {
  rollDice,
  playerMove,
  takeCard,
  interactWithEnemy,
  applyCard,
} from "./phases/gameStarted";
import { endGame } from "./phases/endGame";
import {
  ContextMenuButtonType,
  EnemyCardType,
  MoveDirection,
  PLayerType,
  State,
  TypeOfInventoryCard,
} from "./types";
import { getPlayersOrder } from "./phases/gameStarted/getPlayersOrder";
import { enemyMove } from "./phases/enemyMove";

export type ActionType =
  | { type: "clickedStartButton" }
  | { type: "diceThrown"; payload: number }
  | { type: "moveControlsClicked"; payload: MoveDirection }
  | { type: "req-openCard" }
  | { type: "req-checkInventoryCard" }
  | { type: "req-changePlayerHealth" }
  | { type: "req-deleteCard" }
  | { type: "req-checkEnemyCard" }
  | { type: "req-openEnemyCard" }
  | { type: "req-getBattleResult" }
  | { type: "req-getEndScreen" }
  | { type: "req-checkAvailableNeighboringCell" }
  | { type: "req-checkAvailableNeighboringCards" }
  | { type: "req-getPlayerMoveResult" }
  | { type: "req-switchToNextPlayer" }
  | { type: "req-takeCard" }
  | {
      type: "cardChoosed";
      payload: { type: TypeOfInventoryCard };
    }
  | { type: "req-choosePlayer" }
  | {
      type: "req-fillHole";
      payload: { coord: number; direction: MoveDirection };
    }
  | { type: "clickedEnemy"; payload: { enemyCard: EnemyCardType } }
  | { type: "req-removeEnemyCard" }
  | { type: "clickedPlayer"; payload: PLayerType }
  | {
      type: "clickedContextMenu";
      payload: { card: PLayerType; buttonType: ContextMenuButtonType };
    }
  | { type: "req-getNextPlayer" };

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
        case "rollDice": {
          return rollDice(state, action);
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

    case "enemyMove": {
      return enemyMove(state, action);
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
