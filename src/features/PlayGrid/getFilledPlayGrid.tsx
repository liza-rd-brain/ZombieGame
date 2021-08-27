import React from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";

import {
  State,
  PlayGridMode,
  PlayerListType,
  CellType,
  EnemyListType,
  DeadPlayerListType,
  GameState,
} from "../../business/types";
import { getCards } from "./getCards";
import { getPlayersList } from "./getPlayersList";
import { getEnemyList } from "./getEnemyList";
import { Barrier } from "./Barrier";

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
`;

type PortalType = {
  coordX: string;
  coordY: string;
};

const CardsPortal = styled.div<PortalType>`
  position: relative;
  display: flex;
  left: ${(props) => {
    return `${Number(props.coordX) * 50}px`;
  }};

  bottom: ${(props) => {
    return `${Number(props.coordY) * 50 + 50}px`;
  }};
`;

const CardsWrap = styled.div`
  display: flex;
  flex-wrap: nowrap;
  position: absolute;
  z-index: 3;
  font-size: 12px;
  font-weight: bold;
  /*   flex-direction: row-reverse; */
  > * {
    position: relative !important;
    margin: 0 -12px;

    /*     margin: 0px -41px;
    left: -54px; */
  }
`;

const checkNeedSplitCards = (
  playerList: PlayerListType,
  orderIndex: string,
  cell: CellType,
  enemiyList: EnemyListType,
  gameState: GameState
) => {
  const playerItemList = Object.entries(playerList);

  const playerListOnCell = playerItemList
    .filter((playerItem) => {
      const [, playerCard] = playerItem;
      return playerCard.coord === orderIndex && playerCard.name === "player";
    })
    .map((playerItem) => {
      const [, playerCard] = playerItem;
      return playerCard;
    });

  const hasPlayerOncell = playerListOnCell.length === 1;

  const hasCardOnCell = cell.cardItem.length === 1;

  const enemyOnCell = Object.entries(enemiyList).filter(
    ([string, enemyCard]) => enemyCard.coord === orderIndex
  );
  const hasEnemyOnCell = enemyOnCell.length === 1;
  const amountEnemyOnCell = enemyOnCell.length;

  const phaseInteractWithEnemy = gameState.type.includes("interactWithEnemy");
  const hasTwoEnemy = amountEnemyOnCell === 2;
  /*   const hasPlayerAndCards = hasPlayerOncell && hasCardOnCell; */
  const hasPlayerAndEnemy =
    hasEnemyOnCell && hasPlayerOncell && !phaseInteractWithEnemy;
  const hasEnemyAndCard = hasEnemyOnCell && hasCardOnCell;

  switch (true) {
    /*    case hasTwoEnemy:
    case hasPlayerAndCards: */
    case hasTwoEnemy:
    case hasPlayerAndEnemy:
    case hasEnemyAndCard: {
      return true;
    }
    default: {
      return false;
    }
  }
};

export const getFilledPlayGrid = (state: State) => {
  const {
    gameField,
    playerList,
    activePlayerNumber,
    gameState,
    enemyList,
    deadPlayerList,
    _config,
  } = state;
  const orderGameCells = gameField.order;

  const isCurrPlayerAlive = playerList[activePlayerNumber] ? true : false;

  const fullPlayerGrid = orderGameCells.map((orderIndex: string) => {
    const cellValues = gameField.values[orderIndex];
    const [hor, vert] = orderIndex.split(".");

    //TODO: Need to find out is more than one card in the cell!
    const cardList = (
      <>
        {getPlayersList(orderIndex, playerList, activePlayerNumber, gameState)}

        {cellValues.name === "commonCell"
          ? getEnemyList(
              orderIndex,
              enemyList,
              deadPlayerList,
              activePlayerNumber
            )
          : null}

        {getCards(cellValues, hor, vert)}
      </>
    );

    const needSplitCards = checkNeedSplitCards(
      playerList,
      orderIndex,
      cellValues,
      enemyList,
      gameState
    );

    const getCardsOnCell = (
      needSplitCards: Boolean,
      cardList: JSX.Element,
      orderIndex: string
    ) => {
      switch (needSplitCards) {
        case false: {
          return cardList;
        }
        case true: {
          const fieildElem = document.getElementById("field");
          switch (fieildElem) {
            case null: {
              return cardList;
            }
            default: {
              const [hor, vert] = orderIndex.split(".");
              console.log(hor, vert);
              const portal = ReactDOM.createPortal(
                <CardsPortal coordX={hor} coordY={vert}>
                  <CardsWrap>{cardList}</CardsWrap>
                </CardsPortal>,
                fieildElem
              );
              return portal;
            }
          }
        }
        default: {
          return null;
        }
      }
    };

    const cardsOnCell = getCardsOnCell(needSplitCards, cardList, orderIndex);

    const availableCells = state.gameState.coordOfAvailableCells;
    const needHighlightning = availableCells?.includes(orderIndex);

    switch (isCurrPlayerAlive) {
      case false: {
        return (
          <Wrap key={`${hor}.${vert}`}>
            <CellItem
              needHighlightning={needHighlightning}
              mode={_config.playGridMode}
            >
              {cardsOnCell}

              {_config.playGridMode === "cssStyle" ? `${hor}.${vert}` : null}
            </CellItem>
            {cellValues.name === "commonCell" ? (
              <Barrier orderIndex={orderIndex}></Barrier>
            ) : null}
          </Wrap>
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
                return (
                  <React.Fragment key={`${hor}.${vert}`}>
                    <Wrap key={`${hor}.${vert}`}>
                      <CellItem
                        needHighlightning={needHighlightning}
                        mode={_config.playGridMode}
                      >
                        {_config.playGridMode === "cssStyle"
                          ? `${hor}.${vert}`
                          : null}
                      </CellItem>
                      {cellValues.name === "commonCell" ? (
                        <Barrier orderIndex={orderIndex}></Barrier>
                      ) : null}
                    </Wrap>

                    {ReactDOM.createPortal(
                      <>
                        <UnderlayerItem coordX={hor} coordY={vert}>
                          {cardsOnCell}
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
              <Wrap key={`${hor}.${vert}`}>
                <CellItem
                  needHighlightning={needHighlightning}
                  mode={_config.playGridMode}
                >
                  {cardsOnCell}

                  {_config.playGridMode === "cssStyle"
                    ? `${hor}.${vert}`
                    : null}
                </CellItem>
                {cellValues.name === "commonCell" ? (
                  <Barrier orderIndex={orderIndex}></Barrier>
                ) : null}
              </Wrap>
            );
          }

          default: {
            return null;
          }
        }
      }
    }
  });

  return fullPlayerGrid;
};
