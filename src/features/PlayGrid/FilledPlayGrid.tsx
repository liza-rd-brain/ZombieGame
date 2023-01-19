import React, { useMemo } from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";
import { useSelector } from "react-redux";

import {
  State,
  PlayGridMode,
  PlayerListType,
  CellType,
  EnemyListType,
  GameState,
} from "../../business/types";

import { CardListEl } from "./CardListEl";
import { getPlayerList } from "./getPlayerList";
import { Barrier } from "./Barrier";
import { EnemyList } from "../../components";
import { checkNeedSplitCards } from "./checkNeedSplitCards";
import { getSplittedCardsPassive } from "./getSplittedCardsPassive";

type CellApperance = {
  needHighlightning?: boolean;
  mode: PlayGridMode;
};

type UnderlayerType = {
  coordX: string;
  coordY: string;
};

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

  const orderGameCells = gameField.order;

  /**
   * ? often need, make as selector
   * only live player can interact with card
   */
  const isCurrPlayerAlive = playerList[activePlayerNumber] ? true : false;

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

    const enemyListEl = hasEnemy && (
      <EnemyList
        list={enemyListOnCell}
        activePlayerNumber={activePlayerNumber}
        deadPlayerList={deadPlayerList}
        coord={orderIndex}
      />
    );

    const cardListEl = (
      <CardListEl
        cell={cellValues}
        /* type={} */
        currCoord={orderIndex}
        enemyList={enemyList}
        deadPlayerList={deadPlayerList}
        activePlayerNumber={activePlayerNumber}
        playerList={playerList}
      />
    );

    const hasCard = cellValues.cardItem && cellValues.cardItem.length > 0;

    const hasClosedEnemyItem = Object.entries(enemyList).find(
      ([string, enemyCard]) =>
        enemyCard.coord === orderIndex && enemyCard.apperance === "closed"
    );

    const isPlayerAlone = !hasEnemy && !hasCard && !hasClosedEnemyItem;

    const playerListEl = getPlayerList(
      orderIndex,
      playerList,
      activePlayerNumber,
      gameState,
      isPlayerAlone
    );

    const cardList = (
      <>
        {playerListEl}
        {enemyListEl}
        {cardListEl}
      </>
    );

    const cardListWithoutInventoryCards = (
      <>
        {playerListEl}
        {enemyListEl}
      </>
    );

    /**
     * ? its only inventory cards
     * wor case when enemy take card with inventory
     */
    const inventoryElement = <>{cardListEl}</>;

    const needSplitCards = checkNeedSplitCards(
      playerList,
      orderIndex,
      cellValues,
      enemyList,
      gameState
    );

    const cardsOnCell = needSplitCards
      ? getSplittedCardsPassive(cardList, orderIndex)
      : cardList;

    const availableCells = gameState.coordOfAvailableCells;

    const needHighlightning = availableCells?.includes(orderIndex);

    //
    switch (isCurrPlayerAlive) {
      case false: {
        return (
          <MemoizedWrap key={`${hor}.${vert}`}>
            <CellItem
              needHighlightning={needHighlightning}
              mode={memoConfig.playGridMode}
            >
              {cardsOnCell}
              {draftCellNumbers}
            </CellItem>
            {barrier}
          </MemoizedWrap>
        );
      }

      case true: {
        const currPlayerCoord = playerList[activePlayerNumber].coord;
        const [playerX, playerY] = currPlayerCoord.split(".");

        const isPhaseCreateSeparateWindow =
          gameState.type.includes("interactWithEnemy") ||
          gameState.type === "gameStarted.takeCard";

        //For creating portal
        const isNeedCreateSeparateWindow =
          isPhaseCreateSeparateWindow && playerX === hor && playerY === vert;

        switch (isNeedCreateSeparateWindow) {
          case true: {
            const fieildElem = document.getElementById("field");

            switch (fieildElem) {
              case null: {
                return null;
              }

              default: {
                /**
                 * Only for open enemyCArd
                 */
                const enemyOnCell = Object.entries(enemyList).filter(
                  ([string, enemyCard]) =>
                    enemyCard.coord === orderIndex &&
                    enemyCard.apperance === "open"
                );

                const hasEnemyOnCell = enemyOnCell.length === 1;

                const playerItemList = Object.entries(playerList);

                //TODO: add player.apperance === "open"
                const playerListOnCell = playerItemList
                  .filter((playerItem) => {
                    const [, playerCard] = playerItem;
                    return (
                      playerCard.coord === orderIndex &&
                      playerCard.name === "player"
                    );
                  })
                  .map((playerItem) => {
                    const [, playerCard] = playerItem;
                    return playerCard;
                  });

                const hasPlayerOnCell = playerListOnCell.length === 1;

                const cellValues = gameField.values[orderIndex];

                const closedEnemyOnCell = Object.entries(enemyList).filter(
                  ([string, enemyCard]) =>
                    enemyCard.coord === orderIndex &&
                    enemyCard.apperance === "closed"
                );

                /**
                 * Inventory or other closed cards, like enemy
                 */
                const hasCardOnCell =
                  (cellValues.cardItem && cellValues.cardItem.length === 1) ||
                  closedEnemyOnCell;

                const phaseInteractWithEnemy =
                  gameState.type.includes("interactWithEnemy");

                /**
                 * has Enemy and Player and Card
                 */
                const hasEnemyPlayerCard =
                  hasEnemyOnCell &&
                  hasPlayerOnCell &&
                  hasCardOnCell &&
                  phaseInteractWithEnemy;

                return (
                  <React.Fragment key={`${hor}.${vert}`}>
                    <MemoizedWrap key={`${hor}.${vert}`}>
                      <CellItem
                        needHighlightning={needHighlightning}
                        mode={memoConfig.playGridMode}
                      >
                        {draftCellNumbers}
                        {hasEnemyPlayerCard ? inventoryElement : null}
                      </CellItem>
                      {barrier}
                    </MemoizedWrap>

                    {ReactDOM.createPortal(
                      <>
                        <UnderlayerItem coordX={hor} coordY={vert}>
                          {hasEnemyPlayerCard
                            ? cardListWithoutInventoryCards
                            : cardsOnCell}
                        </UnderlayerItem>
                      </>,
                      fieildElem
                    )}
                  </React.Fragment>
                );
              }
            }
          }

          case false: {
            return (
              <MemoizedWrap key={`${hor}.${vert}`}>
                <CellItem
                  needHighlightning={needHighlightning}
                  mode={memoConfig.playGridMode}
                >
                  {cardsOnCell}
                  {draftCellNumbers}
                </CellItem>
                {barrier}
              </MemoizedWrap>
            );
          }

          default: {
            return null;
          }
        }
      }
    }
    return null;
  });

  return <>{fullPlayerGrid}</>;
});
