import React from "react";
import { Provider, useDispatch, useSelector } from "react-redux";

import styled, { ThemeProvider } from "styled-components";

const StartButton = styled.button`
  margin: 100px;
`;

export const StartScreen = () => {
  const dispatch = useDispatch();
  return (
    <>
      <StartButton
        onClick={() => {
          dispatch({ type: "clickStartButton" });
        }}
      >
        {" "}
        начать игру
      </StartButton>
    </>
  );
};
