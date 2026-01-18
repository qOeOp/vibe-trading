# Dashboard Refinement Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Refine dashboard to match original dashboard-2 template exactly with proper styling, navigation, and components.

**Architecture:** Feature-based structure with updated global styles, additional AI Assistant page, enhanced Overview page with Recent Deals preview, and improved header/sidebar navigation.

**Tech Stack:** React 18, TypeScript, React Router v6, Tailwind CSS v4, Radix UI, Recharts, Zustand, Lucide React

---

## Task 1: Replace Global Styles

**Files:**
- Backup: `web/src/styles.css` → `web/src/styles.css.backup`
- Replace: `web/src/styles.css`
- Source: `/Users/vx/WebstormProjects/vibe-trading/dashboard-2/app/globals.css`

**Step 1: Backup current styles**

```bash
cd /Users/vx/WebstormProjects/vibe-trading/.worktrees/dashboard-refinement
cp web/src/styles.css web/src/styles.css.backup
```

Expected: File copied successfully

**Step 2: Copy dashboard-2 globals.css**

```bash
cp /Users/vx/WebstormProjects/vibe-trading/dashboard-2/app/globals.css web/src/styles.css
```

Expected: File replaced

**Step 3: Verify main.tsx imports styles correctly**

Check `web/src/main.tsx` contains:
```tsx
import './styles.css';
```

Expected: Import is correct (no changes needed)

**Step 4: Start dev server and verify styles load**

```bash
npx nx serve web
```

Open http://localhost:4200 and verify:
- Dark theme background is darker (not violet)
- Sidebar has neutral colors (not purple accent)
- Border radius appears slightly larger (10px)

Expected: Neutral gray color scheme visible

**Step 5: Commit**

```bash
git add web/src/styles.css web/src/styles.css.backup
git commit -m "style: replace global styles with dashboard-2 theme

Replace violet-bloom theme with neutral gray theme from dashboard-2.
- Use oklch color space
- Update border radius to 10px system
- Backup old styles to styles.css.backup

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 2: Add GitHub Link to Header

**Files:**
- Modify: `web/src/features/dashboard/components/dashboard-header.tsx`

**Step 1: Add Github icon import**

In `dashboard-header.tsx`, update imports:

```tsx
import {
  Search,
  Command,
  MoreVertical,
  Github,  // ADD THIS
} from "lucide-react";
```

**Step 2: Add GitHub link button before mobile menu**

Insert after `<ThemeToggle />` and before the mobile menu `<DropdownMenu>`:

```tsx
<Button variant="ghost" size="icon" asChild>
  <a
    href="https://github.com/qOeOp/vibe-trading"
    target="_blank"
    rel="noopener noreferrer"
    data-testid="dashboard-header-github-link"
  >
    <Github className="size-5" />
    <span className="sr-only">GitHub Repository</span>
  </a>
</Button>
```

**Step 3: Verify in browser**

Start dev server if not running:
```bash
npx nx serve web
```

Navigate to dashboard and verify:
- GitHub icon appears between theme toggle and mobile menu
- Clicking opens https://github.com/qOeOp/vibe-trading in new tab
- Icon has same hover effect as theme toggle

Expected: GitHub link visible and functional

**Step 4: Commit**

```bash
git add web/src/features/dashboard/components/dashboard-header.tsx
git commit -m "feat(dashboard): add GitHub link to header

Add GitHub repository link button next to theme toggle.
Opens in new tab with accessible label.

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 3: Create AI Assistant Page Components

**Files:**
- Create: `web/src/features/dashboard/pages/ai-assistant-page.tsx`
- Create: `web/src/features/dashboard/components/ai-chat-message.tsx`

**Step 1: Create message bubble component**

Create `web/src/features/dashboard/components/ai-chat-message.tsx`:

