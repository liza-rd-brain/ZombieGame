import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

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
  coord?: { x?: number; y?: number };
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
  left: ${(props) => {
    if (props.coord?.x) {
      return `${props.coord?.x + 50}px`;
    } else {
      return "0px";
    }
  }};
  top: ${(props) => {
    return `${props.coord?.y}px`;
  }};
`;

const Button = styled.button`
  height: 30px;
  width: 70px;
`;

export const PlayGrid = () => {
  const dispatch = useDispatch();
  const state = useSelector((state: State) => ({
    ...state,
  }));

  type contextMenuType = {
    type: "visible" | "hidden";
    playerNumber?: Number;
    coord?: { x?: number; y?: number };
  };

  const initialContextMenuState: contextMenuType = { type: "hidden" };

  const [contextMenuState, updatecontextMenuState] = useState(
    initialContextMenuState
  );

  const { gameField, playerList, enemyList, numberOfPlayer } = state;

  const { vert: maxVert } = FINISH_COORD;
  const height = maxVert + 1;
  const playerEl = document.getElementById(`player${numberOfPlayer}`);
  const playerCoord = {
    x: playerEl?.getBoundingClientRect().x,
    y: playerEl?.getBoundingClientRect().y,
  };

  const getContextMenu = (numberOfPlayer: number) => {
    updatecontextMenuState({
      type: "visible",
      playerNumber: numberOfPlayer,
      coord: playerCoord,
    });

    console.log("координаты", playerEl?.getBoundingClientRect());
  };

  useEffect(() => {
    switch (contextMenuState.type) {
      case "visible": {
        const bodyElement = document.querySelector("body");

        const callback = (e: MouseEvent) => {
          /**
           * Its for avoiding event on currentPlayer
           */
          if (
            e.target ===
            document.getElementById(`player${state.numberOfPlayer}`)
          ) {
            e.stopPropagation();
          }

          updatecontextMenuState((prevState) => {
            return { ...prevState, type: "hidden" };
          });

          bodyElement?.removeEventListener("click", callback, {
            capture: true,
          });
        };

        bodyElement?.addEventListener("click", callback, {
          capture: true,
        });

        return () => {
          bodyElement?.removeEventListener("click", callback, {
            capture: true,
          });
        };
      }

      default:
        break;
    }
  }, [contextMenuState.type]);

  return (
    <>
      <GridItem vert={height} type={contextMenuState.type}>
        {getFilledPlayGrid(state, getContextMenu)}
      </GridItem>
      <ContextMenu
        type={contextMenuState.type}
        id={"contextMenu"}
        className={"contextMenu"}
        coord={contextMenuState.coord}
      >
        <Button
          className={"contextMenu"}
          onClick={() => {
            dispatch({
              type: "req-shareHealthCard",
              payload: contextMenuState.playerNumber,
            });
          }}
        >
          передать
        </Button>
        <Button
          onClick={() => {
            dispatch({
              type: "req-healPlayer",
              payload: contextMenuState.playerNumber,
            });
          }}
        >
          лечить
        </Button>
      </ContextMenu>
    </>
  );
};
