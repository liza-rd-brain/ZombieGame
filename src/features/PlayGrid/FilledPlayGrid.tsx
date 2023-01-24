import React, { useMemo } from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";

import { State, PlayGridMode } from "../../business/types";

import { CardListEl } from "./CardListEl";
import { getPlayerList } from "./getPlayerList";
import { Barrier } from "./Barrier";

import { checkNeedSplitCards } from "./checkNeedSplitCards";
import { getSplittedCardsPassive } from "./getSplittedCardsPassive";

import { useOpenCardAnimation } from "../../business/effects/useOpenCardAnimation";

type CellApperance = {
  needHighlightning?: boolean;
  mode: PlayGridMode;
};

type UnderlayerType = {
  coordX: string;
  coordY: string;
};

type CardsListType = "all" | "enemy" | "inventory";
type PlanType = "back" | "front";

const Wrap = styled.div`
  position: relative;
`;

const CellItem = styled.div<CellApperance>`
  display: flex;
  position: relative;
  box-sizing: border-box;

  font-size: 14px;
  text-align: right;
  width: 50px;
  height: 50px;
  color: lightgrey;

  border: ${(props) => {
    if (props.mode === "cssStyle") {
      return "1px solid lightgray";
    }
  }};

  background-color: ${(props) => {
    if (props.needHighlightning) {
      return "rgb(55 163 0 / 52%);";
    }
  }};
`;

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

/**
 * @returns view of cards, single or multiple and splitted
 */

