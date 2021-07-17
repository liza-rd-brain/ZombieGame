import { State, PlayerListType, TypeOfCard, InventoryType } from "../../types";

/**
 * We need to give highlighting to healthCard
 */

export const getStateCardSelected = (
  state: State,
  typeOfSelect: TypeOfCard
): State => {
  // TODO: Need to restrict select unneceserry card -?!
  // Add switch on type of cards
  const { activePlayerNumber } = state;

  const isCardNonZero = checkCardNonZero(state, typeOfSelect);

  switch (isCardNonZero) {
    case false: {
      return state;
    }

    case true:
      {
        const newPlayerList = changeSelectedCard(state, typeOfSelect);
        const selectedCard = newPlayerList[activePlayerNumber].inventory
          .cardSelected
          ? true
          : false;

        // The difference between weaponCard and other card that weapon are used in the battle.
        //Obviously we need other stateWithoutSelectedCard for weapon
        const stateWithSelectedCard: State = {
          ...state,
          playerList: newPlayerList,
          gameState: {
            ...state.gameState,
            type: "gameStarted.applyCard",
            coordOfAvailableCells: null,
          },
          doEffect: { type: "!checkAvailableNeighboringCards" },
        };

        const stateWithoutSelectedCard: State = {
          ...state,
          playerList: newPlayerList,
          gameState: {
            ...state.gameState,
            coordOfAvailableCards: null,
            type: /* cardType === "weapon"
              ? "gameStarted.interactWithEnemy"
              :  */ "gameStarted.playerMove",
          },
          doEffect: { type: "!checkAvailableNeighboringCell" },
        };

        switch (selectedCard) {
          case true:
            return stateWithSelectedCard;
          case false:
            return stateWithoutSelectedCard;
        }
      }
      break;

    default: {
      return state;
    }
  }
};

const changeSelectedCard = (
  state: State,
  typeOfSelect: TypeOfCard
): PlayerListType => {
  const { playerList, activePlayerNumber } = state;
  const inventory = playerList[activePlayerNumber].inventory;

  const isTheSameSelectType = inventory.cardSelected === typeOfSelect;

  switch (isTheSameSelectType) {
    case true: {
      const newInventoryCardUnSelected: InventoryType = {
        ...inventory,
        cardSelected: null,
      };

      const newPlayerList: PlayerListType = {
        ...playerList,
        [activePlayerNumber]: {
          ...playerList[activePlayerNumber],
          inventory: newInventoryCardUnSelected,
        },
      };

      return newPlayerList;
    }

    case false: {
      const newInventoryCardSelected: InventoryType = {
        ...inventory,
        cardSelected: typeOfSelect,
      };

      const newPlayerList: PlayerListType = {
        ...playerList,
        [activePlayerNumber]: {
          ...playerList[activePlayerNumber],
          inventory: newInventoryCardSelected,
        },
      };

      return newPlayerList;
    }
  }
};

const checkCardNonZero = (state: State, typeOfSelect: TypeOfCard): Boolean => {
  const { playerList, activePlayerNumber } = state;
  const inventory = playerList[activePlayerNumber].inventory;
  if (typeOfSelect !== null) {
    const hasCards = inventory[typeOfSelect] !== 0;
    return hasCards;
  } else {
    return false;
  }
};
