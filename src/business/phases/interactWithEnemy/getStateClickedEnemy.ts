import { State, EnemyCardType } from "../../types";
import { deleteSelectedCard } from "../common/deleteSelectedCard";

export const getStateClickedEnemy = (state: State): State => {
  const { activePlayerNumber, playerList, enemyList } = state;
  const currEnemyCoord = playerList[activePlayerNumber].coord;
  const playerCanFight =
    playerList[activePlayerNumber].coord === currEnemyCoord;
  const currEnemy = enemyList[currEnemyCoord];
  const defeatedEnemy: EnemyCardType = { ...currEnemy, apperance: "defeated" };
  const newEnemyList = {
    ...state.enemyList,
    [currEnemyCoord]: defeatedEnemy,
  };

  const newInventory = deleteSelectedCard(playerList, activePlayerNumber);

  const newPlayerList = {
    ...playerList,
    [activePlayerNumber]: {
      ...playerList[activePlayerNumber],
      inventory: newInventory,
    },
  };

  switch (playerCanFight) {
    case true: {
      return {
        ...state,
        enemyList: newEnemyList,
        playerList: newPlayerList,
        doEffect: { type: "!removeEnemyCard" },
      };
    }
    case false: {
      return state;
    }
  }
};
