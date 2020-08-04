import React from "react";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";
import Man from "./Man";
import Health from "./Health";
import Wall from "./Wall";
import {
  State,
  EndCell,
  CoordItem,
  ObjCellType,
  ObjFieldItem,
  HealthItem,
  FinishCell,
  GameList,
} from "./../app";

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
  /*параметризирую по ширине поля*/
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

function getCell(cell: ObjCellType) {
  switch (cell.name) {
    case "field": {
      const hasHealth = cell.cardItem.healthItem != undefined;
      const hasMan = cell.cardItem.manItem != undefined;
      const hasManAndHealth = hasMan && hasHealth;

      switch (true) {
        case hasManAndHealth: {
          if (cell.cardItem.healthItem && cell.cardItem.manItem) {
            return (
              <>
                <Man />
                <Health
                  name={cell.cardItem.healthItem.name}
                  type={cell.cardItem.healthItem.type}
                  apperance={cell.cardItem.healthItem.apperance}
                />
              </>
            );
          } else return null;
        }
        case hasMan: {
          return <Man />;
        }
        case hasHealth: {
          if (cell.cardItem.healthItem) {
            return (
              <Health
                name={cell.cardItem.healthItem.name}
                type={cell.cardItem.healthItem.type}
                apperance={cell.cardItem.healthItem.apperance}
              />
            );
          } else return null;
        }
      }
    }
    case "finish": {
      switch (true) {
        case cell.cardItem.manItem != undefined: {
          return <Man />;
        }
        default: {
          return null;
        }
      }
    }
  }
}

function getFullArrayMap(gameList: GameList) {
  const gridArray = Array.from(gameList);

  return gridArray.map((cell: [string, ObjCellType]) => {
    const index = cell[0];
    const objItem = cell[1];
    const hor = parseInt(index.split(".")[0]);
    const vert = parseInt(index.split(".")[1]);
    switch (objItem.name) {
      case "field": {
        return (
          <CellItem key={`${hor}${vert}`}>
            {getCell(objItem)}
            {hor}
            {vert}
          </CellItem>
        );
      }
      case "finish": {
        return (
          <CellItem key={`${hor}${vert}`}>
            {getCell(objItem)}
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
  return 0;
}

function Grid() {
  const [maxHor, maxVert, GameList] = useSelector((state: State) => [
    EndCell.hor,
    EndCell.vert,
    state.GameList,
  ]);

  const width = maxHor + 1;
  const height = maxVert + 1;

  return <GridItem vert={height}>{getFullArrayMap(GameList)}</GridItem>;
}

export default Grid;
