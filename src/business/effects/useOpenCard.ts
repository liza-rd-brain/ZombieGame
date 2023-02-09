import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { State } from "../types";

export function useOpenCard() {
  const doEffect = useSelector((state: State) => state.doEffect);
  const dispatch = useDispatch();

  useEffect(
    function openCard() {
      switch (doEffect?.type) {
        case "!checkAppearanceInventoryCard": {
          dispatch({
            type: "req-checkInventoryCard",
          });
          break;
        }

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
