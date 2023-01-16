import { Health, BoardsCard, WeaponCard, EnemyList } from "../../components";
import {
  CardApperance,
  CellType,
  DeadPlayerListType,
  EnemyListType,
  PlayerListType,
} from "../../business/types";
import { FC, memo, useMemo } from "react";
import { useOpenCardAnimation } from "../../business/effects/useOpenCardAnimation";
import React from "react";

/**
 * Return inventory and other closed cards
 */

const CardView = React.memo(function _CardView({
  type,
  coord,
  apperance,
}: {
  type: string;
  coord: string;
  apperance: CardApperance;
}) {
  //TODO: only for
  return <BoardsCard apperance={apperance} coord={coord} />;
  // return useMemo(() => {
  //   return <BoardsCard apperance={apperance} coord={coord} />;
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [apperance]);
});

export const CardListEl = React.memo(function _CardListEl({
  cell,
  hor,
  vert,
  currCoord,
  enemyList,
  deadPlayerList,
  activePlayerNumber,
  playerList,
}: {
  cell: CellType;
  hor: string;
  vert: string;
  currCoord: string;
  enemyList: EnemyListType;
  deadPlayerList: DeadPlayerListType;
  activePlayerNumber: number;
  playerList: PlayerListType;
}) {
  //Should get coordinate or is nedd to run

  const playerCoord = playerList[activePlayerNumber].coord;
  /*     useOpenCardAnimation({ coord: "" }); */
  //TODO:добавить условие карточка на ячейке
  const needRerender = playerCoord === currCoord && cell.cardItem?.length;
  if (needRerender) {
    console.log(needRerender, playerCoord);
  }

  const MemoCardView = useMemo(() => CardView, [needRerender]);

  const cardItemList = cell.cardItem;
  if (cardItemList) {
    return (
      <>
        {cardItemList.map((cardItem) => {
          return (
            <MemoCardView
              key={`${hor}.${vert}.health`}
              apperance={cardItem.apperance}
              type={cardItem.name}
              coord={currCoord}
            />
          );
        })}
      </>
    );
  } else {
    return null;
  }
});
