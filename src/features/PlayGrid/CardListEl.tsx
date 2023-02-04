import React, { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

import { useOpenCardAnimation } from "../../business/effects/useOpenCardAnimation";

import { Health, BoardsCard, WeaponCard, EnemyList } from "../../components";
import {
  CardApperance,
  CellType,
  DeadPlayerListType,
  EnemyListType,
  PlayerListType,
  State,
  TypeOfCard,
  TypeOfInventoryCard,
} from "../../business/types";
import { EnemyCardNew } from "../../components/Enemy/EnemyCardNew";

const ANIMATION_TIME = 3;

type CardsListType = "all" | "enemy" | "inventory";

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

    // case "enemy": {
    //   return <EnemyCardNew apperance={apperance} refList={refList} />;
    // }

    // }
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
  // playerList,
  refList,
}: {
  cell: CellType;
  type: CardsListType;
  currCoord: string;
  enemyList: EnemyListType;
  deadPlayerList: DeadPlayerListType;

  // playerList: PlayerListType;
  refList: {
    cardContainerRef: React.RefObject<HTMLDivElement>;
    cardFrontRef: React.RefObject<HTMLDivElement>;
  };
}) {
  const [hor, vert] = currCoord.split(".");

  const activePlayerNumber = useSelector(
    (state: State) => state.activePlayerNumber
  );

  const playerList = useSelector((state: State) => state.playerList);

  const playerCoord = playerList[activePlayerNumber]?.coord;

  //TODO: почему только открытые карточки???
  const enemyListOnCell = Object.entries(enemyList).filter(
    ([string, enemyCard]) =>
      enemyCard.coord === currCoord /* && enemyCard.apperance === "open" */
  );

  const isInventoryCardClosed =
    cell.cardItem?.length === 1 && cell.cardItem[0].apperance === "closed";

  const isEnemyCardClosed =
    enemyListOnCell.length && enemyListOnCell[0][1].apperance === "closed";
  //TODO: по идее в doEffect можно закидывать номер ячейки, на которой открытие карточки

  const isItemClosed = isInventoryCardClosed || isEnemyCardClosed;
  const needRerenderCard = Boolean(playerCoord === currCoord && isItemClosed);

  const MemoCard = useMemo(
    () => Card,
    [
      /* needRerenderCard */
    ]
  );

  const cardItemList = cell.cardItem;

  const hasEnemy = enemyListOnCell.length > 0;

  //перенести это условие в Card

  const inventoryElem = cardItemList ? (
    <>
      {cardItemList.map((cardItem) => {
        if (type === "enemy") {
          console.log(true);
        }
        return type === "all" || type === "inventory" ? (
          <MemoCard
            refList={refList}
            key={`${hor}.${vert}.health`}
            apperance={cardItem.apperance}
            type={cardItem.name}
            coord={currCoord}
          />
        ) : null;
      })}
    </>
  ) : null;

  // console.log("enemyList", enemyList);
  // console.log("enemyListOnCell", enemyListOnCell);

  const needSplitCards = enemyListOnCell.length > 1;

  const firstItemIsClosed =
    enemyListOnCell.length && enemyListOnCell[0][1].apperance === "closed";

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
    console.log("we are here", type, currCoord);
    /**
     * если карточка закрытая - можем просто вернуть view
     * если нет, то взаимодействие с карточкой становится сложным:
     * 1) либо бой
     * 2) либо это активная карточка,
     * с другой стороны не перерисовывать же весь компонент или все равно перерисовыывать?
     * т.к. будет другая картинка и прочее
     *
     */

    // const isCurrentEnemyCard = Boolean(
    //   deadPlayerList &&
    //     Number(deadPlayerList[activePlayerNumber].index) === Number(index)
    // );

    return (
      <EnemyCardNew
        enemyCard={enemyCard}
        key={index}
        isCurrent={false}
        // isCurrent={isActivePlayerDead ? isCurrentEnemyCard : false}
        needSplitCards={needSplitCards}
        needReverseCards={needReverseCards}
        apperance={enemyCard.apperance}
        refList={refList}
        // onClick={() => {
        //   dispatch({
        //     type: "clickedEnemy",
        //     payload: { enemyCard: enemyCard },
        //   });
        // }}
      />
    );

    // return (
    //   <MemoCard
    //     refList={cardRef}
    //     key={`${hor}.${vert}.health`}
    //     apperance={enemyCard.apperance}
    //     type={"enemy"}
    //     coord={currCoord}
    //   />
    // );
  });

  // const enemyElem=
  // if (cardItemList) {
  //   return (
  //     <>
  //       {cardItemList.map((cardItem) => {
  //         return (
  //           <MemoCard
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
  return (
    <>
      {inventoryElem}
      {type === "inventory" ? null : enemyElem}
    </>
  );
});
