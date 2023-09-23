import { motion } from "framer-motion";
import styled from "styled-components";
import { Size } from "../../types/system";

interface IModalLayout {
  children: React.ReactNode;
  size: Size;
  height?: number;
  width?: boolean;
}

export const ModalLayout = ({
  children,
  size,
  height,
  width,
}: IModalLayout) => (
  <Layout
    size={size}
    width={width}
    height={height}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{
      duration: 0.5,
      ease: "easeInOut",
    }}
  >
    {children}
  </Layout>
);

export const PopUpLayout = ({ children, size }: IModalLayout) => (
  <Layout size={size}>{children}</Layout>
);

const SIZE_HEIGHT_MAP = {
  xxl: "500px",
  xl: "400px",
  lg: "300px",
  md: "240px",
  sm: "180px",
  xs: "120px",
};

const Layout = styled(motion.div)<{
  size: Size;
  height?: number;
  width?: boolean;
}>`
  width: ${(props) => (props.width ? "330px" : "340px")};
  height: ${(props) =>
    props.height ? `${props?.height}px` : SIZE_HEIGHT_MAP[props.size]};
  padding: var(--padding-main);
  background-color: white;
  border-radius: var(--border-radius-main);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 20;
`;