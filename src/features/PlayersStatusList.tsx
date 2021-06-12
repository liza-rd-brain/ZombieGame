import React from "react";
import { useSelector } from "react-redux";

import styled from "styled-components";

import { State, PlayerListType } from "../business/types";

import { AMOUNT_PLAYERS, MAX_HEALTH_AMOUNT } from "../shared/config";
import { HealthSlots } from "../components/HealthSlots";
import { Inventory } from "../components/Inventory";

type HealthSlotType = {
  isFilled: boolean;
};

type AmountOfPlayers = {
  amount: number;
};

const PlayersListWrap = styled.div<AmountOfPlayers>`
  /*  width: 130px; */
  width: 100%;
  height: 100px;
  /*   border: 1px solid lightgray; */
  display: grid;

  grid-template-rows: 20% auto auto;
  grid-template-columns: ${(props) => {
    return `repeat(${props.amount} ,25px)`;
  }};
  pointer-events: none;
  margin: 0 30px;
`;

const CharacterAvatar = styled.div`
  font-size: 12px;
  text-align: center;
  grid-row-start: 1;
  grid-row-end: 2;
`;

const HealthSlotsWrap = styled.div`
  grid-row-start: 2;
  grid-row-end: 3;
  & > * {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex-direction: column;
    width: 100%;
  }
`;

const InventorysWrap = styled.div`
  grid-row-start: 3;
  grid-row-end: 4;
  & * {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex-direction: column;
    box-sizing: border-box;
    outline: none;
    /*  & > * {
      box-sizing: border-box;
    } */
  }
`;

export const PlayersStatusList = () => {
  return (
    <PlayersListWrap amount={AMOUNT_PLAYERS}>
      {new Array(AMOUNT_PLAYERS).fill(0).map((player, index) => {
        return (
          <React.Fragment key={index}>
            <CharacterAvatar>{`${index + 1}`}</CharacterAvatar>
            <HealthSlotsWrap>
              <HealthSlots index={index}></HealthSlots>
            </HealthSlotsWrap>
            <InventorysWrap>
              <Inventory index={index} />
            </InventorysWrap>
          </React.Fragment>
        );
      })}
    </PlayersListWrap>
  );
};
