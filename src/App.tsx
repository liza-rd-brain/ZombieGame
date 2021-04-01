import { useEffect, useMemo } from "react";
import { Provider, useDispatch, useSelector } from "react-redux";

import styled from "styled-components";

import { PlayGrid, MoveControls, Dice } from "./features";
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

const Status = styled.div`
  border: 1px dotted red;
  color: red;
  width: 200px;
  min-height: 18px;
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
  const textPhase = () => {
    switch (gameState.type) {
      case "gameStarted.trownDice":
        return "бросить кубик";
      case "gameStarted.clickArrow":
        return "сделать ход";
      case "gameStarted.takeHealthCard":
        return "открываем карточку";
      case "gameStarted.interactEnemyCard":
        switch (doEffect?.type) {
          case "!needOpenEnemyCard": {
            return "открываем карточку";
          }
          case "!needThrowBattleDice": {
            return "pежим боя: бросить кубик";
          }
          case "!needGetBattleResult": {
            switch (dice) {
              case 1:
              case 2: {
                return `выпало ${dice}: игрок спасается бегством `;
              }
              case 3: {
                return `выпало ${dice}: игрок теряет 1 здоровье`;
              }
              case 4: {
                return `выпало ${dice}: враг побежден`;
              }
              default:
                return " ";
            }
          }
          default:
            return " ";
        }

      case "endGame":
        return gameResult;
      default:
        return " ";
    }
  };

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

  const getPlayersHealthList = () => {
    const playerArray = Object.entries(playersList);
    const healthArray = playerArray.map((player) => {
      const [, playerValue] = player;
      return playerValue.health;
    });

    return healthArray.toString();
  };

  const getPlayerListCoord = () => {
    const playerArray = Object.entries(playersList);
    const coordArray = playerArray.map((player) => {
      const [, playerValue] = player;
      return playerValue.coord;
    });

    return coordArray.toString();
  };

  const playersHealth = playersList[numberOfPlayer].health;
  const playersCoord = playersList[numberOfPlayer].coord;

  const playersHealthList = useMemo(() => getPlayersHealthList(), [
    playersHealth,
    getPlayersHealthList,
  ]);

  const playersCoordList = useMemo(() => getPlayerListCoord(), [
    playersCoord,
    getPlayerListCoord,
  ]);

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
              <Status>{textPhase()}</Status>
              <Status>{`здоровье: ${playersHealthList}`}</Status>
              <Status>{`координаты: ${playersCoordList}`}</Status>

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
