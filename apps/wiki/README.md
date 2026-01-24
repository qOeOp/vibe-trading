# Vibe Trading Wiki

The internal documentation hub for the Vibe Trading project, built with Next.js 15, Fumadocs, and Content Collections.

## Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
- **Documentation:** [Fumadocs](https://fumadocs.dev/)
- **Content Engine:** [Content Collections](https://content-collections.dev/)
- **Styling:** Tailwind CSS v4
- **Language:** TypeScript

## Directory Structure

- `app/`: Next.js App Router pages and layouts.
- `content/`: Documentation source files (.md and .mdx).
- `lib/`: Shared utilities and Fumadocs source configuration.
- `public/`: Static assets (images, icons).
- `content-collections.ts`: Configuration for content processing.

## Getting Started

### Development

Run the development server:

```bash
npx nx run wiki:dev
```

Open [http://localhost:8216](http://localhost:8216) to view the site.

### Build

Generate a static production build:

```bash
npx nx run wiki:build
```

### Linting

```bash
npx nx run wiki:lint
```

## Writing Documentation

1. Add your `.md` or `.mdx` files to the `content/` directory.
2. Use frontmatter to define the page title and description:
   ```yaml
   ---
   title: My New Page
   description: A brief overview
   ---
   ```
3. Update `meta.json` in the respective folder to control the sidebar ordering and display names.