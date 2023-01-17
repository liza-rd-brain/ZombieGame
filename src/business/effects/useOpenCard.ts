import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { State } from "../types";

export function useOpenCard() {
  const doEffect = useSelector((state: State) => state.doEffect);
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

        case "!takeCard": {
          dispatch({
            type: "req-takeCard",
          });
          break;
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
