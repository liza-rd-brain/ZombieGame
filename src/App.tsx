import { useEffect, useMemo } from "react";
import { Provider, useDispatch, useSelector } from "react-redux";

import styled from "styled-components";

import { PlayGrid, MoveControls, Dice, StatusList } from "./features";
import { StartScreen, EndScreen } from "./pages";
import { State } from "./business/types";
import { store } from "./business/store";
import { useOpenCard, useEndScreen, usePlayerMove } from "./business/effects";

const Field = styled.div`
  position: relative;
  /*   width: 450px; */
  margin: 0 auto;
`;

const Game = styled.div`
  width: 650px;
  margin: 0 auto;
  display: flex;
  justify-content: center;
`;

const LeftPanel = styled.div`
  width: 300px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  flex-grow: 0;
`;

const GameControls = styled.div`
  display: flex;
  width: 70%;
`;

export function GetApp() {
  const { gameState } = useSelector((state: State) => ({ ...state }));

  useOpenCard();
  usePlayerMove();
  useEndScreen();

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
              <GameControls>
                <Dice />
                <MoveControls />
              </GameControls>
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
