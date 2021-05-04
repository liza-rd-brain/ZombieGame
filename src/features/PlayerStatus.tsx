import { useSelector } from "react-redux";

import styled from "styled-components";

import { State, PlayerListType } from "../business/types";

import { MAX_HEALTH_AMOUNT } from "../shared/config";
import { HealthSlots } from "./HealthSlots";
type HealthSlotType = {
  isFilled: boolean;
};

const PlayerStatusCard = styled.div`
  width: 250px;
  height: 100px;
  border: 1px solid lightgray;
  padding: 10px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
`;

const CharacterAvatar = styled.div`
  width: 50px;
  height: 70px;
  border: 1px solid lightgray;
  font-size: 14px;
  text-align: center;
`;

const Status = styled.div`
  display: flex;
  border: 1px solid lightgray;
  height: 20px;
  padding: 3px;
  margin-bottom: 15px;
  font-size: 14px;
  width: 150px;
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
`;
export const PlayerStatus = () => {
  const { numberOfPlayer } = useSelector((state: State) => ({
    ...state,
  }));

  return (
    <PlayerStatusCard>
      <Column>
        <CharacterAvatar>игрок {`${numberOfPlayer + 1}`}</CharacterAvatar>
      </Column>
      <Column>
        <Status>
          {`здоровье:  `}
          <HealthSlots index={numberOfPlayer}></HealthSlots>
        </Status>
        <Status>{`предметы:  `}</Status>
      </Column>
    </PlayerStatusCard>
  );
};
