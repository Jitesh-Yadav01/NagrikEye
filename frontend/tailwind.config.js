/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
            colors: {
                'mindmarket-green': '#8ED462',
                'mindmarket-black': '#1a1a1a',
            }
        },
    },
    plugins: [],
}
