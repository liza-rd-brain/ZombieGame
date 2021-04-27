import { useSelector } from "react-redux";

import styled from "styled-components";

import { State, PlayerListType } from "../business/types";

import { MAX_HEALTH_AMOUNT } from "../shared/config";
import { HealthSlots } from "../components/HealthSlots";
import { Inventory } from "./Inventory";

type HealthSlotType = {
  isFilled: boolean;
};

const PlayerStatusCard = styled.div`
  width: 250px;
  height: 200px;
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

  padding: 3px;
  margin-bottom: 15px;
  font-size: 14px;
  width: 150px;
`;

const HealthStatus = styled(Status)`
  height: 20px;
`;

const InventoryStatus = styled(Status)`
  height: 100px;
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
`;
export const PlayerStatus = () => {
  const { numberOfPlayer } = useSelector((state: State) => ({
    ...state,
  }));

  // TODO: why pass the index?
  return (
    <PlayerStatusCard>
      <Column>
        <CharacterAvatar>игрок {`${numberOfPlayer + 1}`}</CharacterAvatar>
      </Column>
      <Column>
        <HealthStatus>
          {`здоровье:  `}
          <HealthSlots index={numberOfPlayer}></HealthSlots>
        </HealthStatus>
        <InventoryStatus>
          {`предметы:  `}
          <Inventory />
        </InventoryStatus>
      </Column>
    </PlayerStatusCard>
  );
};
