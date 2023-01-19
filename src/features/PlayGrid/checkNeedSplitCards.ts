import {
  CellType,
  EnemyListType,
  GameState,
  PlayerListType,
} from "../../business/types";

/**
 * split for passive phase, cards lying on one cell
 */
export const checkNeedSplitCards = (
  playerList: PlayerListType,
  orderIndex: string,
  cell: CellType,
  enemyList: EnemyListType,
  gameState: GameState
) => {
  const playerItemList = Object.entries(playerList);

  //TODO: seem like often used construction
  const playerListOnCell = playerItemList
    .filter((playerItem) => {
      const [, playerCard] = playerItem;
      return playerCard.coord === orderIndex && playerCard.name === "player";
    })
    .map((playerItem) => {
      const [, playerCard] = playerItem;
      return playerCard;
    });

  const hasPlayerOnCell = playerListOnCell.length === 1;

  //? can be more than one card, think yes if player died and left card pille
  const hasCardOnCell = cell.cardItem?.length === 1;

  const enemyOnCell = Object.entries(enemyList).filter(
    ([string, enemyCard]) => enemyCard.coord === orderIndex
  );
  const hasEnemyOnCell = enemyOnCell.length === 1;
  const amountEnemyOnCell = enemyOnCell.length;

  const phaseInteractWithEnemy = gameState.type.includes("interactWithEnemy");
  const hasTwoEnemy = amountEnemyOnCell === 2;

  const hasPlayerAndEnemy =
    hasEnemyOnCell && hasPlayerOnCell && !phaseInteractWithEnemy;
  const hasEnemyAndCard = hasEnemyOnCell && hasCardOnCell;

  const hasEnemyAndPlayerAndCard =
    hasEnemyOnCell &&
    hasPlayerOnCell &&
    hasCardOnCell &&
    phaseInteractWithEnemy;

  switch (true) {
    case hasEnemyAndPlayerAndCard: {
      return false;
    }

    case hasTwoEnemy:
    case hasPlayerAndEnemy:
    case hasEnemyAndCard: {
      return true;
    }
    default: {
      return false;
    }
  }
};
