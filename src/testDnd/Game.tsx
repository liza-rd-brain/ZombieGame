import React, { useState } from "react";

import { useDrag, useDrop } from "react-dnd";

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { AppContext } from "./AppContext";
import { ITEM_LIST } from "./common";
import { getRandomList } from "./common/getRandomList";
// import { Container } from "../components/test/Container";
import { ViewContainer } from "./components/ViewContainer";
import { IndexedListType } from "./types";

// const ItemObj = {

// };

const createIndexedTable = (
  list: Array<number | string>
): Array<IndexedListType> => {
  return list.map((item, index) => {
    return { position: index, value: item };
    // return { index: item };
  });
};

const Game = () => {
  const currIndexedList = createIndexedTable(ITEM_LIST);

  type RefStateType = { list: Array<IndexedListType> };

  const initialState: RefStateType = { list: currIndexedList };
  const randomList = getRandomList(currIndexedList);

  const [state, setState] = useState(initialState);
  return (
    <>
      <DndProvider backend={HTML5Backend}>
        {/* <Container /> */}
        <AppContext.Provider
          value={{
            randomList: randomList,
            list: currIndexedList,
          }}
        >
          <ViewContainer />
        </AppContext.Provider>
      </DndProvider>
    </>
  );
};

export default Game;
