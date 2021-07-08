import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { State } from "../types";

export function usePlayerMove() {
  const [doEffect] = useSelector((state: State) => [state.doEffect]);
  const dispatch = useDispatch();

  useEffect(
    function playerMove() {
      switch (doEffect?.type) {
        case "!checkAvailableNeighboringCell": {
          dispatch({
            type: "req-checkAvailableNeighboringCell",
          });
          break;
        }

        case "!cleanMarkedCell": {
          const timerMarkCell = setTimeout(
            () =>
              dispatch({
                type: "req-cleanAvailableCells",
              }),
            0
          );
          return () => {
            clearTimeout(timerMarkCell);
          };
        }

        case "!getPlayerMoveResult": {
          dispatch({
            type: "req-getPlayerMoveResult",
          });
          break;
        }

        default:
          break;
      }
    },
    [doEffect]
  );
}
