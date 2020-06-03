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

function getArray(manHor, manVert, width, height, healthList) {
  return new Array(height)
    .fill(0)
    .map((itemVert, indexVert) =>
      new Array(width).fill({}).map((itemHor, indexHor) => {
        return (
          <Cell hor={indexHor} vert={indexVert} key={`${indexHor}${indexVert}`}>
            {`${indexHor}${indexVert}`}
            <Man hor={indexHor} vert={indexVert} />
            <Health hor={indexHor} vert={indexVert} />
          </Cell>
        );
      })
    )
    .reverse();
}

function Grid() {
  const [
    manHor,
    manVert,
    maxHor,
    maxVert,
    healthList,
  ] = useSelector((state) => [
    state.man.hor,
    state.man.vert,
    state.endCoord.hor,
    state.endCoord.vert,
    state.healthList,
  ]);

  const width = maxHor + 1;
  const height = maxVert + 1;

  console.log(getArray(manHor, manVert, width, height, healthList));

  return (
    <GridItem vert={width}>
      {getArray(manHor, manVert, width, height, healthList)}
    </GridItem>
  );
}

export default Grid;
