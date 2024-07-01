import { Skeleton as ChakraSkeleton, SkeletonProps } from "@chakra-ui/react";
import { PropsWithChildren } from "react";

interface ISkeleton extends Pick<SkeletonProps, "isLoaded"> {}

function Skeleton({ children, isLoaded = false }: PropsWithChildren<ISkeleton>) {
  return (
    <ChakraSkeleton
      borderRadius="8px"
      startColor="RGB(227, 230, 235)"
      endColor="rgb(246,247,249)"
      isLoaded={isLoaded}
      height="100%"
      width="100%"
    >
      {children}
    </ChakraSkeleton>
  );
}

export default Skeleton;
