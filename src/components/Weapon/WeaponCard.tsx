import styled from "styled-components";
import { StyledCommonCard } from "../CommonCard/CommonCard";
import img from "./weapon.png";

type WeaponAppearanceType = {
  appearance?: "closed" | "open";
};

const StyledWeaponCard = styled.div<WeaponAppearanceType>`
  ${StyledCommonCard}
  background-color: ${(props) => {
    if (props.appearance === "open") {
      return "unset";
    }
  }};

  border-color: ${(props) => {
    if (props.appearance === "open") {
      return "gray";
    }
  }};
  background-image: ${(props) => {
    if (props.appearance === "open") {
      return `url(${img})`;
    }
  }};
`;

export const WeaponCard = (props: WeaponAppearanceType) => {
  return (
    <StyledWeaponCard {...props}>
      {/*      {props.appearance === "closed" ? null : "O"} */}
    </StyledWeaponCard>
  );
};
