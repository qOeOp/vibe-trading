# Task: Loading Text

Animated loading message with ellipsis dots indicating activity.

---

## Design

### Specifications
- Text: "加载中..." (default) or custom message
- Font: 14px (text-sm), weight 400
- Color: #9ca3af (gray-400)
- Ellipsis animation: Dots fade in/out sequentially

---

## Implementation

```typescript
<p className="loading-text">{message}</p>
```

```css
.loading-text {
  font-size: 14px;
  font-weight: 400;
  color: #9ca3af;
  animation: ellipsis 1.4s ease-in-out infinite;
}

@keyframes ellipsis {
  0%, 20% { content: '加载中'; }
  40% { content: '加载中.'; }
  60% { content: '加载中..'; }
  80%, 100% { content: '加载中...'; }
}
```

---

## Acceptance Criteria

✅ **Text:**
- [ ] Default message: "加载中..."
- [ ] Font: 14px, weight 400
- [ ] Color: gray-400
- [ ] Ellipsis animation: 1.4s cycle
- [ ] 16px gap below spinner
