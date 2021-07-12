import { useSelector } from "react-redux";

import styled from "styled-components";

import { State, PlayerListType } from "../business/types";

/* import {maxHealthAmount } from "../shared/config/devConfig"; */
import { config } from "../business/initialState";

type HealthSlotType = {
  isFilled: boolean;
};

const HealthSlotList = styled.div`
  display: flex;
  align-items: center;
`;
const HealthSlot = styled.div<HealthSlotType>`
  width: 5px;
  height: 5px;
  border-radius: 50%;
  border: 1px solid #f09292;
  margin: 1px;
  background-color: ${(props) => {
    if (props.isFilled) {
      return "#f09292";
    } else return "none";
  }};
`;

export const HealthSlots = (props: { index: number }) => {
  const { playerList } = useSelector((state: State) => ({
    ...state,
  }));

  return (
    <HealthSlotList>
      {getHealthSlot(playerList, props.index).map(
        (healthSlotFilled: boolean, index: number) => {
          return (
            <HealthSlot key={index} isFilled={healthSlotFilled}></HealthSlot>
          );
        }
      )}
    </HealthSlotList>
  );
};

const getHealthSlot = (playerList: PlayerListType, index: number) => {
  const playerHealth = getPlayerHealth(playerList, index);
  const maxHealthSlotList = new Array(config.maxHealthAmount).fill(0);

  const filledHealthSlotList = maxHealthSlotList.reduce(
    (prev, currSlot, index) => {
      if (index < playerHealth) {
        return [...prev, true];
      } else {
        return [...prev, false];
      }
    },
    []
  );
  return filledHealthSlotList;
};

const getPlayerHealth = (
  playersList: PlayerListType,
  numberOfPlayer: number
) => {
  return playersList[numberOfPlayer].health;
};
