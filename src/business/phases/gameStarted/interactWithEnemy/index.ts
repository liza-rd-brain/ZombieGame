import { State } from "../../../types";

import { ActionType } from "../../../reducer";
import { openEnemyCard } from "./openEnemyCard";
import { getBattleResult } from "./getBattleResult";
import { getStateCardSelected } from "../common/getStateCardSelected";

export const interactWithEnemy = (state: State, action: ActionType): State => {
  switch (action.type) {
    case "req-checkEnemyCard": {
      return checkCardApperance(state);
    }

    case "req-openEnemyCard": {
      return openEnemyCard(state);
    }

    case "diceThrown": {
      const dice = action.payload;
      return trownBattleDice(state, dice);
    }

    case "req-getBattleResult": {
      return getBattleResult(state);
    }
    case "cardChoosed": {
      const target = action.payload;
      return getStateCardSelected(state, target);
    }

    default: {
      return state;
    }
  }
};

const checkCardApperance = (state: State): State => {
  const { enemyList, playerList, numberOfPlayer } = state;
  const currentCoord = playerList[numberOfPlayer].coord;

  const isNeedOpenEnemyCard =
    enemyList[currentCoord].apperance === "open" ? false : true;

  switch (true) {
    case isNeedOpenEnemyCard: {
      return {
        ...state,
        doEffect: { type: "!openEnemyCard" },
      };
    }

    case !isNeedOpenEnemyCard: {
      return {
        ...state,
        doEffect: { type: "!throwBattleDice" },
        dice: 0,
      };
    }

    default: {
      return state;
    }
  }
};

const trownBattleDice = (state: State, dice: number): State => {
  const [phaseOuter, phaseInner] = state.gameState.type.split(".");
  switch (phaseOuter) {
    case "fightOrKeepBattle": {
      return {
        ...state,
        dice: dice,
        doEffect: { type: "!getBattleResult" },
        /*         gameState: { type: "gameStarted.interactWithEnemy" }, */
      };
    }
    default: {
      return {
        ...state,
        dice: dice,
        doEffect: { type: "!getBattleResult" },
      };
    }
  }
};
