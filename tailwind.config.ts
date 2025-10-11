import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        white: "var(--white)",
        backdrop : "rgba(0,0,0,0.4)",
        success:{
          DEFAULT: "var(--success)",
          foreground: "var(--success-foreground)",
        },
        error:{
          DEFAULT: "var(--error)",
          foreground: "var(--error-foreground)",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
      },
      backgroundImage:{
        striped: "repeating-linear-gradient(to right,var(--primary) 0px,var(--primary) 10px,var(--background) 10px,var(--background) 20px)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      animation:{
        'slide-down': 'slidedown 1s ease',
        'flash': 'flash 0.5s ease'
      },
      keyframes:{
        slidedown:{
          '0%':{
            transform: "translateY(-50%)",
            opacity: "0",
            },
            '100%':{ transform: "translateY(0%)",
                      opacity: "1",}
        },
        flash:{
          '0%, 100%':{
            opacity: "1",
          },
          '50%':{
            opacity: "0"
          }
        }
      }
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
