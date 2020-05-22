import React from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";

const DiceWrap = styled.div`
  border: 1px solid lightgray;
  width: 100px;
  height: 100px;
  display: grid;
`;
const DiceButton = styled.button`
  /* width: 50px; */
  margin: 0 auto;

  /*  height: 100px; */
`;
const DiceNumber = styled.div`
  height: 30px;
  margin-top: 20px;
  text-align: center;
`;

const minNumber = 1;
const maxNumber = 4;

function Dice() {
  const dispath = useDispatch();
  const [diceNumber, gamePhase] = useSelector((state) => [
    state.dice,
    state.gamePhase,
  ]);
  const getNumber = () => {
    return Math.floor(Math.random() * maxNumber + 1);
  };

  return (
    <DiceWrap>
      <DiceNumber>{diceNumber}</DiceNumber>
      <DiceButton
        onClick={() => {
          switch (gamePhase) {
            case "бросить кубик":
              dispath({
                type: "changeDice",
                payload: getNumber(),
              }),
                dispath({
                  type: "changeGameState",
                  payload: "двигать фишку",
                });
            case "двигать фишку":
              break;
            default:
              break;
          }
        }}
      >
        бросить кубик
      </DiceButton>
    </DiceWrap>
  );
}

export default Dice;
