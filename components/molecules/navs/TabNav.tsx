import { Tab, TabList, Tabs } from "@chakra-ui/react";
import styled from "styled-components";
export interface ITabNavOptions {
  text: string;
  func: () => void;
  flex?: 1;
}

interface ITabNav {
  selected?: string;
  tabOptionsArr: ITabNavOptions[];
}

export default function TabNav({ selected, tabOptionsArr }: ITabNav) {
  const idx = tabOptionsArr.findIndex((tab) => tab.text === selected);

  return (
    <>
      <Tabs index={selected ? idx : undefined} colorScheme="mintTheme" bgColor="white">
        <CustomTabList>
          {tabOptionsArr.map((tab) => (
            <CustomTab flex={tab?.flex} key={tab.text} onClick={tab.func}>
              {tab.text}
            </CustomTab>
          ))}
        </CustomTabList>
      </Tabs>
    </>
  );
}
const CustomTabList = styled(TabList)`
  display: flex;
  flex-wrap: nowrap;
  overflow-x: scroll;
  padding-bottom: 2px;
  &::-webkit-scrollbar {
    display: none; /* 스크롤바를 숨기는 옵션 */
  }
`;

const CustomTab = styled(Tab)`
  flex-shrink: 0 !important;
`;
