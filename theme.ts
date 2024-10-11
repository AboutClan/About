import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  styles: {
    global: {
      body: {
        color: "var(--gray-800)",
      },
    },
  },

  colors: {
    gray: {
      50: "#f5f5f5",
      100: "#eeeeee",
      200: "#e0e0e0",
      300: "#bdbdbd",
      400: "#9e9e9e",
      500: "#757575",
      600: "#616161",
      700: "#424242",
      800: "#424242",
    },
    badgePink: {
      100: "#FEE7E7",
      800: "#FF69B4",
    },
    badgeBrown: {
      100: "#D2B48C",
      800: "#6B4226",
    },
    badgeMojito: {
      100: "#E0F2F1",
      800: "#006400",
    },

    badgeMint: {
      100: "#E6FFFA",
      800: "#00c2b3",
    },
    badgeOcean: {
      100: "#F0F8FF",
      800: "#1E90FF",
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
    grayTheme: {
      100: "#9e9e9e",
      500: "#9e9e9e",
      800: "#9e9e9e",
    },
    redTheme: {
      100: "#f26363",
      500: "#f26363",
      600: "#f26363",
      800: "#ffffff",
    },
    yellowTheme: {
      500: "#ffa500",
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
        _disabled: {
          opacity: 0.6,
        },
      },
      sizes: {
        xs: {
          // width: "12px !important",
          // height: "12px",
          padding: 0,
        },

        md: {
          padding: "0 20px",
          h: "42px",
        },
        lg: {
          h: "48px",
          fontWeight: 700,
          fontSize: "14px",
        },
      },
      variants: {
        unstyled: {
          minWidth: "unset", // 최소 너비 제거

          padding: 0, // 패딩 제거
        },
      },
    },
  },
});

export default theme;
