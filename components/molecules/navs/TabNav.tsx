import { Tab, TabList, Tabs } from "@chakra-ui/react";
export interface ITabNavOptions {
  text: string;
  func: () => void;
}

interface ITabNav {
  selected?: string;
  tabOptionsArr: ITabNavOptions[];
  hasBorder?: boolean;
  isMain?: boolean;
  isFullSize?: boolean;
  isBlack?: boolean;
}

export default function TabNav({
  selected,
  tabOptionsArr,
  hasBorder = true,
  isMain = false,
  isFullSize,
  isBlack,
}: ITabNav) {
  const idx = tabOptionsArr.findIndex((tab) => tab.text === selected);

  return (
    <>
      <Tabs
        index={selected ? idx : undefined}
        color="var(--gray-500)"
        colorScheme={!isBlack ? "mint" : "black"}
        bgColor="white"
        height="44px"
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
              fontSize="13px"
              fontWeight={index === idx ? 600 : 400}
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
            >
              {tab.text}
            </Tab>
          ))}
        </TabList>
      </Tabs>
    </>
  );
}
