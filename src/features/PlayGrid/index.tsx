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
  type: "visible" | "hidden";
};

type WrapType = {};

const GridItem = styled.div<GridProps>`
  outline: 2px solid red;
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
  display: ${(props) => {
    if (props.type === "visible") {
      return "block";
    } else {
      return "none";
    }
  }};
  flex-direction: column;
  position: absolute;
  width: 100px;
  height: 100px;
  background-color: #ffffff;
  box-shadow: 0 0 10px rgb(0 0 0 / 50%);
  justify-content: start;
  padding: 21px 0 0 12px;
  box-sizing: border-box;
`;

const Wrap = styled.div<WrapType>`
  display: block;
  position: absolute;
  width: 70px;
  height: 60px;
  background-color: white;
`;

const Button = styled.button`
  height: 30px;
  width: 70px;
`;

const CloseButton = styled.button`
  width: 15px;
  height: 15px;
  padding: 0;
  outline: 1px solid black;
  border: none;
  top: 0;
  position: absolute;
  right: 0;
  line-height: 12px;

  &:hover {
    color: red;
  }
`;

type contextMenuType = {
  type: "visible" | "hidden";
  numberOfPlayer?: number;
};
export const PlayGrid = () => {
  const dispatch = useDispatch();
  const state = useSelector((state: State) => ({
    ...state,
  }));

  const initialContextMenuState: contextMenuType = { type: "hidden" };
  const [contextMenuState, updatecontextMenuState] = useState(
    initialContextMenuState
  );

  const { gameField, playerList, enemyList, numberOfPlayer } = state;

  const { vert: maxVert } = FINISH_COORD;
  const height = maxVert + 1;

  const getContextMenu = (numberOfPlayer: number) => {
    console.log("показать контекстное меню", numberOfPlayer);
    updatecontextMenuState({
      type: "visible",
      numberOfPlayer,
    });
  };

  return (
    <>
      <GridItem vert={height} type={contextMenuState.type}>
        {getFilledPlayGrid(
          gameField,
          playerList,
          enemyList,
          numberOfPlayer,
          getContextMenu
        )}
      </GridItem>
      <div id="modalMenu" />

      <ContextMenu type={contextMenuState.type}>
        <Button
          onClick={() => {
            updatecontextMenuState({
              type: "hidden",
            });
            dispatch({
              type: "req-shareHealthCard",
              payload: contextMenuState.numberOfPlayer,
            });
          }}
        >
          передать
        </Button>
        <Button
          onClick={() => {
            updatecontextMenuState({
              type: "hidden",
            });
            dispatch({
              type: "req-healPlayer",
              payload: contextMenuState.numberOfPlayer,
            });
          }}
        >
          лечить
        </Button>
        <CloseButton
          onClick={() => {
            updatecontextMenuState({
              type: "hidden",
            });
          }}
        >
          &#10006;
        </CloseButton>
      </ContextMenu>
    </>
  );
};
