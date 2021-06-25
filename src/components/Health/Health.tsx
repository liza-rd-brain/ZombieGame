import styled from "styled-components";
import { CommonCard } from "../CommonCard/CommonCard";
import img from "./health3.png";

type HealthApperanceType = {
  apperance?: "closed" | "open";
  className?: string;
};

export const StyledHealthCard = styled(CommonCard)<HealthApperanceType>`
  background-color: ${(props) => {
    if (props.apperance === "open") {
      return "unset";
    }
  }};

  border-color: ${(props) => {
    if (props.apperance !== "open") {
      return "gray";
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
