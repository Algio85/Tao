import React from 'react';
import { Introduction } from '../components/Introduction';

const meta = {
  title: 'Introduction',
  component: Introduction,
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#f5f5f5' },
        { name: 'dark',  value: '#0f0f0f' },
      ],
    },
  },
};

export default meta;

export const Default = {
  name: 'Introduction',
};
