import { State, PlayerListType, CardItem } from "../../types";

/**
 * We need to give highlighting to healthCard
 */
type TargerCard = {
  index: number;
  card: CardItem;
};

export const getStateCardSelected = (state: State, targerCard: TargerCard) => {
  // TODO: Need to restrict select unneceserry card -?!
  // Add switch on type of cards
  const { numberOfPlayer } = state;

  const newPlayerList = changeSelectedCard(state, targerCard.index);

  const hasAnyCardSelected = newPlayerList[numberOfPlayer].inventory.find(
    (card) => {
      return card?.isSelected === true;
    }
  )
    ? true
    : false;

  const cardType = targerCard.card?.name;
  // The difference between weaponCard and other  card that weapon are usedin the battle.
  //Obviously we need other stateWithoutSelectedCard for weapon
  const stateWithSelectedCard: State = {
    ...state,
    playerList: newPlayerList,
    gameState: {
      type: "gameStarted.applyCard",
    },
  };

  const stateWithoutSelectedCard: State = {
    ...state,
    playerList: newPlayerList,
    gameState: {
      type: /* cardType === "weapon"
          ? "gameStarted.interactWithEnemy"
          :  */ "gameStarted.playerMove",
    },
  };

  switch (hasAnyCardSelected) {
    case true:
      return stateWithSelectedCard;
    case false:
      return stateWithoutSelectedCard;
  }
};

const changeSelectedCard = (
  state: State,
  currentCardIndex: number
  /*   hasCurrentCardHighlightning: boolean */
) => {
  const { playerList, numberOfPlayer } = state;
  const inventory = playerList[numberOfPlayer].inventory;
  const targetCard = inventory[currentCardIndex];

  const newInventory = inventory.map((card, index) => {
    if (index === currentCardIndex) {
      return { ...card, isSelected: !targetCard?.isSelected };
    } else {
      return { ...card, isSelected: false };
    }
  });

  const newPlayerList: PlayerListType = {
    ...playerList,
    [numberOfPlayer]: {
      ...playerList[numberOfPlayer],
      inventory: newInventory,
    },
  };

  return newPlayerList;
};
