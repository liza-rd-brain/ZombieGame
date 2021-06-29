import styled from "styled-components";
import { StyledCommonCard } from "../CommonCard/CommonCard";
import img from "./weapon.png";

type WeaponApperanceType = {
  apperance?: "closed" | "open";
};

const StyledWeaponCard = styled.div<WeaponApperanceType>`
  ${StyledCommonCard}
  background-color: ${(props) => {
    if (props.apperance === "open") {
      return "unset";
    }
  }};

  border-color: ${(props) => {
    if (props.apperance === "open") {
      return "gray";
    }
  }};
  background-image: ${(props) => {
    if (props.apperance === "open") {
      return `url(${img})`;
    }
  }};
`;

export const WeaponCard = (props: WeaponApperanceType) => {
  return (
    <StyledWeaponCard {...props}>
      {/*      {props.apperance === "closed" ? null : "O"} */}
    </StyledWeaponCard>
  );
};
