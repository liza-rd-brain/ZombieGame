import { useSelector } from "react-redux";

import styled from "styled-components";

import {
  State,
  GameState,
  TypeEffect,
  PlayerListType,
} from "../business/types";

import { MAX_HEALTH_AMOUNT } from "../shared/config";

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
  height: 20px;
  padding: 3px;
  margin-bottom: 15px;
  font-size: 14px;
  width: 150px;
`;

const HealthSlotList = styled.div`
  display: flex;
  height: 15px;
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
  const { playerList, numberOfPlayer } = useSelector((state: State) => ({
    ...state,
  }));

  const playerHealth = getPlayerHealth(playerList, numberOfPlayer);
  const maxHealthSlotList = new Array(MAX_HEALTH_AMOUNT).fill(0);

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

  return (
    <PlayerStatusCard>
      <Column>
        <CharacterAvatar>игрок {`${numberOfPlayer + 1}`}</CharacterAvatar>
      </Column>
      <Column>
        <HealthStatus>
          {`здоровье:  `}
          <HealthSlotList>
            {filledHealthSlotList.map((healthSlotFilled: boolean) => {
              return <HealthSlot isFilled={healthSlotFilled}></HealthSlot>;
            })}
          </HealthSlotList>
        </Status>
        <Status>{`предметы:  `}</Status>
      </Column>
    </PlayerStatusCard>
  );
};

const getPlayerHealth = (
  playersList: PlayerListType,
  numberOfPlayer: number
) => {
  return playersList[numberOfPlayer].health;
};
