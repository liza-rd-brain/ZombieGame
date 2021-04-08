import { useDispatch } from "react-redux";

import styled from "styled-components";

const StartButton = styled.button`
  margin: 100px;
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
