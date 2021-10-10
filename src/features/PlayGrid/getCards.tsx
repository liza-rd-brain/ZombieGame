import { Health, BoardsCard, WeaponCard, EnemyList } from "../../components";
import {
  CellType,
  DeadPlayerListType,
  EnemyListType,
} from "../../business/types";

/**
 * Return inventory and other closed cards
 */
export const getCards = (
  cell: CellType,
  hor: string,
  vert: string,
  index: string,
  enemiesList: EnemyListType,
  deadPlayerList: DeadPlayerListType,
  activePlayerNumber: number
) => {
  const healthCardItem = cell.cardItem.find(
    (cardItem) => cardItem?.name === "health"
  );

  const boardsCardItem = cell.cardItem.find(
    (cardItem) => cardItem?.name === "boards"
  );

  const weaponCardItem = cell.cardItem.find(
    (cardItem) => cardItem?.name === "weapon"
  );

  const closedEnemyItem = Object.entries(enemiesList).filter(
    ([string, enemyCard]) =>
      enemyCard.coord === index && enemyCard.apperance === "closed"
  );

  const hasClosedEnemy = closedEnemyItem.length > 0;

  return (
    <>
      {healthCardItem ? (
        <Health
          apperance={healthCardItem.apperance}
          className={""}
          key={`${hor}.${vert}.health`}
        />
      ) : null}
      {boardsCardItem ? (
        <BoardsCard
          apperance={boardsCardItem.apperance}
          key={`${hor}.${vert}.boards`}
        />
      ) : null}
      {weaponCardItem ? (
        <WeaponCard
          apperance={weaponCardItem.apperance}
          key={`${hor}.${vert}.weapon`}
        />
      ) : null}
      {hasClosedEnemy ? (
        <EnemyList
          list={closedEnemyItem}
          activePlayerNumber={activePlayerNumber}
          deadPlayerList={deadPlayerList}
          coord={index}
        />
      ) : null}
    </>
  );
};
