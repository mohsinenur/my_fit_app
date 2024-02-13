/** @type {import('next').NextConfig} */
const nextConfig = {
    async headers() {
        return [
            {
            source: "/pages/api/googleFit/(.*)",
            headers: [
                { key: "Access-Control-Allow-Credentials", value: "true" },
                { key: "Access-Control-Allow-Origin", value: "http://localhost:3000" },
                { key: "Access-Control-Allow-Methods", value: "GET,OPTIONS,PATCH,DELETE,POST,PUT" }
            ]
            }
        ]
    }
};

export default nextConfig;
