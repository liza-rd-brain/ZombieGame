import styled from "styled-components";

import {
  GameField,
  PlayerListType,
  EnemyListType,
  CommonCell,
  CellType,
} from "../../business/types";

import { getCards } from "./getCards";
import { getPlayersList } from "./getPlayersList";
import { getEnemyList } from "./getEnemyList";

const CellItem = styled.div<CellType>`
  position: relative;
  border: 1px solid #bfb1b1;
  box-sizing: content-box;
  width: 30px;
  height: 30px;
  color: lightgrey;
  background-color: ${(props) => {
    if (props.availableForTake) {
      return "pink";
    }
  }};
`;

// TODO: Take out style variable-?!
const CellItemWall = styled.div<CommonCell>`
  position: absolute;
  box-sizing: content-box;
  width: 30px;
  height: 30px;
  color: lightgrey;
  border-top: ${(props) => {
    if (props.surfaceItem) {
      switch (props.surfaceItem.top) {
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
    if (props.surfaceItem) {
      switch (props.surfaceItem.bottom) {
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
    if (props.surfaceItem) {
      switch (props.surfaceItem.left) {
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
    if (props.surfaceItem) {
      switch (props.surfaceItem.right) {
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

//TODO:как типизировать возврат jsx
export const getFilledPlayGrid = (
  gameField: GameField,
  playersList: PlayerListType,
  enemyList: EnemyListType
) => {
  const orderGameCells = gameField.order;

  const fullPlayerGrid = orderGameCells.map((orderIndex: string) => {
    const cellValues = gameField.values[orderIndex];
    const [hor, vert] = orderIndex.split(".");

    switch (cellValues.name) {
      case "start":
      case "finish": {
        return (
          <CellItem key={`${hor}${vert}`} {...cellValues}>
            {getCards(cellValues)}
            {getPlayersList(orderIndex, playersList)}
            {hor}
            {vert}
          </CellItem>
        );
      }
      case "commonCell": {
        // TODO:  Pass props for walls
        return (
          <CellItem key={`${hor}${vert}`} {...cellValues}>
            <CellItemWall key={`${hor}${vert}`} {...cellValues}>
              {getCards(cellValues)}
              {getPlayersList(orderIndex, playersList)}
              {getEnemyList(orderIndex, enemyList)}

              {hor}
              {vert}
            </CellItemWall>
          </CellItem>
        );
      }
      default: {
        return null;
      }
    }
  });

  return fullPlayerGrid;
};
