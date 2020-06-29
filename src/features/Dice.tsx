import React from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";

import {State} from "./../app"
const DiceWrap = styled.div`
  border: 1px solid lightgray;
  width: 100px;
  height: 100px;
  display: grid;
`;

const DiceButton = styled.button`
  margin: 0 auto;

`;
const DiceNumber = styled.div`
  height: 30px;
  margin-top: 20px;
  text-align: center;
`;


const maxNumber = 4;

function Dice() {
  const dispath = useDispatch();
  const [diceNumber] = useSelector((state:State) => [
    state.dice
  ]);
  const getNumber = () => {
    return Math.floor(Math.random() * maxNumber + 1);
  };

  return (
    <DiceWrap>
      <DiceNumber>{diceNumber}</DiceNumber>
      <DiceButton
        onClick={() => {
          dispath({
            type: "diceThrown",
            payload: getNumber(),
          });
        }}
      >
        бросить кубик
      </DiceButton>
    </DiceWrap>
  );
}

export default Dice;
