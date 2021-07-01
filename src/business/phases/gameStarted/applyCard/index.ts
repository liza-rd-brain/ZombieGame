import { State } from "../../../types";
import { ActionType } from "../../../reducer";

import { getStateCardSelected } from "../../common/getStateCardSelected";
import { getStateGiveCard } from "./getStateGiveCard";
import { getStateHealCurrPlayer } from "./getStateHealCurrPlayer";
import { getStateHealAnotherPlayer } from "./getStateHealAnotherPlayer";
import { getStateHoleFilled } from "./getStateHoleFilled";
/**
 *  In payload get order number of chosen for interact player.
 * If this number = indexCurrPlayer we heal player.
 * If not - we give context menu: need heal or apply.
 */
export const applyCard = (state: State, action: ActionType): State => {
  const { numberOfPlayer, playerList } = state;

  const chosenCardType = playerList[numberOfPlayer].inventory.cardSelected;

  switch (action.type) {
    case "req-shareCard": {
      const recipientPlayerNumber = action.payload;
      return getStateGiveCard(state, recipientPlayerNumber);
    }

    case "cardChoosed": {
      const typeOfSelect = action.payload.type;
      return getStateCardSelected(state, typeOfSelect);
    }

    default: {
      switch (chosenCardType) {
        case "health": {
          switch (action.type) {
            case "req-healPlayer": {
              /**
               * Need to increase playerHealth
               * Then remove card from inventory
               * Can we do this simultaneously?
               */

              const indexChosenPlayer = action.payload;
              const isCurrPlayer = indexChosenPlayer === numberOfPlayer;

              switch (isCurrPlayer) {
                case true:
                  return getStateHealCurrPlayer(state);

                case false: {
                  return getStateHealAnotherPlayer(state, indexChosenPlayer);
                }
                default:
                  return state;
              }
            }

            default:
              return state;
          }
        }

        case "boards": {
          switch (action.type) {
            case "req-fillHole": {
              const { coord, direction } = action.payload;
              console.log("заполнить проем", coord, direction);
              return getStateHoleFilled(state, coord, direction);
            }

            default:
              return state;
          }
        }

        default:
          return state;
      }
    }
  }
};
