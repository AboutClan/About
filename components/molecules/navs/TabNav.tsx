import { Tab, TabList, Tabs } from "@chakra-ui/react";
export interface ITabNavOptions {
  text: string;
  func: () => void;
  flex?: 1;
}

interface ITabNav {
  selected?: string;
  tabOptionsArr: ITabNavOptions[];
  hasBorder?: boolean;
  isMain?: boolean;
}

export default function TabNav({
  selected,
  tabOptionsArr,
  hasBorder = true,
  isMain = false,
}: ITabNav) {
  const idx = tabOptionsArr.findIndex((tab) => tab.text === selected);

  return (
    <>
      <Tabs
        index={selected ? idx : undefined}
        color="var(--gray-500)"
        colorScheme="mintTheme"
        bgColor="white"
      >
        <TabList
          display="flex"
          flexWrap="nowrap"
          overflowX="scroll"
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
          {tabOptionsArr.map((tab) => (
            <Tab
              display="flex"
              flexShrink="0 !important"
              fontSize="inherit"
              fontWeight={600}
              p={!isMain ? "8px 20px" : "8px 16px"}
              flex={tab?.flex}
              key={tab.text}
              onClick={tab.func}
            >
              {tab.text}
            </Tab>
          ))}
        </TabList>
      </Tabs>
    </>
  );
}
