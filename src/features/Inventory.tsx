import { useSelector } from "react-redux";

import styled from "styled-components";

import { State, PlayerListType } from "../business/types";
import { Health } from "../components/Health";

const HealthInventory = styled(Health)`
  position: relative;
  margin: 2px;
`;
const InventoryWrap = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-content: flex-start;
`;
export const Inventory = () => {
  const { playerList, numberOfPlayer } = useSelector((state: State) => ({
    ...state,
  }));

  const inventory = playerList[numberOfPlayer].inventory;

  const healthCardList = inventory.filter((card) => {
    return (card.name = "health");
  });

  return (
    <InventoryWrap>
      {healthCardList.map((card, index) => {
        return <HealthInventory key={index}></HealthInventory>;
      })}
    </InventoryWrap>
  );
};
