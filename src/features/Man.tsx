import React from "react";

import styled from "styled-components";

import { HealthItem, CoordItem } from "./../app";

const ManItem = styled.div<CoordItem>`
  border: 10px solid red;
  border-radius: 50%;
  width: 7px;
  height: 7px;
  background-color: red;
  position: absolute;
  top: 2px;
  left: 1px;
  z-index: 1;
`;

function Man(props: HealthItem) {
  return <ManItem hor={props.hor} vert={props.vert}></ManItem>;
}

export default Man;
