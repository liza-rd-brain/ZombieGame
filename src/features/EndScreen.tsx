import React from "react";
import { useSelector } from "react-redux";
import styled, { ThemeProvider } from "styled-components";

import { State } from "../business/types";

const GameScore = styled.div`
  margin: 100px;
`;

export const EndScreen = () => {
  const gameResult = useSelector((state: State) => state.gameResult);
  return (
    <>
      <GameScore>Игра окончена. {gameResult}</GameScore>
    </>
  );
};
