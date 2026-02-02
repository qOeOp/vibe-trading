# Task: Command Reference

Complete list of npm scripts.

---

## Development Commands

```bash
# Start development server
npx nx serve preview
# → Starts Next.js dev server on http://localhost:4300

# Build for production
npx nx build preview
# → Creates optimized static export in dist/apps/preview/.next
```

---

## Code Quality Commands

```bash
# Run ESLint
npx nx run preview:lint
# → Checks TypeScript and React code for errors

# Format code
npx nx format:write
# → Runs Prettier on all files
```

---

## Acceptance Criteria

✅ **Commands:**
- [ ] All commands execute without errors
- [ ] Build produces static export
- [ ] Lint passes (0 errors)
- [ ] Format succeeds
