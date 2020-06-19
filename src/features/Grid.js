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

const CellItem = styled.div`
  position: relative;
  border: 1px solid #000;
  box-sizing: content-box;
  width: 30px;
  height: 30px;
  color: lightgrey;
`;

function Cell(props) {
  const hasMan = props.manHor === props.hor && props.manVert === props.vert;
  const health = props.healthList.find((item, index) => {
    return item.hor === props.hor && item.vert === props.vert;
  });
  const hasHealth = health ? true : false;
  const hasManAndHealth = hasHealth && hasMan;
  switch (true) {
    case hasManAndHealth: {
      return (
        <CellItem>
          <Man hor={props.manHor} vert={props.manVert} />
          <Health
            hor={health.hor}
            vert={health.vert}
            type={health.type}
            apperance={health.apperance}
          />
        </CellItem>
      );
    }
    case hasMan: {
      return (
        <CellItem>
          <Man hor={props.manHor} vert={props.manVert} />
        </CellItem>
      );
    }
    case hasHealth: {
      return (
        <CellItem>
          <Health
            hor={health.hor}
            vert={health.vert}
            type={health.type}
            apperance={health.apperance}
          />
        </CellItem>
      );
    }

    default: {
      return <CellItem />;
    }
  }
}
function getArray(manHor, manVert, width, height, healthList) {
  return new Array(height)
    .fill(0)
    .map((itemVert, indexVert) =>
      new Array(width).fill({}).map((itemHor, indexHor) => {
        return (
          <Cell
            hor={indexHor}
            vert={indexVert}
            key={`${indexHor}${indexVert}`}
            manHor={manHor}
            manVert={manVert}
            healthList={healthList}
          >
            {`${indexHor}${indexVert}`}
          </Cell>
        );
      })
    )
    .reverse();
}

function Grid(props) {
  const [
    manHor,
    manVert,
    maxHor,
    maxVert,
    healthList,
  ] = useSelector((state) => [
    state.manCoord.hor,
    state.manCoord.vert,
    state.endCoord.hor,
    state.endCoord.vert,
    state.healthList,
  ]);

  const width = maxHor + 1;
  const height = maxVert + 1;

  return (
    <GridItem vert={width}>
      {getArray(manHor, manVert, width, height, healthList)}
    </GridItem>
  );
}

export default Grid;
