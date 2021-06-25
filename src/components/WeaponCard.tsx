import styled from "styled-components";
import { CommonCard } from "./CommonCard/CommonCard";

type WeaponApperanceType = {
  apperance?: "closed" | "open";
};

const StyledWeaponCard = styled(CommonCard)<WeaponApperanceType>`
  color: red;
  font-size: 20px;
  text-align: center;
  background-color: ${(props) => {
    if (props.apperance !== "closed") {
      return "white";
    } else {
      return "";
    }
  }};

  border-color: ${(props) => {
    if (props.apperance === "closed") {
      return "gray";
    } else {
      return "gray";
    }
  }};
`;

export const WeaponCard = (props: WeaponApperanceType) => {
  return (
    <StyledWeaponCard {...props}>
      {props.apperance === "closed" ? null : "O"}
    </StyledWeaponCard>
  );
};
