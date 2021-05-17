import styled from "styled-components";

import {
  GameField,
  PlayerListType,
  EnemyListType,
  CommonCell,
  BarrierType,
  MoveDirection,
  AvailableCellListType,
  CellType,
  AvailableCellType,
  State,
  GameState,
} from "../../business/types";

import { getCards } from "./getCards";
import { getPlayersList } from "./getPlayersList";
import { getEnemyList } from "./getEnemyList";
import { Barrier } from "./Barrier";

import { MOVE_DIRECTION_LIST } from "../../shared/config";

type CellApperance = {
  hasMarker?: boolean;
};

const Wrap = styled.div`
  position: relative;
`;

const CellItem = styled.div<CellApperance>`
  position: relative;
  box-sizing: border-box;
  border: 1px solid lightgray;
  font-size: 14px;
  text-align: right;
  width: 50px;
  height: 50px;
  color: lightgrey;
  background-color: ${(props) => {
    if (props.hasMarker) {
      return " rgb(241, 224, 224)";
    }
  }};
`;

export const getFilledPlayGrid = (state: State, getContextMenu: Function) => {
  const { gameField, playerList, numberOfPlayer, gameState, enemyList } = state;
  const orderGameCells = gameField.order;

  const currPlayerCoord = playerList[numberOfPlayer].coord;

  const availableCells =
    playerList[numberOfPlayer].availableCellsCoords?.concat(currPlayerCoord);

  const fullPlayerGrid = orderGameCells.map((orderIndex: string) => {
    const cellValues = gameField.values[orderIndex];
    const [hor, vert] = orderIndex.split(".");

    const hasMarker = availableCells?.includes(orderIndex);

    switch (cellValues.name) {
      case "start":
      case "finish": {
        return (
          <CellItem key={`${hor}.${vert}`} hasMarker={hasMarker}>
            {getCards(cellValues)}
            {getPlayersList(
              orderIndex,
              playerList,
              numberOfPlayer,
              getContextMenu
            )}
            {`${hor}.${vert}`}
          </CellItem>
        );
      }
      case "commonCell": {
        return (
          <Wrap key={`${hor}.${vert}`}>
            <CellItem hasMarker={hasMarker}>
              {getCards(cellValues)}
              {getPlayersList(
                orderIndex,
                playerList,
                numberOfPlayer,
                getContextMenu
              )}
              {getEnemyList(orderIndex, enemyList)}
              {`${hor}.${vert}`}
            </CellItem>
            <Barrier orderIndex={orderIndex}></Barrier>
          </Wrap>
        );
      }
      default: {
        return null;
      }
    }
  });

  return fullPlayerGrid;
};
