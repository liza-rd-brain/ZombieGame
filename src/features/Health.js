import React from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";

const HealthItem = styled.div`
     border: 10px solid;
     background-color: ${(props) => {
       switch (props.type) {
         case "increment":
           return "green";
         case "decrement":
           return "gray";
         default:
           break;
       }
     }};
     border-color:${(props) => {
       switch (props.type) {
         case "increment":
           return "green";
         case "decrement":
           return "gray";
         default:
           break;
       }
     }};
    /* border-radius: 50%; */
    width: 10px;
    height: 10px;
   
    position: absolute;
    top: 0px;
    left: 0px;
/*   bottom: ${(props) => `${props.vert * 32 + 4}px`};
  left: ${(props) => `${props.hor * 30 + 4}px`}; */
`;

function Health(props) {
  const healthList = useSelector((state) => state.healthList);
  /*находим индех из списка карточек здоровья*/

  const index = healthList.findIndex((item) => {
    return item.hor === props.hor && item.vert === props.vert;
  });
  /*если в этой ячейке есть элемент здоровья*/
  if (index != -1) {
    /*вытаскиваем ее тип*/

    const currType = healthList[index].type;
    return (
      <HealthItem
        key={`${props.hor}${props.vert}`}
        hor={props.hor}
        vert={props.vert}
        type={currType}
      ></HealthItem>
    );
  } else return <></>;
}

export default Health;
