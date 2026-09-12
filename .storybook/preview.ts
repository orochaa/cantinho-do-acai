import type { Preview } from '@storybook/react-vite';
import { createElement } from 'react';
import { AppContentShell } from '../src/components/app-content-shell';
import { AppShell } from '../src/components/app-shell';
import '../src/global.css';
import { MemoryRouter } from 'react-router';

const preview: Preview = {
  parameters: {
    layout: 'centered',
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    Story =>
      createElement(
        AppShell,
        null,
        createElement(
          MemoryRouter,
          null,
          createElement(AppContentShell, null, createElement(Story)),
        ),
      ),
  ],
};

export default preview;
