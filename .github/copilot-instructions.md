# Copilot Instructions for EDCWeb25

## Project Overview
This is a Next.js 15 project using the App Router with TypeScript, React 19, Tailwind CSS v4, and Biome for linting/formatting. The project prioritizes modern tooling with Turbopack for faster builds and development.

## Architecture & Structure
- **App Router**: Uses `app/` directory structure (not pages)
- **Styling**: Tailwind CSS v4 with custom CSS variables in `globals.css`
- **Fonts**: Geist Sans and Geist Mono loaded via `next/font/google`
- **TypeScript**: Strict mode enabled with path aliases (`@/*` maps to root)

## Development Workflow

### Commands
```bash
npm run dev        # Start dev server with Turbopack
npm run build      # Build with Turbopack 
npm run lint       # Run Biome linting
npm run format     # Format code with Biome
```

### Key Files
- `app/layout.tsx` - Root layout with font variables and metadata
- `app/page.tsx` - Homepage component
- `app/globals.css` - Global styles with CSS custom properties
- `biome.json` - Linting/formatting configuration

## Code Conventions

### Styling
- Use Tailwind classes with CSS variables for theming
- Dark mode handled via `@media (prefers-color-scheme: dark)`
- Custom CSS properties defined in `:root` and `@theme inline`
- Example: `bg-foreground text-background` uses CSS custom properties

### Component Structure
- Server Components by default (no 'use client' unless needed)
- TypeScript interfaces for props using `Readonly<{}>` pattern
- Image optimization with `next/image` and priority loading

### Biome Configuration
- 2-space indentation, organize imports on save
- Next.js and React recommended rules enabled
- Unknown CSS at-rules disabled for Tailwind compatibility
- VCS integration enabled for better git workflow

## Tailwind CSS v4 Specifics
- Uses `@import "tailwindcss"` instead of traditional Tailwind imports
- Inline theme configuration with `@theme inline` directive
- CSS custom properties for consistent theming across light/dark modes

## Code Organization & Modularity

### Component Structure
- Break down large components into smaller, focused pieces
- Create reusable components in `app/components/` directory
- Use descriptive component names that explain their purpose
- Add JSDoc comments to explain component functionality for newcomers

### File Organization Principles
- Keep files small and focused on a single responsibility
- Use feature-based folder structure (e.g., `components/home/`, `components/ui/`)
- Extract complex logic into custom hooks or utility functions
- Separate concerns: UI components, business logic, and styling

### Newcomer-Friendly Practices
- Add clear comments explaining Next.js-specific concepts (Server Components, App Router)
- Document prop interfaces with descriptive comments
- Explain Tailwind CSS patterns and custom CSS variables usage
- Include code examples in comments for complex patterns

### Refactoring Guidelines
- Extract repeated JSX patterns into reusable components
- Move inline styles to CSS classes when they become complex
- Create type definitions for shared data structures
- Use meaningful variable and function names that self-document

## Development Notes
- Turbopack enabled for both dev and build for faster compilation
- Font variables (`--font-geist-sans`, `--font-geist-mono`) available globally
- Path alias `@/` resolves to project root for cleaner imports
- Biome handles both linting and formatting (no ESLint/Prettier)
- Prioritize readability over brevity - explain concepts for framework newcomers