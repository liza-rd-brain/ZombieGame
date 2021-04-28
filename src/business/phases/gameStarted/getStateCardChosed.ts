import { useDispatch, useSelector } from "react-redux";

import { State, HealthCardType, PlayerListType } from "../../types";
import { ActionType } from "../../reducer";

/**
 * We need to give highlighting to healthCard
 */
export const getStateCardChosed = (state: State, currentCardIndex: number) => {
  const { playerList, numberOfPlayer } = state;

  const inventory = playerList[numberOfPlayer].inventory;

  // We take first from the healthCards
  const choosenHealthCard = inventory[currentCardIndex];
  const highlightHealthCard = { ...choosenHealthCard, highlighting: true };

  const newInventory = inventory.map((card, index) => {
    if (index === currentCardIndex) {
      return highlightHealthCard;
    } else return card;
  });

  const newPlayerList: PlayerListType = {
    ...playerList,
    [numberOfPlayer]: {
      ...playerList[numberOfPlayer],
      inventory: newInventory,
    },
  };

  console.log(newPlayerList);
  return { ...state, playerList: newPlayerList };
};
