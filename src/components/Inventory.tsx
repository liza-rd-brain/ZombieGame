import { useDispatch, useSelector } from "react-redux";

import styled from "styled-components";

import {
  State,
  PlayerListType,
  HealthCardType,
  GameState,
  CardItem,
} from "../business/types";
import { Health } from "./Health/Health";
import { BoardsCard } from "./Boards/BoardsCard";
import { WeaponCard } from "./Weapon/WeaponCard";

type SlotType = {
  onClick: Function;
  highlighting?: boolean;
};

const InventoryWrap = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-content: flex-start;
`;

const Slot = styled.div<SlotType>`
  display: flex;
  cursor: pointer;

  & > * {
    margin: 2px;
    position: relative;
  }

  outline: ${(props) => {
    if (props.highlighting === true) {
      return "1px solid red ";
    }
  }};
`;

export const Inventory = (props: { index: number }) => {
  const dispatch = useDispatch();
  const { playerList, gameState } = useSelector((state: State) => ({
    ...state,
  }));

  const inventory = playerList[props.index].inventory;
  return (
    <InventoryWrap>
      {inventory.map((inventoryCard, inventoryCardindex) => {
        return (
          <Slot
            key={inventoryCardindex}
            highlighting={inventoryCard?.isSelected}
            onClick={() => {
              dispatch({
                type: "cardChoosed",
                payload: { index: inventoryCardindex, card: inventoryCard },
              });
            }}
          >
            {getChildrenComponent(inventoryCard)}
          </Slot>
        );
      })}
    </InventoryWrap>
  );
};

const getChildrenComponent = (inventoryCard: CardItem) => {
  switch (inventoryCard?.name) {
    case "health": {
      return <Health apperance={inventoryCard.apperance} />;
    }
    case "boards": {
      return <BoardsCard apperance={inventoryCard.apperance} />;
    }
    case "weapon": {
      return <WeaponCard apperance={inventoryCard.apperance} />;
    }
    default: {
      return null;
    }
  }
};
