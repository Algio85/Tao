import { addons } from '@storybook/manager-api';
import { create } from '@storybook/theming/create';

const theme = create({
  base: 'light',

  // Brand
  brandTitle: ' ',
  brandUrl: '/',
  brandImage: '/Tao.svg',
  brandTarget: '_self',

  // UI colors
  colorPrimary: '#2563EB',
  colorSecondary: '#2563EB',

  // App background
  appBg: '#f5f5f5',
  appContentBg: '#ffffff',
  appPreviewBg: '#ffffff',
  appBorderColor: '#e5e5e5',
  appBorderRadius: 8,

  // Text
  textColor: '#171717',
  textInverseColor: '#ffffff',
  textMutedColor: '#737373',

  // Toolbar
  barTextColor: '#737373',
  barHoverColor: '#2563EB',
  barSelectedColor: '#2563EB',
  barBg: '#ffffff',

  // Input
  inputBg: '#ffffff',
  inputBorder: '#e5e5e5',
  inputTextColor: '#171717',
  inputBorderRadius: 6,

  // Buttons
  buttonBg: '#ffffff',
  buttonBorder: '#e5e5e5',
  booleanBg: '#f5f5f5',
  booleanSelectedBg: '#2563EB',
});

addons.setConfig({ theme });