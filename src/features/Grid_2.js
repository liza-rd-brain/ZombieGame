import React from "react";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";
import Man from "./Man";
import Health from "./Health";

const GridItem = styled.div`
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

const Cell = styled.div`
  position: relative;
  border: 1px solid #000;
  box-sizing: content-box;
  width: 30px;
  height: 30px;
  color: lightgrey;
`;

/* 
function checkHealthCard(indexHor, indexVert, healthCoord) {
  return healthCoord.map((item, index) => {
    return item.hor === indexHor && item.vert === indexVert ? true : false;
  })[0];
}
 */

function getGridArray(manHor, manVert, width, height, healthCoord) {
  const dispatch = useDispatch();

  const arrayGrid = new Array(height).fill(0).map((item, indexVert) =>
    new Array(width).fill({}).map((itemHor, indexHor) => {
      /*проверить нет ли человека в клетке*/

      return {
        coord: { hor: indexHor, vert: indexVert },
        man: indexVert === manVert && indexHor === manHor ? true : false,
        health: healthCoord
          .map((item, index) => {
            return item.hor === indexHor && item.vert === indexVert
              ? true
              : false;
          })
          .filter((item) => item === true)[0],
      };
    })
  );

  return arrayGrid
    .map((row) => {
      return row.map((cell) => {
        if (cell.health && cell.man) {
          dispatch({
            type: "incHealth",
            payload: { hor: cell.coord.hor, vert: cell.coord.vert },
          });

          /*  return (
            <Cell
              hor={cell.coord.hor}
              vert={cell.coord.vert}
              key={`${cell.coord.hor}${cell.coord.vert}`}
            >
              <Health hor={cell.coord.hor} vert={cell.coord.vert} />
              <Man health={cell.health} />
            </Cell>
          ); */
        } else if (cell.health) {
          return (
            <Cell
              hor={cell.coord.hor}
              vert={cell.coord.vert}
              key={`${cell.coord.hor}${cell.coord.vert}`}
            >
              <Health hor={cell.coord.hor} vert={cell.coord.vert} />
            </Cell>
          );
        } else if (cell.man) {
          return (
            <Cell
              hor={cell.coord.hor}
              vert={cell.coord.vert}
              key={`${cell.coord.hor}${cell.coord.vert}`}
            >
              {`${cell.coord.hor}${cell.coord.vert}`}

              <Man />
            </Cell>
          );
        } else {
          return (
            <Cell
              hor={cell.coord.hor}
              vert={cell.coord.vert}
              key={`${cell.coord.hor}${cell.coord.vert}`}
            >
              {`${cell.coord.hor}${cell.coord.vert}`}
            </Cell>
          );
        }
      });
    })
    .reverse();
}

function Grid() {
  const [
    manHor,
    manVert,
    maxHor,
    maxVert,
    healthCoord,
  ] = useSelector((state) => [
    state.man.hor,
    state.man.vert,
    state.endCoord.hor,
    state.endCoord.vert,
    state.healthCoord,
  ]);

  const width = maxHor + 1;
  const height = maxVert + 1;

  console.log(getArray(manHor, manVert, width, height, healthCoord));

  return (
    <GridItem vert={width}>
      {getArray(manHor, manVert, width, height, healthCoord)}
    </GridItem>
  );
}

export default Grid;
