import { useSelector } from "react-redux";
import styled from "styled-components";

import { FINISH_COORD } from "../../shared/config";
import { State, PlayGridMode } from "../../business/types";
import { getFilledPlayGrid } from "./getFilledPlayGrid";
import { PLAY_GRID_MODE } from "../../shared/config";

import img from "./house_2.png";

type GridProps = {
  vert: number;
  mode: PlayGridMode;
};

const GridItem = styled.div<GridProps>`
  outline: ${(props) => {
    if (props.mode === "cssStyle") {
      return "2px solid lightgray";
    }
  }};

  margin: 0 auto;
  width: 100%;
  transform: rotate(270deg);
  display: grid;
  grid-column-start: -1;
  //параметризирую по ширине поля
  grid-template-columns: ${(props) => {
    return `repeat(${props.vert} ,50px)`;
  }};

  grid-gap: 0px;
  > * {
    transform: rotate(90deg);
  }

  background-image: ${(props) => {
    if (props.mode === "image") {
      return `url(${img})`;
    }
  }};

  background-color: white;
  background-size: 600px;
  box-shadow: 0 0 10px rgb(0 0 0 / 50%);
`;

export const PlayGrid = () => {
  const state = useSelector((state: State) => ({
    ...state,
  }));

  const { vert: maxVert } = FINISH_COORD;
  const height = maxVert + 1;

  return (
    <GridItem key={"grid"} vert={height} mode={PLAY_GRID_MODE}>
      {getFilledPlayGrid(state)}
    </GridItem>
  );
};
