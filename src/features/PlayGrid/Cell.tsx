import React, { useMemo } from "react";
import ReactDOM from "react-dom";
import { useSelector } from "react-redux";
import styled from "styled-components";

import { PlayGridMode, State } from "../../business/types";
import { CellItem } from "../../components/CellItem";

import { Barrier } from "./Barrier";
import { CardListEl } from "./CardListEl";
import { PlayerList } from "./PlayerList";

type CellApperance = {
  needHighlightning?: boolean;
  mode: PlayGridMode;
};

type PlanType = "back" | "front";
type CardsListType = "all" | "enemy" | "inventory";

type UnderlayerType = {
  coordX: string;
  coordY: string;
};

const Wrap = styled.div`
  position: relative;
`;

// const CellItem = styled.div<CellApperance>`
//   display: flex;
//   position: relative;
//   box-sizing: border-box;

//   font-size: 14px;
//   text-align: right;
//   width: 50px;
//   height: 50px;
//   color: lightgrey;

//   border: ${(props) => {
//     if (props.mode === "cssStyle") {
//       return "1px solid lightgray";
//     }
//   }};

//   background-color: ${(props) => {
//     if (props.needHighlightning) {
//       return "rgb(55 163 0 / 52%);";
//     }
//   }};
// `;

const UnderlayerItem = styled.div<UnderlayerType>`
  position: relative;
  display: flex;
  width: 134px;
  height: 100px;
  background-color: rgb(47 84 96 / 77%);
  left: -30px;
  bottom: 120px;
  flex-direction: row;
  justify-content: center;
  border-radius: 10px;
  box-shadow: 0px 0px 12px 1px rgb(62 76 81 / 98%);

  left: ${(props) => {
    return `${Number(props.coordX) * 50 - 30}px`;
  }};

  bottom: ${(props) => {
    return `${Number(props.coordY) * 50 + 70}px`;
  }};

  & > * {
    position: relative !important;
    margin: 30px 0;
    width: 50px;
    height: 50px;
    z-index: 3;
  }

  flex-direction: row;
  align-items: center;
  z-index: 6;
`;

//принимает только буквально координату
//через селекторы сама решает что рисовать

/**
 * 1. player   +
 * 6.walls===barrier (сейчас просто картинка)
 * 2.enemy
 * 3.inventory
 * 4.split
 * 5.separate window
 */

/**
 * 1. Есть ли активная карточка на ячейка- нет=> только background
 * 2. Достаем все карточки на ячейке
 */
