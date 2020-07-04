import React from "react";
import styled from "styled-components";
import { CoordItem } from "./../app";

const WallItem = styled.div<CoordItem>`
  border: 5px solid;
  width: 5px;
  height:5px;
  position: absolute;
  top: 5px;
  left: 5px;
  color: orange;
  background-color: orange;
`;

function Wall(props: CoordItem) {
  return <WallItem hor={props.hor} vert={props.vert}></WallItem>;
}
export default Wall;
