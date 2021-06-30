import { useDispatch, useSelector } from "react-redux";

import styled from "styled-components";

import { State, CardItem, CardItemList } from "../business/types";
import { Health } from "./Health/Health";
import { BoardsCard } from "./Boards/BoardsCard";
import { WeaponCard } from "./Weapon/WeaponCard";
import { StyledCommonCard } from "./CommonCard/CommonCard";

import health from "../components/Health/health.png";
import boards from "../components/Boards/boards.png";
import weapon from "../components/Weapon/weapon.png";

type SlotType = {
  /*   onClick: Function; */
  highlighting?: boolean;
};

type StructuredInventory = Record<string, number>;

type CardsNameType = "boards" | "health" | "weapon";

type ImageType = {
  type: CardsNameType;
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

  const inventory: CardItemList = playerList[props.index].inventory;

  const structuredInventory: StructuredInventory = inventory.reduce(
    (prevItem: StructuredInventory, currentItem) => {
      if (currentItem) {
        const prevItemObj = prevItem[currentItem.name];

        if (prevItemObj) {
          return {
            ...prevItem,
            [currentItem.name]: prevItem[currentItem.name] + 1,
          };
        } else {
          return { ...prevItem, [currentItem.name]: 1 };
        }
      } else return {};
    },
    {}
  );
  console.log(structuredInventory);

  const isCardSelected = (name: CardsNameType, inventory: CardItemList) => {
    const selectedCard = inventory.find((card: CardItem) => card?.isSelected);
    return selectedCard ? true : false;
  };

  return (
    <InventoryWrap>
      <InwentoryRow>
        <Image
          type="health"
          highlighting={isCardSelected("health", inventory)}
          onClick={() => {
            dispatch({
              type: "cardChoosed",
              payload: { type: "health" },
            });
          }}
        ></Image>
        <Counter> x {structuredInventory["health"] || 0}</Counter>
      </InwentoryRow>
      <InwentoryRow>
        <Image type="boards"></Image>
        <Counter> x {structuredInventory["boards"] || 0}</Counter>
      </InwentoryRow>
      <InwentoryRow>
        <Image type="weapon"></Image>
        <Counter> x {structuredInventory["weapon"] || 0}</Counter>
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
