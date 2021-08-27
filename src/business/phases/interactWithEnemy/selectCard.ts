import { State } from "../../types";
import { ActionType } from "../../reducer";
import { changeSelectedCard } from "./changeSelectedCard";

export const selectCard = (state: State, action: ActionType) => {
  const { activePlayerNumber } = state;
  switch (action.type) {
    case "cardChoosed": {
      //TODO: now in battle we can chose any card from inventory
      //TODO: double click should be unclick!
      const newPlayerList = changeSelectedCard(state, action.payload.type);

      const hasAnyCardSelected = newPlayerList[activePlayerNumber].inventory
        .cardSelected
        ? true
        : false;

      // The difference between weaponCard and other card that weapon are used in the battle.
      // Obviously we need other stateWithoutSelectedCard for weapon
      const stateWithSelectedCard: State = {
        ...state,
        playerList: newPlayerList,
        gameState: {
          ...state.gameState,
          type: "interactWithEnemy.applyCard",
        },
      };

      const stateWithoutSelectedCard: State = {
        ...state,
        playerList: newPlayerList,
        gameState: {
          ...state.gameState,
          type: "interactWithEnemy.makeBattleAction",
        },
      };

      switch (hasAnyCardSelected) {
        case true:
          return stateWithSelectedCard;
        case false:
          return stateWithoutSelectedCard;
      }
      break;
    }

    default: {
      return state;
    }
  }
};