//не получится мемозировать из-за объектов селектора?! н-р gameField - object!?
export const FilledPlayGrid: React.FC = React.memo(function _FilledPlayGrid() {
  const dispatch = useDispatch();
  const _config = useSelector((state: State) => state._config);
  const gameField = useSelector((state: State) => state.gameField);
  const playerList = useSelector((state: State) => state.playerList);
  const activePlayerNumber = useSelector(
    (state: State) => state.activePlayerNumber
  );
  const gameState = useSelector((state: State) => state.gameState);
  const enemyList = useSelector((state: State) => state.enemyList);
  const deadPlayerList = useSelector((state: State) => state.deadPlayerList);
  const memoConfig = useMemo(() => _config, []);

  const playerCoord = playerList[activePlayerNumber].coord;
  const hasEnemyCard = Object.values(enemyList).find(
    (enemyItem) => enemyItem.coord === playerCoord
  );
  const hasInventoryCards = gameField.values[playerCoord];
  // const hasInventoryCard=
  const needRerenderCard = Boolean(hasEnemyCard || hasInventoryCards);

  console.log(hasEnemyCard, hasInventoryCards, needRerenderCard);

  const ANIMATION_TIME = 3;

  const getNextPhase = () => {
    //for inventory and for other card ???
    dispatch({ type: "req-openCard" });
  };

  const { cardRef } = useOpenCardAnimation({
    needRun: needRerenderCard,
    maxTime: ANIMATION_TIME,
    onTimerEnd: getNextPhase,
  });

  // const memoRef = cardRef;
  const memoRef = useMemo(() => cardRef, []);

  const orderGameCells = gameField.order;

  /**
   * ? often need, make as selector
   * only live player can interact with card
   */

  const MemoizedWrap = useMemo(() => Wrap, []);

  const fullPlayerGrid = orderGameCells.map((orderIndex: string) => {
    const cellValues = gameField.values[orderIndex];
    const [hor, vert] = orderIndex.split(".");

    const draftCellNumbers =
      memoConfig.playGridMode === "cssStyle" ? `${hor}.${vert}` : null;

    const barrier =
      cellValues.name === "commonCell" ? (
        <Barrier orderIndex={orderIndex}></Barrier>
      ) : null;

    const enemyListOnCell = Object.entries(enemyList).filter(
      ([string, enemyCard]) =>
        enemyCard.coord === orderIndex && enemyCard.apperance === "open"
    );

    const hasEnemy = enemyListOnCell.length > 0;

    const hasCard = cellValues.cardItem && cellValues.cardItem.length > 0;

    const hasClosedEnemyItem = Object.entries(enemyList).find(
      ([string, enemyCard]) =>
        enemyCard.coord === orderIndex && enemyCard.apperance === "closed"
    );

    const isPlayerAlone = !hasEnemy && !hasCard && !hasClosedEnemyItem;

    const needSplitCards = checkNeedSplitCards(
      playerList,
      orderIndex,
      cellValues,
      enemyList,
      gameState
    );

    const availableCells = gameState.coordOfAvailableCells;

    const isCurrPlayerAlive = playerList[activePlayerNumber] ? true : false;

    const needHighlightning = availableCells?.includes(orderIndex);

    const currPlayerCoord = playerList[activePlayerNumber].coord;
    const [playerX, playerY] = currPlayerCoord.split(".");
    const isPhaseCreateSeparateWindow =
      gameState.type.includes("interactWithEnemy") ||
      gameState.type === "gameStarted.takeCard";

    //For creating portal
    const isNeedCreateSeparateWindow =
      isPhaseCreateSeparateWindow && playerX === hor && playerY === vert;

    const getCardListType = ({ type: cardListType }: { type: PlanType }) => {
      const closedEnemyOnCell = Object.entries(enemyList).filter(
        ([string, enemyCard]) =>
          enemyCard.coord === orderIndex && enemyCard.apperance === "closed"
      );

      const enemyOnCell = Object.entries(enemyList).filter(
        ([string, enemyCard]) =>
          enemyCard.coord === orderIndex && enemyCard.apperance === "open"
      );

      const hasEnemyOnCell = enemyOnCell.length === 1;

      const playerItemList = Object.entries(playerList);

      //TODO: add player.apperance === "open"
      const playerListOnCell = playerItemList
        .filter((playerItem) => {
          const [, playerCard] = playerItem;
          return (
            playerCard.coord === orderIndex && playerCard.name === "player"
          );
        })
        .map((playerItem) => {
          const [, playerCard] = playerItem;
          return playerCard;
        });

      const hasPlayerOnCell = playerListOnCell.length === 1;

      const hasCardOnCell =
        (cellValues.cardItem && cellValues.cardItem.length === 1) ||
        closedEnemyOnCell;

      const phaseInteractWithEnemy =
        gameState.type.includes("interactWithEnemy");

      const hasEnemyPlayerCard =
        hasEnemyOnCell &&
        hasPlayerOnCell &&
        hasCardOnCell &&
        phaseInteractWithEnemy;

      switch (cardListType) {
        case "back": {
          switch (isCurrPlayerAlive) {
            case false: {
              return "all";
            }
            case true: {
              switch (isNeedCreateSeparateWindow) {
                case true: {
                  switch (hasEnemyPlayerCard) {
                    case true: {
                      return "inventory";
                    }
                    case false: {
                      return null;
                    }
                    default: {
                      break;
                    }
                  }
                  break;
                }
                case false: {
                  return "all";
                }
                default: {
                  break;
                }
              }
            }
          }
          break;
        }
        case "front": {
          switch (hasEnemyPlayerCard) {
            case true: {
              return "enemy";
            }
            case false: {
              return "all";
            }
            default: {
              break;
            }
          }
          break;
        }
        default: {
          break;
        }
      }
    };

    /**
     * this list background cards
     */
    const backgroundCardListType = getCardListType({ type: "front" });
    const foregroundCardListType = getCardListType({
      type: "back",
    }) as CardsListType;

    const hasBackgroundCard = Boolean(backgroundCardListType);

    const fieildElem = document.getElementById("field");

    const playerListEl = getPlayerList(
      orderIndex,
      playerList,
      activePlayerNumber,
      gameState,
      isPlayerAlone
    );

    const getCardListWithPlayer = ({ type }: { type: CardsListType }) => {
      return (
        <>
          {playerListEl}
          <CardListEl
            refList={memoRef}
            cell={cellValues}
            type={type as CardsListType}
            currCoord={orderIndex}
            enemyList={enemyList}
            deadPlayerList={deadPlayerList}
            activePlayerNumber={activePlayerNumber}
            playerList={playerList}
          />
        </>
      );
    };

    const getCardsOnCell = ({ type }: { type: CardsListType }) => {
      const cardListWithPlayer = getCardListWithPlayer({ type });
      const cardsOnCell = needSplitCards
        ? getSplittedCardsPassive(cardListWithPlayer, orderIndex)
        : cardListWithPlayer;

      return cardsOnCell;
    };

    const backgroundCardWrap = (
      <MemoizedWrap key={`${hor}.${vert}`}>
        <CellItem
          needHighlightning={needHighlightning}
          mode={memoConfig.playGridMode}
        >
          {draftCellNumbers}
          {hasBackgroundCard
            ? getCardsOnCell({ type: backgroundCardListType as CardsListType })
            : null}
        </CellItem>
        {barrier}
      </MemoizedWrap>
    );

    const foregroundPortal = fieildElem
      ? ReactDOM.createPortal(
          <>
            <UnderlayerItem coordX={hor} coordY={vert}>
              {getCardsOnCell({ type: foregroundCardListType })}
            </UnderlayerItem>
          </>,
          fieildElem
        )
      : null;

    const separateWindowWrap = (
      <React.Fragment key={`${hor}.${vert}`}>
        {backgroundCardWrap}
        {foregroundPortal}
      </React.Fragment>
    );

    if (isNeedCreateSeparateWindow) {
      return separateWindowWrap;
    } else {
      return backgroundCardWrap;
    }
  });

  return <>{fullPlayerGrid}</>;
});
