import { useSelector } from "react-redux";

import styled from "styled-components";

import { FINISH_COORD } from "../../shared/config";
import { State } from "../../business/types";
import { getFilledPlayGrid } from "./getFilledPlayGrid";

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
  //параметризирую по ширине поля
  grid-template-columns: ${(props) => {
    return `repeat(${props.vert} ,30px)`;
  }};

  grid-gap: 0px;
  > * {
    transform: rotate(90deg);
  }
`;

export const PlayGrid = () => {
  const { gameField, playersList, enemiesList } = useSelector(
    (state: State) => ({
      ...state,
    })
  );
  const { vert: maxVert } = FINISH_COORD;
  const height = maxVert + 1;
  const playerGrid = (
    <GridItem vert={height}>
      {getFilledPlayGrid(gameField, playersList, enemiesList)}
    </GridItem>
  );
  return playerGrid;
};
