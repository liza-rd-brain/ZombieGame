import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { State } from "../types";

export function useOpenCard() {
  const [doEffect] = useSelector((state: State) => [state.doEffect]);
  const dispatch = useDispatch();

  useEffect(
    function openCard() {
      switch (doEffect?.type) {
        case "!checkApperanceInventoryCard": {
          dispatch({
            type: "req-checkInventoryCard",
          });
          break;
        }

        //TODO: here control need be given to hook for only card open animation!
        // case "!openCard": {
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
        // }

        case "!takeCard": {
          const timerTakeCard = setTimeout(
            () =>
              dispatch({
                type: "req-takeCard",
              }),
            5000
          );
          return () => {
            clearTimeout(timerTakeCard);
          };
        }

        case "!changePlayerHealth": {
          const timerChangePlayerHealth = setTimeout(
            () =>
              dispatch({
                type: "req-changePlayerHealth",
              }),
            500
          );
          return () => {
            clearTimeout(timerChangePlayerHealth);
          };
        }

        case "!deleteCard": {
          const timerDeleteCard = setTimeout(
            () =>
              dispatch({
                type: "req-deleteCard",
              }),
            500
          );
          return () => {
            clearTimeout(timerDeleteCard);
          };
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
