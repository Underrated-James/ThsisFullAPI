import styled from "styled-components";
import pipeImg from "../images/pipe-red.png";

interface PipeProps {
  height: number;
  width: number;
  left: number;
  top: number;
  deg?: number;
}

const Pipe = styled.div<PipeProps>`
  position: absolute;
  background-image: url(${pipeImg});
  width: ${(props) => props.width}px;
  height: ${(props) => props.height}px;
  left: ${(props) => props.left}px;
  top: ${(props) => props.top}px;
  transform: rotate(${(props) => props.deg}deg);
`;

export default Pipe;
