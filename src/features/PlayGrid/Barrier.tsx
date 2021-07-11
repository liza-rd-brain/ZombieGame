import { useDispatch, useSelector } from "react-redux";

import styled from "styled-components";

import { getNeighboringCellList } from "../../business/phases/common/getNeighboringCellList";

import closedDoor from "../../assets/door2.png";
import closedWindow from "../../assets/window2.png";
import door from "../../assets/door.png";
import window from "../../assets/window.png";

import {
  State,
  MoveDirection,
  BarrierItem,
  AvailableCellListType,
  GameField,
  GameState,
  PlayerListType,
  CellType,
  AvailableCellType,
  PlayGridMode,
} from "../../business/types";

import { config } from "../../business/initialState";
/* import { PLAY_GRID_MODE } from "../../shared/config/devConfig"; */

type WallType = {
  barrierItem?: BarrierItem;
  //TODO: поправить тип?
  highlightningList: (MoveDirection | null)[] | null;
  onClick: Function;
  mode: PlayGridMode;
};

type BarrierCoord = {
  orderIndex: string;
};

const CommonWall = styled.div<WallType>`
  pointer-events: ${(props) => {
    if (
      props.barrierItem &&
      props.barrierItem.name !== "wall" &&
      props.barrierItem.isOpen
    ) {
      const needHighlightning = props.highlightningList?.find((item) => {
        return item === "bottom" || "left";
      });
      if (needHighlightning) {
        return "defaulr";
      } else {
        return "none";
      }
    } else {
      return "none";
    }
  }};

  cursor: ${(props) => {
    switch (props.barrierItem?.name) {
      case "wall": {
        return "default";
      }
      case "door": {
        return "pointer";
      }
      case "window": {
        return "pointer";
      }
      default:
        return "default";
    }
  }};

  &:before {
    content: "";
    position: absolute;
    width: 50px;
    height: 50px;
    bottom: 0px;
    z-index: 5;
  }
`;

const WallImage = styled(CommonWall)<WallType>`
  /*   cursor: default; */

  transform: ${(props) => {
    switch (props.barrierItem?.direction) {
      case "left": {
        return "rotate(90deg)";
      }
      default: {
        return "null";
      }
    }
  }};

  &:before {
    bottom: ${(props) => {
      switch (props.barrierItem?.direction) {
        case "bottom": {
          return "-30px";
        }
        case "left": {
          return "-55px";
        }
        default: {
          return "null";
        }
      }
    }};

    left: ${(props) => {
      switch (props.barrierItem?.direction) {
        case "left": {
          return "-25px";
        }
        default: {
          return "null";
        }
      }
    }};

    background-size: 44px;
    background-image: ${(props) => {
      switch (
        props.barrierItem &&
        props.barrierItem.name !== "wall" &&
        props.barrierItem.isOpen
      ) {
        case true: {
          switch (props.barrierItem?.name) {
            case "door": {
              return `url(${door})`;
            }
            case "window": {
              return `url(${window})`;
            }
            default: {
              return "unset";
            }
          }
        }
        case false: {
          switch (props.barrierItem?.name) {
            case "door": {
              return `url(${closedDoor})`;
            }
            case "window": {
              return `url(${closedWindow})`;
            }
            default: {
              return "unset";
            }
          }
        }
      }
    }};
  }

  &:after {
    content: "";
    z-index: 5;
    position: absolute;
    width: 50px;
    height: 50px;
    z-index: 5;

    top: ${(props) => {
      if (props.barrierItem?.direction === "left") {
        return "14px";
      }
    }};

    width: ${(props) => {
      if (props.barrierItem?.direction === "left") {
        return "50px";
      }
    }};

    height: ${(props) => {
      if (
        props.barrierItem?.direction === "bottom" ||
        props.barrierItem?.direction === "left"
      ) {
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
        return "-25px";
      }
    }};

    background-color: ${(props) => {
      if (
        props.barrierItem &&
        props.barrierItem.name !== "wall" &&
        props.barrierItem.isOpen
      ) {
        const needHighlightning = props.highlightningList?.find((item) => {
          return item === "bottom" || "left";
        });
        if (needHighlightning) {
          return "#79fe2f42";
        } else {
          return "none";
        }
      }
    }};
  }
`;

const Wall = styled(CommonWall)<WallType>`
  &:before {
    pointer-events: none;
    height: ${(props) => {
      if (props.barrierItem?.direction === "bottom") {
        if (
          props.barrierItem &&
          props.barrierItem.name !== "wall" &&
          props.barrierItem.isOpen === false
        ) {
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
        if (
          props.barrierItem &&
          props.barrierItem.name !== "wall" &&
          props.barrierItem.isOpen === false
        ) {
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
      if (
        (props.barrierItem && props.barrierItem.name === "wall") ||
        (props.barrierItem && props.barrierItem.isOpen)
      ) {
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
    z-index: 5;

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
      if (
        props.barrierItem &&
        props.barrierItem.name !== "wall" &&
        props.barrierItem.isOpen
      ) {
        const needHighlightning = props.highlightningList?.find((item) => {
          return item === "bottom" || "left";
        });
        if (needHighlightning) {
          return "#79fe2f42";
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

  const { gameField, playerList, activePlayerNumber, gameState } = state;

  const orderIndex = props.orderIndex;
  const cellValues = gameField.values[orderIndex];
  const currPlayerCoord = playerList[activePlayerNumber].coord;

  const neighboringCellList = getNeighboringCellList(
    currPlayerCoord,
    gameField
  );

  const neighboringCellListCoord = neighboringCellList.map((cellItem) => {
    return cellItem.coord;
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
    activePlayerNumber
  );

  switch (cellValues.name) {
    case "commonCell": {
      const barrierList = cellValues.barrierList?.map((barrier) => {
        switch (config.PLAY_GRID_MODE) {
          case "cssStyle": {
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
                mode={config.PLAY_GRID_MODE}
                onClick={() => {
                  const canCloseHole = highlightningList.find((cellType) => {
                    return (
                      cellType?.coord === orderIndex &&
                      cellType?.direction === barrier.direction &&
                      barrier.name !== "wall" &&
                      barrier.isOpen === true
                    );
                  })
                    ? true
                    : false;
                  if (canCloseHole) {
                    dispatch({
                      type: "req-fillHole",
                      payload: {
                        coord: orderIndex,
                        direction: barrier.direction,
                      },
                    });
                  } else {
                    return null;
                  }
                }}
              >
                {" "}
              </Wall>
            );
          }
          case "image": {
            return (
              <WallImage
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
                mode={config.PLAY_GRID_MODE}
                onClick={() => {
                  const canCloseHole = highlightningList.find((cellType) => {
                    return (
                      cellType?.coord === orderIndex &&
                      cellType?.direction === barrier.direction &&
                      barrier.name !== "wall" &&
                      barrier.isOpen === true
                    );
                  })
                    ? true
                    : false;
                  if (canCloseHole) {
                    dispatch({
                      type: "req-fillHole",
                      payload: {
                        coord: orderIndex,
                        direction: barrier.direction,
                      },
                    });
                  } else {
                    return null;
                  }
                }}
              >
                {" "}
              </WallImage>
            );
          }
          default: {
            return null;
          }
        }
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
      const { direction } = cellItem;
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
      const typeOfSelectedCard = cardItemList.cardSelected;
      /*  const typeOfSelectedCard = selectedCard?.name; */
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
