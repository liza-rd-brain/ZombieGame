import ReactDOM from "react-dom";
import styled from "styled-components";

import { State, PlayGridMode } from "../../business/types";
import { getCards } from "./getCards";
import { getPlayersList } from "./getPlayersList";
import { getEnemyList } from "./getEnemyList";
import { Barrier } from "./Barrier";

import { PLAY_GRID_MODE } from "../../shared/config";
import React from "react";

type CellApperance = {
  hasMarker?: boolean;
  isNeedSepareteCards: boolean;
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
    if (props.hasMarker) {
      return "rgb(55 163 0 / 77%);";
    }
  }};
`;

const UnderlayerItem = styled.div<UnderlayerType>`
  position: relative;
  display: flex;
  width: 100px;
  height: 100px;
  background-color: rgb(129 128 72/ 77%);
  left: ${(props) => {
    return `${Number(props.coordX) * 50 - 30}px`;
  }};

  bottom: ${(props) => {
    return `${Number(props.coordY) * 50 + 70}px`;
  }};

  & > * {
    position: relative;
    margin: 30px 0;
    width: 50px;
    height: 50px;
  }
  flex-direction: row;

  align-items: center;
`;

export const getFilledPlayGrid = (state: State, getContextMenu: Function) => {
  const { gameField, playerList, numberOfPlayer, gameState, enemyList } = state;
  const orderGameCells = gameField.order;

  const currPlayerCoord = playerList[numberOfPlayer].coord;

  const availableCells = state.availableCellsCoords?.concat(currPlayerCoord);

  const fullPlayerGrid = orderGameCells.map((orderIndex: string) => {
    const cellValues = gameField.values[orderIndex];
    const [hor, vert] = orderIndex.split(".");

    const hasMarker = availableCells?.includes(orderIndex);

    const [playerX, playerY] = currPlayerCoord.split(".");
    const isPhaseCardsSeparate =
      gameState.type.includes("interactWithEnemy") ||
      gameState.type === "gameStarted.takeCard";

    const isNeedSepareteCards =
      isPhaseCardsSeparate && playerX === hor && playerY === vert;

    const cardList = (
      <React.Fragment>
        {" "}
        {getCards(cellValues, hor, vert)}
        {getPlayersList(
          orderIndex,
          playerList,
          numberOfPlayer,
          getContextMenu,
          hor,
          vert
        )}
        {cellValues.name === "commonCell"
          ? getEnemyList(orderIndex, enemyList, hor, vert)
          : null}
      </React.Fragment>
    );

    switch (isNeedSepareteCards) {
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
                    hasMarker={hasMarker}
                    isNeedSepareteCards={isNeedSepareteCards}
                    mode={PLAY_GRID_MODE}
                  >
                    {PLAY_GRID_MODE === "cssStyle" ? `${hor}.${vert}` : null}
                  </CellItem>
                  {cellValues.name === "commonCell" ? (
                    <Barrier orderIndex={orderIndex}></Barrier>
                  ) : null}
                </Wrap>

                {ReactDOM.createPortal(
                  <UnderlayerItem coordX={hor} coordY={vert}>
                    {cardList}{" "}
                  </UnderlayerItem>,
                  fieildElem
                )}
              </React.Fragment>
            );
          }
        }
        return null;
      }
      case false: {
        return (
          <Wrap key={`${hor}.${vert}`}>
            <CellItem
              hasMarker={hasMarker}
              isNeedSepareteCards={isNeedSepareteCards}
              mode={PLAY_GRID_MODE}
            >
              {cardList}

              {PLAY_GRID_MODE === "cssStyle" ? `${hor}.${vert}` : null}
            </CellItem>
            {cellValues.name === "commonCell" ? (
              <Barrier orderIndex={orderIndex}></Barrier>
            ) : null}
          </Wrap>
        );
      }
    }
  });

  return fullPlayerGrid;
};
