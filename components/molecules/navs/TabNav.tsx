import { Box, Tab, TabList, Tabs } from "@chakra-ui/react";

import AlertDot from "../../atoms/AlertDot";
export interface ITabNavOptions {
  text: string;
  func: () => void;
  isAlert?: boolean;
}

interface ITabNav {
  selected?: string;
  tabOptionsArr: ITabNavOptions[];
  hasBorder?: boolean;
  isMain?: boolean;
  isFullSize?: boolean;
  isBlack?: boolean;
  size?: "md" | "lg" | "xl";
}

export default function TabNav({
  selected,
  tabOptionsArr,
  hasBorder = true,
  isMain = false,
  isFullSize,
  isBlack,
  size = "md",
}: ITabNav) {
  const idx = tabOptionsArr.findIndex((tab) => tab.text === selected);

  return (
    <>
      <Tabs
        index={selected ? idx : undefined}
        color={size === "md" ? "var(--gray-500)" : "var(--color-gray)"}
        colorScheme={!isBlack ? "mint" : "black"}
        bgColor="white"
        height="44px"
        id="tabs-default"
      >
        <TabList
          height="44px"
          display="flex"
          flexWrap="nowrap"
          overflowX="scroll"
          borderBottom="var(--border)"
          pb="2px"
          sx={{
            "&::-webkit-scrollbar": {
              display: "none",
            },
            ...(!hasBorder && {
              borderBottom: "none",
              boxShadow: "none",
            }),
          }}
        >
          {tabOptionsArr.map((tab, index) => (
            <Tab
              display="flex"
              flexShrink="0 !important"
              fontSize={size === "md" ? "13px" : size === "xl" ? "18px" : "16px"}
              fontWeight={index === idx ? (size === "md" ? 600 : 800) : size === "md" ? 400 : 800}
              p={!isMain ? "8px 20px" : "8px 12px"}
              flex={isFullSize ? 1 : undefined}
              key={tab.text}
              color={tab.text === selected ? (isBlack ? "black" : "mint") : undefined}
              onClick={tab.text !== selected ? tab.func : undefined}
              whiteSpace="nowrap"
              _focus={{
                outline: "none",
                boxShadow: "none",
              }}
              pos="relative"
            >
              {tab.text}
              {tab?.isAlert && (
                <Box pos="absolute" bottom={2} right={2}>
                  <AlertDot />
                </Box>
              )}
            </Tab>
          ))}
        </TabList>
      </Tabs>
    </>
  );
}
