import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { State } from "../types";

export function useApplyCard() {
  const doEffect = useSelector((state: State) => state.doEffect);
  const dispatch = useDispatch();

  useEffect(
    function playerMove() {
      switch (doEffect?.type) {
        case "!checkAvailableNeighboringCards": {
          dispatch({
            type: "req-checkAvailableNeighboringCards",
          });
          break;
        }

        default:
          break;
      }
    },
    //eslint-disable-next-line
    [doEffect]
  );
}
