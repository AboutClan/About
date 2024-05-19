import { motion } from "framer-motion";
import { useEffect } from "react";
import { useRecoilState } from "recoil";

import { slideDirectionState } from "../../recoils/navigationRecoils";
interface IPageLayout {
  isFixed?: boolean;
  posZero?: "top";
  children: React.ReactNode;
}

function Slide({ children, isFixed, posZero }: IPageLayout) {
  const [slideDirection, setSlideDirection] = useRecoilState(slideDirectionState);

  useEffect(() => {
    setSlideDirection("right");
  }, []);

  const variants = {
    hidden: (direction) => ({
      x: direction === "left" ? -375 : 375,
      opacity: 0,
    }),
    visible: {
      x: 0,
      opacity: 1,
    },
  };

  const animationProps = slideDirection
    ? {
        initial: "hidden",
        animate: "visible",
        custom: slideDirection,
        variants: variants,
        transition: { duration: 0.5 },
      }
    : {};
 
  return (
    <>
      <motion.div
        {...animationProps}
        style={{
          position: isFixed ? "fixed" : "static",
          zIndex: isFixed ? 100 : 0,
          width: "100%",
          maxWidth: "390px",

          height: isFixed ? "min-content" : "max-content",
          top: posZero !== "top" ? 0 : "auto",

          bottom: posZero !== "top" ? "auto" : 0,
        }}
      >
        {children}
      </motion.div>
      {/* {slideDirection && isFirstRender.current ? (
        <ChakraSlide
          direction={slideDirection}
          in={true}
          style={{
            position: isFixed ? "fixed" : "static",
            zIndex: isFixed ? 100 : 0,
            height: isFixed ? "min-content" : "max-content",
            top: posZero === "top" ? null : 0,
          }}
        >
          {children}
        </ChakraSlide>
      ) : (
        <Box
          position={isFixed ? "fixed" : "static"}
          top={posZero !== "top" && 0}
          bottom={posZero === "top" && 0}
          w="100%"
          zIndex={20}
        >
          {children}
        </Box>
      )} */}
    </>
  );
}

export default Slide;
