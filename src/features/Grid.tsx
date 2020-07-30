import React from "react";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";
import Man from "./Man";
import Health from "./Health";
import Wall from "./Wall";
import {
  State,
  EndCell,
  GameList,
  CellType,
  CoordItem,
  FieldItem,
  CardInteract,
  ObjGameList,
  ObjCellType,
  ObjFieldItem,
  HealthItem,
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

const CellItem = styled.div<CoordItem>`
  position: relative;
  border: 1px solid #000;
  box-sizing: content-box;
  width: 30px;
  height: 30px;
  color: lightgrey;
`;

function getCell(cell: ObjFieldItem) {
  switch (true) {
    case cell.cardItem.manItem != undefined: {
      return <Man />;
    }
    case cell.cardItem.hasOwnProperty("healthItem") &&
      cell.cardItem.healthItem != undefined: {
      /*Промежуточное решение */
      const health: HealthItem = cell.cardItem.healthItem as HealthItem;
      cell.cardItem.healthItem;
      return (
        <Health
          name={health.name}
          type={health.type}
          apperance={health.apperance}
        />
      );
    }
    default:
      return null;
  }
}

function getFullArray(objGameList: ObjGameList) {
  /*из объекта сделать массив?!*/
  const gridArray = Object.values(objGameList).sort(function (prev, next) {
    /*может нужна потом сортировака и по вертикали */
    switch (true) {
      case prev.hor < next.hor: {
        return -1;
      }
      case prev.hor > next.hor: {
        return 1;
      }
      default:
        return 0;
    }
  });

  return gridArray.map((cell: ObjCellType) => {
    switch (cell.name) {
      case "field": {
        return (
          <CellItem
            key={`${cell.hor}${cell.vert}`}
            hor={cell.hor}
            vert={cell.vert}
          >
            {getCell(cell)}
            {cell.hor}
            {cell.vert}
          </CellItem>
        );
      }
      case "wall": {
        return (
          <CellItem
            key={`${cell.hor}${cell.vert}`}
            hor={cell.hor}
            vert={cell.vert}
          >
            <Wall></Wall>
          </CellItem>
        );
      }
      default:
        return (
          <CellItem
            key={`${cell.hor}${cell.vert}`}
            hor={cell.hor}
            vert={cell.vert}
          >
            {cell.hor}
            {cell.vert}
          </CellItem>
        );
    }
  });
}

function Grid() {
  const [
    maxHor,
    maxVert,
    gameList,
    objGameList,
  ] = useSelector((state: State) => [
    EndCell.hor,
    EndCell.vert,
    state.gameList,
    state.objGameList,
  ]);

  const width = maxHor + 1;
  const height = maxVert + 1;

  return <GridItem vert={height}>{getFullArray(objGameList)}</GridItem>;
}

export default Grid;
