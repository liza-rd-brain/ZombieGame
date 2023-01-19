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

const ANIMATION_TIME = 3;

type CardsListType = "all" | "enemy" | "inventory";

/**
 * Return inventory and other closed cards
 */
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
  return <BoardsCard apperance={apperance} refList={refList} />;
});

/**
 * Represent some card on one Cell
 */
export const CardListEl = React.memo(function _CardListEl({
  type,
  cell,
  currCoord,
  enemyList,
  deadPlayerList,
  activePlayerNumber,
  playerList,
}: {
  cell: CellType;
  type?: CardsListType;
  currCoord: string;
  enemyList: EnemyListType;
  deadPlayerList: DeadPlayerListType;
  activePlayerNumber: number;
  playerList: PlayerListType;
}) {
  const dispatch = useDispatch();
  const [hor, vert] = currCoord.split(".");

  const getNextPhase = () => {
    dispatch({ type: "req-openCard" });
  };

  const playerCoord = playerList[activePlayerNumber].coord;

  const isCardClosed =
    cell.cardItem?.length === 1 && cell.cardItem[0].apperance === "closed";

  //TODO: по идее в doEffect можно закидывать номер ячейки, на которой открытие карточки

  const needRerenderCard = Boolean(playerCoord === currCoord && isCardClosed);

  const { cardRef } = useOpenCardAnimation({
    needRun: needRerenderCard,
    maxTime: ANIMATION_TIME,
    onTimerEnd: getNextPhase,
  });

  const MemoCardView = useMemo(() => CardView, [needRerenderCard]);

  const cardItemList = cell.cardItem;

  const enemyListOnCell = Object.entries(enemyList).filter(
    ([string, enemyCard]) =>
      enemyCard.coord === currCoord && enemyCard.apperance === "open"
  );

  const hasEnemy = enemyListOnCell.length > 0;

  //перенести это условие в CardView
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
  } else if (hasEnemy) {
    return null;
  } else {
    return null;
  }
});
