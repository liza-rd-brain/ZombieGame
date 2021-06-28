import styled from "styled-components";
import { StyledCommonCard } from "../CommonCard/CommonCard";
import img from "./health.png";

type HealthApperanceType = {
  apperance?: "closed" | "open";
  className?: string;
};

export const StyledHealthCard = styled.div<HealthApperanceType>`
  ${StyledCommonCard}
  background-color: ${(props) => {
    if (props.apperance === "open") {
      return "unset";
    }
  }};

  background-image: ${(props) => {
    if (props.apperance === "open") {
      return `url(${img})`;
    }
  }};
`;

export const Health = (props: HealthApperanceType) => {
  return <StyledHealthCard {...props}></StyledHealthCard>;
};
