const path = require("path");
require("dotenv").config();
const webpack = require("webpack");

const ContentSecurityPolicy = `frame-ancestors 'none'`;

module.exports = {
  experimental: {
    serverActions: {
      allowedOrigins: ['my-proxy.com', '*.my-proxy.com'],
    },
  },
  trailingSlash: false,
  // webpackDevMiddleware: (config) => {
  //   config.watchOptions = {
  //     poll: 1000,
  //     aggregateTimeout: 300,
  //   };

  //   return config;
  // },
  output: 'standalone',
  experimental: {
    serverActions: true,
  },
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
  },
  env: {
    BASE_URL: process.env.BASE_URL,
    PASSWORD_USER: process.env.PASSWORD_USER
  },
  reactStrictMode: false,
  swcMinify: true,
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value:
              "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "Content-Security-Policy",
            value: ContentSecurityPolicy.replace(/\s{2,}/g, " ").trim(),
          },
        ],
      },
    ];
  },
  webpack(config) {
    config.watchOptions = {
      poll: 1000,
      aggregateTimeout: 300,
    };
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });

    return config;
  },
};
