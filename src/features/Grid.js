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

const width = 10;
const height = 10;

function getArray(hor, vert) {
  return new Array(height)
    .fill(0)
    .map((itemHor, indexVer) =>
      new Array(width).fill({}).map((itemVer, indexHor) => {
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
  const [hor, vert] = useSelector((state) => [state.man.hor, state.man.vert]);
  return <GridItem vert={width}>{getArray(hor, vert)}</GridItem>;
}

export default Grid;
