import { useContext } from "react";
import styled from "styled-components";

import { DragItem } from "./DragItem";

import { IndexedListType } from "../types";
import { AppContext } from "../AppContext";
import { DropItem } from "./DropItem";

const Wrapper = styled.div`
  width: 890px;
`;

const DragContainer = styled.div`
  width: 100%;
  height: 300px;
  padding: 23px;
  border: 1px solid green;
`;

const DropContainer = styled.div`
  width: 100%;
  height: 223px;
  padding: 23px;
  border: 1px solid black;
`;

//TODO: добавлен рандом
const getDragList = (list: IndexedListType[]) => {
  console.log("list", list);
  return list.map((item) => {
    return <DragItem item={item.value} keyIndex={item.position} />;
  });
};

const getDropList = (list: IndexedListType[]) => {
  return list.map((item) => {
    return <DropItem item={item.value} keyIndex={item.position} />;
  });
};

const createIndexedTable = (
  list: Array<number | string>
): Array<IndexedListType> => {
  return list.map((item, index) => {
    return { position: index, value: item };
    // return { index: item };
  });
};

export const ViewContainer = () => {
  const { randomList, list } = useContext(AppContext);

  // console.log("randomList", randomList);
  // console.log("list", list);

  return (
    <Wrapper>
      <DragContainer>{getDragList(randomList)}</DragContainer>
      <DropContainer>{getDropList(list)}</DropContainer>
    </Wrapper>
  );
};
