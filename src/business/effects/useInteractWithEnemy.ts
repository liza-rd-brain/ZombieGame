import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { State } from "../types";

export function useInteractWithEnemy() {
  const [doEffect] = useSelector((state: State) => [state.doEffect]);
  const dispatch = useDispatch();

  useEffect(() => {
    switch (doEffect?.type) {
      case "!checkAppearanceEnemyCard": {
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
          2000
        );

        return () => {
          clearTimeout(timerGetResult);
        };
      }

      case "!removeEnemyCard": {
        const timerRemoveEnemy = setTimeout(
          () => dispatch({ type: "req-removeEnemyCard" }),
          1000
        );
        return () => {
          clearTimeout(timerRemoveEnemy);
        };
      }
      default: {
        break;
      }
    }
    //eslint-disable-next-line
  }, [doEffect]);
}
