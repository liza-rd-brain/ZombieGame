import React from "react";

import styled from "styled-components";

/* import {amountPlayers } from "../shared/config/devConfig"; */
import { HealthSlots } from "../components/HealthSlots";
import { Inventory } from "../components/Inventory";
import { ConfigType } from "../business/types";

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

export const PlayersStatusList = (config: ConfigType) => {
  return (
    <PlayersListWrap amount={config.amountPlayers}>
      {new Array(config.amountPlayers).fill(0).map((player, index) => {
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
