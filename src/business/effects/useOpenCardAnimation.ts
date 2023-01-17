import { useEffect } from "react";
import { useSelector } from "react-redux";

import { State } from "../types";

export function useOpenCardAnimation({
  coord,
  needRun,
}: {
  coord: string;
  needRun: boolean;
}) {
  // const { doEffect, playerList, activePlayerNumber } = useSelector(
  //   (state: State) => ({ ...state })
  // );
  const doEffect = useSelector((state: State) => state.doEffect);
  const playerList = useSelector((state: State) => state.playerList);
  const activePlayerNumber = useSelector(
    (state: State) => state.activePlayerNumber
  );

  const currCoord = playerList[activePlayerNumber].coord;

  useEffect(
    function openCardAnimation() {
      switch (doEffect?.type) {
        case "!openCard": {
          if (needRun) {
            console.log("run open card animation");
            console.log(coord);
          }

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
