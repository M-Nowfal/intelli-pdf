import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: [
    "pdf-parse",
    "onnxruntime-node",
    "@huggingface/transformers",
  ],
};

export default nextConfig;
