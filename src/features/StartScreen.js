import React from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import styled, { ThemeProvider } from "styled-components";
import { useReducer } from "react";

const StartButton = styled.button`
  margin: 100px;
`;

function StartScreen(props) {
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
}

export default StartScreen;
