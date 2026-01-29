# Task: Page Structure

Complete page layout with centered container.

---

## Implementation

```tsx
// apps/preview/src/app/page.tsx

export default function Page() {
  return (
    <div className="page-container">
      <HeatMapContainer />
    </div>
  );
}
```

```css
/* apps/preview/src/app/styles.css */

body {
  margin: 0;
  padding: 0;
  background: #0a0a0a;  /* Darker than container */
  font-family: system-ui, -apple-system, sans-serif;
}

.page-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;  /* Breathing room around container */
}
```

---

## Acceptance Criteria

✅ **Layout:**
- [ ] HeatMapContainer centered in viewport
- [ ] Dark background (#0a0a0a)
- [ ] 40px padding around container
- [ ] Responsive padding on small screens
