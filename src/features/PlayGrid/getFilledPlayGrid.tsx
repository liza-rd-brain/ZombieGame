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
import { getNeighboringCellList } from "../../business/phases/gameStarted/getNeighboringCellList";

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

const Wall = styled.div<WallType>`
  &:before {
    content: "";
    position: absolute;
    width: 50px;
    height: 50px;
    bottom: 0px;
    z-index: 2;
    height: ${(props) => {
      if (props.barrierItem) {
        switch (props.barrierItem.bottom.name) {
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
            return "0px";
        }
      } else {
        return "none";
      }
    }};

    background-color: ${(props) => {
      if (props.barrierItem) {
        const needHighlightning = props.highlightningList?.find(
          (item: MoveDirection) => item === "bottom"
        );

        switch (props.barrierItem.bottom.name) {
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
    /*   width: 30px; */
    height: 50px;
    z-index: 2;
    bottom: 0px;

    width: ${(props) => {
      if (props.barrierItem) {
        switch (props.barrierItem.left.name) {
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
      if (props.barrierItem && props.barrierItem.left) {
        return "50px";
      } else if (
        props.barrierItem &&
        !props.barrierItem.left &&
        !props.barrierItem.bottom
      ) {
        return "5px";
      } else {
        return "0px";
      }
    }};

    background-color: ${(props) => {
      if (props.barrierItem) {
        const needHighlightning = props.highlightningList?.find(
          (item: MoveDirection) => item === "left"
        );

        switch (props.barrierItem.left.name) {
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
      return " rgb(241, 237, 237)";
    }
  }};
`;

// TODO: Take out style variable-?!
const CellItemWall = styled.div<CommonCell>`
  position: absolute;
  z-index: 2;
  box-sizing: border-box;
  width: 30px;
  height: 30px;
  color: lightgrey;

  border-top: ${(props) => {
    if (props.barrierItem) {
      switch (props.barrierItem.top.name) {
        case "wall": {
          return "5px solid #f09308";
        }
        case "door": {
          return "2px solid #584324";
        }
        case "window": {
          return "2px solid #669aa7";
        }
        default:
          return "none";
      }
    } else {
      return "none";
    }
  }};

  border-bottom: ${(props) => {
    if (props.barrierItem) {
      switch (props.barrierItem.bottom.name) {
        case "wall": {
          return "5px solid #f09308";
        }
        case "door": {
          return "2px solid #584324";
        }
        case "window": {
          return "2px solid #669aa7";
        }
        default:
          return "none";
      }
    } else {
      return "none";
    }
  }};

  border-left: ${(props) => {
    if (props.barrierItem) {
      switch (props.barrierItem.left.name) {
        case "wall": {
          return "5px solid #f09308";
        }
        case "door": {
          return "2px solid #584324";
        }
        case "window": {
          return "2px solid #669aa7";
        }
        default:
          return "none";
      }
    } else {
      return "none";
    }
  }};
  border-right: ${(props) => {
    if (props.barrierItem) {
      switch (props.barrierItem.right.name) {
        case "wall": {
          return "5px solid #f09308";
        }
        case "door": {
          return "2px solid #584324";
        }
        case "window": {
          return "2px solid #669aa7";
        }
        default:
          return "none";
      }
    } else {
      return "none";
    }
  }};
`;

export const getFilledPlayGrid = (state: State, getContextMenu: Function) => {
  const { gameField, playerList, numberOfPlayer, gameState, enemyList } = state;
  const orderGameCells = gameField.order;

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

    const currCell = gameField.values[currPlayerCoord];

    const neighboringCellListCoord = neighboringCellList.map((cellItem) => {
      const { direction, coord } = cellItem;
      return coord;
    });

    const checkCellListCoord = neighboringCellListCoord.concat(currPlayerCoord);

    const needCheckHighlightning = checkCellListCoord.find(
      (coord) => orderIndex === coord
    );

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
            <Wall
              barrierItem={cellValues.barrierItem} /* {...cellValues} */
              //Calculating, only if is cell with player
              highlightningList={
                needCheckHighlightning
                  ? getHigtlightning(highlightningList, orderIndex)
                  : null
              }
              onClick={() => {
                console.log("click");
              }}
            >
              {" "}
            </Wall>
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
