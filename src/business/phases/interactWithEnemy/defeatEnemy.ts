import { State, EnemyCardType } from "../../types";
import { deleteSelectedCard } from "../common/deleteSelectedCard";

export const defeatEnemy = (state: State): State => {
  const { numberOfPlayer, playerList, enemyList } = state;
  const currEnemyCoord = playerList[numberOfPlayer].coord;
  const currEnemy = enemyList[currEnemyCoord];
  const defeatedEnemy: EnemyCardType = { ...currEnemy, apperance: "defeated" };
  const newEnemyList = {
    ...state.enemyList,
    [currEnemyCoord]: defeatedEnemy,
  };

  const newInventory = deleteSelectedCard(playerList, numberOfPlayer);

  const newPlayerList = {
    ...playerList,
    [numberOfPlayer]: {
      ...playerList[numberOfPlayer],
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
