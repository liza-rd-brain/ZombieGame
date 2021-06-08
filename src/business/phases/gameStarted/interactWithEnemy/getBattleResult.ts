import { State } from "../../../types";

export const getBattleResult = (state: State): State => {
  const { dice } = state;

  switch (dice) {
    case 1:
    case 2: {
      return getStatePlayerCanFight(state);
    }

    case 3: {
      return getStatePlayetLoseHealth(state);
    }

    case 4: {
      return getStatePlayerRunsAway(state);
    }
    default:
      return state;
  }
};

const getStatePlayerCanFight = (state: State): State => {
  //Player can use weapon or rethrow dice
  return {
    ...state,
    dice: 0,
    gameState: { type: "gameStarted.interactWithEnemy" },
    doEffect: { type: "!makeBattleAction" },
  };
};

const getStatePlayerRunsAway = (state: State): State => {
  // Полностью передать управление в playerMove?!
  // dice=1 - убегает на 1
  return {
    ...state,
    dice: 1,
    gameState: {
      type: "gameStarted.playerMove",
    },
    doEffect: { type: "!checkAvailableNeighboringCell" },
  };
};

const getStatePlayetLoseHealth = (state: State): State => {
  const { playerList, numberOfPlayer } = state;
  const newPlayerHealth = playerList[numberOfPlayer].health - 1;
  const isPlayerAlive = newPlayerHealth > 0 ? true : false;

  const newPlayerList = {
    ...playerList,
    [numberOfPlayer]: {
      ...playerList[numberOfPlayer],
      health: playerList[numberOfPlayer].health - 1,
    },
  };

  // TODO :  режим боя должен вестись до победы\побега\проигрыша
  if (isPlayerAlive) {
    const newState: State = {
      ...state,
      dice: 0,
      gameState: {
        type: "gameStarted.getPlayersOrder",
      },
      doEffect: {
        type: "!getNextPlayer",
      },
      playerList: newPlayerList,
    };

    return newState;
  } else {
    console.log(`игрок №${numberOfPlayer} погиб`);

    return {
      ...state,
      gameState: { type: "endGame" },
      gameResult: "Вы проиграли",
      doEffect: null,
    };
  }
};

const getStatePLayerWon = (state: State): State => {
  const { enemyList, numberOfPlayer, playerList } = state;
  const currentCoord = playerList[numberOfPlayer].coord;
  const newEnemyList = { ...enemyList };
  delete newEnemyList[currentCoord];

  return {
    ...state,
    enemyList: newEnemyList,
    dice: 0,
    gameState: {
      type: "gameStarted.getPlayersOrder",
    },
    doEffect: {
      type: "!getNextPlayer",
    },
  };
};
