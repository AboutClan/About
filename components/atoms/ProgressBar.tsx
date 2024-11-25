import { Progress } from "@chakra-ui/react";

interface IProgressBar {
  value: number;
  colorScheme?: "mint";
  hasStripe?: boolean;
  size?: "sm" | "md";
}

export default function ProgressBar({
  value,
  colorScheme = "mint",
  hasStripe = false,
  size,
}: IProgressBar) {
  return <Progress size={size} value={value} colorScheme={colorScheme} hasStripe={hasStripe} />;
}
