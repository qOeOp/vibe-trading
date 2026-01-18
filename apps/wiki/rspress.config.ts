import * as path from 'node:path';
import { defineConfig } from 'rspress/config';

export default defineConfig({
  root: path.join(__dirname, 'docs'),
  title: 'Vibe Trading',
  dev: {
    port: 8216,
  },
  globalStyles: path.join(__dirname, 'docs/custom.css'),
  description: 'A modern, event-driven trading platform.',
  icon: '/favicon.ico',
  logo: {
    light: '/rspress-light-logo.png', // Placeholder
    dark: '/rspress-dark-logo.png',  // Placeholder
  },
  themeConfig: {
    socialLinks: [
      {
        icon: 'github',
        mode: 'link',
        content: 'https://github.com/vibe-trading',
      },
    ],
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Architecture', link: '/architecture/' },
      { text: 'API', link: '/api-reference/' },
      { text: 'Product', link: '/product-guide/' },
    ],
    // Vibe Trading "Violet Bloom" Colors
    // Rspress uses CSS variables for theming.
    // We will override these in a custom CSS file.
  },
});