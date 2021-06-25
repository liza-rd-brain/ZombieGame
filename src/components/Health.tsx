import styled from "styled-components";
import { CommonCard } from "./CommonCard/CommonCard";

type HealthApperanceType = {
  apperance?: "closed" | "open";
  className?: string;
};

export const StyledHealthCard = styled(CommonCard)<HealthApperanceType>`
  background-color: ${(props) => {
    if (props.apperance !== "closed") {
      return "green";
    } else {
      return "";
    }
  }};

  border-color: ${(props) => {
    if (props.apperance === "closed") {
      return "gray";
    } else {
      return "green";
    }
  }};
`;

export const Health = (props: HealthApperanceType) => {
  return <StyledHealthCard {...props}></StyledHealthCard>;
};
