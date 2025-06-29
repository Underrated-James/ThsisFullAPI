import styled from "styled-components";
import birdImg from "../images/yellowbird-upflap.png";

interface BirdProps {
  height: number;
  width: number;
  top: number;
  left: number;
}


const Bird = styled.div<BirdProps>`
  position: absolute;
  background-image: url(${birdImg});
  background-repeat: no-repeat;
  background-size: ${(props) => props.width}px ${(props) => props.height}px;
  width: ${(props) => props.width}px;
  height: ${(props) => props.height}px;
  top: ${(props) => props.top}px;
  left: ${(props) => props.left}px;
`;

export default Bird;
