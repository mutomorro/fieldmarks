/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Core Mutomorro palette
        'mt-white': '#FFFFFF',
        'mt-cream': '#FAF6F1',
        'mt-deep': '#221C2B',
        'mt-mid': '#423B49',
        'mt-accent': '#9B51E0',

        // Heading gradient stops (used individually too)
        'mt-purple': '#80388F',
        'mt-pink': '#FF4279',
        'mt-warm': '#FFA200',

        // Theme colours (one per concept group)
        'theme-core': '#9B51E0',
        'theme-behaviours': '#d4735e',
        'theme-archetypes': '#3aaa9e',
        'theme-leverage': '#d4a830',
        'theme-complexity': '#4a9ad4',
        'theme-mental': '#a06cc0',
        'theme-resilience': '#5a6cc0',
        'theme-boundaries': '#d45a7a',
        'theme-org': '#7ab84e',
        'theme-measurement': '#d4735e',
        'theme-design': '#3aaa9e',
        'theme-nature': '#7ab84e',
        'theme-human': '#a06cc0',
      },
      fontFamily: {
        sans: ['"Source Sans 3"', 'system-ui', 'sans-serif'],
      },
      fontWeight: {
        light: '300',
        normal: '400',
        semi: '600',
      },
      maxWidth: {
        'content': '1350px',
        'narrow': '800px',
        'prose': '720px',
      },
      borderRadius: {
        'none': '0',
      },
    },
  },
  plugins: [],
};
