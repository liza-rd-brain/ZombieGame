import React from "react";

import styled from "styled-components";

import { ManItem, CoordItem, ManList } from "./../app";

type ManArray = {
  list: ManList;
};

const ManItem = styled.div`
  border: 5px solid red;
  border-radius: 50%;
  width: 5px;
  height: 5px;
  background-color: red;
  top: 2px;
  left: 1px;
  z-index: 1;
`;

const ManList = styled.div`
  display: flex;
  flex-wrap: wrap;
  position: absolute;
  z-index: 1;
  font-size: 10px;
  font-color: green;
  color: green;
`;

function Man(props: ManArray) {
  const manArray = props.list;
  return (
    <ManList>
      {manArray.map((item, index) => (
        <ManItem key={index}>{item.orderNumber}</ManItem>
      ))}
    </ManList>
  );
}

export default Man;
