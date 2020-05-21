import React from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";

const ManItem = styled.div`
  border: 10px solid red;
  border-radius: 50%;
  width: 7px;
  height: 7px;
  background-color: red;
  position: absolute;
  top:2px;
  left: 1px;
/*   bottom: ${(props) => `${props.vert * 32 + 4}px`};
  left: ${(props) => `${props.hor * 30 + 4}px`}; */
`;

function Man() {
  /*   const state = useSelector((state) => state); */
  const [hor, vert] = useSelector((state) => [state.man.hor, state.man.vert]);
  return <ManItem hor={hor} vert={vert}></ManItem>;
}

export default Man;
