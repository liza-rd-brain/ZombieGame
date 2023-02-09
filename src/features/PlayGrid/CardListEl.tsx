import React, { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

import { useOpenCardAnimation } from "../../business/effects/useOpenCardAnimation";

import { HealthCard, BoardsCard, WeaponCard } from "../../components";
import {
  CardAppearance,
  CellType,
  DeadPlayerListType,
  EnemyListType,
  State,
  TypeOfCard,
} from "../../business/types";
import { EnemyCard } from "../../components/Enemy/EnemyCard";
import styled from "styled-components";

//TODO: при 1 секунде- промаргивание
const ANIMATION_TIME = 3;

type CardsListType = "all" | "enemy" | "inventory";

const CardList = styled.div`
  position: absolute;
`;

/**
 * Return inventory and other closed cards
 */
const Card = React.memo(function _CardView({
  apperance,
  refList,
  type,
}: {
  type: TypeOfCard;
  coord: string;
  apperance: CardAppearance;
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
    case "health": {
      return <HealthCard apperance={apperance} refList={refList} />;
    }

    default: {
      return null;
    }
  }
});

/**
 * Represent some card on one Cell: inventory and enemy, for now all except player
 */
export const CardListEl = React.memo(function _CardListEl({
  type,
  cell,
  currCoord,
  enemyList,
  deadPlayerList,
}: /*   refList, */
{
  cell: CellType;
  type: CardsListType;
  currCoord: string;
  enemyList: EnemyListType;
  deadPlayerList: DeadPlayerListType;
  /* 
  refList: {
    cardContainerRef: React.RefObject<HTMLDivElement>;
    cardFrontRef: React.RefObject<HTMLDivElement>;
  }; */
}) {
  const dispatch = useDispatch();
  const [hor, vert] = currCoord.split(".");

  const activePlayerNumber = useSelector(
    (state: State) => state.activePlayerNumber
  );

  const playerList = useSelector((state: State) => {
    const hasPlayerOnCell =
      state.playerList[state.activePlayerNumber]?.coord === currCoord;
    return hasPlayerOnCell ? state.playerList : null;
  });

  const isCurrentEnemyCard = useSelector((state: State) => {
    const enemyOrderNumber = state.deadPlayerList
      ? state.deadPlayerList[state.activePlayerNumber]?.index
      : undefined;

    const isCurrEnemyCard = enemyOrderNumber
      ? state.enemyList[enemyOrderNumber].coord === currCoord
      : undefined;

    return Boolean(isCurrEnemyCard);
  });

  const playerCoord = playerList && playerList[activePlayerNumber]?.coord;

  //TODO: почему только открытые карточки???
  const enemyListOnCell = Object.entries(enemyList).filter(
    ([string, enemyCard]) => {
      return enemyCard.coord === currCoord;
    }

    /* && enemyCard.apperance === "open" */
  );

  const enemyCardsOnCell = enemyListOnCell.map(([string, enemyCard]) => {
    return enemyCard;
  });

  const isInventoryCardClosed =
    cell.cardItem?.length === 1 && cell.cardItem[0].appearance === "closed";

  const isEnemyCardClosed =
    enemyListOnCell.length && enemyListOnCell[0][1].appearance === "closed";

  //TODO: по идее в doEffect можно закидывать номер ячейки, на которой открытие карточки
  const needRenderOpenCard = useSelector((state: State) => {
    const playerCoord = state.playerList[state.activePlayerNumber]?.coord;
    if (playerCoord === currCoord) {
      const hasEnemyCard =
        playerCoord &&
        Object.values(state.enemyList).find(
          (enemyItem) => enemyItem.coord === playerCoord
        );

      const hasInventoryCards = state.gameField.values[playerCoord];

      const needRenderOpenCard = Boolean(hasEnemyCard || hasInventoryCards);
      return needRenderOpenCard;
    } else {
      return false;
    }
  });

  const getNextPhase = () => {
    //for inventory and for other card ???
    console.log("taking Card");
    dispatch({ type: "req-openCard" });
  };

  const { cardRef } = useOpenCardAnimation({
    needRun: needRenderOpenCard,
    maxTime: ANIMATION_TIME,
    onTimerEnd: getNextPhase,
  });

  const MemoCard = useMemo(() => Card, []);

  const cardItemList = cell.cardItem;

  /**
   * Пока рассматривается возможность нахождения только одной карточки инвентаря на ячейке
   */
  const inventoryElem = cardItemList ? (
    <>
      {cardItemList.map((cardItem) => {
        return type === "all" || type === "inventory" ? (
          <MemoCard
            refList={cardRef}
            key={`${hor}.${vert}.health`}
            apperance={cardItem.appearance}
            type={cardItem.name}
            coord={currCoord}
          />
        ) : null;
      })}
    </>
  ) : null;

  const needSplitCards = enemyCardsOnCell.length > 1;

  if (enemyCardsOnCell.length) {
    // console.log("enemyListOnCell", enemyListOnCell);
    // console.log("enemyCardsOnCell", currCoord, enemyCardsOnCell);
  }

  const firstItemIsClosed =
    enemyListOnCell.length && enemyListOnCell[0][1].appearance === "closed";

  const isActiveEnemyCard =
    deadPlayerList && deadPlayerList?.[activePlayerNumber]?.index ? true : null;

  //find out index of active dead player
  const indexOfActiveCard = enemyListOnCell.findIndex(([index, enemyCard]) => {
    if (deadPlayerList && deadPlayerList[activePlayerNumber]) {
      return Number(index) === Number(deadPlayerList[activePlayerNumber].index);
    } else {
      return -1;
    }
  });

  const needReverseCards = Boolean(
    (indexOfActiveCard !== 0 && needSplitCards && isActiveEnemyCard) ||
      (firstItemIsClosed && needSplitCards)
  );

  const isActivePlayerDead =
    deadPlayerList && deadPlayerList[activePlayerNumber] ? true : false;

  const enemyElem = enemyListOnCell.map(([index, enemyCard]) => {
    return (
      <EnemyCard
        enemyCard={enemyCard}
        key={index}
        order={index}
        isCurrent={isActivePlayerDead ? isCurrentEnemyCard : false}
        needSplitCards={needSplitCards}
        needReverseCards={needReverseCards}
        apperance={enemyCard.appearance}
        refList={cardRef}
        // onClick={() => {
        //   dispatch({
        //     type: "clickedEnemy",
        //     payload: { enemyCard: enemyCard },
        //   });
        // }}
      />
    );
  });

  // const enemyList = <EnemyList></EnemyList>;

  return (
    <CardList>
      {inventoryElem}
      {type === "inventory" ? null : enemyElem}
    </CardList>
  );
});
