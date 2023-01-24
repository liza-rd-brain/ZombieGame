import { useSelector } from "react-redux";

import styled from "styled-components";

import { State } from "../business/types";

import { HealthSlots } from "../components/HealthSlots";
import { Inventory } from "../components/Inventory";

import player from "../components/Player/player.png";
import player2 from "../components/Player/player2.png";
import player3 from "../components/Player/player3.png";
import player4 from "../components/Player/player4.png";

type avatarType = { image: string };

const PlayerStatusCard = styled.div`
  width: 250px;
  height: 240px;
  border: 1px solid lightgray;
  padding: 10px;
  box-sizing: border-box;
  display: flex;
  /*  justify-content: center; */
  background-color: white;
  flex-wrap: wrap;
`;

//eslint-disable-next-line
const CharacterAvatar = styled.div<avatarType>`
  width: 50px;
  height: 50px;
  border: 1px solid lightgray;
  font-size: 14px;
  text-align: center;
  background-repeat: no-repeat;
  background-position: 0px;
  background-size: 44px;
  background-position: 3px;
  background-image: ${(props) => {
    return `url(${props.image})`;
  }};
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
  margin: 15px 5px;
`;

const InventoryStatus = styled(Status)`
  /*   height: 100px; */
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
`;

export const PlayerStatus = () => {
  // const { activePlayerNumber, playerList } = useSelector((state: State) => ({
  //   ...state,
  // }));

  const activePlayerNumber = useSelector(
    (state: State) => state.activePlayerNumber
  );
  const playerList = useSelector((state: State) => state.playerList);

  const playerImageList = [player, player2, player3, player4];

  // TODO: why pass the index?

  const avatar = (
    <CharacterAvatar image={playerImageList[activePlayerNumber]}>
      {`${activePlayerNumber + 1}`}
    </CharacterAvatar>
  );
  const health = (
    <HealthStatus>
      {`здоровье:  `}
      <HealthSlots index={activePlayerNumber}></HealthSlots>
    </HealthStatus>
  );
  const inventory = (
    <InventoryStatus>
      <Inventory index={activePlayerNumber} />
    </InventoryStatus>
  );

  const isAlivePlayer = playerList[activePlayerNumber] ? true : false;

  switch (isAlivePlayer) {
    case true: {
      return (
        <PlayerStatusCard>
          <Row>
            {avatar}
            {health}
          </Row>
          <Row>{inventory}</Row>
        </PlayerStatusCard>
      );
    }
    case false: {
      return (
        <PlayerStatusCard>
          <Row>
            {avatar}
            <HealthStatus>{<div>Dead</div>}</HealthStatus>
          </Row>
        </PlayerStatusCard>
      );
    }
  }
};
