import { PlayerListType, CellType } from "../../../types";

export const changePlayerHealth = (
  healthCell: CellType,
  playersList: PlayerListType,
  numberOfPlayer: number
) => {
  if (healthCell.name === "commonCell") {
    const currHealth = playersList[numberOfPlayer].health;

    const changedPlayersList: PlayerListType = {
      ...playersList,
      [numberOfPlayer]: {
        ...playersList[numberOfPlayer],
        health: currHealth + 1,
      },
    };

    return changedPlayersList;
  } else {
    return playersList;
  }
};
