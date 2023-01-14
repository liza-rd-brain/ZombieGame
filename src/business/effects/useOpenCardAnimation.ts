import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { State } from "../types";

export function useOpenCardAnimation({ coord }: { coord: string }) {
  const { doEffect, playerList, activePlayerNumber } = useSelector(
    (state: State) => ({ ...state })
  );
  const currCoord = playerList[activePlayerNumber].coord;

  useEffect(
    function openCardAnimation() {
      switch (doEffect?.type) {
        case "!openCard": {
          /*    if (currCoord === coord) { */
          console.log("run open card animation");
          console.log(coord);
          /*      } */

          break;
          //   const timerOpen = setTimeout(
          //     () =>
          //       dispatch({
          //         type: "req-openCard",
          //       }),
          //     1000
          //   );
          //   return () => {
          //     clearTimeout(timerOpen);
          //   };
        }
        default: {
          break;
        }
      }
    },
    //eslint-disable-next-line
    [doEffect]
  );
}
