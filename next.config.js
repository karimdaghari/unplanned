import { fileURLToPath } from "node:url";
import createJiti from "jiti";
const jiti = createJiti(fileURLToPath(import.meta.url));

jiti("./src/env/server");
jiti("./src/env/client");

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
	/* config options here */
};

export default nextConfig;
