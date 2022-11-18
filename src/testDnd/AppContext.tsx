import { createContext, MutableRefObject } from "react";
import { IndexedListType } from "./types";

//TODO: добавить scraping string
type ContextType = {
  randomList: IndexedListType[];
  list: IndexedListType[];
};

type EmptyContextType = Record<string, never>;

export const AppContext = createContext<ContextType | EmptyContextType>({});
