import { Box, Flex, Switch } from "@chakra-ui/react";

interface FlexSwitchBlockProps {
  label: string;
  icon: JSX.Element;
  isChecked: boolean;
  onToggle: (checked: boolean) => void;
}

function FlexSwitchBlock({ label, icon, isChecked, onToggle }: FlexSwitchBlockProps) {
  return (
    <Flex borderBottom="var(--border)" p="16px 12px" justify="space-between" align="center">
      <Box display="flex" alignItems="center">
        {icon}
        <Box ml="8px">{label}</Box>
      </Box>
      <Switch
        colorScheme="mint"
        isChecked={isChecked}
        onChange={(e) => onToggle(e.target.checked)}
      />
    </Flex>
  );
}

export default FlexSwitchBlock;
