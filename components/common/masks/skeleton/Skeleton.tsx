import { Skeleton as ChakraSkeleton } from "@chakra-ui/react";

interface ISkeleton {
  children: React.ReactNode;
  isLoad?: boolean;
}

function Skeleton({ children, isLoad }: ISkeleton) {
  return (
    <ChakraSkeleton
      borderRadius="8px"
      startColor="RGB(227, 230, 235)"
      endColor="rgb(246,247,249)"
      isLoaded={isLoad}
      height="100%"
      width="100%"
    >
      {children}
    </ChakraSkeleton>
  );
}

export default Skeleton;
