import { State, EnemiesListType, PlayersListType } from "../../../types";

export const getBattleResult = (state: State): State => {
  const { dice } = state;

  switch (dice) {
    case 1:
    case 2: {
      return getStatePlayerRunsAway(state);
    }

    case 3: {
      return getStatePlayetLoseHealth(state);
    }

    case 4: {
      return getStatePLayerWon(state);
    }
    default:
      return state;
  }
};


const getStatePlayerRunsAway = (state: State): State => {
  // Полностью передать управление в clickArrow?!
  // dice=1 - убегает на 1
  return {
    ...state,
    dice: 1,
    gameState: {
      ...state,
      type: "gameStarted.clickArrow",
    },
  };
};

const getStatePlayetLoseHealth = (state: State): State => {
  const { playersList, numberOfPlayer } = state;
  const newPlayerHealth = playersList[numberOfPlayer].health - 1;
  const isPlayerAlive = newPlayerHealth > 0 ? true : false;

  const newplayersList = {
    ...playersList,
    [numberOfPlayer]: {
      ...playersList[numberOfPlayer],
      health: playersList[numberOfPlayer].health - 1,
    },
  };

  // TODO: заменить на switchToNextPlayer
  // TODO :  режим боя должен вестись до победы\побега\проигрыша
  if (isPlayerAlive) {
    const newState: State = {
      ...state,
      dice: 0,
      gameState: {
        type: "gameStarted.getOrder",
      },
      doEffect: {
        type: "!getNextPlayer",
      },
      playersList: newplayersList,
    };

    return newState;
  } else {
    console.log(`игрок №${numberOfPlayer} погиб`);
    //TODO :общая часть state?
    return {
      ...state,
      gameState: { type: "endGame" },
      gameResult: "Вы проиграли",
      doEffect: null,
    };
  }
};

const getStatePLayerWon = (state: State): State => {
  const { enemiesList, numberOfPlayer, playersList } = state;
  const currentCoord = playersList[numberOfPlayer].coord;
  const newEnemiesList = { ...enemiesList };
  delete newEnemiesList[currentCoord];

  // TODO: заменить на switchToNextPlayer
  return {
    ...state,
    enemiesList: newEnemiesList,
    dice: 0,
    gameState: {
      type: "gameStarted.getOrder",
    },
    doEffect: {
      type: "!getNextPlayer",
    },
  };
};
