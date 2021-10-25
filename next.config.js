module.exports = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    if (!isServer) {
        // don't resolve 'fs' module on the client to prevent this error on build --> Error: Can't resolve 'fs'
        config.resolve.fallback = {
            fs: false,
            crypto: false,
            stream: false,
            path: false,
            zlib: false,
            http: false,
            net: false,
        }
    }

    return config;
}
}
