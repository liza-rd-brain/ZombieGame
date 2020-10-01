import React from "react";

import styled from "styled-components";

import { ManItem, CoordItem, ManList } from "./../app";

type ManArray = {
  list: ManList;
};

const ManItem = styled.div`
  border: 5px solid red;
  border-radius: 50%;
  width: 7px;
  height: 7px;
  background-color: red;
  top: 2px;
  left: 1px;
  z-index: 1;
`;

const ManList = styled.div`
  display: flex;
  position: absolute;
  z-index: 1;
`;

function Man(props: ManArray) {
  const manArray = props.list;
  return (
    <ManList>
      {manArray.map((item, index) => (
        <ManItem>{index}</ManItem>
      ))}
    </ManList>
  );
}

export default Man;
