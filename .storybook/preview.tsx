import { ChakraProvider } from "@chakra-ui/react";
import type { Preview } from "@storybook/nextjs";
import React from "react";

import "@/styles/variable.css";
import theme from "@/theme";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  // @chakra-ui/storybook-addon은 Storybook 9에서 삭제된 @storybook/types에
  // peer를 걸고 있어 설치할 수 없다. 동일 효과를 decorator로 직접 구현한다.
  decorators: [
    (Story) => (
      <ChakraProvider theme={theme}>
        <Story />
      </ChakraProvider>
    ),
  ],
};

export default preview;
