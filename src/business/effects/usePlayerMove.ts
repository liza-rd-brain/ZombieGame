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

        case "!getPlayerMoveResult": {
          dispatch({
            type: "req-getPlayerMoveResult",
          });
          break;
        }
        case "!getDeadPlayerMoveResult": {
          const timerMoveResult = setTimeout(
            () =>
              dispatch({
                type: "req-getDeadPlayerMoveResult",
              }),
            500
          );

          return () => {
            clearTimeout(timerMoveResult);
          };
        }

        default:
          break;
      }
    },
    //eslint-disable-next-line
    [doEffect]
  );
}
