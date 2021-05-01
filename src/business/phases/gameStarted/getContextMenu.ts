import { State, PlayerListType, AvailableCellListType } from "../../types";
import { ActionType } from "../../reducer";

import { getStateCardChosed } from "./getStateCardChosed";
import { getNeighboringCellList } from "./getNeighboringCellList";
import { canInteractWithCell } from "./canInteractWithCell";

export const getContextMenu = (action: ActionType, state: State): State => {
  console.log("getContextMenu");
  return state;
};
