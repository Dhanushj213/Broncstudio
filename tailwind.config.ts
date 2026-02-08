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
                // Shared colors / Brand
                navy: {
                    900: "var(--brand-primary)", // Mapped to text-primary in dark
                    800: "var(--brand-secondary)",
                    700: "#374151",
                },
                coral: {
                    500: "var(--accent-orange)", // Use accent orange for CTA
                    100: "#FFE4E4",
                    300: "#FF9E9E",
                },
                gold: "var(--accent-gold)",
                mint: "var(--success-mint)",

                // Status
                success: "var(--success)",
                warning: "var(--warning)",
                error: "var(--error)",
                info: "var(--info)",

                // Flagship Accent
                'accent-orange': {
                    DEFAULT: "var(--accent-orange)",
                    soft: "var(--accent-orange-soft)",
                    border: "var(--accent-orange-border)",
                }
            },
            backgroundColor: {
                // Semantic Page Level
                page: "var(--bg-page)",
                section: "var(--bg-section)",

                // Component Level
                card: "var(--bg-card)",
                'card-hover': "var(--card-hover)",
                elevated: "var(--bg-elevated)", // For menus/modals

                // Specific Areas
                header: "var(--header-bg)",
                nav: "var(--nav-bg)", // Bottom nav
                menu: "var(--menu-bg)", // Hamburger

                // Action Tiles
                action: "var(--action-bg)",
                'action-hover': "var(--action-hover)",
            },
            textColor: {
                primary: "var(--text-primary)",
                secondary: "var(--text-secondary)",
                muted: "var(--text-muted)",
                disabled: "var(--text-disabled)",

                // Semantic
                highlight: "var(--accent-orange)", // For prices, active states

                // Legacy mappings if needed
                navy: "var(--text-primary)", // Ensure legacy navy text becomes primary in dark
                coral: "var(--accent-orange)",
            },
            borderColor: {
                subtle: "var(--border-subtle)",
                DEFAULT: "var(--border-default)",
                divider: "var(--divider)",
                accent: "var(--accent-border)",
            },
            boxShadow: {
                card: "var(--card-shadow)",
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
