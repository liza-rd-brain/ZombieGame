import styled, { css } from "styled-components";
import img from "./brain.svg";

export const StyledCommonCard = css`
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
