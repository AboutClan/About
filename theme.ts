import { inputAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers, extendTheme } from "@chakra-ui/react";

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(
  inputAnatomy.keys,
);

const baseStyle = definePartsStyle({
  // define the part you're going to style
  field: {},
});

export const inputTheme = defineMultiStyleConfig({ baseStyle });

const theme = extendTheme({
  styles: {
    global: {
      body: {
        color: "var(--gray-1)",
      },

      // "*:focus": {
      //   outlineColor: "black",

      //   borderColor: "red !important",
      // },
      // "*:active": {
      //   outline: "none",

      //   borderColor: "red",
      // },
    },
  },

  colors: {
    badgePink: {
      100: "#FEE7E7",
      800: "#FF69B4",
    },
    badgeMint: {
      100: "#E6FFFA",
      800: "#00c2b3",
    },
    redMy: "#ff6b6b",
    mint: "#00c2b3",
    my: {
      bg: "#FEE7E7",
      color: "#FF69B4",
    },
    mintTheme: {
      100: "#00c2b3",
      500: "#00c2b3",
      600: "#00c2b3",
      800: "#ffffff",
    },
    redTheme: {
      100: "#F56565",
      500: "#F56565",
      800: "#ffffff",
    },
    yellowTheme: {
      500: "#FEBC5A",
    },
    puppleTheme: {
      500: "#9E7CFF",
    },
  },
  fonts: {
    body: `apple, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu,
    Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif`,
  },
  components: {
    Input: inputTheme,
    Textarea: {
      baseStyle: {
        // 포커스 됐을 때의 스타일
        _focus: {
          borderColor: "blue.500", // 원하는 색상으로 변경
          boxShadow: `0 0 0 1px var(--chakra-colors-blue-500)`, // 해당 색상의 박스 쉐도우 추가 (선택적)
        },
      },
    },
    Badge: {
      baseStyle: {
        fontSize: "12px",
        lineHeight: 1.5,
        padding: "0px 4px",
      },
    },
    Button: {
      baseStyle: {
        borderRadius: "4px",
        _focus: {
          outline: "none",
          boxShadow: "none",
        },
      },
      sizes: {
        xs: {
          h: "24px",
        },

        md: {
          h: "42px",
        },
        lg: {
          h: "46px",
        },
      },
    },
    Progress: {
      baseStyle: {
        track: {
          bg: "var(--font-h7)",
        },
        filledTrack: {
          bg: "var(--color-mint)",
        },
      },
    },
  },
});

export default theme;
