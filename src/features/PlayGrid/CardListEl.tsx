import { Health, BoardsCard, WeaponCard, EnemyList } from "../../components";
import {
  CardApperance,
  CellType,
  DeadPlayerListType,
  EnemyListType,
  PlayerListType,
  TypeOfCard,
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
  type,
}: {
  type: TypeOfCard;
  coord: string;
  apperance: CardApperance;
  refList: {
    cardContainerRef: React.RefObject<HTMLDivElement>;
    cardFrontRef: React.RefObject<HTMLDivElement>;
  };
}) {
  switch (type) {
    case "boards": {
      return <BoardsCard apperance={apperance} refList={refList} />;
    }
    case "weapon": {
      return <WeaponCard apperance={apperance} refList={refList} />;
    }
    default: {
      return null;
    }
  }
});

/**
 * Represent some card on one Cell: inventory and enemy
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
  type: CardsListType;
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

  const inventoryElem = cardItemList ? (
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
  ) : null;

  // const enemyElem=
  // if (cardItemList) {
  //   return (
  //     <>
  //       {cardItemList.map((cardItem) => {
  //         return (
  //           <MemoCardView
  //             refList={cardRef}
  //             key={`${hor}.${vert}.health`}
  //             apperance={cardItem.apperance}
  //             type={cardItem.name}
  //             coord={currCoord}
  //           />
  //         );
  //       })}
  //     </>
  //   );
  // } else if (hasEnemy) {
  //   return null;
  // } else {
  //   return null;
  // }
  return inventoryElem;
});
