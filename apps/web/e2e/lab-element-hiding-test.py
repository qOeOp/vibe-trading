"""TDD: Verify editor elements are properly hidden/moved in lab mode.

Tests written BEFORE implementation. Expected to fail initially.
Design spec sections 5.2 and 7.2:
  - Top-right controls (NotebookMenu, Config, Shutdown) → moved to topbar (already done)
  - StatusOverlay (running/disconnected icons) → hidden, integrated into dock
  - Bottom-right controls (Save, Run, Stop, CommandPalette) → should remain visible
  - Editor native sidebar (icon bar) → hidden, replaced by LabCollapsedSidebar
"""
from playwright.sync_api import sync_playwright
import sys

PASS = 0
FAIL = 0

def check(name, condition, detail=""):
    global PASS, FAIL
    if condition:
        PASS += 1
        print(f"  ✓ {name}")
    else:
        FAIL += 1
        print(f"  ✗ {name} — {detail}")

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1440, "height": 900})
    page.on("dialog", lambda d: d.accept())

    page.goto("http://localhost:4200/factor/lab")
    page.wait_for_load_state("networkidle")

    # Enter lab mode
    connect_btn = page.locator("text=Connect")
    if connect_btn.count() > 0:
        connect_btn.first.click()
        page.wait_for_timeout(3000)
        page.wait_for_load_state("networkidle")

    page.screenshot(path="/tmp/lab-element-hiding-1.png")

    # ═══════════════════════════════════════
    print("\n=== TEST 1: Marimo top-right floating controls HIDDEN ===")

    # Marimo's top-right controls (NotebookMenu dropdown, Config, Shutdown)
    # should NOT be visible inside the EDITOR area. They were moved to our topbar.
    # Key: these are inside the editor PanelGroup, not in the topbar.
    top_right_info = page.evaluate("""() => {
        // Marimo's controls have specific test IDs
        const menuDropdown = document.querySelector('[data-testid="notebook-menu-dropdown"]');
        const shutdownBtn = document.querySelector('[data-testid="shutdown-button"]');
        const exitLabBtn = document.querySelector('[data-testid="exit-lab-button"]');

        // Check if any of these are visible (have non-zero dimensions)
        const isVisible = (el) => {
            if (!el) return false;
            const rect = el.getBoundingClientRect();
            const cs = window.getComputedStyle(el);
            return rect.width > 0 && rect.height > 0 && cs.display !== 'none'
                   && cs.visibility !== 'hidden' && cs.opacity !== '0';
        };

        return {
            menuDropdownVisible: isVisible(menuDropdown),
            shutdownVisible: isVisible(shutdownBtn),
            exitLabVisible: isVisible(exitLabBtn),
            anyVisible: isVisible(menuDropdown) || isVisible(shutdownBtn) || isVisible(exitLabBtn),
        };
    }""")

    if top_right_info:
        check("Marimo top-right controls NOT visible in lab mode",
              not top_right_info.get("anyVisible", False),
              f"menu={top_right_info.get('menuDropdownVisible')}, shutdown={top_right_info.get('shutdownVisible')}")
    else:
        check("Top-right controls NOT visible", True)  # Not found = pass

    # ═══════════════════════════════════════
    print("\n=== TEST 2: StatusOverlay HIDDEN in lab mode ===")

    # StatusOverlay renders at top-left (z-50, top-4, left-4)
    # It shows running/disconnected/locked icons
    # In lab mode, these should be hidden (status moves to dock)
    status_overlay = page.evaluate("""() => {
        // StatusOverlay has data-testid="loading-indicator" for running state
        const loadingIndicator = document.querySelector('[data-testid="loading-indicator"]');

        // Also check for disconnected/locked icons at top-left
        const topLeftIcons = [];
        const all = document.querySelectorAll('div');
        for (const el of all) {
            const cs = window.getComputedStyle(el);
            const rect = el.getBoundingClientRect();
            // StatusOverlay container: z-50, top-4, left-4
            if ((cs.position === 'absolute' || cs.position === 'fixed')
                && rect.top < 40 && rect.left < 40
                && parseInt(cs.zIndex) >= 50) {
                const svg = el.querySelector('svg');
                if (svg) {
                    topLeftIcons.push({
                        visible: cs.display !== 'none' && cs.visibility !== 'hidden'
                                 && cs.opacity !== '0' && rect.width > 0,
                        class: svg.getAttribute('class') || '',
                    });
                }
            }
        }

        return {
            loadingIndicatorFound: !!loadingIndicator,
            loadingIndicatorVisible: loadingIndicator
                ? window.getComputedStyle(loadingIndicator).display !== 'none'
                : false,
            topLeftIcons: topLeftIcons,
            anyVisible: topLeftIcons.some(i => i.visible),
        };
    }""")

    if status_overlay:
        # In lab mode, status overlay should not show icons at top-left
        # (Running icon might not appear if nothing is running, so we check the container)
        check("No visible StatusOverlay icons at top-left",
              not status_overlay.get("anyVisible", False),
              f"Found {len(status_overlay.get('topLeftIcons', []))} visible icons at top-left")

    # ═══════════════════════════════════════
    print("\n=== TEST 3: Bottom-right controls REMAIN visible ===")

    # Save, Run, Stop, CommandPalette should still be visible at bottom-right
    bottom_right_info = page.evaluate("""() => {
        const results = {};

        // Run button
        const runBtn = document.querySelector('[data-testid="run-button"]');
        if (runBtn) {
            const rect = runBtn.getBoundingClientRect();
            results.runButton = { found: true, visible: rect.width > 0, x: rect.x, y: rect.y };
        } else {
            results.runButton = { found: false };
        }

        // Interrupt/stop button
        const stopBtn = document.querySelector('[data-testid="interrupt-button"]');
        if (stopBtn) {
            const rect = stopBtn.getBoundingClientRect();
            results.stopButton = { found: true, visible: rect.width > 0 };
        } else {
            results.stopButton = { found: false };
        }

        // Hide code / preview button
        const previewBtn = document.querySelector('[data-testid="hide-code-button"]');
        if (previewBtn) {
            const rect = previewBtn.getBoundingClientRect();
            results.previewButton = { found: true, visible: rect.width > 0 };
        } else {
            results.previewButton = { found: false };
        }

        return results;
    }""")

    if bottom_right_info:
        run = bottom_right_info.get("runButton", {})
        # Run button may be "inactive" (zero-size) when no cells need running — that's OK
        check("Run button exists in DOM",
              run.get("found"),
              f"found={run.get('found')}")

        stop = bottom_right_info.get("stopButton", {})
        check("Stop button exists and visible",
              stop.get("found") and stop.get("visible"),
              f"found={stop.get('found')}, visible={stop.get('visible')}")

        preview = bottom_right_info.get("previewButton", {})
        check("Preview/hide-code button exists and visible",
              preview.get("found") and preview.get("visible"),
              f"found={preview.get('found')}, visible={preview.get('visible')}")

        # Verify bottom-right position (x > 1200, y > 600)
        if run.get("found") and run.get("x"):
            check(f"Run button at bottom-right (x={run['x']:.0f}, y={run['y']:.0f})",
                  run["x"] > 1200 and run["y"] > 600,
                  f"Position x={run['x']:.0f}, y={run['y']:.0f}")

    # ═══════════════════════════════════════
    print("\n=== TEST 4: Filename input HIDDEN in lab mode ===")

    # The "untitled marimo notebook" filename input should be hidden
    # Filename editing moves to dock file tabs
    filename_info = page.evaluate("""() => {
        const filenameInput = document.querySelector('[data-testid="filename-input"]');
        if (filenameInput) {
            const rect = filenameInput.getBoundingClientRect();
            const cs = window.getComputedStyle(filenameInput);
            return {
                found: true,
                visible: rect.width > 0 && rect.height > 0
                         && cs.display !== 'none' && cs.visibility !== 'hidden',
            };
        }
        // Also check for any element containing "untitled marimo notebook"
        const allInputs = document.querySelectorAll('input[placeholder]');
        for (const input of allInputs) {
            if (input.placeholder.includes('untitled') || input.placeholder.includes('marimo')) {
                const rect = input.getBoundingClientRect();
                return {
                    found: true,
                    visible: rect.width > 0 && rect.height > 0,
                    placeholder: input.placeholder,
                };
            }
        }
        return { found: false, visible: false };
    }""")

    check("Filename input NOT visible in lab mode",
          not filename_info.get("visible", False),
          f"found={filename_info.get('found')}, visible={filename_info.get('visible')}")

    # ═══════════════════════════════════════
    print("\n=== TEST 5: Editor native sidebar HIDDEN ===")

    # Marimo's own sidebar icon bar should not be visible
    # It has data-testid="app-chrome-sidebar" or similar
    editor_sidebar = page.evaluate("""() => {
        // Look for the marimo sidebar component (usually has icon buttons for panels)
        // The Sidebar component renders inside PanelGroup
        const sidebar = document.querySelector('[data-testid="sidebar"]');
        if (sidebar) {
            const rect = sidebar.getBoundingClientRect();
            const cs = window.getComputedStyle(sidebar);
            return {
                found: true,
                visible: rect.width > 0 && cs.display !== 'none',
                width: rect.width,
            };
        }

        // Also check for the sidebar wrapper that contains panel icons
        // In marimo, the sidebar has panel icon buttons
        const allPanelGroups = document.querySelectorAll('[data-panel-group-id]');
        for (const pg of allPanelGroups) {
            const sidebarEl = pg.querySelector('.panel-sidebar');
            if (sidebarEl) {
                const rect = sidebarEl.getBoundingClientRect();
                return {
                    found: true,
                    visible: rect.width > 5,
                    width: rect.width,
                };
            }
        }

        return { found: false, visible: false };
    }""")

    check("Editor native sidebar NOT visible",
          not editor_sidebar.get("visible", False),
          f"Sidebar found={editor_sidebar.get('found')}, visible={editor_sidebar.get('visible')}, w={editor_sidebar.get('width', 0)}")

    # ═══════════════════════════════════════
    print("\n=== TEST 5: Editor native footer (border-t) NOT visible ===")

    # In lab mode, the old border-t footer should be replaced by floating dock
    # The old footer has class 'border-t border-border'
    old_footer = page.evaluate("""() => {
        const footers = document.querySelectorAll('footer');
        for (const f of footers) {
            const cs = window.getComputedStyle(f);
            const rect = f.getBoundingClientRect();
            // Old footer: has border-t, is at the very bottom, full width
            if (rect.width > 1000 && cs.borderTopWidth !== '0px' && rect.bottom > 850) {
                return { found: true, hasBorderTop: true, width: rect.width };
            }
        }
        return { found: false };
    }""")

    check("No full-width bordered footer in lab mode",
          not old_footer.get("found", False),
          f"Old bordered footer found, width={old_footer.get('width', 0)}")

    # ═══════════════════════════════════════
    page.screenshot(path="/tmp/lab-element-hiding-2.png")

    print(f"\n{'='*50}")
    print(f"Results: {PASS} passed, {FAIL} failed")
    if FAIL > 0:
        print("SOME TESTS FAILED — expected for TDD before implementation")
        sys.exit(1)
    else:
        print("ALL TESTS PASSED")

    browser.close()
