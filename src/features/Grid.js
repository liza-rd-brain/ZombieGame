import React from "react";
import styled from "styled-components";

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
  border: 1px solid #000;
  box-sizing: content-box;
  width: 30px;
  height: 30px;
  color: lightgrey;
`;

const width = 10;
const height = 10;

const array = new Array(height)
  .fill(0)
  .map((itemHor, indexVer) =>
    new Array(width).fill({}).map((itemVer, indexHor) => {
      return (
        <Cell
          hor={indexHor}
          vert={indexVer}
          key={`${indexHor}${indexVer}`}
        >{`${indexHor}${indexVer}`}</Cell>
      );
    })
  )
  .reverse();

console.log(array);

array.length = height;

array.map(() => {});
const cellGrid = () => {};

function Grid() {
  return <GridItem vert={width}>{array}</GridItem>;
}

export default Grid;
