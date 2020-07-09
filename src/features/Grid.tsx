import React from "react";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";
import Man from "./Man";
import Health from "./Health";
import Wall from "./Wall";
import { State, HealthItem } from "./../app";

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

const CellItem = styled.div`
  position: relative;
  border: 1px solid #000;
  box-sizing: content-box;
  width: 30px;
  height: 30px;
  color: lightgrey;
`;

type CellItem = {
  hor: number;
  vert: number;
  man?: boolean;
  wall?: boolean;
  health?: any;
};

function getFullArray(gameList: Array<any>) {
  return gameList.map((item: any) => {
    return item.map((item: any) => {
      const hasMan = /* item && */ item.man ? true : false;
      const hasHealth = item.health ? true : false;
      const hasWall = item.wall ? true : false;

      const hasManAndHealth = hasMan && hasHealth;
      switch (true) {
        case hasManAndHealth: {
          return (
            <CellItem>
              <Man hor={item.hor} vert={item.vert} />
              <Health
                hor={item.hor}
                vert={item.vert}
                type={item.health.type}
                apperance={item.health.apperance}
              />
            </CellItem>
          );
        }
        case hasMan: {
          return (
            <CellItem key={`${item.hor}${item.vert}`}>
              {`${item.hor}${item.vert}`}
              <Man hor={item.hor} vert={item.vert} />
            </CellItem>
          );
        }
        case hasHealth: {
          return (
            <CellItem>
              <Health
                key={`${item.hor}${item.vert}`}
                hor={item.hor}
                vert={item.vert}
                type={item.health.type}
                apperance={item.health.apperance}
              />
            </CellItem>
          );
        }
        case hasWall: {
          return (
            <CellItem key={`${item.hor}${item.vert}`}>
              <Wall hor={item.hor} vert={item.vert}></Wall>
            </CellItem>
          );
        }
        /*  case !hasMan: {
          return (
            <CellItem
              key={`${item.hor}${item.vert}`}
            >{`${item.hor}${item.vert}`}</CellItem>
          );
        } */
        default:
          return (
            <CellItem
              key={`${item.hor}${item.vert}`}
            >{`${item.hor}${item.vert}`}</CellItem>
          );
      }
    });
  });
}

function Grid() {
  const [
 /*    manHor,
    manVert, */
    maxHor,
    maxVert,
   /*  healthList, */
    gameList,
  ] = useSelector((state: State) => [
   /*  state.manCoord.hor,
    state.manCoord.vert, */
    state.endCoord.hor,
    state.endCoord.vert,
/*     state.healthList, */
    state.gameList,
  ]);

  const width = maxHor + 1;
  const height = maxVert + 1;

  console.log(gameList);

  return <GridItem vert={width}>{getFullArray(gameList)}</GridItem>;
}

export default Grid;
