import { useDispatch, useSelector } from "react-redux";

import styled from "styled-components";

import { State, PlayerListType, HealthCardType } from "../business/types";
import { Health } from "../components/Health";

type HealthSlotType = {
  onClick: Function;
  highlighting?: boolean;
};

const InventoryWrap = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-content: flex-start;
`;

const HealthSlot = styled.div<HealthSlotType>`
  display: flex;

  & > * {
    margin: 2px;
    position: relative;
  }

  outline: ${(props) => {
    if (props.highlighting) {
      return "1px solid red ";
    }
  }};
`;

export const Inventory = () => {
  const dispatch = useDispatch();
  const { playerList, numberOfPlayer } = useSelector((state: State) => ({
    ...state,
  }));

  const inventory = playerList[numberOfPlayer].inventory;

  /* const healthCardList = inventory.filter((card) => {
    return (card.name = "health");
  }); */

  return (
    <InventoryWrap>
      {inventory.map((inventoryCard, inventoryCardindex) => {
        if (inventoryCard.name === "health") {
          return (
            <HealthSlot
              key={inventoryCardindex}
              highlighting={inventoryCard.highlighting}
              onClick={(e) => {
                dispatch({
                  type: "cardChoosed",
                  payload: inventoryCardindex,
                });
              }}
            >
              <Health></Health>
            </HealthSlot>
          );
        }
      })}
    </InventoryWrap>
  );
};
