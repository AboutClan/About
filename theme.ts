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
      800: "#303030",
      900: "black",
    },
    red: {
      50: "#ffe5e5", // 아주 연한 빨강
      100: "#ffb3b3", // 밝은 파스텔 빨강
      200: "#ff9999", // 부드러운 빨강
      300: "#ff8080", // 살짝 진한 빨강
      400: "#ff7070", // 포인트로 쓰기 좋은 색상
      500: "#ff6969", // 메인 빨강 (기준)
      600: "#e06060", // 조금 더 어두운 빨강
      700: "#c05050", // 차분한 빨강
      800: "#993d3d", // 어두운 빨강
      900: "#662626", // 가장 진한 빨강
    },
    orange: {
      50: "#fff3e0", // 아주 연한 오렌지
      100: "#ffe0b3", // 밝은 파스텔 오렌지
      200: "#ffc880", // 부드러운 오렌지
      300: "#ffb14d", // 약간 진한 오렌지
      400: "#ff9f26", // 포인트로 쓰기 좋은 오렌지
      500: "#ffa501", // 메인 오렌지색 (기준)
      600: "#e59400", // 조금 더 어두운 오렌지
      700: "#b37400", // 차분한 오렌지
      800: "#805500", // 어두운 오렌지
      900: "#4d3300", // 가장 진한 오렌지
    },
    blue: {
      50: "#e3f2ff", // 아주 연한 파랑
      100: "#b3daff", // 밝은 파스텔 파랑
      200: "#80c2ff", // 부드러운 파랑
      300: "#4da9ff", // 살짝 진한 파랑
      400: "#2694ff", // 포인트로 쓰기 좋은 파랑
      500: "#007dfb", // 메인 파랑 (기준)
      600: "#006cd1", // 조금 더 어두운 파랑
      700: "#005aa8", // 차분한 파랑
      800: "#004680", // 어두운 파랑
      900: "#002d52", // 가장 진한 파랑
    },
    mint: {
      50: "#e0f7f5", // 아주 밝고 연한 민트
      100: "#b3ece7", // 부드러운 파스텔 민트
      200: "#80e0d8", // 밝은 민트 계열
      300: "#4dd4c8", // 약간 더 진한 민트
      400: "#26cabc", // 포인트로 쓰기 좋은 색상
      500: "#00c2b3", // 메인 민트 색상 (기준)
      600: "#00a99d", // 조금 더 어두운 민트
      700: "#008f85", // 차분한 딥 민트
      800: "#007569", // 어두운 민트 톤
      900: "#00594e", // 가장 진한 민트 계열
    },

    purple: {
      50: "#f3e0f7", // 아주 연한 보라
      100: "#e2b3ea", // 밝은 파스텔 보라
      200: "#d180dd", // 부드러운 보라
      300: "#c04dd0", // 약간 진한 보라
      400: "#b33fc9", // 포인트로 쓰기 좋은 보라
      500: "#bb57d5", // 메인 보라색 (기준)
      600: "#9a46b3", // 조금 어두운 보라
      700: "#7a3690", // 차분한 보라
      800: "#5a266d", // 어두운 보라
      900: "#3a184a", // 가장 진한 보라
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
          // 모든 colorScheme에 대해 기본 배경색을 mint.400으로 설정
          bg: `${props.colorScheme === "gray" ? "gray.200" : `${props.colorScheme}.500`}`,
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
          fontWeight: 700,
          fontSize: "11px",
          borderRadius: "4px",
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

          padding: 0, // 패딩 제거
        },
      },
    },
  },
});

export default theme;
