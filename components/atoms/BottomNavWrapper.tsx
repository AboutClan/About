import { Box } from "@chakra-ui/react";

interface BottomNavWrapperProps {
  children: React.ReactNode;
}

function BottomNavWrapper({ children }: BottomNavWrapperProps) {
  return (
    <Box p={5} mb={2} position="absolute" bottom="0" w="100%">
      {children}
    </Box>
  );
}

export default BottomNavWrapper;
