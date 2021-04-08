import { State } from "../../../types";

import { ActionType } from "../../../reducer";
import { openEnemyCard } from "./openEnemyCard";
import { getBattleResult } from "./getBattleResult";

export const interactEnemyCard = (action: ActionType, state: State): State => {
  switch (action.type) {
    case "checkApperanCeEnemyCard": {
      return getStateCheckApperance(state);
    }

    case "openedEnemyCard": {
      return getStateOpenCard(state);
    }

    case "diceIsThrown": {
      const dice = action.payload;
      return getStateDIceIsThrown(state);
    }

    case "getBattleResult": {
      return getBattleResult(state);
    }

    default: {
      return state;
    }
  }
};

const getStateCheckApperance = (state: State): State => {
  const { enemiesList, playersList, numberOfPlayer } = state;
  const currentCoord = playersList[numberOfPlayer].coord;

  const isNeedOpenEnemyCard =
    enemiesList[currentCoord].apperance === "open" ? false : true;

  switch (true) {
    case isNeedOpenEnemyCard: {
      return {
        ...state,
        doEffect: { type: "!needOpenEnemyCard" },
      };
    }

    case !isNeedOpenEnemyCard: {
      return {
        ...state,
        doEffect: { type: "!needThrowBattleDice" },
        dice: 0,
      };
    }

    default: {
      return state;
    }
  }
};

const getStateOpenCard = (state: State): State => {
  const { enemiesList, playersList, numberOfPlayer } = state;
  const currentCoord = playersList[numberOfPlayer].coord;
  const newEnemiesList = openEnemyCard(enemiesList, currentCoord);

  return {
    ...state,
    enemiesList: newEnemiesList,
    //для отрисовки статуса!
    doEffect: { type: "!needThrowBattleDice" },
    dice: 0,
  };
};

const getStateDIceIsThrown = (state: State): State => {
  const { dice } = state;
  return {
    ...state,
    dice: dice,
    doEffect: { type: "!needGetBattleResult" },
  };
};
