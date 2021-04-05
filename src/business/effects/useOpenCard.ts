import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { State } from "../types";

export function useOpenCard() {
  const [doEffect] = useSelector((state: State) => [state.doEffect]);
  const dispatch = useDispatch();

  useEffect(
    function openCard() {
      switch (doEffect?.type) {
        case "!needOpenHealthCard": {
          const timerOpen = setTimeout(
            () =>
              dispatch({
                type: "openedHealthCard",
              }),
            1000
          );
          return () => {
            clearTimeout(timerOpen);
          };
        }

        case "!changePlayerHealth": {
          const timerChangePlayerHealth = setTimeout(
            () =>
              dispatch({
                type: "changedPlayerHealth",
              }),
            500
          );
          return () => {
            clearTimeout(timerChangePlayerHealth);
          };
        }
        case "!changeHealthList": {
          const timerChangeHealthList = setTimeout(
            () =>
              dispatch({
                type: "changedHealthList",
              }),
            500
          );
          return () => {
            clearTimeout(timerChangeHealthList);
          };
        }
        case "!getNextPlayer": {
          dispatch({ type: "receivedNextPlayer" });
          break;
        }

        case "!needCheckApperanCeEnemyCard": {
          dispatch({
            type: "checkApperanCeEnemyCard",
          });
          break;
        }

        case "!needOpenEnemyCard": {
          const timerOpen = setTimeout(
            () =>
              dispatch({
                type: "openedEnemyCard",
              }),
            1000
          );
          return () => {
            clearTimeout(timerOpen);
          };
        }

        case "!needGetBattleResult": {
          const timerGetResult = setTimeout(
            () => dispatch({ type: "getBattleResult" }),
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
