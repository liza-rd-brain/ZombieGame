import React from "react";
import { useSelector, useDispatch } from "react-redux";

import styled from "styled-components";

import { Player, Health, Wall } from "../components";
import { CellType, GameList, GameField } from "../business/types";
import { FINISH_COORD } from "../business/initialState";
import { State } from "../business/types";

type GridProps = {
  vert: number;
};

const GridItem = styled.div<GridProps>`
  border: 2px solid red;
  margin: 0 auto;
  width: 100%;
  transform: rotate(270deg);
  display: grid;
  grid-column-start: -1;
  //параметризирую по ширине поля
  grid-template-columns: ${(props) => {
    return `repeat(${props.vert} ,30px)`;
  }};

  grid-gap: 0px;
  > * {
    transform: rotate(90deg);
  }
`;

const CellItem = styled.div`
  position: relative;
  border: 1px solid #000;
  box-sizing: content-box;
  width: 30px;
  height: 30px;
  color: lightgrey;
`;

function getCell(cell: CellType) {
  switch (cell.name) {
    case "commonCell": {
      return (
        <>
          {cell.cardItem.healthItem ? (
            <Health
              name={cell.cardItem.healthItem.name}
              type={cell.cardItem.healthItem.type}
              apperance={cell.cardItem.healthItem.apperance}
            />
          ) : null}
          {cell.cardItem.playerList ? (
            <Player list={cell.cardItem.playerList} />
          ) : null}
        </>
      );
    }

    case "start": {
      return (
        <>
          {cell.cardItem.playerList ? (
            <Player list={cell.cardItem.playerList} />
          ) : null}
        </>
      );
    }

    case "finish": {
      return (
        <>
          {cell.cardItem.playerList ? (
            <Player list={cell.cardItem.playerList} />
          ) : null}
        </>
      );
    }
  }
}

//TODO:как типизировать возврат jsx
function getFullPlayGrid(gameField: GameField) {
  const orderGameCells = gameField.order;

  const fullPlayerGrid = orderGameCells.map((orderIndex: string) => {
    const cellValues = gameField.values[orderIndex];
    const [hor, vert] = orderIndex.split(".");

    switch (cellValues.name) {
      case "commonCell": {
        return (
          <CellItem key={`${hor}${vert}`}>
            {getCell(cellValues)}
            {hor}
            {vert}
          </CellItem>
        );
      }

      case "start": {
        return (
          <CellItem key={`${hor}${vert}`}>
            {getCell(cellValues)}
            {hor}
            {vert}
          </CellItem>
        );
      }

      case "finish": {
        return (
          <CellItem key={`${hor}${vert}`}>
            {getCell(cellValues)}
            {hor}
            {vert}
          </CellItem>
        );
      }

      case "wall": {
        return (
          <CellItem key={`${hor}${vert}`}>
            <Wall></Wall>
          </CellItem>
        );
      }
    }
  });

  console.log(fullPlayerGrid);
  return fullPlayerGrid;
}

export const PlayGrid = () => {
  const { GameField } = useSelector((state: State) => ({
    ...state,
  }));
  const { hor: maxHor, vert: maxVert } = FINISH_COORD;
  const height = maxVert + 1;
  const playerGrid = (
    <GridItem vert={height}>{getFullPlayGrid(GameField)}</GridItem>
  );
  return playerGrid;
};
