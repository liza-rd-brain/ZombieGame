import styled from "styled-components";
import { StyledCommonCard } from "../CommonCard/CommonCard";
import img from "./health.png";

type HealthAppearanceType = {
  appearance?: "closed" | "open";
  className?: string;
};

export const StyledHealthCard = styled.div<HealthAppearanceType>`
  ${StyledCommonCard}
  background-color: ${(props) => {
    if (props.appearance === "open") {
      return "unset";
    }
  }};

  background-image: ${(props) => {
    if (props.appearance === "open") {
      return `url(${img})`;
    }
  }};
`;

export const Health = (props: HealthAppearanceType) => {
  return <StyledHealthCard {...props}></StyledHealthCard>;
};
