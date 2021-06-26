import styled from "styled-components";
import img from "./brain.svg";

type CommonCardType = {
  className?: string;
};

const StyledCommonCard = styled.div`
  position: absolute;
  border: 1px solid;
  width: 34px;
  height: 34px;
  margin: 4px;
  background-color: #b8b47d;
  background-image: url(${img});
  background-size: 30px;
  background-blend-mode: soft-light;
  background-repeat: no-repeat;
  background-position: 1px;
`;

export const CommonCard = (props: any) => (
  <StyledCommonCard {...props}></StyledCommonCard>
);
