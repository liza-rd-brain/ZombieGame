import { State, PlayerListType, CardItem, EnemyCardType } from "../../types";
import { ActionType } from "../../reducer";
import { changeSelectedCard } from "./changeSelectedCard";

export const selectCard = (state: State, action: ActionType) => {
  const { numberOfPlayer } = state;
  switch (action.type) {
    case "cardChoosed": {
      const newPlayerList = changeSelectedCard(state, action.payload.type);

      const hasAnyCardSelected = newPlayerList[numberOfPlayer].inventory
        .cardSelected
        ? true
        : false;

      // The difference between weaponCard and other card that weapon are used in the battle.
      // Obviously we need other stateWithoutSelectedCard for weapon
      const stateWithSelectedCard: State = {
        ...state,
        playerList: newPlayerList,
        gameState: { type: "interactWithEnemy.applyCard" },
      };

      const stateWithoutSelectedCard: State = {
        ...state,
        playerList: newPlayerList,
        gameState: { type: "interactWithEnemy.makeBattleAction" },
      };

      switch (hasAnyCardSelected) {
        case true:
          return stateWithSelectedCard;
        case false:
          return stateWithoutSelectedCard;
      }
    }
    default: {
      return state;
    }
  }
};
