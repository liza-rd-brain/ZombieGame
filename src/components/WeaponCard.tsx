import styled from "styled-components";

type WeaponApperanceType = {
  apperance?: "closed" | "open";
};

const StyledWeaponCard = styled.div<WeaponApperanceType>`
  position: absolute;
  border: 1px solid;
  width: 20px;
  height: 20px;
  margin: 12px;
  color: red;
  font-size: 20px;
  text-align: center;
  background-color: ${(props) => {
    if (props.apperance === "closed") {
      return "gray";
    } else {
      return "white";
    }
  }};

  border-color: ${(props) => {
    if (props.apperance === "closed") {
      return "gray";
    } else {
      return "gray";
    }
  }};
`;

export const WeaponCard = (props: WeaponApperanceType) => {
  return (
    <StyledWeaponCard {...props}>
      {props.apperance === "closed" ? null : "O"}
    </StyledWeaponCard>
  );
};
