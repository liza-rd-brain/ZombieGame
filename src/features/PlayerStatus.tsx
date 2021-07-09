import { useSelector } from "react-redux";

import styled from "styled-components";

import { State } from "../business/types";

import { HealthSlots } from "../components/HealthSlots";
import { Inventory } from "../components/Inventory";

const PlayerStatusCard = styled.div`
  width: 250px;
  height: 220px;
  border: 1px solid lightgray;
  padding: 10px;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  background-color: white;
`;

//eslint-disable-next-line
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
  /*   height: 100px; */
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
`;

export const PlayerStatus = () => {
  const { activePlayerNumber } = useSelector((state: State) => ({
    ...state,
  }));

  // TODO: why pass the index?
  return (
    <PlayerStatusCard>
      {/* <Column>
        <CharacterAvatar>игрок {`${numberOfPlayer + 1}`}</CharacterAvatar>
      </Column> */}
      <Column>
        <HealthStatus>
          {`здоровье:  `}
          <HealthSlots index={activePlayerNumber}></HealthSlots>
        </HealthStatus>
        <InventoryStatus>
          {/*    {`предметы:  `} */}
          <Inventory index={activePlayerNumber} />
        </InventoryStatus>
      </Column>
    </PlayerStatusCard>
  );
};
