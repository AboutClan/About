import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  styles: {
    global: {
      body: {
        color: "var(--gray-800)",
      },
    },
  },
  semanticTokens: {
    colors: {
      mint: {
        default: "mint.500",
        _dark: "mint.300",
      },
      red: {
        default: "red.500", // 기본으로 red.500을 매칭
        _dark: "red.400", // 다크 모드 시 red.400 사용 (선택)
      },
      orange: {
        default: "orange.500",
        _dark: "orange.400",
      },
      yellow: {
        default: "yellow.500",
        _dark: "yellow.400",
      },
      green: {
        default: "green.500",
        _dark: "green.400",
      },
      teal: {
        default: "teal.500",
        _dark: "teal.400",
      },
      blue: {
        default: "blue.500",
        _dark: "blue.400",
      },
      cyan: {
        default: "cyan.500",
        _dark: "cyan.400",
      },
      purple: {
        default: "purple.500",
        _dark: "purple.400",
      },

      gray: {
        default: "gray.500",
        _dark: "gray.400",
      },
    },
  },

  colors: {
    gray: {
      50: "#fafafa",
      100: "#f5f5f5",
      200: "#eeeeee",
      300: "#e0e0e0",
      400: "#bdbdbd",
      500: "#9e9e9e",
      600: "#757575", // 명도 46% (유지)
      700: "#616161",
      800: "#424242",
      900: "black",
    },
    black: {
      500: "#303030", // 명도 46% (유지)
    },
    mint: {
      50: "#e0f7f5",
      100: "#b3ece7",
      200: "#80e0d8",
      300: "#4dd4c8",
      400: "#26cabc",
      500: "#00c2b3", // 명도 50% (유지)
      600: "#00a99d",
      700: "#008f85",
      800: "#007569",
      900: "#00594e",
    },
    red: {
      50: "#ffe5e5",
      100: "#ffb3b3",
      200: "#ff9999",
      300: "#ff7f7f", // 명도 58% (조정)
      400: "#ff7070",
      500: "#ff6969", // 명도 58% (조정)
      600: "#e06060",
      700: "#c05050",
      800: "#993d3d",
      900: "#662626",
    },
    orange: {
      50: "#fff3e0",
      100: "#ffe0b3",
      200: "#ffc880",
      300: "#ffb14d", // 명도 60% (조정)
      400: "#ff9f26",
      500: "#ffa501", // 명도 62% (유지)
      600: "#e59400",
      700: "#b37400",
      800: "#805500",
      900: "#4d3300",
    },
    yellow: {
      50: "#fffbea",
      100: "#fff3c4",
      200: "#fce588",
      300: "#fadb5f", // 명도 58% (조정)
      400: "#f7c948",
      500: "#faca15", // 명도 62% (유지)
      600: "#e3ac0d",
      700: "#c49508",
      800: "#a37805",
      900: "#7a5303",
    },
    green: {
      50: "#e0f8f5", // 아주 연한 녹색
      100: "#b3ede7", // 밝은 파스텔 녹색
      200: "#80e0d8", // 부드러운 녹색
      300: "#4dd4c8", // 약간 진한 녹색
      400: "#26cabc", // 포인트용 녹색
      500: "#11b1a7", // 메인 녹색 (기준)
      600: "#0e988f", // 어두운 녹색
      700: "#0c7f77", // 차분한 어두운 녹색
      800: "#095f5a", // 더 깊고 어두운 녹색
      900: "#063f3c", // 가장 어두운 녹색
    },
    teal: {
      50: "#e6fcf5",
      100: "#c3f7e6",
      200: "#96efd4",
      300: "#63e6be", // 명도 55% (유지)
      400: "#38d9a9",
      500: "#20c997", // 명도 55% (유지)
      600: "#1aa581",
      700: "#178f6e",
      800: "#116c52",
      900: "#0b4936",
    },
    blue: {
      50: "#e3f2ff",
      100: "#b3daff",
      200: "#80c2ff",
      300: "#4da9ff", // 명도 54% (조정)
      400: "#2694ff",
      500: "#007dfb", // 명도 51% (유지)
      600: "#006cd1",
      700: "#005aa8",
      800: "#004680",
      900: "#002d52",
    },
    cyan: {
      50: "#e0f7fa",
      100: "#b3ebf2",
      200: "#80dee8",
      300: "#4dd0e1", // 명도 54% (조정)
      400: "#26c6da",
      500: "#00bcd4", // 명도 54% (유지)
      600: "#00a3ba",
      700: "#008b9e",
      800: "#006f7d",
      900: "#004d52",
    },
    purple: {
      50: "#f3e0f7",
      100: "#e2b3ea",
      200: "#d180dd",
      300: "#c04dd0", // 명도 60% (조정)
      400: "#b33fc9",
      500: "#bb57d5", // 명도 63% (유지)
      600: "#9a46b3",
      700: "#7a3690",
      800: "#5a266d",
      900: "#3a184a",
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
    // mint: "#00c2b3",
    my: {
      bg: "#FEE7E7",
      color: "#FF69B4",
    },
    grayTheme: {
      100: "#9e9e9e",
      500: "#9e9e9e",
      800: "#9e9e9e",
    },

    yellowTheme: {
      500: "#ffa500",
    },
  },
  fonts: {
    body: `apple, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu,
    Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif`,
  },
  components: {
    Badge: {
      baseStyle: {
        padding: "0px 4px",
      },
      variants: {
        solid: (props) => ({
          bg: `${props.colorScheme === "gray" ? "gray.100" : `${props.colorScheme}.500`}`,
          color: `${props.colorScheme === "gray" ? "gray.600" : `white`}`,
        }),
        subtle: (props) => ({
          ...(props.colorScheme === "gray" && {
            bg: "gray.200",
            color: "gray.600",
          }),
        }),
      },
      defaultProps: {
        variant: "solid",
      },
      sizes: {
        md: {
          px: "8px !important",
          py: "4px",
          fontWeight: 600,
          fontSize: "8px",
          borderRadius: "4px",
        },
        lg: {
          px: "8px !important",
          py: "2px",
          h: "20px",
          fontWeight: "bold",
          fontSize: "11px",

          borderRadius: "4px",
        },
      },
    },
    Toast: {
      variants: {
        leftAccent: (props) => {
          const { status } = props;
          const bgColor = {
            success: "mint.500",
            error: "red.500",
            warning: "yellow.500",
            info: "blue.500",
          };

          return {
            container: {
              bg: bgColor[status],
              color: "white",
            },
          };
        },
      },
    },

    Button: {
      baseStyle: {
        borderRadius: "4px",
        _focus: {
          outline: "none",
          boxShadow: "none",
        },
        _hover: {
          boxShadow: "none", // Hover 시 boxShadow 제거
          outline: "none",
        },
        _disabled: {
          opacity: 0.6,
        },
      },
      sizes: {
        xs: {
          h: "24px",
          fontSize: "11px",
          fontWeight: 600,
          borderRadius: "8px",
          px: "10px !important",
          iconSpacing: "4px !important", //적용 안됨
        },

        sm: {
          fontSize: "10px",
          h: "28px",
          border: "1px solid var(--gray-100)",
        },

        md: {
          padding: "0 20px",
          h: "42px",
          fontWeight: 700,
          fontSize: "12px",
        },
        lg: {
          h: "48px",
          fontWeight: 700,
          fontSize: "14px",
          borderRadius: "12px",
        },
      },
      variants: {
        unstyled: {
          minWidth: "unset", // 최소 너비 제거
          h: "auto",
          padding: 0, // 패딩 제거
        },
      },
    },
  },
});

export default theme;
