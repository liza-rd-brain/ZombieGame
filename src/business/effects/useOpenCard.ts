import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { State } from "../types";

export function useOpenCard() {
  const [doEffect] = useSelector((state: State) => [state.doEffect]);
  const dispatch = useDispatch();

  useEffect(
    function openCard() {
      switch (doEffect?.type) {
        case "!openHealthCard": {
          const timerOpen = setTimeout(
            () =>
              dispatch({
                type: "req-openHealthCard",
              }),
            1000
          );
          return () => {
            clearTimeout(timerOpen);
          };
        }

        case "!takeHealthCard": {
          const timerTakeHealthCard = setTimeout(
            () =>
              dispatch({
                type: "req-takeHealthCard",
              }),
            500
          );
          return () => {
            clearTimeout(timerTakeHealthCard);
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

        case "!deleteHealthCard": {
          const timerDeleteHealthCard = setTimeout(
            () =>
              dispatch({
                type: "req-deleteHealthCard",
              }),
            500
          );
          return () => {
            clearTimeout(timerDeleteHealthCard);
          };
        }
        case "!getNextPlayer": {
          dispatch({ type: "req-getNextPlayer" });
          break;
        }

        case "!checkApperanceEnemyCard": {
          dispatch({
            type: "req-checkEnemyCard",
          });
          break;
        }

        case "!openEnemyCard": {
          const timerOpen = setTimeout(
            () =>
              dispatch({
                type: "req-openEnemyCard",
              }),
            1000
          );
          return () => {
            clearTimeout(timerOpen);
          };
        }

        case "!getBattleResult": {
          const timerGetResult = setTimeout(
            () => dispatch({ type: "req-getBattleResult" }),
            1000
          );

          return () => {
            clearTimeout(timerGetResult);
          };
        }

        default:
          break;
      }
    },
    [doEffect]
  );
}
