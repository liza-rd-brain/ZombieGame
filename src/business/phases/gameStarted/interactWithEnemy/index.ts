import { State, PlayerListType, CardItem } from "../../../types";

import { ActionType } from "../../../reducer";
import { openEnemyCard } from "./openEnemyCard";
import { getBattleResult } from "./getBattleResult";
import { getStateCardSelected } from "../common/getStateCardSelected";

export const interactWithEnemy = (state: State, action: ActionType): State => {
  const [, phaseInner] = state.gameState.type.split(".");

  switch (phaseInner) {
    case "makeBattleAction": {
      switch (action.type) {
        case "diceThrown": {
          /*  const dice = action.payload; */
          return trownBattleDice(state, action);
        }
        default: {
          return state;
        }
      }
    }
    case "throwBattleDice": {
      return trownBattleDice(state, action);
    }

    default: {
      switch (action.type) {
        case "req-checkEnemyCard": {
          return checkCardApperance(state);
        }

        case "req-openEnemyCard": {
          return openEnemyCard(state);
        }

        /*   case "diceThrown": {
          return trownBattleDice(state, action);
        } */

         case "req-getBattleResult": {
          return getBattleResult(state);
        }
        case "cardChoosed": {
          return selectCard(state, action);
        }
        case "req-hitEnemy": {
          /*  return useWeapon() */
          if (state.gameState.type === "interactWithEnemy.applyCard") {
            console.log("ударили врага");
          }

          return state;
        }

        default: {
          return state;
        }
      }
    }
  }
};

const checkCardApperance = (state: State): State => {
  const { enemyList, playerList, numberOfPlayer } = state;
  const currentCoord = playerList[numberOfPlayer].coord;

  const isNeedOpenEnemyCard =
    enemyList[currentCoord].apperance === "open" ? false : true;

  switch (true) {
    case isNeedOpenEnemyCard: {
      return {
        ...state,
        doEffect: { type: "!openEnemyCard" },
      };
    }

    case !isNeedOpenEnemyCard: {
      return {
        ...state,
        gameState: { type: "interactWithEnemy.throwBattleDice" },
        /*    doEffect: { type: "!throwBattleDice" }, */
        dice: 0,
      };
    }

    default: {
      return state;
    }
  }
};

const trownBattleDice = (state: State, action: ActionType): State => {
  switch (action.type) {
    case "diceThrown": {
      return {
        ...state,
        dice: action.payload,
        gameState: { type: "interactWithEnemy" },
        doEffect: { type: "!getBattleResult" },
      };
    }

    default:
      return state;
  }
};

type TargerCard = {
  index: number;
  card: CardItem;
};

const selectCard = (state: State, action: ActionType) => {
  const { numberOfPlayer } = state;
  switch (action.type) {
    case "cardChoosed": {
      const newPlayerList = changeSelectedCard(state, action.payload.index);

      const hasAnyCardSelected = newPlayerList[numberOfPlayer].inventory.find(
        (card) => {
          return card?.isSelected === true;
        }
      )
        ? true
        : false;

      const cardType = action.payload.card?.name;
      // The difference between weaponCard and other  card that weapon are usedin the battle.
      //Obviously we need other stateWithoutSelectedCard for weapon
      const stateWithSelectedCard: State = {
        ...state,
        playerList: newPlayerList,
        gameState: { type: "interactWithEnemy.applyCard" },
      };

      const stateWithoutSelectedCard: State = {
        ...state,
        playerList: newPlayerList,
        gameState: { type: "interactWithEnemy.makeBattleAction" },
      };

      switch (hasAnyCardSelected) {
        case true:
          return stateWithSelectedCard;
        case false:
          return stateWithoutSelectedCard;
      }
    }
    default: {
      return state;
    }
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
