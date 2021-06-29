import { Provider, useSelector } from "react-redux";

import styled from "styled-components";
import "./index.css";
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
import {
  useOpenCard,
  useEndScreen,
  usePlayerMove,
  useInteractWithEnemy,
} from "./business/effects";
import { PlayerStatus } from "./features/PlayerStatus";

const Field = styled.div`
  margin: 0 auto;
`;

const Game = styled.div`
  width: 900px;
  margin: 40px auto;
  display: flex;
  justify-content: center;

  cursor: default;
  & > * {
  }
`;

const RightPanel = styled.div`
  width: 300px;
  height: 600px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  flex-grow: 0;
  align-items: start;
  margin: 0 30px;
  padding: 50px 0;
  box-sizing: border-box;
  & > * {
  }
`;

const LeftPanel = styled.div`
  display: flex;
  align-self: start;
  background-color: white;
  height: 100px;
  margin: 0 30px;
  border-radius: 5px;
  padding: 5px 0;
`;

const GameControls = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  padding: 0 15px;
  box-sizing: border-box;
`;

export function GetApp() {
  const { gameState } = useSelector((state: State) => ({ ...state }));

  useOpenCard();
  usePlayerMove();
  useEndScreen();
  useInteractWithEnemy();

  const getGameScreen = () => {
    switch (gameState.type) {
      case "waitingStart":
        return <StartScreen />;

      case "getEndScreen":
        return <EndScreen />;

      default:
        return (
          <>
            <LeftPanel>
              <PlayersStatusList />
            </LeftPanel>
            <Field id="field">
              <PlayGrid />
            </Field>
            <RightPanel>
              <StatusList />
              <GameControls>
                <Dice />
                <MoveControls />
              </GameControls>
              {/*   <PlayerStatus /> */}
            </RightPanel>
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
