import { useDispatch } from "react-redux";

import styled from "styled-components";

const StartButton = styled.button`
  height: 22px;
  margin: 140px;
`;

export const StartScreen = () => {
  const dispatch = useDispatch();
  return (
    <>
      <StartButton
        onClick={() => {
          dispatch({ type: "clickedStartButton" });
        }}
      >
        {" "}
        начать игру
      </StartButton>
    </>
  );
};
