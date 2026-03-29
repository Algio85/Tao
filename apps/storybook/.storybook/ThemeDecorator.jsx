import React, { useEffect } from 'react';
import { useGlobals } from '@storybook/preview-api';
import { applyTheme } from '../src/tokens/themeEngine.js';

export function ThemeDecorator(Story, context) {
  const [globals] = useGlobals();

  useEffect(() => {
    applyTheme({
      brandColor:     globals.brandColor    || '#2563EB',
      typescaleRatio: globals.typescale     || '1.2',
      densityFactor:  globals.density       || '1',
    });
  }, [globals.brandColor, globals.typescale, globals.density]);

  return <Story {...context} />;
}
