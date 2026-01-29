# Task: Input Styling & States

Input field styling with focus states and placeholder.

---

## Implementation

```css
.search-input {
  width: 100%;
  height: 100%;
  padding-left: 32px;  /* Space for icon */
  padding-right: 8px;
  font-size: 14px;
  color: white;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  outline: none;
  transition: border-color 150ms ease-out;
}

.search-input::placeholder {
  color: #9ca3af;  /* gray-400 */
}

.search-input:focus {
  border-color: #6366f1;  /* indigo-500 */
}
```

---

## Acceptance Criteria

✅ **Styling:**
- [ ] Background: rgba(255, 255, 255, 0.05)
- [ ] Border: rgba(255, 255, 255, 0.2), focus: indigo-500
- [ ] Text: 14px white
- [ ] Placeholder: gray-400
- [ ] Border radius: 6px
