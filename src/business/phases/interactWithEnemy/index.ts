import { State } from "../../types";

import { ActionType } from "../../reducer";
import { openEnemyCard } from "./openEnemyCard";
import { getBattleResult } from "./getBattleResult";
import { removeEnemyCard } from "./removeEnemyCard";
import { getStateClickedEnemy } from "./getStateClickedEnemy";
import { checkCardApperance } from "./checkCardApperance";
import { trownBattleDice } from "./trownBattleDice";
import { selectCard } from "./selectCard";

export const interactWithEnemy = (state: State, action: ActionType): State => {
  const [, phaseInner] = state.gameState.type.split(".");

  switch (phaseInner) {
    case "makeBattleAction": {
      switch (action.type) {
        case "diceThrown": {
          return trownBattleDice(state, action);
        }

        case "cardChoosed": {
          return selectCard(state, action);
        }

        default: {
          return state;
        }
      }
    }

    case "applyCard": {
      switch (action.type) {
        case "cardChoosed": {
          return selectCard(state, action);
        }

        case "clickedEnemy": {
          return getStateClickedEnemy(state, action);
        }
        case "req-removeEnemyCard": {
          return removeEnemyCard(state);
        }

        default: {
          return state;
        }
      }
    }

    case "throwBattleDice": {
      return trownBattleDice(state, action);
    }

    default: {
      switch (action.type) {
        case "req-checkEnemyCard": {
          return checkCardApperance(state);
        }

        case "req-openEnemyCard": {
          return openEnemyCard(state);
        }

        case "req-getBattleResult": {
          return getBattleResult(state);
        }

        default: {
          return state;
        }
      }
    }
  }
};