export const Cell: React.FC<{
  coord: string;
  mode: PlayGridMode;
}> = React.memo(function _Cell({ coord, mode /* , cardRef */ }) {
  const cellValues = useSelector(
    (state: State) => state.gameField.values[coord]
  );

  const hasActivePlayerOnCell: boolean = useSelector(
    (state: State) =>
      state.playerList[state.activePlayerNumber]?.coord === coord
  );

  const hasActiveDeadPlayerOnCell: boolean = useSelector(
    (state: State) => {
      const hasEnemyCard = Object.values(state.enemyList).find(
        (enemyItem) => enemyItem.coord === coord
      );
      return Boolean(hasEnemyCard);
    }
    // state.deadPlayerList &&
    // state.deadPlayerList[state.activePlayerNumber]?.coord === coord
  );

  /**
   * considering hasActivePlayerOnCell
   */
  const isPhaseEnemyInteract = useSelector(
    (state: State) =>
      hasActivePlayerOnCell &&
      state.gameState.type.includes("interactWithEnemy")
  );

  const needHighlightning = useSelector((state: State) =>
    state.gameState.coordOfAvailableCells
      ? state.gameState.coordOfAvailableCells.includes(coord)
      : false
  );

  const isPlayerMoveArea = useSelector((state: State) => {
    const playerMovePhase = state.gameState.type === "gameStarted.playerMove";

    return playerMovePhase && needHighlightning;
  });

  /**
   * considering hasActivePlayerOnCell
   */
  const isPhaseTakeCard = useSelector(
    (state: State) =>
      hasActivePlayerOnCell && state.gameState.type === "gameStarted.takeCard"
  );

  const isNeedCreateSeparateWindow =
    isPhaseEnemyInteract || isPhaseTakeCard; /* || isPhasePlayerMove */

  const enemyList = useSelector((state: State) => state.enemyList);
  const deadPlayerList = useSelector((state: State) => state.deadPlayerList);

  const [hor, vert] = coord.split(".");

  const draftCellNumbers = mode === "cssStyle" ? `${hor}.${vert}` : null;

  const memoizedBarrier = useMemo(() => {
    return <Barrier orderIndex={coord} mode={mode}></Barrier>;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fieildElem = document.getElementById("field");

  const getCardList = ({
    type,
    planType,
  }: {
    type: CardsListType | null;
    planType: PlanType;
  }) => {
    return (
      <>
        {/**
         * если задни план и фаза - игрока не рисуем
         * иначе на заднем\переднем рисуем
         */}
        {planType === "back" && isNeedCreateSeparateWindow ? null : (
          <PlayerList coord={coord} />
        )}
        {/*  {memoizedPlayerCard} */}
        <CardListEl
          /*     refList={cardRef} */
          cell={cellValues}
          type={type as CardsListType}
          currCoord={coord}
          enemyList={enemyList}
          deadPlayerList={deadPlayerList}
        />
      </>
    );
  };

  const getCardListType = ({
    type,
  }: {
    type: PlanType;
  }): CardsListType | null => {
    switch (type) {
      /**
       * если передний план
       * вз-е с врагом - на первом плане враг
       * вз-е с карточкой -карточка
       * иначе ничего
       *
       * если задний- все наоборот
       */
      case "front": {
        if (hasActivePlayerOnCell) {
          switch (true) {
            case isPhaseEnemyInteract: {
              return "enemy";
            }
            case isPhaseTakeCard: {
              return "inventory";
            }
            default: {
              return null;
            }
          }
        } else {
          return null;
        }
      }
      case "back": {
        if (hasActivePlayerOnCell) {
          switch (true) {
            case isPhaseEnemyInteract: {
              return "inventory";
            }
            case isPhaseTakeCard: {
              return "enemy";
            }
            default: {
              return "all";
            }
          }
        } else {
          return "all";
        }
      }
    }
  };

  const getCardsOnCell = ({ type }: { type: PlanType }) => {
    const cardListType = getCardListType({ type });

    const cardListWithPlayer = getCardList({
      type: cardListType,
      planType: type,
    });

    return cardListWithPlayer;
  };

  const foregroundPortal = fieildElem
    ? ReactDOM.createPortal(
        <>
          <UnderlayerItem coordX={hor} coordY={vert}>
            {getCardsOnCell({ type: "front" })}
          </UnderlayerItem>
        </>,
        fieildElem
      )
    : null;

  const backgroundCardWrap = (
    <Wrap key={`${hor}.${vert}`}>
      <CellItem
        needHighlightning={needHighlightning}
        mode={mode}
        hor={hor}
        vert={vert}
      >
        {draftCellNumbers}
        {getCardsOnCell({ type: "back" })}
      </CellItem>
      {memoizedBarrier}
    </Wrap>
  );

  const cellItem: JSX.Element = useMemo(() => {
    return (
      <React.Fragment key={`${hor}.${vert}`}>
        {backgroundCardWrap}
        {isNeedCreateSeparateWindow ? foregroundPortal : null}
      </React.Fragment>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    hasActivePlayerOnCell,
    isPhaseEnemyInteract,
    isPhaseTakeCard,
    needHighlightning,
    hasActiveDeadPlayerOnCell,
    isPlayerMoveArea,
  ]);

  return cellItem;
});
