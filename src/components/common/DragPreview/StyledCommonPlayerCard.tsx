import styled from "styled-components";

export const StyledCommonPlayerCard = styled.div<{
  image: string;
  isCurrent: boolean;
}>`
  width: 50px;
  height: 50px;
  margin: 0px;
  text-align: center;
  padding: 2px;
  box-sizing: border-box;
  cursor: default;
  background-repeat: no-repeat;
  background-position: 0px;
  background-size: 44px;
  background-position: 3px;
  border-radius: 6px;

  background-image: ${(props) => {
    return `url(${props.image})`;
  }};

  box-shadow: ${(props) => {
    if (props.isCurrent) {
      return "inset 0px 0px 4px 3px #3e3ab7d4";
    }
  }};
  padding: 0px;

  &:before {
    content: "";
    position: absolute;
    width: 24px;
    height: 24px;
    border-radius: 1px;

    pointer-events: none;
    opacity: 0.5;
    padding: 4px;
    left: 4px;
    top: 4px;
  }
`;
