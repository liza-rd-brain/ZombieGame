import { useEffect, useMemo } from "react";
import { Provider, useDispatch, useSelector } from "react-redux";

import styled from "styled-components";

import {
  PlayGrid,
  MoveControls,
  Dice,
  StatusList,
  PlayersStatusList,
} from "./features";
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
  width: 900px;
  margin: 40px auto;
  display: flex;
  justify-content: center;
  height: 100vh;
`;

const LeftPanel = styled.div`
  width: 300px;
  height: 400px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  flex-grow: 0;
  align-items: start;
  margin: 0 30px;
`;

const RightPanel = styled.div`
  display: flex;
`;

const GameControls = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
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
            <RightPanel>
              <PlayersStatusList />
            </RightPanel>
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
