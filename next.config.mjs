/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Development configuration for VS Code and localhost
  allowedDevOrigins: [
    '127.0.0.1',
    'localhost',
    'vscode-webview://vscode-webview',
    '*.github.dev',
    '*.codespaces.githubusercontent.com'
  ],
}

export default nextConfig
