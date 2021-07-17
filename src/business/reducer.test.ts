import { initialState } from "./initialState";
import { reducer } from "./reducer";
import { State, BarrierList, BarrierItem, SwitchedBarrierItem } from "./types";

test("test initial state", () => {
  const newState = reducer(initialState, {} as any);
  expect(newState).toEqual(initialState);
});
