import React from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import Man from "./Man";

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



function getArray(hor, vert, maxHor, maxVert) {
  return new Array(maxVert + 1)
    .fill(0)
    .map((itemHor, indexVer) =>
      new Array(maxHor + 1).fill({}).map((itemVer, indexHor) => {
        if (indexVer === vert && indexHor === hor) {
          return (
            <Cell hor={indexHor} vert={indexVer} key={`${indexHor}${indexVer}`}>
              {`${indexHor}${indexVer}`}
              <Man />
            </Cell>
          );
        } else {
          return (
            <Cell
              hor={indexHor}
              vert={indexVer}
              key={`${indexHor}${indexVer}`}
            >{`${indexHor}${indexVer}`}</Cell>
          );
        }
      })
    )
    .reverse();
}

function Grid() {
  const [hor, vert, maxHor, maxVert] = useSelector((state) => [
    state.man.hor,
    state.man.vert,
    state.endCoord.hor,
    state.endCoord.vert,
  ]);
  return (
    <GridItem vert={maxVert + 1}>
      {getArray(hor, vert, maxHor, maxVert)}
    </GridItem>
  );
}

export default Grid;
