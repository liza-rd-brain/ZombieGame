import styled from "styled-components";

import {
  GameField,
  PlayerListType,
  EnemyListType,
} from "../../business/types";

import { Wall } from "../../components";
import { getCards } from "./getCards";
import { getPlayersList } from "./getPlayersList";
import { getEnemyList } from "./getEnemyList";

const CellItem = styled.div`
  position: relative;
  border: 1px solid #000;
  box-sizing: content-box;
  width: 30px;
  height: 30px;
  color: lightgrey;
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
      case "wall": {
        return (
          <CellItem key={`${hor}${vert}`}>
            <Wall></Wall>
          </CellItem>
        );
      }
      case "start" || "finish": {
        return (
          <CellItem key={`${hor}${vert}`}>
            {getCards(cellValues)}
            {getPlayersList(orderIndex, playersList)}
            {hor}
            {vert}
          </CellItem>
        );
      }
      default: {
        return (
          <CellItem key={`${hor}${vert}`}>
            {getCards(cellValues)}
            {getPlayersList(orderIndex, playersList)}
            {getEnemyList(orderIndex, enemyList)}

            {hor}
            {vert}
          </CellItem>
        );
      }
    }
  });

  return fullPlayerGrid;
};
