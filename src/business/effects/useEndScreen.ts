import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { State } from "../types";

export function useEndScreen() {
  const dispatch = useDispatch();
  const gameState = useSelector((state: State) => state.gameState);

  useEffect(
    function getEndScreen() {
      switch (gameState.type) {
        case "endGame":
          const timer = setTimeout(
            () => dispatch({ type: "req-getEndScreen" }),
            1000
          );

          return () => clearTimeout(timer);

        default:
          break;
      }
    },
    [gameState.type, dispatch]
  );
}
