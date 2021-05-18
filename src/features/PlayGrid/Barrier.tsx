import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import styled from "styled-components";

import { getNeighboringCellList } from "../../business/phases/gameStarted/getNeighboringCellList";

import {
  State,
  MoveDirection,
  BarrierItem,
  CommonCell,
  AvailableCellListType,
  GameField,
  GameState,
  PlayerListType,
  CellType,
  AvailableCellType,
} from "../../business/types";

type WallType = {
  barrierItem?: BarrierItem;
  //TODO: поправить тип?
  highlightningList: (MoveDirection | null)[] | null;
  onClick: Function;
};

type BarrierCoord = {
  orderIndex: string;
};

const Wall = styled.div<WallType>`
  &:before {
    content: "";
    position: absolute;
    width: 50px;
    height: 50px;
    bottom: 0px;
    z-index: 2;
    height: ${(props) => {
      if (props.barrierItem?.direction === "bottom") {
        switch (props.barrierItem.name) {
          case "wall": {
            return "5px";
          }
          case "door": {
            return "3px";
          }
          case "window": {
            return "3px";
          }
          default:
            return "0px";
        }
      } else {
        return "0px";
      }
    }};

    background-color: ${(props) => {
      if (props.barrierItem) {
        const needHighlightning = props.highlightningList?.find((item) => {
          return item === "bottom";
        });

        switch (props.barrierItem.name) {
          case "wall": {
            return "#f09308;";
          }
          case "door": {
            if (needHighlightning) {
              return "#78ff2d";
            } else {
              return " #584324;";
            }
          }
          case "window": {
            if (needHighlightning) {
              return "#78ff2d";
            } else {
              return " #a3cdd8;";
            }
          }
          default:
            return "none";
        }
      } else {
        return "none";
      }
    }};
  }
  &:after {
    content: "";
    position: absolute;
    height: 50px;
    z-index: 2;
    bottom: 0px;

    width: ${(props) => {
      if (props.barrierItem?.direction === "left") {
        switch (props.barrierItem.name) {
          case "wall": {
            return "5px ";
          }
          case "door": {
            return "3px";
          }
          case "window": {
            return "3px";
          }
          default:
            return "5px";
        }
      } else {
        return "none";
      }
    }};

    height: ${(props) => {
      if (
        props.barrierItem &&
        props.barrierItem.direction === "left" &&
        props.barrierItem.name !== null
      ) {
        return "50px";
        //it is needed for now for pretty  wall painting
      } else if (props.barrierItem && props.barrierItem.name === null) {
        return "5px";
      } else {
        return "0px";
      }
    }};

    background-color: ${(props) => {
      if (props.barrierItem) {
        const needHighlightning = props.highlightningList?.find((item) => {
          return item === "left";
        });

        switch (props.barrierItem.name) {
          case "wall": {
            return "#f09308";
          }
          case "door": {
            if (needHighlightning) {
              return "#78ff2d";
            } else {
              return " #584324;";
            }
          }
          case "window": {
            if (needHighlightning) {
              return "#78ff2d";
            } else {
              return " #a3cdd8;";
            }
          }
          default:
            return "#f09308";
        }
      } else {
        return "none";
      }
    }};
  }
`;

export const Barrier = (props: BarrierCoord) => {
  const dispatch = useDispatch();
  const state = useSelector((state: State) => ({
    ...state,
  }));

  const { gameField, playerList, numberOfPlayer, gameState } = state;

  const orderIndex = props.orderIndex;
  const cellValues = gameField.values[orderIndex];
  const currPlayerCoord = playerList[numberOfPlayer].coord;

  const availableCells =
    playerList[numberOfPlayer].availableCellsCoords?.concat(currPlayerCoord);

  const neighboringCellList = getNeighboringCellList(
    currPlayerCoord,
    gameField
  );

  const neighboringCellListCoord = neighboringCellList.map((cellItem) => {
    const { direction, coord } = cellItem;
    return coord;
  });

  const checkCellListCoord = neighboringCellListCoord.concat(currPlayerCoord);

  const needCheckHighlightning = checkCellListCoord.find(
    (coord) => orderIndex === coord
  );

  const highlightningList = getHighlightningList(
    neighboringCellList,
    gameField,
    currPlayerCoord,
    gameState,
    playerList,
    numberOfPlayer
  );

  switch (cellValues.name) {
    case "commonCell": {
      const barrierList = cellValues.barrierList?.map((barrier) => {
        return (
          <Wall
            barrierItem={barrier}
            //Calculating, only if is cell with player
            highlightningList={
              needCheckHighlightning
                ? getHigtlightningDirection(highlightningList, orderIndex)
                : null
            }
            onClick={
              () =>
                dispatch({ type: "req-fillHole" }) /* getCallbackClick(state) */
            }
          >
            {" "}
          </Wall>
        );
      });
      return <>{barrierList}</>;
    }
    default: {
      return null;
    }
  }
};

const getHigtlightningDirection = (
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

  const availableCellList = neighboringCellList
    .map((cellItem) => {
      const { direction, coord } = cellItem;
      const currCellHasHole = checkCellOnHole(currCell, direction);
      const nextCell = gameField.values[coord];
      const oppositeDirection = getOppositeDirection(direction);
      const nextCellHasHole = checkCellOnHole(nextCell, oppositeDirection);
      if (currCellHasHole) {
        const cellItemWithHole: AvailableCellType = {
          direction,
          coord: currCoord,
        };

        return cellItemWithHole;
      } else if (nextCellHasHole) {
        const cellItemWithHole: AvailableCellType = {
          direction: oppositeDirection,
          coord,
        };
        return cellItemWithHole;
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
    if (direction === "left" || direction === "bottom") {
      /*    const cellHasWindow = cell.barrierItem?.name === "window" ? true : false; */
      const cellHasWindow = cell.barrierList?.find(
        (barrier) => barrier.name === "window"
      )
        ? true
        : false;
      const cellHasDoor = cell.barrierList?.find(
        (barrier) => barrier.name === "door"
      )
        ? true
        : false;
      const cellHasHole = cellHasWindow || cellHasDoor;
      return cellHasHole;
    } else {
      return false;
    }
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
