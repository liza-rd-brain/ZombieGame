import { useEffect, useMemo } from "react";
import { Provider, useDispatch, useSelector } from "react-redux";

import styled from "styled-components";

import { PlayGrid, MoveControls, Dice, StatusList } from "./features";
import { StartScreen, EndScreen } from "./pages";
import { State } from "./business/types";
import { store } from "./business/store";
import { useOpenCard } from "./business/effects";
const Field = styled.div`
  position: relative;
  width: 300px;
  margin: 0 auto;
`;

const Game = styled.div`
  width: 600px;
  margin: 0 auto;
  display: flex;
  justify-content: center;
`;

const LeftPanel = styled.div`
  width: 200px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  flex-grow: 0;
`;


export function GetApp() {
  const {
    gameState,
    gameResult,
    playersList,
    numberOfPlayer,
    dice,
    doEffect,
  } = useSelector((state: State) => ({ ...state }));

  const dispatch = useDispatch();

  //TODO: вынести отдельный модуль режима боя-?!


  useOpenCard();

  useEffect(
    function getEndScreen() {
      switch (gameState.type) {
        case "endGame":
          const timer = setTimeout(
            () => dispatch({ type: "getEndScreen" }),
            1000
          );

          return () => clearTimeout(timer);

        default:
          break;
      }
    },
    [gameState.type, dispatch]
  );

 

  const getGameScreen = () => {
    switch (gameState.type) {
      case "waitingStart":
        return <StartScreen />;

      case "getEndScreen":
        return <EndScreen />;

      default:
        return (
          <>
            <Field>
              <PlayGrid />
            </Field>
            <LeftPanel>
              <StatusList />
       

              <Dice />
              <MoveControls />
            </LeftPanel>
          </>
        );
    }
  };

  return <Game>{getGameScreen()}</Game>;
}

export const App = () => {
  return (
    <Provider store={store}>
      <GetApp />
    </Provider>
  );
};
