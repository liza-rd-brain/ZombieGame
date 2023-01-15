import { Health, BoardsCard, WeaponCard, EnemyList } from "../../components";
import {
  CellType,
  DeadPlayerListType,
  EnemyListType,
  PlayerListType,
} from "../../business/types";
import { FC, useMemo } from "react";

/**
 * Return inventory and other closed cards
 */
export const CardListEl: FC<{
  cell: CellType;
  hor: string;
  vert: string;
  currCoord: string;
  enemyList: EnemyListType;
  deadPlayerList: DeadPlayerListType;
  activePlayerNumber: number;
  playerList: PlayerListType;
}> = ({
  cell,
  hor,
  vert,
  currCoord,
  enemyList,
  deadPlayerList,
  activePlayerNumber,
  playerList,
}) => {
  const healthCardItem = cell.cardItem.find(
    (cardItem) => cardItem?.name === "health"
  );

  const boardsCardItem = cell.cardItem.find(
    (cardItem) => cardItem?.name === "boards"
  );

  const weaponCardItem = cell.cardItem.find(
    (cardItem) => cardItem?.name === "weapon"
  );

  const closedEnemyItem = Object.entries(enemyList).filter(
    ([string, enemyCard]) =>
      enemyCard.coord === currCoord && enemyCard.apperance === "closed"
  );

  const hasClosedEnemy = closedEnemyItem.length > 0;

  const currPlayerCoord = playerList[activePlayerNumber].coord;

  //To avoid unnecessary render
  const memoizedCardList = useMemo(() => {
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
            coord={`${hor}.${vert}`}
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
            coord={currCoord}
          />
        ) : null}
      </>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currPlayerCoord]);

  return memoizedCardList;
};
