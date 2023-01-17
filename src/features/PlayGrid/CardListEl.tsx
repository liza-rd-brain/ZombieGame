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
import { useDispatch } from "react-redux";

/**
 * Return inventory and other closed cards
 */

const ANIMATION_TIME = 3;

const CardView = React.memo(function _CardView({
  apperance,
  refList,
}: {
  type: string;
  coord: string;
  apperance: CardApperance;
  refList: {
    cardContainerRef: React.RefObject<HTMLDivElement>;
    cardFrontRef: React.RefObject<HTMLDivElement>;
  };
}) {
  //TODO: only for
  return <BoardsCard apperance={apperance} refList={refList} />;
  // return useMemo(() => {
  //   return <BoardsCard apperance={apperance} coord={coord} />;
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [apperance]);
});

/**
 * Represent some card on one Cell
 */
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

  const dispatch = useDispatch();

  const getNextPhase = () => {
    console.log("конец анимации");
    dispatch({ type: "req-openCard" });
  };

  const playerCoord = playerList[activePlayerNumber].coord;

  const isCardClosed =
    cell.cardItem?.length === 1 && cell.cardItem[0].apperance === "closed";

  //TODO: по идее в doEffect можно закидывать номер ячейки, на которой открытие карточки

  //TODO:добавить условие карточка на ячейке
  const needRerender = Boolean(playerCoord === currCoord && isCardClosed);

  const { cardRef } = useOpenCardAnimation({
    needRun: needRerender,
    maxTime: ANIMATION_TIME,
    onTimerEnd: getNextPhase,
  });

  const MemoCardView = useMemo(() => CardView, [needRerender]);

  const cardItemList = cell.cardItem;
  if (cardItemList) {
    return (
      <>
        {cardItemList.map((cardItem) => {
          return (
            <MemoCardView
              refList={cardRef}
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
