import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  styles: {
    global: {
      body: {
        color: "var(--gray-800)",
      },

      li: {
        position: "relative",
        paddingLeft: "20px", // 마커와 텍스트 간의 간격
        listStyleType: "none", // 기본 마커 제거

        "&::before": {
          content: '"•"', // 마커 심볼
          position: "absolute",
          left: "8px",
          top: "50%",
          transform: "translateY(-50%)", // 수직 중앙 정렬
          fontSize: "10px", // 마커 크기
          fontWeight: "800",
          display: "inline-block",
          lineHeight: "20px",
        },
      },
      ".colored-bullet::before": {
        color: "#7F1728",
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
      900: "#282828",
    },
    black: {
      500: "#424242", // 명도 46% (유지)
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
      700: "#cc4c4c", // 🔄 기존보다 더 선명한 딥레드
      800: "#aa3a3a", // 🔄 브라운에서 붉은 계열로
      900: "#8a2a2a", // 🔄 어두운 딥레드
    },
    orange: {
      50: "#fff3e0",
      100: "#ffe0b3",
      200: "#ffc880",
      300: "#ffb14d", // 명도 60% (조정)
      400: "#ff9f26",
      500: "#ffa501", // 명도 62% (유지)
      600: "#e59400",
      700: "#cc7300", // 🔄 딥 오렌지
      800: "#a65a00", // 🔄
      900: "#804000", // 🔄
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
      900: "#8a5f03", // 🔄 기존보다 살짝 더 금색에 가까운 느낌
    },
    green: {
      50: "#edf7ed", // 아주 연한 연두+회색 톤
      100: "#cfe9cf", // 부드러운 파스텔 연두
      200: "#a8dba8", // 연하지만 확실한 초록
      300: "#7cc67c", // 선명한 초록빛, 형광 아님
      400: "#4fb84f", // 메인보다 밝지만 안정된 채도
      500: "#28a745", // 메인 초록 (유지)
      600: "#21863a", // 살짝 어두운 버전
      700: "#196b30", // 더 어둡고 깊이감
      800: "#125126", // 딥그린 느낌
      900: "#0a361b", // 거의 블랙에 가까운 짙은 초록
    },
    teal: {
      50: "#e6fcf7", // 매우 연한 초록빛 청록색
      100: "#c1f7e3", // 연한 청록색
      200: "#8ef2cd", // 밝은 청록색
      300: "#5beeb7", // 중간 청록색
      400: "#33e4a3", // 선명한 청록색
      500: "#20d997", // 메인 청록색 (유지)
      600: "#1bb681", // 약간 어두운 청록색
      700: "#168d6c", // 더 어두운 청록색
      800: "#106353", // 깊고 어두운 청록색
      900: "#0b3a3a", // 가장 어두운 청록색
    },
    blue: {
      50: "#eaf6ff", // 아주 연한 하늘색
      100: "#cdeaff", // 연한 하늘색
      200: "#91d8ff", // 밝은 하늘색
      300: "#5fc1ff", // 선명한 파란색
      400: "#36a5ff", // 명도와 채도 조정
      500: "#007dfb", // 메인 파란색 (유지)
      600: "#0069d1", // 약간 어두운 파란색
      700: "#0055a8", // 더 어두운 파란색
      800: "#003f80", // 깊고 어두운 파란색
      900: "#002855", // 가장 어두운 파란색
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
      50: "#f7ecfb", // 아주 연한 라벤더+핑크
      100: "#e8c9f6", // 연한 라벤더
      200: "#d4a2ef", // 채도 높인 연보라
      300: "#bf7ae8", // 확실히 보라색 존재감 있음
      400: "#b062e3", // 부드럽지만 또렷한 보라
      500: "#a248de", // ⭐ 밝기 + 채도 조화된 메인 보라
      600: "#913bcc", // 조금 더 짙은 포인트
      700: "#792faf", // 대비 강조용
      800: "#5e238c", // 너무 어둡지 않게 조정
      900: "#451a66", // 기존보다 한 톤 밝은 딥 퍼플
    },
    pink: {
      50: "#fff0f6", // 아주 연한 핑크빛
      100: "#ffd6e7", // 부드럽고 연한 파스텔 핑크
      200: "#ffadd0", // 밝고 화사한 핑크
      300: "#ff85b9", // 선명하고 밝은 중간 핑크
      400: "#ff5ca2", // 포인트로 쓰기 좋은 선명한 핑크
      500: "#ff338c", // 메인 핑크 (선명하고 밝은 채도)
      600: "#e0267b", // 메인보다 약간 어둡고 진한 핑크
      700: "#b81f66", // 깊이감 있는 짙은 핑크
      800: "#8f1850", // 깊은 딥핑크
      900: "#661139", // 가장 어두운 짙은 핑크
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
    badgeSunset: {
      100: "#FFF3D9",
      800: "#FF8F1F",
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
            bg: "gray.100",
            color: "gray.600",
          }),
          fontWeight: "regular",
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
        smd: {
          px: "4px !important",
          py: "2px",
          fontWeight: "regular",
          fontSize: "11px",
          borderRadius: "4px",
        },
        lg: {
          px: "8px !important",
          py: "5px",
          h: "20px",
          fontWeight: "bold",
          fontSize: "10px",
          lineHeight: "10px",
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
        subtle: (props) => ({
          bg: `${props.colorScheme}.50`,
          color: `${props.colorScheme}.700`,
          _hover: {
            bg: `${props.colorScheme}.100`,
          },
          _active: {
            bg: `${props.colorScheme}.200`,
          },
        }),
      },
    },

    Tabs: {
      baseStyle: (props) => ({
        tab: {
          _selected: {
            color: props.colorScheme === "mint" ? "mint.500" : "gray.800", // 활성화된 탭 텍스트 색상
            borderColor: props.colorScheme === "mint" ? "mint.500" : "gray.800", // 활성화된 탭 하단 테두리 색상
            fontWeight: "semibold",
          },
        },
      }),
    },
  },
});

export default theme;
