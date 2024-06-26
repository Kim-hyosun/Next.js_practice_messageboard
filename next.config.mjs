/** @type {import('next').NextConfig} */
import { resolve } from 'path';
import process from 'process';

const nextConfig = {
  webpack: (config) => {
    config.resolve.alias['@'] = resolve(process.cwd());
    config.experiments = { ...config.experiments, topLevelAwait: true };
    return config;
  },
};

export default nextConfig;
