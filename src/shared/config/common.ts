import { MoveDirectionList } from "../../business/types";
import { CELLS_BARRIERS_LIST } from "./walls";
export const MOVE_DIRECTION_LIST: MoveDirectionList = [
  "top",
  "right",
  "bottom",
  "left",
];

export const COMMON_CONFIG = {
  cellsBarrierList: CELLS_BARRIERS_LIST,
  moveDirectionList: MOVE_DIRECTION_LIST,
};
