
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
				wedding: {
					green: '#1a5d40',
					light: '#f1f7f3',
					cream: '#f8f6f0',
					black: '#000000',
					white: '#ffffff',
					gold: '#d4af37',
					olive: '#63745a'
				},
				premium: {
					base: '#FEFEFE',
					warm: '#F8F6F3',
					charcoal: '#2D2D2D',
					black: '#0A0A0A',
					light: '#E5E7EB',
					beige: '#efeee9',
					'olive-dark': '#4a5548',
					'noir-editorial': '#1a1a18'
				},
				editorial: {
					beige: '#F8F5EF',
					olive: '#63745a',
					'olive-light': '#A8B89B',
					noir: '#0F0F0F',
					cream: '#f5f4ef',
					gray: '#666666',
					border: '#E8E8E8',
					terracotta: '#C4654A',
					'gold-light': '#E8D9BF'
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
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
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
				},
				'fade-in': {
					'0%': { opacity: '0' },
					'100%': { opacity: '1' }
				},
				'typing': {
					'0%': { width: '0%' },
					'100%': { width: '100%' }
				},
			'marquee': {
				'0%': { transform: 'translateX(0)' },
				'100%': { transform: 'translateX(-50%)' }
			},
			'marquee-slow': {
				'0%': { transform: 'translateX(0)' },
				'100%': { transform: 'translateX(-50%)' }
			},
			'marquee-tags': {
				'0%': { transform: 'translateX(0)' },
				'100%': { transform: 'translateX(-50%)' }
			},
			'slide-up': {
				'0%': { transform: 'translateY(20px)', opacity: '0' },
				'100%': { transform: 'translateY(0)', opacity: '1' }
			},
			'pulse-glow': {
				'0%, 100%': { boxShadow: '0 0 20px hsl(var(--primary) / 0.3)' },
				'50%': { boxShadow: '0 0 40px hsl(var(--primary) / 0.6)' }
			},
			'float': {
				'0%, 100%': { transform: 'translateY(0)' },
				'50%': { transform: 'translateY(-10px)' }
			},
			'float-delayed': {
				'0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
				'50%': { transform: 'translateY(-15px) rotate(5deg)' }
			}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.5s ease-out',
				'typing': 'typing 1.5s steps(40, end)',
				'marquee': 'marquee 25s linear infinite',
				'marquee-slow': 'marquee-slow 20s linear infinite',
				'marquee-tags': 'marquee-tags 15s linear infinite',
				'slide-up': 'slide-up 0.5s ease-out forwards',
				'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
				'float': 'float 3s ease-in-out infinite',
				'float-delayed': 'float-delayed 4s ease-in-out infinite'
			},
			fontFamily: {
				serif: ['Playfair Display', 'serif'],
				sans: ['Inter', 'sans-serif']
			}
		}
	},
	plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;
