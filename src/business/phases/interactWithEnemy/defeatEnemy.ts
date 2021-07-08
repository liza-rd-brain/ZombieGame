import { State, EnemyCardType } from "../../types";
import { deleteSelectedCard } from "../common/deleteSelectedCard";

export const defeatEnemy = (state: State): State => {
  const { activePlayerNumber, playerList, enemyList } = state;
  const currEnemyCoord = playerList[activePlayerNumber].coord;
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

  return {
    ...state,
    enemyList: newEnemyList,
    playerList: newPlayerList,
    doEffect: { type: "!removeEnemyCard" },
  };
};
