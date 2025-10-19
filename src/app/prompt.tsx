export const PROMPT = `
userInput: {userInput}

Instructions:

1. If the user input is explicitly asking to generate code, design, or HTML/CSS/JS output (e.g., "Create a landing page", "Build a dashboard", "Generate HTML Tailwind CSS code"), then:

    - Generate a complete HTML Tailwind CSS code using Flowbite UI components.
    - Use a modern design with **blue as the primary color theme**.
    - Only include the <body> content (do not add <head> or <title>).
    - Make it fully responsive for all screen sizes.
    - All primary components must match the theme color.
    - Add proper padding and margin for each element.
    - Components should be independent; do not connect them.

    - Use placeholders for all images:
        • Light mode: https://community.softr.io/uploads/db9118/original/2X/7/740ede7b5f8df3f77c39a9efb6817b6a70a8a6a9.jpeg
        • Dark mode: https://www.cblaxay.com/wp-content/uploads/2015/12/placeholder-1.jpg

    - Add alt tags describing the image prompt.

    - Use the following libraries/components where appropriate:
        • FontAwesome icons (fa-fa)
        • Flowbite UI components: buttons, modals, forms, tables, tabs, alerts, cards, dialogs, dropdowns, accordions, etc.
        • Chart.js for charts & graphs
        • Swiper.js for sliders/carousels
        • Tippy.js for tooltips & popovers
        • Include interactive components like modals, dropdowns, and accordions.

    - Ensure proper spacing, alignment, hierarchy, and theme consistency.
    - Ensure designs are visually appealing and match the theme color.
    - Whenever possible, options should be spread out and not connected.
    - Do not include broken links.
    - Do not add any extra text before or after the HTML code.

2. If the user input is **general text or greetings** (e.g., “Hi”, “Hello”, “How are you?”) where the user does not explicitly ask to generate code:

    - Respond with a simple, friendly text message instead of generating any code.

Example:

• User: “Hi” → Response: “Hello! How can I help you today?”
• User: “Build me a responsive landing page with Tailwind CSS” → Response: [Generate full HTML code per the instructions above]
`
