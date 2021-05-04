import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import styled from "styled-components";

import {
  State,
  PlayerListType,
  HealthCardType,
  GameState,
} from "../business/types";
import { Health } from "./Health";

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
    /*  box-sizing: border-box; */
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

  type AppranceType = { highlightning?: boolean }[];

  const inventory = playerList[props.index].inventory;

  /*   const initialApperance: AppranceType = [{ highlightning: false }]; */
  const initialApperance: AppranceType = inventory.map((inventoryItem) => {
    return {
      highlightning: false,
    };
  });
  const [apperance, setApperance] = useState(initialApperance);

  return (
    <InventoryWrap>
      {inventory.map((inventoryCard, inventoryCardindex) => {
        if (inventoryCard.name === "health") {
          return (
            <HealthSlot
              key={inventoryCardindex}
              highlighting={
                apperance[inventoryCardindex]
                  ? apperance[inventoryCardindex].highlightning
                  : false
              }
              onClick={() => {
                setApperance((prevApperance) => {
                  return inventory.map((inventoryItem, index) => {
                    if (index === inventoryCardindex) {
                      return {
                        highlightning: prevApperance[inventoryCardindex]
                          ? !prevApperance[inventoryCardindex].highlightning
                          : true,
                      };
                    } else return { highlightning: false };
                  });
                });

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
