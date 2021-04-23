import { PlayerListType, CellType } from "../../../types";

export const changePlayerHealth = (
  healthCell: CellType,
  playersList: PlayerListType,
  numberOfPlayer: number
) => {
  if (healthCell.name === "commonCell" && healthCell.cardItem.healthItem) {
    const currHealth = playersList[numberOfPlayer].health;

    const changedplayersList: PlayerListType = {
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
