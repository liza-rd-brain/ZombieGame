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
  enemyList: EnemyListType,
  deadPlayerList: DeadPlayerListType,
  activePlayerNumber: number
) => {
  const healthCardItem = cell.cardItem.find(
    (cardItem) => cardItem?.name === "health"
  );

  const boardsCardItem = cell.cardItem.find(
    (cardItem) => cardItem?.name === "boards"
  );

  const WeaponCardItem = cell.cardItem.find(
    (cardItem) => cardItem?.name === "weapon"
  );

  const closedEnemyItem = Object.entries(enemyList).filter(
    ([string, enemyCard]) =>
      enemyCard.coord === index && enemyCard.appearance === "closed"
  );

  const hasClosedEnemy = closedEnemyItem.length > 0;

  return (
    <>
      {healthCardItem ? (
        <Health
          appearance={healthCardItem.appearance}
          className={""}
          key={`${hor}.${vert}.health`}
        />
      ) : null}
      {boardsCardItem ? (
        <BoardsCard
          appearance={boardsCardItem.appearance}
          key={`${hor}.${vert}.boards`}
        />
      ) : null}
      {WeaponCardItem ? (
        <WeaponCard
          appearance={WeaponCardItem.appearance}
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
