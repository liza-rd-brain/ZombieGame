import { PlayerListType, CellType } from "../../../types";

export const changePlayerHealth = (
  healthCell: CellType,
  playersList: PlayerListType,
  numberOfPlayer: number
) => {
  if (healthCell.name === "commonCell" && healthCell.cardItem.healthItem) {
    const sign = healthCell.cardItem.healthItem.type;

    const currHealth = playersList[numberOfPlayer].health;

    const incHealth = currHealth + 1;
    const decHealth = currHealth - 1;

    const changedplayersList: PlayerListType = {
      ...playersList,
      [numberOfPlayer]: {
        ...playersList[numberOfPlayer],
        health: sign === "decrement" ? decHealth : incHealth,
      },
    };

    return changedplayersList;
  } else {
    return playersList;
  }
};
