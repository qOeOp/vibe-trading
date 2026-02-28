//@ts-check

const { composePlugins, withNx } = require('@nx/next');

/**
 * Separate .next directories for build vs serve to avoid lock contention:
 *   serve  → .next       (hot-reload cache, default)
 *   build  → .next-prod  (via NEXT_BUILD_DIR env in project.json build target)
 */
const distDir = process.env.NEXT_BUILD_DIR || '.next';

/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  nx: {
    svgr: false,
  },
  output: 'export',
  images: {
    unoptimized: true,
  },
  distDir,
  // Turbopack: import .md files as raw strings (for blueprint doc system)
  turbopack: {
    root: '../../', // Explicitly set workspace root (Nx monorepo)
    rules: {
      '**/*.md': {
        loaders: ['raw-loader'],
        as: '*.js',
      },
    },
  },
  // Webpack equivalent for --webpack dev server mode
  webpack: (config) => {
    config.module.rules.push({
      test: /\.md$/,
      use: 'raw-loader',
    });
    return config;
  },
};

const plugins = [
  // Add more plugins here
  withNx,
];

module.exports = composePlugins(...plugins)(nextConfig);
