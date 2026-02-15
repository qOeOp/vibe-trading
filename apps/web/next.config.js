//@ts-check

const { composePlugins, withNx } = require('@nx/next');

/**
 * Always use separate .next directories for build vs serve so they never
 * lock-contend or corrupt each other:
 *   serve  → apps/web/.next          (default, hot-reload cache)
 *   build  → apps/web/.next-prod     (via NEXT_BUILD_DIR env set in project.json)
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
};

const plugins = [
  // Add more plugins here
  withNx,
];

module.exports = composePlugins(...plugins)(nextConfig);
