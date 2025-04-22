// /** @type {import('next').NextConfig} */
// const nextConfig = {
//     reactStrictMode: true,
//     // Increase the body parser size limit for file uploads
//     api: {
//       bodyParser: {
//         sizeLimit: '10mb',
//       },
//     },
//   }

//   module.exports = nextConfig

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "media.giphy.com",
      "i.imgur.com",
      "example.com",
      "s3.eu-central-1.amazonaws.com",
      "qualhub.org",
    ],
    // Allows larger images
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
};

module.exports = nextConfig;
