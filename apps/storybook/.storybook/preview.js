import '../src/tokens/tokens.css';
import { ThemeDecorator } from './ThemeDecorator.jsx';

export const globalTypes = {
  brandColor: {
    name: 'Brand colour',
    defaultValue: '#2563EB',
    toolbar: {
      icon: 'paintbrush',
      items: [
        { value: '#2563EB', title: 'Blue'   },
        { value: '#4F46E5', title: 'Indigo' },
        { value: '#7C3AED', title: 'Purple' },
        { value: '#0D9488', title: 'Teal'   },
        { value: '#16A34A', title: 'Green'  },
        { value: '#DC2626', title: 'Red'    },
        { value: '#D97706', title: 'Amber'  },
        { value: '#DB2777', title: 'Pink'   },
      ],
      dynamicTitle: true,
    },
  },
  typescale: {
    name: 'Type scale',
    defaultValue: '1.2',
    toolbar: {
      icon: 'typography',
      items: [
        { value: '1.125', title: 'Compact  (1.125)' },
        { value: '1.2',   title: 'Default  (1.2)'   },
        { value: '1.25',  title: 'Medium   (1.25)'  },
        { value: '1.333', title: 'Large    (1.333)' },
        { value: '1.5',   title: 'Expressive (1.5)' },
      ],
      dynamicTitle: true,
    },
  },
  density: {
    name: 'Density',
    defaultValue: '1',
    toolbar: {
      icon: 'component',
      items: [
        { value: '0.75', title: 'Compact'     },
        { value: '1',    title: 'Comfortable' },
        { value: '1.25', title: 'Spacious'    },
      ],
      dynamicTitle: true,
    },
  },
  iconWeight: {
    name: 'Icon weight',
    defaultValue: 'regular',
    toolbar: {
      icon: 'star',
      items: [
        { value: 'thin',     title: 'Thin'     },
        { value: 'light',    title: 'Light'    },
        { value: 'regular',  title: 'Regular'  },
        { value: 'bold',     title: 'Bold'     },
        { value: 'fill',     title: 'Fill'     },
        { value: 'duotone',  title: 'Duotone'  },
      ],
      dynamicTitle: true,
    },
  },
};

/** @type { import('@storybook/react').Preview } */
const preview = {
  decorators: [ThemeDecorator],
  parameters: {
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#f5f5f5' },
        { name: 'dark',  value: '#0f0f0f' },
      ],
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
