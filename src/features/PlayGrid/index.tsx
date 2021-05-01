import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";

import styled from "styled-components";

import { FINISH_COORD } from "../../shared/config";
import { State } from "../../business/types";

import { getFilledPlayGrid } from "./getFilledPlayGrid";

type GridProps = {
  vert: number;
  type: "visible" | "hidden";
};
type ContextMenuType = {
  coordX: number;
  coordY: number;
};

type ContextMenuType = {
  type: "visible" | "hidden";
};

type WrapType = {};

const GridItem = styled.div<GridProps>`
  outline: 2px solid lightgray;
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
`;

const ContextMenu = styled.div<ContextMenuType>`
  display: flex;
  position: absolute;
  width: 150px;
  height: 40px;
  background-color: #ffffff;
  /*  border: 1px solid gray; */
  top: ${(props) => `${props.coordY - 50}px`};
  left: ${(props) => `${props.coordX - 150}px`};
`;

const Button = styled.button`
  margin: auto;
  height: 30px;
  width: 70px;
  opacity: 1;
  /*   box-shadow: inset 0 -3px 0 #736357; */
`;

export const PlayGrid = () => {
  const state = useSelector((state: State) => ({
    ...state,
  }));

  const { gameField, playerList, enemyList, numberOfPlayer, gameState } = state;

  const { vert: maxVert } = FINISH_COORD;
  const height = maxVert + 1;
  const needContextMenu = state.gameState.type === "gameStarted.getContextMenu";

  const coordX = state.cursor?.x ? state.cursor?.x : 0;
  const coordY = state.cursor?.y ? state.cursor?.y : 0;
  switch (needContextMenu) {
    case false: {
      const playerGrid = (
        <GridItem vert={height}>
          {getFilledPlayGrid(gameField, playerList, enemyList, numberOfPlayer)}
        </GridItem>
      );
      return playerGrid;
    }
    case true: {
      const playerGrid = (
        <>
          <GridItem vert={height}>
            {getFilledPlayGrid(
              gameField,
              playerList,
              enemyList,
              numberOfPlayer
            )}
          </GridItem>
          <ContextMenu coordX={coordX} coordY={coordY}>
            <Button
              onClick={() => {
                console.log("передать");
              }}
            >
              передать
            </Button>
            <Button
              onClick={() => {
                console.log("лечить");
              }}
            >
              лечить
            </Button>
          </ContextMenu>
        </>
      );
      return playerGrid;
    }
  }
};
