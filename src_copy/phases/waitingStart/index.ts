
import {State, ActionType} from "../../app"

function waitingStart(action:ActionType,state:State):State {
  
    switch (action.type) {
        case "clickStartButton": {
          return {
            ...state,
            gameState: "gameStarted.trownDice",
          };
        }
        default:
          return state;
      }
}

export default waitingStart;