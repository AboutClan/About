import { Box, Button, Flex } from "@chakra-ui/react";
import type { ReactNode } from "react";

import { ShortArrowIcon } from "../Icons/ArrowIcons";
import RightDrawer from "./drawer/RightDrawer";

export type MenuDrawerItem = {
  label: string;
  onClick: () => void;
  rightElement?: ReactNode;
  isDisabled?: boolean;
};

type MenuDrawerProps = {
  title: string;
  onClose: () => void;
  items: MenuDrawerItem[];
};

export default function MenuDrawer({ title, onClose, items }: MenuDrawerProps) {
  return (
    <RightDrawer title={title} onClose={onClose}>
      <Flex flexDir="column">
        {items.map((item, idx) => (
          <Button
            key={item.label}
            w="full"
            py={5}
            px={1}
            variant="unstyled"
            borderBottom="var(--border-main)"
            borderTop={idx === 0 ? "var(--border-main" : "none"}
            textAlign="start"
            onClick={item.onClick}
            isDisabled={item.isDisabled}
          >
            <Flex justify="space-between" align="center" fontSize="15px">
              <Box fontWeight={400}>{item.label}</Box>
              {item.rightElement ?? <ShortArrowIcon dir="right" color="gray" size="md" />}
            </Flex>
          </Button>
        ))}
      </Flex>
    </RightDrawer>
  );
}
