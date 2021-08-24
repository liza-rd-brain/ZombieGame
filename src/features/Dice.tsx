import React from "react";
import { useDispatch, useSelector } from "react-redux";

import styled from "styled-components";

import { State } from "../business/types";

const DiceWrap = styled.div`
  border: 1px solid lightgray;
  width: 100px;
  height: 100px;
  display: grid;
  background-color: white;
`;

const DiceButton = styled.button`
  margin: 0 auto;
  cursor: pointer;
`;

const DiceNumber = styled.div`
  height: 30px;
  margin-top: 20px;
  text-align: center;
`;

const maxNumber = 4;

export const Dice = () => {
  const dispatch = useDispatch();
  const [diceNumber] = useSelector((state: State) => [state.dice]);

  const getNumber = () => {
    /*    return 3; */
    return Math.floor(Math.random() * maxNumber + 1);
  };

  return (
    <DiceWrap>
      <DiceNumber>{diceNumber}</DiceNumber>
      <DiceButton
        onClick={() => {
          dispatch({
            type: "diceThrown",
            payload: getNumber(),
          });
        }}
      >
        бросить кубик
      </DiceButton>
    </DiceWrap>
  );
};
