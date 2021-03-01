import React, { useEffect, useMemo, forwardRef } from "react";
import ReactDOM from "react-dom";
import { Provider, useDispatch, useSelector } from "react-redux";
import styled, { ThemeProvider } from "styled-components";

import Grid from "./features/Grid";
import Arrows from "./features/Arrows";
import Dice from "./features/Dice";
import StartScreen from "./features/StartScreen";
import EndScreen from "./features/EndScreen";

import endGame from "./business/phases/endGame";
import { reducer } from "./business/reducer";
import { State } from "./business/types";
import { GameList, CoordItem } from "./business/types";
import { store } from "./business/store";
const Field = styled.div`
  position: relative;
  width: 300px;
  margin: 0 auto;
`;

const Game = styled.div`
  width: 500px;
  margin: 0 auto;
  display: flex;
  justify-content: center;
`;

const LeftPanel = styled.div`
  width: 120px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  flex-grow: 0;
`;
const Status = styled.div`
  border: 1px dotted red;
  color: red;
  width: 150px;
  min-height: 18px;
`;



const showManListHealth = (
  gameList: GameList,
  cardInteractIndex: string[]
): (null | number)[] => {
  //мы точно знаем, что в cardInteractIndex - индексы ячеек с людьми
  const healthArray = cardInteractIndex.map((orderNumber, index) => {
    const elem = gameList.get(orderNumber);
    if (elem && elem.name != "wall" && elem.cardItem.manList) {
      const manElem = elem.cardItem.manList.find((item) => {
        return item.orderNumber === index;
      });
      return manElem ? manElem?.health : null;
    } else return null;
  });

  return healthArray;
};

function App() {
  const {
    gameState,
    gameResult,
    cardInteractIndex,
    GameList,
    doEffect,
  } = useSelector((state: State) => ({ ...state }));

  const dispatch = useDispatch();

  const textPhase = () => {
    switch (gameState.type) {
      case "gameStarted.trownDice":
        return "бросить кубик";
      case "gameStarted.clickArrow":
        return "сделать ход";
      case "gameStarted.takeHealthCard":
        return "открываем карточку";
      case "endGame":
        return gameResult;
      default:
        return " ";
    }
  };

  useEffect(
    function openCard() {
      switch (doEffect?.type) {
        case "!needOpenHealthCard": {
          const timerOpen = setTimeout(
            () =>
              dispatch({
                type: "openedHealthCard",
              }),
            1000
          );
          break;
        }
        case "!changeManHealth": {
          const timerChangeManHealth = setTimeout(
            () =>
              dispatch({
                type: "changedManHealth",
              }),
            500
          );
          break;
        }
        case "!changeHealthList": {
          const timerChangeHealthList = setTimeout(
            () =>
              dispatch({
                type: "changedHealthList",
              }),
            500
          );
          break;
        }
        case "!getNextMan": {
          dispatch({ type: "receivedNextMan" });
        }

        default:
          break;
      }
    },
    [doEffect]
  );

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
    [gameState.type]
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
              <Grid />
            </Field>
            <LeftPanel>
              <Status>{textPhase()}</Status>
              {/* вытащить здоровье из контекста?! */}
              {/*  дополнительно отдавать контекст */}
              {
                <Status>{`здоровье: ${showManListHealth(
                  GameList,
                  cardInteractIndex
                ).toString()}`}</Status>
              }
              <Status>{`координаты: ${cardInteractIndex}`}</Status>
              <Dice />
              <Arrows />
            </LeftPanel>
          </>
        );
    }
  };

  return <Game>{getGameScreen()}</Game>;
}

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.querySelector("#root")
);
