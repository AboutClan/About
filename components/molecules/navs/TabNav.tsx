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
  isThick?: boolean;
}

export default function TabNav({
  selected,
  tabOptionsArr,
  hasBorder = true,
  isMain = false,
  isThick,
}: ITabNav) {
  const idx = tabOptionsArr.findIndex((tab) => tab.text === selected);
 
  return (
    <>
      <Tabs
        index={selected ? idx : undefined}
        color={isThick ? "var(--gray-600)" : "var(--gray-500)"}
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
          {tabOptionsArr.map((tab, index) => (
            <Tab
              display="flex"
              flexShrink="0 !important"
              fontSize="inherit"
              fontWeight={isThick ? 600 : index === idx || idx === -1 ? 600 : 400}
              p={!isMain ? "8px 20px" : "8px 16px"}
              flex={tab?.flex}
              key={tab.text}
              onClick={tab.text !== selected ? tab.func : undefined}
            >
              {tab.text}
            </Tab>
          ))}
        </TabList>
      </Tabs>
    </>
  );
}
