/**
 * UI Component Registry — Vibe Trading
 *
 * Ground of truth for all reusable UI components.
 * AI and developers should consult this before creating new components.
 *
 * Rules:
 * - Same functionality = same component, different appearance = different variant
 * - Check `variants` before adding className overrides
 * - Check `proposedVariants` for planned expansions
 * - Never import from `@internal` components outside their scope
 *
 * Status:
 * - active:     In use, stable
 * - promote:    Exists but underused — prefer over hand-rolling
 * - deprecated: Scheduled for removal or migration
 * - internal:   Scoped to a specific feature, do not use elsewhere
 */

// ─── Types ────────────────────────────────────────────────

type ComponentStatus = 'active' | 'promote' | 'deprecated' | 'internal';

interface ComponentEntry {
  /** Import path */
  path: string;
  /** Named exports */
  exports: string[];
  /** Current status */
  status: ComponentStatus;
  /** Layer: L0=lib, L1=ui primitive, L2=shared/layout, L3=feature */
  layer: 'L0' | 'L1' | 'L2' | 'L3';
  /** Radix UI or other primitive foundation */
  primitive?: string;
  /** CVA variant axes */
  variants?: Record<string, string[]>;
  /** Planned variant expansions */
  proposedVariants?: Record<string, string[]>;
  /** Import count at last audit (2026-03-08) */
  imports: number;
  /** Brief description */
  description: string;
}

// ─── Registry ─────────────────────────────────────────────

