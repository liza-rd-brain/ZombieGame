import { State, PlayerListType, TypeOfCard } from "../../types";

export const changeSelectedCard = (state: State, typeOfSelect: TypeOfCard) => {
  const { playerList, activePlayerNumber } = state;
  const inventory = playerList[activePlayerNumber].inventory;

  const newInventory = { ...inventory, cardSelected: typeOfSelect };

  const newPlayerList: PlayerListType = {
    ...playerList,
    [activePlayerNumber]: {
      ...playerList[activePlayerNumber],
      inventory: newInventory,
    },
  };

  return newPlayerList;
};
