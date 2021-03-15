import React from "react";

import styled from "styled-components";

const WallItem = styled.div/* <CoordItem> */ `
  border: 5px solid;
  width: 5px;
  height: 5px;
  position: absolute;
  top: 5px;
  left: 5px;
  color: orange;
  background-color: orange;
`;

export const Wall = () => {
  return <WallItem></WallItem>;
};