export const COMPONENT_REGISTRY: Record<string, ComponentEntry> = {
  // ════════════════════════════════════════════════════════
  // L1: UI Primitives (components/ui/)
  // ════════════════════════════════════════════════════════

  button: {
    path: '@/components/ui/button',
    exports: ['Button', 'ButtonProps', 'buttonVariants'],
    status: 'active',
    layer: 'L1',
    primitive: '@radix-ui/react-slot',
    variants: {
      variant: [
        'default',
        'destructive',
        'outline',
        'secondary',
        'ghost',
        'link',
        'success',
        'warn',
        'action',
        'text',
        'linkDestructive',
        'outlineDestructive',
      ],
      size: [
        'default',
        'xs',
        'sm',
        'lg',
        'icon',
        'icon-xs',
        'icon-sm',
        'icon-lg',
      ],
    },
    imports: 43,
    description:
      'Primary button with 12 variants and 8 sizes. Supports asChild via Radix Slot.',
  },

  badge: {
    path: '@/components/ui/badge',
    exports: ['Badge', 'badgeVariants'],
    status: 'active',
    layer: 'L1',
    primitive: '@radix-ui/react-slot',
    variants: {
      variant: [
        'default',
        'defaultOutline',
        'secondary',
        'destructive',
        'outline',
        'success',
        'up',
        'down',
        'flat',
      ],
    },
    imports: 2,
    description:
      'Inline badge with market color variants (red=up, green=down, amber=flat).',
  },

  tabs: {
    path: '@/components/ui/tabs',
    exports: [
      'Tabs',
      'TabsList',
      'TabsTrigger',
      'TabsContent',
      'tabsListVariants',
    ],
    status: 'active',
    layer: 'L1',
    primitive: 'radix-ui/Tabs',
    variants: {
      listVariant: ['default', 'line'],
    },
    imports: 11,
    description:
      'Tabbed navigation. "default" = pill bg, "line" = underline indicator.',
  },

  toggle: {
    path: '@/components/ui/toggle',
    exports: ['Toggle', 'toggleVariants'],
    status: 'active',
    layer: 'L1',
    primitive: '@radix-ui/react-toggle',
    variants: {
      variant: ['default', 'outline'],
      size: ['default', 'sm', 'lg'],
    },
    imports: 3,
    description: 'Single toggle button with pressed state.',
  },

  dialog: {
    path: '@/components/ui/dialog',
    exports: [
      'Dialog',
      'DialogTrigger',
      'DialogClose',
      'DialogPortal',
      'DialogOverlay',
      'DialogContent',
      'DialogHeader',
      'DialogFooter',
      'DialogTitle',
      'DialogDescription',
    ],
    status: 'active',
    layer: 'L1',
    primitive: '@radix-ui/react-dialog',
    imports: 10,
    description:
      'Modal dialog with overlay, portal, accessible title/description.',
  },

  'alert-dialog': {
    path: '@/components/ui/alert-dialog',
    exports: [
      'AlertDialog',
      'AlertDialogTrigger',
      'AlertDialogPortal',
      'AlertDialogOverlay',
      'AlertDialogContent',
      'AlertDialogHeader',
      'AlertDialogFooter',
      'AlertDialogTitle',
      'AlertDialogDescription',
      'AlertDialogMedia',
      'AlertDialogAction',
      'AlertDialogCancel',
    ],
    status: 'active',
    layer: 'L1',
    primitive: 'radix-ui/AlertDialog',
    imports: 3,
    description: 'Confirmation dialog with action/cancel buttons.',
  },

  sheet: {
    path: '@/components/ui/sheet',
    exports: [
      'Sheet',
      'SheetTrigger',
      'SheetClose',
      'SheetPortal',
      'SheetOverlay',
      'SheetContent',
      'SheetHeader',
      'SheetFooter',
      'SheetTitle',
      'SheetDescription',
    ],
    status: 'active',
    layer: 'L1',
    primitive: '@radix-ui/react-dialog',
    variants: {
      side: ['top', 'right', 'bottom', 'left'],
    },
    imports: 5,
    description: 'Slide-in panel from edge. Built on Dialog primitive.',
  },

  'responsive-modal': {
    path: '@/components/ui/responsive-modal',
    exports: [
      'Modal',
      'ModalPortal',
      'ModalOverlay',
      'ModalTrigger',
      'ModalClose',
      'ModalContent',
      'ModalHeader',
      'ModalFooter',
      'ModalTitle',
      'ModalDescription',
    ],
    status: 'active',
    layer: 'L1',
    primitive: '@radix-ui/react-dialog',
    variants: {
      side: ['top', 'right', 'bottom', 'left'],
    },
    imports: 1,
    description:
      'Mobile: bottom sheet. Desktop: centered modal. Responsive dialog.',
  },

  popover: {
    path: '@/components/ui/popover',
    exports: [
      'Popover',
      'PopoverTrigger',
      'PopoverContent',
      'PopoverAnchor',
      'PopoverClose',
    ],
    status: 'active',
    layer: 'L1',
    primitive: '@radix-ui/react-popover',
    imports: 9,
    description: 'Floating content panel triggered by a button.',
  },

  'dropdown-menu': {
    path: '@/components/ui/dropdown-menu',
    exports: [
      'DropdownMenu',
      'DropdownMenuPortal',
      'DropdownMenuTrigger',
      'DropdownMenuContent',
      'DropdownMenuGroup',
      'DropdownMenuItem',
      'DropdownMenuCheckboxItem',
      'DropdownMenuRadioGroup',
      'DropdownMenuRadioItem',
      'DropdownMenuLabel',
      'DropdownMenuSeparator',
      'DropdownMenuShortcut',
      'DropdownMenuSub',
      'DropdownMenuSubTrigger',
      'DropdownMenuSubContent',
    ],
    status: 'active',
    layer: 'L1',
    primitive: '@radix-ui/react-dropdown-menu',
    imports: 14,
    description:
      'Multi-level dropdown with checkboxes, radios, keyboard navigation.',
  },

  'context-menu': {
    path: '@/components/ui/context-menu',
    exports: [
      'ContextMenu',
      'ContextMenuPortal',
      'ContextMenuTrigger',
      'ContextMenuContent',
      'ContextMenuGroup',
      'ContextMenuItem',
      'ContextMenuCheckboxItem',
      'ContextMenuRadioGroup',
      'ContextMenuRadioItem',
      'ContextMenuLabel',
      'ContextMenuSeparator',
      'ContextMenuShortcut',
      'ContextMenuSub',
      'ContextMenuSubTrigger',
      'ContextMenuSubContent',
    ],
    status: 'active',
    layer: 'L1',
    primitive: '@radix-ui/react-context-menu',
    imports: 1,
    description: 'Right-click context menu. Same API as DropdownMenu.',
  },

  command: {
    path: '@/components/ui/command',
    exports: [
      'Command',
      'CommandDialog',
      'CommandInput',
      'CommandList',
      'CommandEmpty',
      'CommandGroup',
      'CommandItem',
      'CommandShortcut',
      'CommandSeparator',
    ],
    status: 'active',
    layer: 'L1',
    primitive: 'cmdk',
    imports: 12,
    description:
      'Command palette / search list. Foundation for combobox patterns.',
  },

  tooltip: {
    path: '@/components/ui/tooltip',
    exports: ['TooltipProvider', 'Tooltip', 'TooltipTrigger', 'TooltipContent'],
    status: 'active',
    layer: 'L1',
    primitive: '@radix-ui/react-tooltip',
    imports: 45,
    description: 'Hover/focus tooltip with configurable delay and positioning.',
  },

  select: {
    path: '@/components/ui/select',
    exports: [
      'Select',
      'SelectGroup',
      'SelectValue',
      'SelectTrigger',
      'SelectContent',
      'SelectLabel',
      'SelectItem',
      'SelectSeparator',
      'SelectScrollUpButton',
      'SelectScrollDownButton',
    ],
    status: 'active',
    layer: 'L1',
    primitive: '@radix-ui/react-select',
    variants: {
      size: ['sm', 'default'],
    },
    imports: 11,
    description: 'Native-like dropdown select with keyboard navigation.',
  },

  input: {
    path: '@/components/ui/input',
    exports: ['Input'],
    status: 'active',
    layer: 'L1',
    imports: 8,
    description: 'Styled text input. Use InputGroup for prefix/suffix addons.',
  },

  'search-input': {
    path: '@/components/ui/search-input',
    exports: ['SearchInput', 'searchInputVariants'],
    status: 'active',
    layer: 'L1',
    variants: {
      variant: ['default', 'pill', 'inline'],
    },
    imports: 3,
    description:
      'Unified search input with debounce, clear button, loading state. Replaces treemap SearchBox, PillSearch, filter-bar inline search.',
  },

  'input-group': {
    path: '@/components/ui/input-group',
    exports: [
      'InputGroup',
      'InputGroupAddon',
      'InputGroupButton',
      'InputGroupText',
      'InputGroupInput',
      'InputGroupTextarea',
    ],
    status: 'active',
    layer: 'L1',
    variants: {
      addonAlign: ['inline-start', 'inline-end', 'block-start', 'block-end'],
      buttonSize: ['xs', 'sm', 'icon-xs', 'icon-sm'],
    },
    imports: 1,
    description: 'Input with prefix/suffix icons, buttons, or labels.',
  },

  textarea: {
    path: '@/components/ui/textarea',
    exports: ['Textarea'],
    status: 'active',
    layer: 'L1',
    imports: 3,
    description: 'Multi-line text input.',
  },

  label: {
    path: '@/components/ui/label',
    exports: ['Label'],
    status: 'active',
    layer: 'L1',
    primitive: '@radix-ui/react-label',
    imports: 5,
    description: 'Accessible form label.',
  },

  form: {
    path: '@/components/ui/form',
    exports: [
      'Form',
      'FormField',
      'FormItem',
      'FormLabel',
      'FormControl',
      'FormDescription',
      'FormMessage',
      'useFormField',
    ],
    status: 'active',
    layer: 'L1',
    primitive: '@radix-ui/react-slot',
    imports: 11,
    description: 'React Hook Form integration with accessible error messages.',
  },

  checkbox: {
    path: '@/components/ui/checkbox',
    exports: ['Checkbox'],
    status: 'active',
    layer: 'L1',
    primitive: '@radix-ui/react-checkbox',
    imports: 3,
    description: 'Checkbox with indeterminate state.',
  },

  switch: {
    path: '@/components/ui/switch',
    exports: ['Switch'],
    status: 'active',
    layer: 'L1',
    primitive: '@radix-ui/react-switch',
    imports: 4,
    description: 'Toggle switch (on/off).',
  },

  slider: {
    path: '@/components/ui/slider',
    exports: ['Slider'],
    status: 'active',
    layer: 'L1',
    primitive: '@radix-ui/react-slider',
    imports: 2,
    description: 'Range slider with track, range, and thumb.',
  },

  separator: {
    path: '@/components/ui/separator',
    exports: ['Separator'],
    status: 'active',
    layer: 'L1',
    primitive: '@radix-ui/react-separator',
    imports: 5,
    description: 'Visual divider, horizontal or vertical.',
  },

  'scroll-area': {
    path: '@/components/ui/scroll-area',
    exports: ['ScrollArea', 'ScrollBar'],
    status: 'active',
    layer: 'L1',
    primitive: 'radix-ui/ScrollArea',
    imports: 4,
    description: 'Custom-styled scrollbar container.',
  },

  card: {
    path: '@/components/ui/card',
    exports: [
      'Card',
      'CardHeader',
      'CardTitle',
      'CardDescription',
      'CardAction',
      'CardContent',
      'CardFooter',
    ],
    status: 'active',
    layer: 'L1',
    imports: 1,
    description: 'Standard card container. Use for generic card layouts.',
  },

  table: {
    path: '@/components/ui/table',
    exports: [
      'Table',
      'TableHeader',
      'TableBody',
      'TableFooter',
      'TableHead',
      'TableRow',
      'TableCell',
      'TableCaption',
    ],
    status: 'active',
    layer: 'L1',
    imports: 12,
    description: 'Semantic HTML table with consistent styling.',
  },

  avatar: {
    path: '@/components/ui/avatar',
    exports: ['Avatar', 'AvatarImage', 'AvatarFallback'],
    status: 'active',
    layer: 'L1',
    primitive: '@radix-ui/react-avatar',
    imports: 3,
    description: 'User avatar with image and fallback initial.',
  },

  skeleton: {
    path: '@/components/ui/skeleton',
    exports: ['Skeleton'],
    status: 'active',
    layer: 'L1',
    imports: 4,
    description:
      'Loading placeholder. Use instead of spinners (design system rule).',
  },

  calendar: {
    path: '@/components/ui/calendar',
    exports: ['Calendar', 'CalendarDayButton'],
    status: 'active',
    layer: 'L1',
    primitive: 'react-day-picker',
    imports: 3,
    description: 'Month calendar grid for date selection.',
  },

  'date-time-picker': {
    path: '@/features/journal/components/date-time-picker',
    exports: ['DateTimePicker'],
    status: 'internal',
    layer: 'L3',
    imports: 1,
    description:
      'Journal-specific date+time picker. Moved from L1 to fix layer violation (depends on journal context).',
  },

  'day-picker': {
    path: '@/components/ui/day-picker',
    exports: ['DayPicker'],
    status: 'active',
    layer: 'L1',
    primitive: 'react-day-picker',
    imports: 1,
    description: 'Standalone day picker.',
  },

  kbd: {
    path: '@/components/ui/kbd',
    exports: ['Kbd', 'KbdGroup'],
    status: 'active',
    layer: 'L1',
    imports: 5,
    description: 'Keyboard shortcut display (e.g. ⌘+K).',
  },

  sortable: {
    path: '@/components/ui/sortable',
    exports: [
      'Sortable',
      'SortableContent',
      'SortableItem',
      'SortableItemHandle',
      'SortableOverlay',
    ],
    status: 'active',
    layer: 'L1',
    primitive: '@dnd-kit',
    variants: {
      orientation: ['vertical', 'horizontal', 'mixed'],
    },
    imports: 2,
    description: 'Drag-and-drop sortable list with DnD Kit.',
  },

  faceted: {
    path: '@/components/ui/faceted',
    exports: [
      'Faceted',
      'FacetedTrigger',
      'FacetedBadgeList',
      'FacetedContent',
      'FacetedInput',
      'FacetedList',
      'FacetedEmpty',
      'FacetedGroup',
      'FacetedItem',
      'FacetedSeparator',
    ],
    status: 'active',
    layer: 'L1',
    primitive: 'Popover + cmdk',
    imports: 1,
    description:
      'Multi-select faceted filter dropdown. Combines Popover + Command.',
  },

  sonner: {
    path: '@/components/ui/sonner',
    exports: ['Toaster'],
    status: 'active',
    layer: 'L1',
    primitive: 'sonner',
    imports: 1,
    description: 'Toast notification system. Mount once in layout.',
  },

  'file-tree': {
    path: '@/components/ui/file-tree',
    exports: ['Tree', 'TreeIndicator', 'Folder', 'File', 'CollapseButton'],
    status: 'active',
    layer: 'L1',
    primitive: '@radix-ui/react-accordion',
    imports: 2,
    description:
      'Hierarchical file tree with expand/collapse. Accordion-based.',
  },

  'button-group': {
    path: '@/components/ui/button-group',
    exports: ['ButtonGroup'],
    status: 'active',
    layer: 'L1',
    imports: 1,
    description: 'Horizontal/vertical button group with shared borders.',
  },

  'animated-beam': {
    path: '@/components/ui/animated-beam',
    exports: ['AnimatedBeam'],
    status: 'active',
    layer: 'L1',
    imports: 1,
    description: 'SVG animated beam connecting two elements. Used in diagrams.',
  },

  chart: {
    path: '@/components/ui/chart',
    exports: [
      'ChartContainer',
      'ChartTooltip',
      'ChartTooltipContent',
      'ChartLegend',
      'ChartLegendContent',
      'ChartStyle',
      'ChartConfig',
    ],
    status: 'active',
    layer: 'L1',
    primitive: 'recharts',
    imports: 0,
    description:
      'Recharts wrapper with Mine theme integration. ChartContainer provides responsive sizing + CSS variable injection via ChartConfig.',
  },

  'glowing-effect': {
    path: '@/components/ui/glowing-effect',
    exports: ['GlowingEffect'],
    status: 'active',
    layer: 'L1',
    variants: {
      variant: ['default', 'white'],
    },
    imports: 3,
    description: 'Mouse-tracking gradient glow border on hover. Aceternity UI.',
  },

  'progressive-blur': {
    path: '@/components/ui/progressive-blur',
    exports: ['ProgressiveBlur'],
    status: 'promote',
    layer: 'L1',
    variants: {
      position: ['top', 'bottom', 'both'],
    },
    imports: 0,
    description:
      'Multi-layer backdrop-blur fade. USE THIS instead of hand-rolling blur layers (see cta-overlay.tsx).',
  },

  'query-param-preserving-link': {
    path: '@/components/ui/query-param-preserving-link',
    exports: ['QueryParamPreservingLink'],
    status: 'active',
    layer: 'L1',
    imports: 1,
    description: 'Next.js Link that preserves existing query params.',
  },

  // ════════════════════════════════════════════════════════
  // L2: Shared Components
  // ════════════════════════════════════════════════════════

  // ── Panel System ──────────────────────────────────────

  'panel-frame': {
    path: '@/components/shared/panel',
    exports: [
      'PanelFrame',
      'PanelFrameHeader',
      'FrameCloseButton',
      'PanelFrameBody',
    ],
    status: 'active',
    layer: 'L2',
    imports: 35,
    description:
      'Factor detail panel container. Frame + Header + Body structure.',
  },

  'panel-content': {
    path: '@/components/shared/panel',
    exports: [
      'PanelSection',
      'PanelStatGrid',
      'PanelStatItem',
      'PanelKV',
      'PanelRow',
      'PanelActions',
      'PanelChartBox',
      'PanelEmpty',
    ],
    status: 'active',
    layer: 'L2',
    imports: 35,
    description:
      'Panel content blocks: sections, stat grids, key-value rows, chart boxes.',
  },

  'panel-text': {
    path: '@/components/shared/panel',
    exports: ['PanelText', 'panelTextVariants', 'PANEL_TYPOGRAPHY'],
    status: 'active',
    layer: 'L2',
    variants: {
      variant: ['label', 'body', 'value', 'hint'],
    },
    imports: 35,
    description:
      'Panel typography with semantic variants. Uses @utility panel-* from globals.css.',
  },

  'panel-badge': {
    path: '@/components/shared/panel',
    exports: ['PanelBadge', 'PanelBadgeTag'],
    status: 'active',
    layer: 'L2',
    variants: {
      color: ['muted', 'red', 'teal', 'yellow'],
    },
    imports: 35,
    description: 'Panel-specific badge with Mine color palette.',
  },

  'panel-action-button': {
    path: '@/components/shared/panel',
    exports: ['PanelActionButton'],
    status: 'active',
    layer: 'L2',
    imports: 35,
    description: 'Small action button for panel headers (edit, delete, etc.).',
  },

  // ── Factor Metrics ────────────────────────────────────

  'factor-metrics': {
    path: '@/components/shared/factor-metrics',
    exports: [
      'FactorMetricGrid',
      'FactorMetricItem',
      'DistributionBar',
      'ThresholdBar',
    ],
    status: 'active',
    layer: 'L2',
    imports: 2,
    description:
      'Factor quality metric display: grid layout, distribution bars, threshold indicators.',
  },

  // ── Layout ────────────────────────────────────────────

  'top-nav-bar': {
    path: '@/components/layout/top-nav-bar',
    exports: ['TopNavBar'],
    status: 'active',
    layer: 'L2',
    imports: 2,
    description: 'Top navigation bar with glass-light backdrop blur.',
  },

  'left-icon-sidebar': {
    path: '@/components/layout/left-icon-sidebar',
    exports: ['LeftIconSidebar'],
    status: 'active',
    layer: 'L2',
    imports: 2,
    description: 'Floating icon sidebar with glass-heavy backdrop blur.',
  },

  'page-transition': {
    path: '@/components/layout/page-transition',
    exports: ['PageTransition'],
    status: 'active',
    layer: 'L2',
    imports: 1,
    description: 'Page-level enter/exit animation wrapper.',
  },

  'top-bar-slot': {
    path: '@/components/layout/top-bar-slot',
    exports: [],
    status: 'active',
    layer: 'L2',
    imports: 1,
    description: 'Slot for injecting content into the top nav bar.',
  },

  'user-capsule': {
    path: '@/components/layout/user-capsule',
    exports: ['UserCapsule'],
    status: 'active',
    layer: 'L2',
    imports: 1,
    description: 'User avatar + name capsule in sidebar.',
  },

  // ── Animation ─────────────────────────────────────────

  'animate-in': {
    path: '@/components/animation/animate-in',
    exports: ['AnimateIn', 'AnimateHeavy'],
    status: 'promote',
    layer: 'L2',
    imports: 0,
    description:
      'Page/section entry animation with blur+fade. USE THIS instead of hand-rolling filter:blur transitions.',
  },

  // ── Other Shared ──────────────────────────────────────

  logo: {
    path: '@/components/shared/logo',
    exports: ['Logo'],
    status: 'active',
    layer: 'L2',
    imports: 1,
    description: 'App logo.',
  },

  'floating-paths': {
    path: '@/components/shared/floating-paths',
    exports: ['FloatingPaths'],
    status: 'active',
    layer: 'L2',
    imports: 1,
    description: 'Decorative floating SVG paths for landing/hero sections.',
  },

  'chart-legend-inline': {
    path: '@/components/chart-legend-inline',
    exports: ['ChartLegendInline'],
    status: 'active',
    layer: 'L2',
    imports: 3,
    description: 'Inline chart legend with hover highlight.',
  },

  'lazy-chart': {
    path: '@/components/charts/lazy',
    exports: ['LazyChart'],
    status: 'active',
    layer: 'L2',
    imports: 4,
    description: 'Lazy-loaded chart wrapper with Suspense + skeleton.',
  },

  'error-boundary': {
    path: '@/components/error-boundary',
    exports: ['ErrorBoundary'],
    status: 'active',
    layer: 'L2',
    imports: 2,
    description: 'React error boundary with fallback UI.',
  },

  'theme-provider': {
    path: '@/components/theme-provider',
    exports: ['ThemeProvider'],
    status: 'active',
    layer: 'L2',
    imports: 1,
    description: 'next-themes provider. Mount once in root layout.',
  },

  // ════════════════════════════════════════════════════════
  // L3: Lab-Internal Components (features/lab/components/ui/)
  // ════════════════════════════════════════════════════════
  // These are marimo-origin components scoped to the lab feature.
  // Migration target: replace overlapping ones with L1 equivalents.

  'lab/button': {
    path: '@/features/lab/components/ui/button',
    exports: ['Button', 'buttonVariants'],
    status: 'internal',
    layer: 'L3',
    variants: {
      variant: [
        'default',
        'destructive',
        'success',
        'warn',
        'action',
        'outline',
        'secondary',
        'text',
        'ghost',
        'link',
        'linkDestructive',
        'outlineDestructive',
      ],
      size: ['default', 'xs', 'sm', 'lg', 'icon'],
    },
    imports: 13,
    description:
      'Lab-internal: has keyboardShortcut prop not in L1. Variants now match L1. Only use for keyboardShortcut consumers.',
  },

  'lab/badge': {
    path: '@/features/lab/components/ui/badge',
    exports: ['Badge', 'badgeVariants'],
    status: 'internal',
    layer: 'L3',
    variants: {
      variant: [
        'default',
        'defaultOutline',
        'secondary',
        'destructive',
        'success',
        'outline',
      ],
    },
    imports: 5,
    description:
      'Lab-internal: renders as <span> (L1 is <div>), onClick event types differ. Cannot drop-in replace.',
  },

  'lab/dialog': {
    path: '@/features/lab/components/ui/dialog',
    exports: [
      'Dialog',
      'DialogTrigger',
      'DialogContent',
      'DialogHeader',
      'DialogTitle',
      'DialogDescription',
      'DialogClose',
    ],
    status: 'internal',
    layer: 'L3',
    imports: 4,
    description: 'Lab-internal: DialogContent has usePortal prop not in L1.',
  },

  'lab/alert-dialog': {
    path: '@/features/lab/components/ui/alert-dialog',
    exports: [
      'AlertDialog',
      'AlertDialogTitle',
      'AlertDialogDescription',
      'AlertDialogAction',
      'AlertDialogCancel',
    ],
    status: 'deprecated',
    layer: 'L3',
    imports: 1,
    description: 'DEPRECATED: Use @/components/ui/alert-dialog.',
  },

  'lab/context-menu': {
    path: '@/features/lab/components/ui/context-menu',
    exports: [
      'ContextMenu',
      'ContextMenuTrigger',
      'ContextMenuContent',
      'ContextMenuGroup',
      'ContextMenuItem',
      'ContextMenuSeparator',
    ],
    status: 'deprecated',
    layer: 'L3',
    imports: 4,
    description: 'DEPRECATED: Use @/components/ui/context-menu.',
  },

  'lab/popover': {
    path: '@/features/lab/components/ui/popover',
    exports: ['Popover', 'PopoverTrigger', 'PopoverContent', 'PopoverAnchor'],
    status: 'deprecated',
    layer: 'L3',
    imports: 2,
    description:
      'DEPRECATED: Use @/components/ui/popover (now includes PopoverClose).',
  },

  'lab/card': {
    path: '@/features/lab/components/ui/card',
    exports: [
      'Card',
      'CardHeader',
      'CardTitle',
      'CardContent',
      'CardFooter',
      'CardDescription',
    ],
    status: 'deprecated',
    layer: 'L3',
    imports: 1,
    description: 'DEPRECATED: Use @/components/ui/card.',
  },

  'lab/command': {
    path: '@/features/lab/components/ui/command',
    exports: [
      'Command',
      'CommandDialog',
      'CommandInput',
      'CommandList',
      'CommandEmpty',
      'CommandGroup',
      'CommandItem',
      'CommandShortcut',
      'CommandSeparator',
    ],
    status: 'internal',
    layer: 'L3',
    imports: 3,
    description: 'Lab-internal: CommandInput has rootClassName prop not in L1.',
  },

  'lab/tabs': {
    path: '@/features/lab/components/ui/tabs',
    exports: ['Tabs', 'TabsList', 'TabsTrigger', 'TabsContent'],
    status: 'deprecated',
    layer: 'L3',
    imports: 3,
    description: 'DEPRECATED: Use @/components/ui/tabs.',
  },

  'lab/sheet': {
    path: '@/features/lab/components/ui/sheet',
    exports: [
      'Sheet',
      'SheetTrigger',
      'SheetContent',
      'SheetHeader',
      'SheetTitle',
      'SheetDescription',
      'SheetFooter',
    ],
    status: 'deprecated',
    layer: 'L3',
    imports: 1,
    description: 'DEPRECATED: Use @/components/ui/sheet.',
  },

  'lab/dropdown-menu': {
    path: '@/features/lab/components/ui/dropdown-menu',
    exports: [
      'DropdownMenu',
      'DropdownMenuTrigger',
      'DropdownMenuContent',
      'DropdownMenuGroup',
      'DropdownMenuItem',
      'DropdownMenuSeparator',
      'DropdownMenuCheckboxItem',
      'DropdownMenuRadioItem',
    ],
    status: 'internal',
    layer: 'L3',
    imports: 5,
    description:
      'Lab-internal: SubTrigger has showChevron prop, MenuItem has variant: "danger". API extensions over L1.',
  },

  'lab/tooltip': {
    path: '@/features/lab/components/ui/tooltip',
    exports: [
      'Tooltip',
      'TooltipRoot',
      'TooltipTrigger',
      'TooltipContent',
      'TooltipPortal',
    ],
    status: 'internal',
    layer: 'L3',
    imports: 34,
    description:
      'Lab-internal: convenience wrapper with content prop (vs L1 compound API). Also exports TooltipRoot, TooltipPortal.',
  },

  'lab/scroll-area': {
    path: '@/features/lab/components/ui/scroll-area',
    exports: ['ScrollArea', 'ScrollBar'],
    status: 'deprecated',
    layer: 'L3',
    imports: 0,
    description: 'DEPRECATED: Use @/components/ui/scroll-area.',
  },

  'lab/select': {
    path: '@/features/lab/components/ui/select',
    exports: [
      'Select',
      'SelectTrigger',
      'SelectValue',
      'SelectContent',
      'SelectItem',
      'SelectLabel',
      'SelectSeparator',
    ],
    status: 'deprecated',
    layer: 'L3',
    imports: 2,
    description:
      'DEPRECATED: Use @/components/ui/select. Migration successful, 5 consumers now use L1.',
  },

  'lab/label': {
    path: '@/features/lab/components/ui/label',
    exports: ['Label'],
    status: 'deprecated',
    layer: 'L3',
    imports: 3,
    description: 'DEPRECATED: Use @/components/ui/label.',
  },

  'lab/input': {
    path: '@/features/lab/components/ui/input',
    exports: ['Input', 'DebouncedInput', 'DebouncedNumberInput', 'SearchInput'],
    status: 'internal',
    layer: 'L3',
    imports: 5,
    description:
      'Lab-internal: has icon prop, DebouncedInput, DebouncedNumberInput, SearchInput exports not in L1.',
  },

  'lab/form': {
    path: '@/features/lab/components/ui/form',
    exports: [
      'Form',
      'FormField',
      'FormItem',
      'FormLabel',
      'FormControl',
      'FormDescription',
      'FormMessage',
    ],
    status: 'deprecated',
    layer: 'L3',
    imports: 5,
    description: 'DEPRECATED: Use @/components/ui/form.',
  },

  'lab/checkbox': {
    path: '@/features/lab/components/ui/checkbox',
    exports: ['Checkbox'],
    status: 'deprecated',
    layer: 'L3',
    imports: 3,
    description: 'DEPRECATED: Use @/components/ui/checkbox.',
  },

  'lab/calendar': {
    path: '@/features/lab/components/ui/calendar',
    exports: ['Calendar'],
    status: 'deprecated',
    layer: 'L3',
    imports: 2,
    description: 'DEPRECATED: Use @/components/ui/calendar.',
  },

  'lab/skeleton': {
    path: '@/features/lab/components/ui/skeleton',
    exports: ['Skeleton'],
    status: 'deprecated',
    layer: 'L3',
    imports: 0,
    description: 'DEPRECATED: Use @/components/ui/skeleton.',
  },

  'lab/kbd': {
    path: '@/features/lab/components/ui/kbd',
    exports: ['Kbd'],
    status: 'deprecated',
    layer: 'L3',
    imports: 2,
    description: 'DEPRECATED: Use @/components/ui/kbd.',
  },

  'lab/toggle': {
    path: '@/features/lab/components/ui/toggle',
    exports: ['Toggle', 'toggleVariants'],
    status: 'internal',
    layer: 'L3',
    imports: 2,
    description: 'Lab-internal: has xs size variant not in L1.',
  },

  'lab/table': {
    path: '@/features/lab/components/ui/table',
    exports: [
      'Table',
      'TableHeader',
      'TableBody',
      'TableFooter',
      'TableRow',
      'TableHead',
      'TableCell',
      'TableCaption',
    ],
    status: 'deprecated',
    layer: 'L3',
    imports: 0,
    description: 'DEPRECATED: Use @/components/ui/table.',
  },

  'lab/toast': {
    path: '@/features/lab/components/ui/toast',
    exports: [
      'Toast',
      'ToastAction',
      'ToastClose',
      'ToastDescription',
      'ToastTitle',
    ],
    status: 'deprecated',
    layer: 'L3',
    imports: 1,
    description: 'DEPRECATED: Use @/components/ui/sonner.',
  },

  'lab/toaster': {
    path: '@/features/lab/components/ui/toaster',
    exports: ['Toaster'],
    status: 'deprecated',
    layer: 'L3',
    imports: 1,
    description: 'DEPRECATED: Use @/components/ui/sonner.',
  },

  // ── Lab-only (no L1 equivalent, keep as internal) ─────

  'lab/accordion': {
    path: '@/features/lab/components/ui/accordion',
    exports: [
      'Accordion',
      'AccordionItem',
      'AccordionTrigger',
      'AccordionContent',
    ],
    status: 'internal',
    layer: 'L3',
    imports: 2,
    description:
      'Lab-only accordion. Consider promoting to L1 if needed elsewhere.',
  },

  'lab/alert': {
    path: '@/features/lab/components/ui/alert',
    exports: ['Alert', 'AlertTitle', 'AlertDescription'],
    status: 'internal',
    layer: 'L3',
    variants: {
      variant: ['default', 'destructive', 'warning'],
    },
    imports: 3,
    description: 'Lab-only inline alert banner. Consider promoting to L1.',
  },

  'lab/combobox': {
    path: '@/features/lab/components/ui/combobox',
    exports: ['Combobox'],
    status: 'internal',
    layer: 'L3',
    primitive: 'Popover + cmdk',
    imports: 3,
    description: 'Lab-only searchable select. Radix Popover + cmdk foundation.',
  },

  'lab/confirmation-button': {
    path: '@/features/lab/components/ui/confirmation-button',
    exports: ['ConfirmationButton'],
    status: 'internal',
    layer: 'L3',
    primitive: 'AlertDialog',
    imports: 1,
    description: 'Lab-only button that confirms before action.',
  },

  'lab/date-picker': {
    path: '@/features/lab/components/ui/date-picker',
    exports: ['DatePicker'],
    status: 'internal',
    layer: 'L3',
    primitive: 'react-aria-components',
    imports: 1,
    description: 'Lab-only date picker. Uses react-aria (not Radix).',
  },

  'lab/field': {
    path: '@/features/lab/components/ui/field',
    exports: ['Field'],
    status: 'internal',
    layer: 'L3',
    imports: 2,
    description: 'Lab-only form field wrapper with label+description.',
  },

  'lab/links': {
    path: '@/features/lab/components/ui/links',
    exports: ['Links', 'LinkItem'],
    status: 'internal',
    layer: 'L3',
    imports: 1,
    description: 'Lab-only styled link list.',
  },

  'lab/navigation': {
    path: '@/features/lab/components/ui/navigation',
    exports: ['Navigation'],
    status: 'internal',
    layer: 'L3',
    primitive: '@radix-ui/react-navigation-menu',
    imports: 1,
    description: 'Lab-only navigation menu.',
  },

  'lab/number-field': {
    path: '@/features/lab/components/ui/number-field',
    exports: ['NumberField'],
    status: 'internal',
    layer: 'L3',
    imports: 2,
    description: 'Lab-only numeric input with increment/decrement.',
  },

  'lab/radio-group': {
    path: '@/features/lab/components/ui/radio-group',
    exports: ['RadioGroup', 'RadioGroupItem'],
    status: 'internal',
    layer: 'L3',
    imports: 1,
    description: 'Lab-only radio group. Consider promoting to L1.',
  },

  'lab/switch': {
    path: '@/features/lab/components/ui/switch',
    exports: ['Switch'],
    status: 'internal',
    layer: 'L3',
    imports: 4,
    description: 'Lab-internal: has size prop and icon prop not in L1.',
  },

  'lab/textarea': {
    path: '@/features/lab/components/ui/textarea',
    exports: ['Textarea'],
    status: 'deprecated',
    layer: 'L3',
    imports: 2,
    description:
      'DEPRECATED: Use @/components/ui/textarea. Has active consumers in lab.',
  },

  'lab/slider': {
    path: '@/features/lab/components/ui/slider',
    exports: ['Slider'],
    status: 'deprecated',
    layer: 'L3',
    imports: 1,
    description:
      'DEPRECATED: Use @/components/ui/slider. Has active consumers in lab.',
  },

  'lab/native-select': {
    path: '@/features/lab/components/ui/native-select',
    exports: ['NativeSelect'],
    status: 'internal',
    layer: 'L3',
    imports: 2,
    description:
      'Lab-only native HTML select wrapper. No L1 equivalent (L1 Select uses Radix).',
  },

  'lab/menu-items': {
    path: '@/features/lab/components/ui/menu-items',
    exports: ['MenuItems'],
    status: 'internal',
    layer: 'L3',
    imports: 2,
    description: 'Lab-only menu item primitives for context/dropdown menus.',
  },

  'lab/fullscreen': {
    path: '@/features/lab/components/ui/fullscreen',
    exports: ['Fullscreen'],
    status: 'internal',
    layer: 'L3',
    imports: 1,
    description: 'Lab-only fullscreen toggle wrapper.',
  },

  'lab/draggable-popover': {
    path: '@/features/lab/components/ui/draggable-popover',
    exports: ['DraggablePopover'],
    status: 'internal',
    layer: 'L3',
    imports: 1,
    description: 'Lab-only draggable popover panel.',
  },

  'lab/progress': {
    path: '@/features/lab/components/ui/progress',
    exports: ['Progress'],
    status: 'deprecated',
    layer: 'L3',
    imports: 1,
    description:
      'DEPRECATED: Consider promoting Progress to L1 if needed outside lab.',
  },

  // ── Layout (restored) ──────────────────────────────────

  'market-ticker': {
    path: '@/components/layout/market-ticker',
    exports: [
      'MarketTicker',
      'DEFAULT_TICKER_INDICES',
      'DEFAULT_TICKER_BREADTH',
      'DEFAULT_TICKER_LIMIT_STATS',
    ],
    status: 'active',
    layer: 'L2',
    imports: 1,
    description:
      'Scrolling market ticker bar. Accepts data as props (no L3 dependency). Includes default mock data.',
  },
} as const satisfies Record<string, ComponentEntry>;

// ─── Utilities ────────────────────────────────────────────

/** Get all active components suitable for new feature development */
export function getActiveComponents() {
  return Object.entries(COMPONENT_REGISTRY).filter(
    ([, entry]) => entry.status === 'active' || entry.status === 'promote',
  );
}

/** Get components that should be used instead of hand-rolling */
export function getPromoteComponents() {
  return Object.entries(COMPONENT_REGISTRY).filter(
    ([, entry]) => entry.status === 'promote',
  );
}

/** Get deprecated components that need migration */
export function getDeprecatedComponents() {
  return Object.entries(COMPONENT_REGISTRY).filter(
    ([, entry]) => entry.status === 'deprecated',
  );
}

/** Find component by export name */
export function findByExport(exportName: string) {
  return Object.entries(COMPONENT_REGISTRY).find(([, entry]) =>
    entry.exports.includes(exportName),
  );
}
