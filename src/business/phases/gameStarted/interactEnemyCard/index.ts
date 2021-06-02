import { State } from "../../../types";

import { ActionType } from "../../../reducer";
import { openEnemyCard } from "./openEnemyCard";
import { getBattleResult } from "./getBattleResult";

export const interactEnemyCard = ( state: State,action: ActionType): State => {
  switch (action.type) {
    case "req-checkEnemyCard": {
      return getStateCheckApperance(state);
    }

    case "req-openEnemyCard": {
      return getStateOpenCard(state);
    }

    case "diceThrown": {
      const dice = action.payload;
      return getStateDiceIsThrown(state, dice);
    }

    case "req-getBattleResult": {
      return getBattleResult(state);
    }

    default: {
      return state;
    }
  }
};

const getStateCheckApperance = (state: State): State => {
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

const getStateOpenCard = (state: State): State => {
  const { enemyList, playerList, numberOfPlayer } = state;
  const currentCoord = playerList[numberOfPlayer].coord;
  /**
   * Need separate method for open EnemyCard
   * Because it dont lying structurally on cell
   */
  const newEnemyList = openEnemyCard(enemyList, currentCoord);

  return {
    ...state,
    enemyList: newEnemyList,
    //для отрисовки статуса!
    doEffect: { type: "!throwBattleDice" },
    dice: 0,
  };
};

const getStateDiceIsThrown = (state: State, dice: number): State => {
  return {
    ...state,
    dice: dice,
    doEffect: { type: "!getBattleResult" },
  };
};
