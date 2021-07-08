import { State, PlayerListType, ContextMenuButtonType } from "../../../types";
import { getStateGiveCard } from "./getStateGiveCard";
import { getStateHealAnotherPlayer } from "./getStateHealAnotherPlayer";

export const getStateClickedContextMenu = (
  state: State,
  recipientPlayerNumber: number,
  typeOfAction: ContextMenuButtonType
): State => {
  switch (typeOfAction) {
    case "heal": {
      const newState = getStateHealAnotherPlayer(state, recipientPlayerNumber);
      const stateClosedContextMenu = closeContextMenu(
        newState,
        recipientPlayerNumber
      );
      return stateClosedContextMenu;
    }

    case "share": {
      const newState = getStateGiveCard(state, recipientPlayerNumber);
      const stateClosedContextMenu = closeContextMenu(
        newState,
        recipientPlayerNumber
      );
      return stateClosedContextMenu;
    }

    default: {
      return state;
    }
  }
};

const closeContextMenu = (state: State, recipientPlayerNumber: number) => {
  const stateClosedContextMenu = {
    ...state,
    playerList: {
      ...state.playerList,
      [recipientPlayerNumber]: {
        ...state.playerList[recipientPlayerNumber],
        showContextMenu: false,
      },
    },
  };
  return stateClosedContextMenu;
};
