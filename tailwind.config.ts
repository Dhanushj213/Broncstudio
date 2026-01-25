import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                background: "var(--bg-main)",
                foreground: "var(--text-primary)",
                navy: {
                    900: "var(--brand-primary)",
                    800: "var(--brand-secondary)",
                    700: "#374151",
                    // Add other shades as needed based on brand-primary
                },
                coral: {
                    500: "var(--cta-primary)",
                    // Add light/dark variants if needed
                    100: "#FFE4E4", // approximate for bento backgrounds
                    300: "#FF9E9E",
                },
                gold: "var(--accent-gold)",
                mint: "var(--success-mint)",
            },
            borderRadius: {
                'card': 'var(--border-radius-card)', // 24px
            },
            spacing: {
                '18': '4.5rem', // 72px for header
                '30': '7.5rem', // 120px for margins
            },
            fontFamily: {
                heading: ['var(--font-heading)', 'sans-serif'],
                sans: ['var(--font-sans)', 'sans-serif'],
            },
            backdropBlur: {
                'premium': '18px',
            },
            transitionTimingFunction: {
                'premium': 'var(--ease-premium)',
            }
        },
    },
    plugins: [],
};
export default config;
