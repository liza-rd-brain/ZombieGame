import React from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import styled, { ThemeProvider } from "styled-components";
import { useReducer } from "react";

const GameScore = styled.div`
  margin: 100px;
`;

function EndScreen(props) {
  const gameResult = useSelector((state) => state.gameResult);
  return (
    <>
      <GameScore>Игра окончена. {gameResult}</GameScore>
    </>
  );
}

export default EndScreen;
