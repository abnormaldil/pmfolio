# Project Details: Pixelated Portfolio

This document provides a comprehensive overview of the Pixelated Media portfolio website, including its architecture, folder structure, and tech stack.

---

## 🚀 Tech Stack

### Core
- **Framework**: [Next.js 15.2.9](https://nextjs.org/) (App Router)
- **React**: [React 19.0.0](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/) / JavaScript
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/), [Vanilla CSS](https://developer.mozilla.org/en-US/docs/Web/CSS)

### Animations & UI
- **GSAP**: For complex, high-performance scroll-driven and timeline animations.
- **Framer Motion**: For declarative UI animations and transitions.
- **Lenis**: For smooth, high-quality scrolling.
- **Lottie**: For lightweight, vector-based animations.
- **Spline**: For interactive 3D web experiences.
- **Lucide React**: For consistent, accessible icons.

### Backend & Integrations
- **Supabase**: Open-source Firebase alternative (Auth, Database, Storage).
- **Google Generative AI**: Integration with Gemini AI for chatbot capabilities.
- **Nodemailer**: For handling contact form email submissions.

---

## 📁 Folder Structure

```text
/
├── public/                 # Static assets (images, svgs, animations)
├── src/
│   ├── app/                # Next.js App Router (pages and layouts)
│   │   ├── api/            # Serverless functions / Backend routes
│   │   ├── chatbot/        # Chatbot specific pages/styles
│   │   ├── contact/        # Contact page
│   │   ├── portfolio/      # Portfolio listing/details
│   │   ├── globals.css     # Global CSS styles and Tailwind imports
│   │   ├── layout.js       # Main application layout
│   │   └── page.js         # Homepage
│   ├── components/         # Reusable React components
│   │   ├── Hero.jsx        # Landing section
│   │   ├── Navbar.jsx      # Global navigation
│   │   ├── Footer.jsx      # Global footer
│   │   ├── TargetCursor.tsx# Custom animated cursor
│   │   └── ...             # Other feature-specific components
│   ├── lib/                # Utility functions and shared logic
│   │   ├── animations.js   # GSAP/Animation helper functions
│   │   ├── supabase/       # Supabase client and operations
│   │   ├── spline/         # Spline runtime configurations
│   │   └── ...             # Media helpers, context providers
├── package.json            # Project dependencies and scripts
├── components.json         # Shadcn/UI configuration
└── project_details.md      # This document
```

---

## 🏗️ Architecture & Key Patterns

### 1. **Next.js App Router**
The project leverages the power of Next.js App Router for server-side rendering, routing, and efficient data fetching.

### 2. **Smooth Scrolling (Lenis)**
Integrated globally to provide a premium, smooth scrolling experience across all sections.

### 3. **Animation Strategy**
- **GSAP + ScrollTrigger**: Used for pinning sections, complex parallax effects, and cinematic transitions (e.g., Landing to About).
- **`@gsap/react`**: Ensures GSAP animations are correctly scoped to React component lifecycles.
- **Framer Motion**: Used for hover states, entry animations, and simpler UI transitions.

### 4. **Modern Design System**
- **Tailwind CSS 4**: Utilizes the latest Tailwind features for rapid, responsive layout development.
- **Glassmorphism**: Subtle use of background blurs and gradients for a premium feel.
- **Dynamic Layouts**: Responsive grids and flexboxes that adapt seamlessly to different screen sizes.

### 5. **Data Management**
- **Supabase**: Serves as the primary data store and authentication provider.
- **Context API**: Used for managing global application state (e.g., portfolio data, UI states).

### 6. **AI Integration**
The `PortfolioChatbot` utilizes Google's Generative AI (Gemini) to provide an interactive, intelligent user experience directly within the portfolio.

---

### 7. **📱 Responsiveness Strategy**

The project employs a multi-layered approach to ensure a premium experience across all devices:

-   **Fluid Typography & Spacing**: Extensively uses CSS `clamp(min, preferred, max)` functions. This allows elements like font sizes and paddings to scale linearly with the viewport width, eliminating the need for excessive breakpoints.
-   **Tailwind Responsive Modifiers**: Uses standard Tailwind prefixes (`sm:`, `md:`, `lg:`, `xl:`) for structural layout changes (e.g., switching from a 1-column mobile stack to a multi-column desktop grid).
-   **JavaScript-Based Adaptations**: High-interaction components (like `TargetCursor.tsx`) use `window.innerWidth` checks to adapt their behavior or disable themselves on touch devices/small screens.
-   **Unified Navigation**: The `Navbar.jsx` uses a side-drawer pattern that remains consistent but adapts its trigger and overlay logic based on the screen size.

---

## 🛠️ Development Workflow

- **Local Development**: `npm run dev`
- **Building for Production**: `npm run build`
- **Linting**: `npm run lint`

---

*Last Updated: 2026-03-17*
