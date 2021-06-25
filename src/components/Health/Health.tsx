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
    if (props.apperance !== "closed") {
      return "gray";
    } else {
      return "green";
    }
  }};

  background-image: ${(props) => {
    if (props.apperance === "open") {
      return `url(${img})`;
    } else {
      return "none";
    }
  }};
`;

export const Health = (props: HealthApperanceType) => {
  return <StyledHealthCard {...props}></StyledHealthCard>;
};
