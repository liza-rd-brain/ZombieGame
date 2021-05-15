import styled from "styled-components";

import {
  GameField,
  PlayerListType,
  EnemyListType,
  CommonCell,
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

type WallType = {
  barrierItem?: BarrierType | undefined;
  highlightningList: any /* (AvailableCellType | null)[]; */;
  onClick: Function;
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

  const currPlayerCoord = playerList[numberOfPlayer].coord;

  const availableCells =
    playerList[numberOfPlayer].availableCellsCoords?.concat(currPlayerCoord);

  const neighboringCellList = getNeighboringCellList(
    currPlayerCoord,
    gameField
  );

  const highlightningList = getHighlightningList(
    neighboringCellList,
    gameField,
    currPlayerCoord,
    gameState,
    playerList,
    numberOfPlayer
  );

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

const getHigtlightning = (
  highlightningList: (AvailableCellType | null)[],
  orderIndex: string
) => {
  const currList = highlightningList.filter((cellItem) => {
    return cellItem?.coord === orderIndex;
  });

  const structuredList = currList.map((cellItem) => {
    if (cellItem) {
      const { direction, coord } = cellItem;
      return direction;
    } else {
      return null;
    }
  });
  return structuredList;
};
/**
 * Check the neifhboring of that coord.
 * Have they door or window
 */
const getHighlightningList = (
  neighboringCellList: AvailableCellListType,
  gameField: GameField,
  currCoord: string,
  gameState: GameState,
  playerList: PlayerListType,
  numberOfPlayer: number
) => {
  const currCell = gameField.values[currCoord];

  const availableCellList /* : AvailableCellListType */ = neighboringCellList
    .map((cellItem) => {
      const { direction, coord } = cellItem;
      const currCellHasHole = checkCellOnHole(currCell, direction);
      const nextCell = gameField.values[coord];
      const oppositeDirection = getOppositeDirection(direction);
      const nextCellHasHole = checkCellOnHole(nextCell, oppositeDirection);
      if (currCellHasHole) {
        const cellItemWithHall: AvailableCellType = {
          direction,
          coord: currCoord,
        };

        return cellItemWithHall;
      } else if (nextCellHasHole) {
        const cellItemWithHall: AvailableCellType = {
          direction: oppositeDirection,
          coord,
        };
        return cellItemWithHall;
      } else {
        return null;
      }
    })
    .filter((availableCell) => availableCell !== null);

  switch (gameState.type) {
    case "gameStarted.applyCard.contextMenu":
    case "gameStarted.applyCard":
      const cardItemList = playerList[numberOfPlayer].inventory;
      const selectedCard = cardItemList.find(
        (cardItem) => cardItem?.isSelected === true
      );
      const typeOfSelectedCard = selectedCard?.name;
      if (typeOfSelectedCard === "boards") {
        return availableCellList;
      } else {
        return [];
      }

    default:
      return [];
  }
};

const checkCellOnHole = (cell: CellType, direction: MoveDirection) => {
  if (cell.name === "commonCell") {
    const cellHasWindow =
      cell.barrierItem?.[direction].name === "window" ? true : false;
    const cellHasDoor =
      cell.barrierItem?.[direction].name === "door" ? true : false;
    const cellHasHole = cellHasWindow || cellHasDoor;
    return cellHasHole;
  }
  return false;
};

const getOppositeDirection = (direction: MoveDirection): MoveDirection => {
  switch (direction) {
    case "top": {
      return "bottom";
    }
    case "bottom": {
      return "top";
    }
    case "left": {
      return "right";
    }
    case "right": {
      return "left";
    }
  }
};
