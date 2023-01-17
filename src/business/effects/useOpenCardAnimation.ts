import { useEffect, useReducer, useRef } from "react";
import { useSelector } from "react-redux";

import { State } from "../types";

type PhaseType = "waiting" | "running" | "ended";
type EffectType = null | "startEffect" | "stopEffect";

type ActionType =
  | { type: "start" }
  | { type: "stop" }
  | { type: "setTime" }
  | { type: "clearEffect" };

type TimerControlledType = {
  timeState: {
    timeMark: number;
    initialTimeMark: number;
  };
  phase: PhaseType;
  effect: EffectType;
};

// maxTime- in second
export function useOpenCardAnimation({
  needRun,
  maxTime,
  onTimerEnd,
}: {
  needRun: boolean;
  maxTime: number;
  onTimerEnd: () => void;
}) {
  // const { doEffect, playerList, activePlayerNumber } = useSelector(
  //   (state: State) => ({ ...state })
  // );
  const doEffect = useSelector((state: State) => state.doEffect);
  const cardRef = useRef<HTMLDivElement>();

  const initialTimeState = {
    timeMark: 0,
    initialTimeMark: 0,
  };

  const initialState: TimerControlledType = {
    timeState: initialTimeState,
    phase: "waiting",
    effect: null,
  };

  const reducer = (
    state: TimerControlledType,
    action: ActionType
  ): TimerControlledType => {
    switch (action.type) {
      case "start": {
        if (!state.effect) {
          const newTimeState = {
            ...state.timeState,
            timeMark: new Date().getTime(),
            initialTimeMark: new Date().getTime(),
          };
          return { ...state, timeState: newTimeState, effect: "startEffect" };
        } else {
          return state;
        }
      }

      case "stop": {
        return { ...state, effect: "stopEffect" };
      }
      default: {
        return state;
      }
    }
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(
    function openCardAnimation() {
      switch (doEffect?.type) {
        case "!openCard": {
          if (needRun) {
            //нужно запустить анимацию
            console.log("run open card animation");
            dispatch({ type: "start" });
          }

          break;
        }
        default: {
          break;
        }
      }
    },
    //eslint-disable-next-line
    [doEffect, needRun]
  );

  const getTimerValue = (currTime: number) => {
    const timeDiff = Math.floor(
      (currTime - state.timeState?.initialTimeMark) / 1000
    );
    const timeCurr = maxTime - timeDiff;
    return timeCurr >= 0 ? timeCurr : 0;
  };

  useEffect(() => {
    //ра3 в секунду проверяем не вышел ли таймер
    if (state.effect === "startEffect") {
      const intervalId = setInterval(() => {
        const currentTime = getTimerValue(new Date().getTime());

        // if (timerNodeRef.current) {
        //   timerNodeRef.current.innerHTML = newTimeString;
        // }

        if (currentTime <= 0) {
          clearInterval(intervalId);
          const timeoutId = setTimeout(() => onTimerEnd(), 1000);
          return () => {
            clearTimeout(timeoutId);
          };
        }
      }, 1000);

      return () => {
        clearInterval(intervalId);
      };
    } else if (state.effect === "stopEffect") {
      onTimerEnd();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.effect]);

  return { cardRef };
}
