import { Progress } from "@chakra-ui/react";

interface IProgressBar {
  value: number;
  colorScheme?: "mintTheme";
  hasStripe?: boolean;
}

export default function ProgressBar({
  value,
  colorScheme = "mintTheme",
  hasStripe = false,
}: IProgressBar) {
  return <Progress value={value} colorScheme={colorScheme} hasStripe={hasStripe} />;
}
