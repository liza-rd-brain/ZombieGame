import React from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";

const HealthItem = styled.div`
     border: 10px solid green;
    /* border-radius: 50%; */
    width: 10px;
    height: 10px;
    background-color: green;
    position: absolute;
    top: 0px;
    left: 0px;
/*   bottom: ${(props) => `${props.vert * 32 + 4}px`};
  left: ${(props) => `${props.hor * 30 + 4}px`}; */
`;

function Health(props) {
  const healthCoord = useSelector((state) => state.healthCoord);

  if (
    healthCoord.findIndex((item) => {
      return item.hor === props.hor && item.vert === props.vert;
    }) != -1
  ) {
    return (
      <HealthItem
        key={`${props.hor}${props.vert}`}
        hor={props.hor}
        vert={props.vert}
      ></HealthItem>
    );
  } else return <></>;
}

export default Health;
