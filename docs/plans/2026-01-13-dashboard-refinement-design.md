# Dashboard Refinement Design
**Date:** 2026-01-13
**Purpose:** Refine dashboard integration to match original dashboard-2 template exactly

## Overview

This design addresses visual and structural differences between the current implementation and the original dashboard-2 template (https://square-ui-dashboard-2.vercel.app/). Key improvements include adding Recent Deals preview, AI Assistant page, GitHub link in header, and replacing global styles for complete visual parity.

## Phase 1: Architecture Adjustments & Component Structure

### 1.1 Overview Page Layout Enhancement

Adjust Overview page to match original template layout:

```
Welcome Section (with Import/Export + Create New buttons)
↓
Stats Cards (4 metric cards in row)
↓
Charts Grid (2 columns: Lead Sources + Revenue Flow)
↓
Recent Deals Preview (NEW) - Shows recent 10 deals
  - Uses existing DealsTable component
  - Add props: limit={10} and showPagination={false}
  - Header shows "Active Deals" + total count badge
  - Footer shows "View All Deals →" link to /app/dashboard/deals
```

**Key Changes:**
- Add `<RecentDealsPreview />` component to `overview-page.tsx`
- Create new component `recent-deals-preview.tsx` wrapping DealsTable
- Add optional props to DealsTable component to control row count and pagination

### 1.2 AI Assistant Page Structure

Create basic chat UI interface with:

```
AI Assistant Page (/app/dashboard/ai-assistant)
├── Chat Header
│   ├── "AI Assistant" title
│   └── "Clear conversation" button
├── Messages Area (scrollable)
│   ├── System welcome message (centered)
│   ├── User message bubbles (right-aligned, purple accent)
│   └── AI response bubbles (left-aligned, gray muted)
└── Input Area (fixed bottom)
    ├── Textarea (supports Shift+Enter for newlines)
    ├── "Send" button
    └── Token counter display (optional)
```

**UI Features:**
- Use Card components as message bubbles
- Textarea with auto-height adjustment
- Empty state shows "Start a conversation" placeholder
- Message format supports Markdown rendering (simple newlines and bold)
- **API integration ready**: Message send function is stub, ready for AI service integration

## Phase 2: Header Component Enhancement

### 2.1 Header Element Order (Left to Right)

```tsx
DashboardHeader:
├── SidebarTrigger (sidebar collapse button)
├── Dashboard title
├── Search input (with ⌘K shortcut indicator)
├── ThemeToggle button
├── GitHub link button (NEW)
│   └── href="https://github.com/qOeOp/vibe-trading"
│   └── target="_blank"
│   └── Uses lucide-react Github icon
└── Mobile menu (small screens)
```

### 2.2 GitHub Button Styling

```tsx
<Button variant="ghost" size="icon" asChild>
  <a href="https://github.com/qOeOp/vibe-trading" target="_blank" rel="noopener noreferrer">
    <Github className="size-5" />
    <span className="sr-only">GitHub Repository</span>
  </a>
</Button>
```

**Consistent Styling:**
- Same ghost variant as ThemeToggle
- size="icon" maintains consistent icon button size
- Hover effect unified with other header buttons

### 2.3 Sidebar Footer User Info Area

Add user profile area at sidebar bottom (matching original template):

```
Sidebar Footer:
├── Help Center link
├── Settings link
├── Divider line
└── User Profile Card
    ├── Avatar (VX initials)
    ├── Name: "Vincent Xu"
    ├── Email: "vincent@vibe.trading"
    └── Dropdown trigger (expandable to account menu)
```

## Phase 3: Global Styles & Border Radius System

### 3.1 Style File Replacement Strategy

**Replacement Steps:**
```
1. Backup current web/src/styles.css → web/src/styles.css.backup
2. Copy dashboard-2/app/globals.css → web/src/styles.css
3. Update import in web/src/main.tsx (if path changes)
```

**Key Changes:**
- From violet-bloom purple → neutral gray palette
- Use oklch color space (modern color definition)
- Border radius system update:
  ```css
  --radius: 0.625rem;  (10px, larger than previous 0.5rem)
  --radius-sm: 0.425rem (6.8px)
  --radius-md: 0.625rem (10px)
  --radius-lg: 0.625rem (10px)
  --radius-xl: 1.025rem (16.4px)
  ```

### 3.2 Component Border Radius Adjustments

Check and unify border radius across components:
- **Card component**: Use `rounded-lg` (10px)
- **Button component**: Use `rounded-md` (10px)
- **Input/Textarea**: Use `rounded-md` (10px)
- **Badge component**: Use `rounded-sm` (6.8px)
- **Avatar**: Keep `rounded-full`
- **Sidebar**: Outer container `rounded-md` on lg screens
- **Modal/Sheet**: Use `rounded-lg`

### 3.3 Dark Mode CSS Variables

globals.css includes complete `.dark` class definitions, ensure:
- ThemeProvider uses `attribute="class"`
- Colors change from violet purple to blue-purple accent (`--sidebar-primary: oklch(0.488 0.243 264.376)`)

## Phase 4: Navigation & Routing Enhancement

### 4.1 Sidebar Navigation Update

Add AI Assistant to navigation menu:

```tsx
Navigation Items (original template order):
├── AI Assistant (NEW)
│   └── icon: Bot (lucide-react)
│   └── route: /app/dashboard/ai-assistant
├── Overview (current "Overview")
│   └── icon: LayoutGrid
│   └── route: /app/dashboard/overview
├── Deals
│   └── icon: ChartArea
│   └── route: /app/dashboard/deals
└── Analytics (keep "Soon" badge)
    └── icon: ChartLine
    └── route: /app/dashboard/analytics
```

### 4.2 Route Configuration Update

Add AI Assistant route in `app.tsx`:

```tsx
<Route path="/app" element={<DashboardLayout />}>
  <Route index element={<Navigate to="/app/dashboard/overview" replace />} />
  <Route path="dashboard">
    <Route path="overview" element={<OverviewPage />} />
    <Route path="deals" element={<DealsPage />} />
    <Route path="ai-assistant" element={<AIAssistantPage />} /> {/* NEW */}
  </Route>
</Route>
```

### 4.3 Test ID Naming Convention

Add unified test-ids for new components:
- `page-ai-assistant` - AI Assistant page container
- `ai-chat-messages` - Messages list area
- `ai-chat-input` - Input field
- `ai-chat-send-button` - Send button
- `dashboard-sidebar-nav-ai-assistant` - Sidebar AI Assistant nav item
- `dashboard-header-github-link` - Header GitHub link

### 4.4 Style Consistency Checklist

Ensure AI Assistant page matches dashboard style:
- ✓ Use same Card components and spacing (space-y-6)
- ✓ Titles use `text-2xl font-semibold`
- ✓ Subtitles use `text-muted-foreground text-sm`
- ✓ Message bubbles use Card, consistent padding
- ✓ Input area uses Textarea component (consistent with other forms)
- ✓ Empty state icon color uses `text-muted-foreground`

## Implementation Summary

**Core Changes:**
1. ✅ Add Recent Deals preview to Overview page
2. ✅ Create AI Assistant chat UI page
3. ✅ Add GitHub link button to Header
4. ✅ Replace global styles with dashboard-2's globals.css
5. ✅ Unify all component border radius to 10px system
6. ✅ Add AI Assistant navigation and user profile to Sidebar
7. ✅ Update route configuration

## File Changes

**New Files:**
- `web/src/features/dashboard/pages/ai-assistant-page.tsx`
- `web/src/features/dashboard/components/recent-deals-preview.tsx`

**Modified Files:**
- `web/src/styles.css` (replaced with globals.css)
- `web/src/features/dashboard/pages/overview-page.tsx`
- `web/src/features/dashboard/components/dashboard-header.tsx`
- `web/src/features/dashboard/components/dashboard-sidebar.tsx`
- `web/src/features/dashboard/components/deals-table.tsx` (add optional props)
- `web/src/app/app.tsx` (add AI Assistant route)
- `web/src/features/dashboard/index.ts` (export new components)

## Testing Strategy

After implementation:
1. Update Playwright test to verify GitHub link in header
2. Test AI Assistant page navigation and basic UI interactions
3. Verify Recent Deals preview shows correct data and links to full page
4. Confirm all border radius values match original template
5. Test dark/light theme switching with new color scheme
6. Validate responsive behavior on mobile/tablet/desktop

## Success Criteria

- ✅ Visual appearance matches original dashboard-2 template exactly
- ✅ All navigation items work correctly
- ✅ AI Assistant page renders with empty state
- ✅ Recent Deals preview displays on Overview page
- ✅ GitHub link opens in new tab
- ✅ Color scheme matches globals.css (neutral gray palette)
- ✅ All components use consistent 10px border radius
- ✅ Dark mode works correctly with new variables