```tsx
import { Card } from "@/components/ui/dashboard/card";
import { Avatar, AvatarFallback } from "@/components/ui/dashboard/avatar";
import { Bot, User } from "lucide-react";

interface AIChatMessageProps {
  role: "user" | "assistant";
  content: string;
  timestamp?: string;
}

export function AIChatMessage({ role, content, timestamp }: AIChatMessageProps) {
  const isUser = role === "user";

  return (
    <div
      className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}
      data-testid={`ai-chat-message-${role}`}
    >
      <Avatar className="size-8 shrink-0">
        <AvatarFallback className={isUser ? "bg-primary text-primary-foreground" : "bg-muted"}>
          {isUser ? <User className="size-4" /> : <Bot className="size-4" />}
        </AvatarFallback>
      </Avatar>

      <Card className={`max-w-[80%] p-3 ${isUser ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
        <p className="text-sm whitespace-pre-wrap break-words">{content}</p>
        {timestamp && (
          <p className={`text-xs mt-1 ${isUser ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
            {timestamp}
          </p>
        )}
      </Card>
    </div>
  );
}
```

**Step 2: Create AI Assistant page**

Create `web/src/features/dashboard/pages/ai-assistant-page.tsx`:

```tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";
import { AIChatMessage } from "../components/ai-chat-message";
import { Send, Trash2, Bot } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export function AIAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // TODO: Replace with actual AI API call
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I'm a placeholder response. Connect me to your AI service to enable real conversations!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearConversation = () => {
    setMessages([]);
  };

  return (
    <div className="flex flex-col h-full space-y-6" data-testid="page-ai-assistant">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">AI Assistant</h2>
          <p className="text-muted-foreground text-sm mt-1">
            Ask questions and get intelligent responses
          </p>
        </div>
        {messages.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={clearConversation}
            data-testid="ai-chat-clear-button"
          >
            <Trash2 className="size-4 mr-2" />
            Clear
          </Button>
        )}
      </div>

      {/* Messages Area */}
      <div
        className="flex-1 overflow-y-auto rounded-lg border bg-card p-4 space-y-4 min-h-[400px]"
        data-testid="ai-chat-messages"
      >
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-3">
            <Bot className="size-12 text-muted-foreground" />
            <div>
              <h3 className="font-medium text-lg">Start a conversation</h3>
              <p className="text-muted-foreground text-sm mt-1">
                Type your message below to begin chatting with the AI assistant
              </p>
            </div>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <AIChatMessage
                key={message.id}
                role={message.role}
                content={message.content}
                timestamp={message.timestamp}
              />
            ))}
            {isLoading && (
              <div className="flex gap-3">
                <div className="size-8 shrink-0 rounded-full bg-muted animate-pulse" />
                <div className="h-12 bg-muted rounded-lg animate-pulse max-w-[200px] flex-1" />
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input Area */}
      <div className="flex gap-2">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message... (Shift+Enter for new line)"
          className="min-h-[60px] max-h-[120px] resize-none"
          data-testid="ai-chat-input"
          disabled={isLoading}
        />
        <Button
          onClick={handleSend}
          disabled={!input.trim() || isLoading}
          size="icon"
          className="size-[60px] shrink-0"
          data-testid="ai-chat-send-button"
        >
          <Send className="size-5" />
          <span className="sr-only">Send message</span>
        </Button>
      </div>
    </div>
  );
}
```

**Step 3: Export from dashboard index**

Update `web/src/features/dashboard/index.ts`, add:

```tsx
export { AIAssistantPage } from './pages/ai-assistant-page';
```

**Step 4: Add route to app.tsx**

In `web/src/app/app.tsx`, update imports:

```tsx
import { DashboardLayout, OverviewPage, DealsPage, AIAssistantPage } from '@/features/dashboard';
```

Add route inside dashboard routes:

```tsx
<Route path="dashboard">
  <Route path="overview" element={<OverviewPage />} />
  <Route path="deals" element={<DealsPage />} />
  <Route path="ai-assistant" element={<AIAssistantPage />} />
</Route>
```

**Step 5: Verify in browser**

Navigate to http://localhost:4200/app/dashboard/ai-assistant

Verify:
- Empty state shows Bot icon and "Start a conversation"
- Can type message and send
- User messages appear on right with primary color
- Assistant responses appear on left with muted color
- Clear button appears after first message
- Shift+Enter creates new line, Enter sends

Expected: Full chat UI functional with placeholder responses

**Step 6: Commit**

```bash
git add web/src/features/dashboard/pages/ai-assistant-page.tsx \
        web/src/features/dashboard/components/ai-chat-message.tsx \
        web/src/features/dashboard/index.ts \
        web/src/app/app.tsx
git commit -m "feat(dashboard): add AI Assistant chat page

Create AI Assistant page with chat interface:
- Message bubbles for user/assistant
- Auto-scroll to latest message
- Empty state with Bot icon
- Send button with keyboard shortcut (Enter)
- Clear conversation button
- Placeholder API integration ready for real AI service

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 4: Update Sidebar Navigation

**Files:**
- Modify: `web/src/features/dashboard/components/dashboard-sidebar.tsx`

**Step 1: Add Bot icon import**

Update imports in `dashboard-sidebar.tsx`:

```tsx
import {
  LayoutGrid,
  ChartArea,
  ChartLine,
  Bot,  // ADD THIS
  HelpCircle,
  Settings,
} from "lucide-react";
```

**Step 2: Add AI Assistant to menu items array**

Insert AI Assistant as FIRST item in menuItems array:

```tsx
const menuItems = [
  {
    title: "AI Assistant",
    icon: Bot,
    href: "/app/dashboard/ai-assistant",
    testId: "dashboard-sidebar-nav-ai-assistant",
  },
  {
    title: "Overview",
    icon: LayoutGrid,
    href: "/app/dashboard/overview",
    testId: "dashboard-sidebar-nav-overview",
  },
  {
    title: "Deals",
    icon: ChartArea,
    href: "/app/dashboard/deals",
    testId: "dashboard-sidebar-nav-deals",
  },
  {
    title: "Analytics",
    icon: ChartLine,
    href: "/app/dashboard/analytics",
    badge: "Soon",
    testId: "dashboard-sidebar-nav-analytics",
  },
];
```

**Step 3: Add sidebar footer with user profile**

Before the closing `</Sidebar>` tag, add footer section:

```tsx
<SidebarFooter>
  <SidebarMenu>
    <SidebarMenuItem>
      <SidebarMenuButton asChild>
        <NavLink to="#" data-testid="dashboard-sidebar-help">
          <HelpCircle />
          <span>Help Center</span>
        </NavLink>
      </SidebarMenuButton>
    </SidebarMenuItem>
    <SidebarMenuItem>
      <SidebarMenuButton asChild>
        <NavLink to="#" data-testid="dashboard-sidebar-settings">
          <Settings />
          <span>Settings</span>
        </NavLink>
      </SidebarMenuButton>
    </SidebarMenuItem>
  </SidebarMenu>

  <SidebarSeparator />

  <SidebarMenu>
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuButton
            size="lg"
            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            data-testid="dashboard-sidebar-user-menu"
          >
            <Avatar className="size-8 rounded-lg">
              <AvatarFallback className="rounded-lg">VX</AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">Vincent Xu</span>
              <span className="truncate text-xs text-muted-foreground">vincent@vibe.trading</span>
            </div>
            <ChevronsUpDown className="ml-auto size-4" />
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
          side="bottom"
          align="end"
          sideOffset={4}
        >
          <DropdownMenuLabel className="p-0 font-normal">
            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
              <Avatar className="size-8 rounded-lg">
                <AvatarFallback className="rounded-lg">VX</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">Vincent Xu</span>
                <span className="truncate text-xs text-muted-foreground">vincent@vibe.trading</span>
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Settings className="size-4 mr-2" />
            Account Settings
          </DropdownMenuItem>
          <DropdownMenuItem>
            <HelpCircle className="size-4 mr-2" />
            Support
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  </SidebarMenu>
</SidebarFooter>
```

**Step 4: Add missing imports for footer components**

Add to imports:

```tsx
import { ChevronsUpDown } from "lucide-react";
import {
  SidebarFooter,
  SidebarSeparator,
  // ... existing sidebar imports
} from "@/components/ui/dashboard/sidebar";
```

**Step 5: Verify in browser**

Check dashboard sidebar:
- AI Assistant appears first in navigation
- Help Center and Settings links at bottom
- User profile card shows "Vincent Xu" and email
- Dropdown works with Account Settings and Sign out options
- Profile avatar shows "VX" initials

Expected: Sidebar matches original template layout

**Step 6: Commit**

```bash
git add web/src/features/dashboard/components/dashboard-sidebar.tsx
git commit -m "feat(dashboard): add AI Assistant nav and user profile

Add AI Assistant as first navigation item.
Add sidebar footer with Help/Settings and user profile dropdown.

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 5: Create Recent Deals Preview Component

**Files:**
- Create: `web/src/features/dashboard/components/recent-deals-preview.tsx`
- Modify: `web/src/features/dashboard/components/deals-table.tsx`

**Step 1: Add optional props to DealsTable**

In `deals-table.tsx`, update the component props:

```tsx
interface DealsTableProps {
  limit?: number;
  showPagination?: boolean;
  showFilters?: boolean;
}

export function DealsTable({
  limit,
  showPagination = true,
  showFilters = true
}: DealsTableProps = {}) {
```

**Step 2: Apply limit to displayed deals**

In the DealsTable component, after filtering logic, add:

```tsx
// Apply limit if provided
const displayedDeals = limit ? paginatedDeals.slice(0, limit) : paginatedDeals;
```

Update the table body to use `displayedDeals`:

```tsx
<TableBody>
  {displayedDeals.map((deal, index) => (
    // ... existing table row code
  ))}
</TableBody>
```

**Step 3: Conditionally render filters and pagination**

Wrap filter section:

```tsx
{showFilters && (
  <div className="flex items-center gap-2 sm:gap-3">
    {/* ... existing filter UI ... */}
  </div>
)}
```

Wrap pagination section:

```tsx
{showPagination && (
  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2 py-4">
    {/* ... existing pagination UI ... */}
  </div>
)}
```

**Step 4: Create Recent Deals Preview component**

Create `web/src/features/dashboard/components/recent-deals-preview.tsx`:

```tsx
import { Link } from "react-router-dom";
import { DealsTable } from "./deals-table";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function RecentDealsPreview() {
  return (
    <div className="space-y-4" data-testid="dashboard-recent-deals">
      <DealsTable
        limit={10}
        showPagination={false}
        showFilters={false}
      />

      <div className="flex justify-center pt-2">
        <Button variant="ghost" asChild>
          <Link
            to="/app/dashboard/deals"
            className="flex items-center gap-2"
            data-testid="dashboard-view-all-deals-link"
          >
            View All Deals
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
```

**Step 5: Export from dashboard index**

Update `web/src/features/dashboard/index.ts`:

```tsx
export { RecentDealsPreview } from './components/recent-deals-preview';
```

**Step 6: Add to Overview page**

In `web/src/features/dashboard/pages/overview-page.tsx`, import:

```tsx
import { RecentDealsPreview } from '../components/recent-deals-preview';
```

Add after charts section:

```tsx
<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
  <LeadSourcesChart
    data={leadSourcesData}
    data-testid="dashboard-chart-lead-sources"
  />
  <RevenueFlowChart
    data={revenueFlowData}
    data-testid="dashboard-chart-revenue-flow"
  />
</div>

{/* ADD THIS */}
<RecentDealsPreview />
```

**Step 7: Verify in browser**

Navigate to Overview page and verify:
- Recent Deals table appears below charts
- Shows exactly 10 deals
- No pagination controls visible
- No filter controls visible
- "View All Deals →" link at bottom
- Clicking link navigates to /app/dashboard/deals

Expected: Recent deals preview matches original template

**Step 8: Commit**

```bash
git add web/src/features/dashboard/components/recent-deals-preview.tsx \
        web/src/features/dashboard/components/deals-table.tsx \
        web/src/features/dashboard/pages/overview-page.tsx \
        web/src/features/dashboard/index.ts
git commit -m "feat(dashboard): add Recent Deals preview to Overview

Add configurable DealsTable with limit/pagination/filter controls.
Create RecentDealsPreview showing 10 deals with 'View All' link.
Add preview to Overview page below charts.

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 6: Verify and Adjust Border Radius

**Files:**
- Verify: All component files using rounded-* classes

**Step 1: Check current border radius values**

Verify in `web/src/styles.css`:

```css
--radius: 0.625rem;  /* Should be 10px */
```

Expected: Already correct from globals.css

**Step 2: Spot check key components**

Check these components use correct Tailwind classes:
- Cards: `rounded-lg` (uses --radius-lg = 10px)
- Buttons: `rounded-md` (uses --radius-md = 10px)
- Inputs: `rounded-md`
- Badges: `rounded-sm` (uses --radius-sm = 6.8px)

**Step 3: Visual verification in browser**

Open dashboard and inspect elements:
- Cards should have 10px border radius
- Buttons should have 10px border radius
- All rounded elements should look consistent

Expected: All border radius values appear uniform and match original template

**Step 4: Document verification**

```bash
echo "Border radius verification complete - all components use Tailwind v4 radius system" > /tmp/radius-check.txt
```

Expected: Visual consistency confirmed

**Step 5: Commit if any adjustments made**

If changes needed:
```bash
git add [modified files]
git commit -m "style: adjust border radius for consistency

Ensure all components use 10px border radius system.

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

Otherwise, no commit needed.

---

## Task 7: Final Testing and Documentation

**Files:**
- Update: `web/README.md`
- Create: Test verification checklist

**Step 1: Update README with new features**

In `web/README.md`, add to Features section:

```markdown
### Dashboard Features

- **AI Assistant**: Chat interface with placeholder API integration
- **Recent Deals**: Overview page shows 10 most recent deals
- **GitHub Link**: Quick access to repository from header
- **Theme System**: Neutral gray color scheme with dark mode support
- **Unified Design**: 10px border radius system across all components
```

**Step 2: Manual testing checklist**

Test all new features:

```bash
# Start dev server
npx nx serve web

# Test checklist:
# ✓ Global styles: neutral gray theme, darker dark mode
# ✓ GitHub link in header opens correct URL in new tab
# ✓ AI Assistant page: chat UI, send messages, clear conversation
# ✓ Sidebar: AI Assistant nav item, Help/Settings, user profile dropdown
# ✓ Overview: Recent Deals preview shows 10 rows, View All link works
# ✓ Border radius: all components visually consistent (10px)
# ✓ Navigation: all routes work correctly
# ✓ Responsive: test mobile/tablet/desktop layouts
```

**Step 3: Run Playwright tests**

Update the existing test to include new elements:

```bash
cd ~/.claude/plugins/cache/playwright-skill/playwright-skill/4.1.0/skills/playwright-skill
node run.js /tmp/playwright-test-vibe-trading.js
```

Expected: All tests pass including dashboard verification

**Step 4: Commit README updates**

```bash
git add web/README.md
git commit -m "docs: update README with new dashboard features

Document AI Assistant, Recent Deals, and styling improvements.

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 8: Merge to Main Branch

**Files:**
- All modified files in worktree

**Step 1: Ensure all changes committed**

```bash
git status
```

Expected: "nothing to commit, working tree clean"

**Step 2: Switch to main branch**

```bash
cd /Users/vx/WebstormProjects/vibe-trading
git checkout main
```

**Step 3: Merge feature branch**

```bash
git merge feature/dashboard-refinement --no-ff
```

Expected: Merge successful with all commits

**Step 4: Verify main branch**

```bash
npx nx serve web
```

Test in browser - all features should work.

Expected: Production-ready code in main branch

**Step 5: Clean up worktree**

```bash
git worktree remove .worktrees/dashboard-refinement
```

Expected: Worktree removed

**Step 6: Final commit message (if merge commit created)**

Merge commit should include summary:

```
Merge feature/dashboard-refinement into main

Complete dashboard refinement to match original template:
- Replace global styles with neutral theme
- Add AI Assistant chat page
- Add GitHub link to header
- Add Recent Deals preview to Overview
- Update sidebar navigation with user profile
- Unify border radius to 10px system

All features tested and verified.
```

---

## Success Criteria Checklist

**Visual Parity:**
- ✓ Color scheme matches dashboard-2 (neutral gray, not violet)
- ✓ Border radius is 10px across all components
- ✓ Layout matches original template exactly

**Functionality:**
- ✓ AI Assistant page with working chat UI
- ✓ Recent Deals preview on Overview (10 rows)
- ✓ GitHub link in header opens repository
- ✓ Sidebar shows AI Assistant navigation
- ✓ User profile dropdown in sidebar footer
- ✓ All routes navigate correctly

**Code Quality:**
- ✓ TypeScript types complete
- ✓ Components have test-ids
- ✓ Accessibility labels present
- ✓ Responsive design maintained
- ✓ No console errors

**Testing:**
- ✓ Manual testing checklist completed
- ✓ Playwright tests pass
- ✓ Build succeeds without errors
- ✓ Dark mode works correctly

---

## Notes for Engineer

**Key Decisions:**

1. **AI Assistant**: Uses placeholder responses. Replace `setTimeout` in `handleSend` with actual API call to your AI service. Message format is ready for streaming responses.

2. **Recent Deals**: Reuses DealsTable component with props. If performance issues arise with large datasets, consider creating separate optimized component.

3. **Border Radius**: Tailwind v4 uses CSS variables. The `rounded-*` utilities automatically reference `--radius-*` values from globals.css.

4. **User Profile**: Currently static. Connect to auth context when implementing real authentication.

**Common Issues:**

- If styles don't update: Hard refresh browser (Cmd+Shift+R)
- If imports fail: Restart TypeScript server in IDE
- If hot reload breaks: Restart dev server

**Future Enhancements:**

- Connect AI Assistant to backend API
- Add real-time updates for Recent Deals
- Implement user profile settings page
- Add keyboard shortcuts (⌘K for search)
