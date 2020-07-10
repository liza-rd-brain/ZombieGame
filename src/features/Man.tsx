import React from "react";

import styled from "styled-components";

import { ManItem, CoordItem } from "./../app";

const ManItem = styled.div`
  border: 5px solid red;
  border-radius: 50%;
  width: 7px;
  height: 7px;
  background-color: red;
  position: absolute;
  top: 2px;
  left: 1px;
  z-index: 1;
`;

function Man() {
  return <ManItem></ManItem>;
}

export default Man;
