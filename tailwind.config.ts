import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				// Time-based theme colors
				day: {
					accent: 'hsl(var(--day-accent))',
					text: 'hsl(var(--day-text))',
					card: 'hsl(var(--day-card))',
					border: 'hsl(var(--day-card-border))'
				},
				afternoon: {
					accent: 'hsl(var(--afternoon-accent))',
					text: 'hsl(var(--afternoon-text))',
					card: 'hsl(var(--afternoon-card))',
					border: 'hsl(var(--afternoon-card-border))'
				},
				evening: {
					accent: 'hsl(var(--evening-accent))',
					text: 'hsl(var(--evening-text))',
					card: 'hsl(var(--evening-card))',
					border: 'hsl(var(--evening-card-border))'
				},
				night: {
					accent: 'hsl(var(--night-accent))',
					secondary: 'hsl(var(--night-secondary))',
					text: 'hsl(var(--night-text))',
					card: 'hsl(var(--night-card))',
					border: 'hsl(var(--night-card-border))'
				}
			},
			fontFamily: {
				sans: ['Inter', 'system-ui', 'sans-serif'],
			},
			backgroundImage: {
				'day': 'linear-gradient(135deg, hsl(45 100% 94%), hsl(55 100% 88%))',
				'afternoon': 'linear-gradient(135deg, hsl(195 100% 75%), hsl(25 100% 70%))',
				'evening': 'linear-gradient(135deg, hsl(260 60% 45%), hsl(20 70% 50%))',
				'night': 'linear-gradient(135deg, hsl(270 100% 8%), hsl(290 100% 12%))',
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
