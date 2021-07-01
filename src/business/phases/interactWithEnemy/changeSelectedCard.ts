import { State, PlayerListType, TypeOfCard } from "../../types";

export const changeSelectedCard = (state: State, typeOfSelect: TypeOfCard) => {
  const { playerList, numberOfPlayer } = state;
  const inventory = playerList[numberOfPlayer].inventory;

  const newInventory = { ...inventory, cardSelected: typeOfSelect };

  const newPlayerList: PlayerListType = {
    ...playerList,
    [numberOfPlayer]: {
      ...playerList[numberOfPlayer],
      inventory: newInventory,
    },
  };

  return newPlayerList;
};
