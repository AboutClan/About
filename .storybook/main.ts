import type { StorybookConfig } from "@storybook/nextjs";

const config: StorybookConfig = {
  stories: ["../stories/**/*.mdx", "../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  // Storybook 9에서 essentials/interactions는 코어(storybook 패키지)로 통합되어
  // 별도 addon 설치가 필요 없다.
  addons: ["@storybook/addon-links", "@chromatic-com/storybook"],
  framework: {
    name: "@storybook/nextjs",
    options: {},
  },
  staticDirs: ["../public"],
};
export default config;
