import { Box } from "@chakra-ui/react";

interface AlertCirclePointProps {
  isActive: boolean;
}

function AlertCirclePoint({ isActive }: AlertCirclePointProps) {
  return (
    <Box
      w="6px"
      h="6px"
      p="1px"
      borderRadius="50%"
      bgColor={isActive ? "var(--color-red)" : "var(--color-gray)"}
    />
  );
}

export default AlertCirclePoint;
