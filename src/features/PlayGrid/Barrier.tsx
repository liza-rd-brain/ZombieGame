import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import styled from "styled-components";

import { getNeighboringCellList } from "../../business/phases/gameStarted/common/getNeighboringCellList";

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
    z-index: 5;
    height: ${(props) => {
      if (props.barrierItem?.direction === "bottom") {
        if (props.barrierItem?.isOpen === false) {
          return "10px";
        } else {
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
        }
      } else if (
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

    width: ${(props) => {
      if (props.barrierItem?.direction === "left") {
        if (props.barrierItem?.isOpen === false) {
          return "10px";
        } else {
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
        }
      } else if (
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
    width: ${(props) => {
      if (props.barrierItem?.direction === "left") {
        if (props.barrierItem?.isOpen === false) {
          return "10px";
        } else {
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
        }
      } else {
        return "none";
      }
    }};

    background-color: ${(props) => {
      if (props.barrierItem?.isOpen) {
        const needHighlightning = props.highlightningList?.find((item) => {
          return item === "bottom" || "left";
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
            return "#f09308";
        }
      } else if (props.barrierItem?.isOpen === false) {
        return "#66615d;";
      } else {
        return "none";
      }
    }};
  }
  &:after {
    content: "";
    z-index: 5;
    position: absolute;
    width: 50px;
    height: 50px;

    top: ${(props) => {
      if (props.barrierItem?.direction === "left") {
        return "0";
      }
    }};
    height: ${(props) => {
      if (props.barrierItem?.direction === "bottom" && props.barrierItem) {
        return "20px";
      }
    }};
    width: ${(props) => {
      if (props.barrierItem?.direction === "left") {
        return "20px";
      }
    }};
    bottom: ${(props) => {
      if (props.barrierItem?.direction === "bottom") {
        return "-10px";
      }
    }};
    left: ${(props) => {
      if (props.barrierItem?.direction === "left") {
        return "-10px";
      }
    }};

    background-color: ${(props) => {
      if (props.barrierItem?.isOpen) {
        const needHighlightning = props.highlightningList?.find((item) => {
          return item === "bottom" || "left";
        });

        if (needHighlightning) {
          return "#79fe2f3d";
        } else {
          return "none";
        }
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
            key={barrier.direction}
            barrierItem={barrier}
            highlightningList={
              needCheckHighlightning
                ? getHigtlightningDirection(
                    highlightningList,
                    orderIndex,
                    barrier.direction
                  )
                : null
            }
            onClick={() => {
              const canCloseHole = highlightningList.find((cellType) => {
                return (
                  cellType?.coord === orderIndex &&
                  cellType?.direction === barrier.direction &&
                  barrier.isOpen === true
                );
              })
                ? true
                : false;
              if (canCloseHole) {
                dispatch({
                  type: "req-fillHole",
                  payload: { coord: orderIndex, direction: barrier.direction },
                });
              } else {
                return null;
              }
            }}
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
  orderIndex: string,
  direction: MoveDirection
) => {
  const currList = highlightningList.filter((cellItem) => {
    return cellItem?.coord === orderIndex && cellItem?.direction === direction;
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
