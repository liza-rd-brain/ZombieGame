import React from "react";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";
import Man from "./Man";
import Health from "./Health";
import Wall from "./Wall";
import {
  State,
  StartCell,
  EndCell,
  GameList,
  CellType,
  ManItem,
  HealthItem,
  WallItem,
  CoordItem,
  FieldItem,
  CardInteract,
} from "./../app";

type GridProps = {
  vert: number;
};

const GridItem = styled.div<GridProps>`
  border: 2px solid red;
  margin: 0 auto;
  width: 100%;

  display: grid;
  grid-column-start: -1;
  /*параметризирую по ширине поля*/
  grid-template-columns: ${(props) => {
    return `repeat(${props.vert} ,30px)`;
  }};

  grid-gap: 0px;
`;

const CellItem = styled.div<CoordItem>`
  position: relative;
  border: 1px solid #000;
  box-sizing: content-box;
  width: 30px;
  height: 30px;
  color: lightgrey;
`;

/* function Cell(props: any) {
  return <CellItem hor={props.hor} vert={props.vert}></CellItem>;
} */

function getCell(cell: FieldItem) {
  return cell.cardItem.map((item: CardInteract) => {
    switch (item.name) {
      case "man":
        return <Man />;
      case "health":
        return (
          <Health name="health" type={item.type} apperance={item.apperance} />
        );
      default:
        return null;
    }
  });
}

function getFullArray(gameList: GameList) {
  return gameList.map((item: CellType[]) => {
    return item.map((cell: CellType) => {
      switch (cell.name) {
        case "field": {
          return (
            <CellItem
              key={`${cell.hor}${cell.vert}`}
              hor={cell.hor}
              vert={cell.vert}
            >
              {getCell(cell)}
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
            ></CellItem>
          );
      }
    });
  });
}

function Grid() {
  const [maxHor, maxVert, gameList] = useSelector((state: State) => [
    EndCell.hor,
    EndCell.vert,
    state.gameList,
  ]);

  const width = maxHor + 1;
  const height = maxVert + 1;

  return <GridItem vert={width}>{getFullArray(gameList)}</GridItem>;
}

export default Grid;
