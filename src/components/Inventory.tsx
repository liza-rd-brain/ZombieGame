import { useDispatch, useSelector } from "react-redux";

import styled from "styled-components";

import { State, CardItem, InventoryType, TypeOfCard } from "../business/types";
import { Health } from "./Health/Health";
import { BoardsCard } from "./Boards/BoardsCard";
import { WeaponCard } from "./Weapon/WeaponCard";

import health from "../components/Health/health.png";
import boards from "../components/Boards/boards.png";
import weapon from "../components/Weapon/weapon.png";

type SlotType = {
  /*   onClick: Function; */
  highlighting?: boolean;
};

type ImageType = {
  type: TypeOfCard;
  highlighting?: boolean;
};

const InventoryWrap = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-content: flex-start;
`;

const InwentoryRow = styled.div`
  display: flex;
  width: 100%;
  flex-wrap: nowrap;
  align-items: center;
`;

//Todo: can replace switch to calculated props?
const Image = styled.div<ImageType>`
  width: 50px;
  height: 50px;
  background-size: 44px;
  background-repeat: no-repeat;
  background-position: 3px;
  background-image: ${(props) => {
    switch (props.type) {
      case "health": {
        return `url(${health})`;
      }

      case "boards": {
        return `url(${boards})`;
      }

      case "weapon": {
        return `url(${weapon})`;
      }
    }
  }};
  outline: ${(props) => {
    if (props.highlighting === true) {
      return "1px solid red ";
    }
  }};
`;

const Counter = styled.div`
  margin-left: 10px;
  font-size: 22px;
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

  const inventory: InventoryType = playerList[props.index].inventory;

  return (
    <InventoryWrap>
      <InwentoryRow>
        <Image
          type="health"
          highlighting={inventory.cardSelected === "health"}
          onClick={() => {
            dispatch({
              type: "cardChoosed",
              payload: { type: "health" },
            });
          }}
        ></Image>
        <Counter> x {inventory["health"] || 0}</Counter>
      </InwentoryRow>
      <InwentoryRow>
        <Image
          type="boards"
          highlighting={inventory.cardSelected === "boards"}
          onClick={() => {
            dispatch({
              type: "cardChoosed",
              payload: { type: "boards" },
            });
          }}
        ></Image>
        <Counter> x {inventory["boards"] || 0}</Counter>
      </InwentoryRow>
      <InwentoryRow>
        <Image
          type="weapon"
          highlighting={inventory.cardSelected === "weapon"}
          onClick={() => {
            dispatch({
              type: "cardChoosed",
              payload: { type: "weapon" },
            });
          }}
        ></Image>
        <Counter> x {inventory["weapon"] || 0}</Counter>
      </InwentoryRow>

      <InwentoryRow></InwentoryRow>
      <InwentoryRow></InwentoryRow>
    </InventoryWrap>
  );
};

{
}

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
