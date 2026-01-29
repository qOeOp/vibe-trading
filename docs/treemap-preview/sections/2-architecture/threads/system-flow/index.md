# Thread: System Flow

Application flow from mount to interaction.

---

## Task: [System Flow](./tasks/01-system-flow.md)

**Flow:** Mount → Fetch L1 → Render Tiles → User Interaction → State Update → Re-render

**Key States:**
- Loading: Show spinner
- Error: Show retry UI
- Empty: Show no results message
- Success: Render treemap tiles

---

## Flow Diagram

```
┌─────────────┐
│ Page Mount  │
└──────┬──────┘
       │
┌──────▼──────────┐
│ Fetch L1 Data   │
│ (31 sectors)    │
└──────┬──────────┘
       │
┌──────▼──────────┐
│ Calculate       │
│ Treemap Layout  │
└──────┬──────────┘
       │
┌──────▼──────────┐
│ Render 31 Tiles │
└──────┬──────────┘
       │
┌──────▼──────────┐
│ User Clicks     │
│ Tile            │
└──────┬──────────┘
       │
┌──────▼──────────┐
│ Fetch Children  │
│ (L2 data)       │
└──────┬──────────┘
       │
┌──────▼──────────┐
│ Update State &  │
│ Re-render       │
└─────────────────┘
```
