import { useDispatch, useSelector } from "react-redux";

import { State, HealthCardType, PlayerListType } from "../../types";


/**
 * We need to give highlighting to healthCard
 */
export const getStateCardChosed = (state: State, currentCardIndex: number) => {
  const { playerList, numberOfPlayer } = state;

  const inventory = playerList[numberOfPlayer].inventory;

  const hasAnyCardHighlightning = inventory.find((card) => {
    return card.highlighting === true;
  })
    ? true
    : false;

  // We take first from the healthCards
  const choosenHealthCard = inventory[currentCardIndex];

  const hasCurrentCardHighlightning = choosenHealthCard.highlighting ? true : false;

  /**
   * Just returns the opposite.
   */
  const highlightHealthCard = {
    ...choosenHealthCard,
    highlighting: !hasCurrentCardHighlightning,
  };

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

  switch (hasCurrentCardHighlightning) {
    case true: {
      return { ...state, playerList: newPlayerList };
    }
    case false: {
      switch (hasAnyCardHighlightning) {
        case false: {
          return { ...state, playerList: newPlayerList };
        }
        case true: {
          return state;
        }
      }
    }
  }
};
