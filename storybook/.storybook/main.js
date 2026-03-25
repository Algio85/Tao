/** @type { import('@storybook/react-vite').StorybookConfig } */
const config = {
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx|mdx)',
    '../src/stories/**/*.@(mdx|stories.@(js|jsx|ts|tsx))'
  ],
  addons: ['@storybook/addon-essentials', '@storybook/addon-toolbars', '@tpitre/story-ui'],
  framework: { name: '@storybook/react-vite', options: {} },
  docs: { autodocs: 'tag' },
  staticDirs: ['../public'],
  viteFinal: async (config) => {
    // Story UI: Exclude from dependency optimization to handle CSS imports correctly
    config.optimizeDeps = {
      ...config.optimizeDeps,
      exclude: [
        ...(config.optimizeDeps?.exclude || []),
        '@tpitre/story-ui'
      ]
    };
    return config;
  },
};

export default config;