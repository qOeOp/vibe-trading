"""TDD: Verify LabStatusDock structure, styling, and content layout.

Tests written BEFORE implementation. Expected to fail initially.
Dock spec (from design doc section 6):
  - Glassmorphism: bg-white/40 backdrop-blur-2xl rounded-full h-10
  - Position: bottom, centered, floating (not full width)
  - Left side: file tabs area (+ button, active file pill)
  - Right side: status indicators (kernel, CPU/mem, warnings, errors, AI)
  - Width follows editor area (not full viewport)
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

    page.screenshot(path="/tmp/lab-dock-test-1.png")

    # ═══════════════════════════════════════
    print("\n=== TEST 1: Dock element exists with data-slot ===")

    dock = page.locator('[data-slot="lab-status-dock"]')
    check("Dock element exists", dock.count() > 0, "data-slot='lab-status-dock' not found")

    if dock.count() == 0:
        # Fallback: try finding by footer data-slot
        dock = page.locator('[data-slot="lab-footer"]')
        print(f"    Fallback: lab-footer found = {dock.count() > 0}")

    # ═══════════════════════════════════════
    print("\n=== TEST 2: Dock positioning and dimensions ===")

    dock_info = page.evaluate("""() => {
        const dock = document.querySelector('[data-slot="lab-status-dock"]')
                  || document.querySelector('[data-slot="lab-footer"]');
        if (!dock) return null;
        const rect = dock.getBoundingClientRect();
        const cs = window.getComputedStyle(dock);
        return {
            x: rect.x,
            y: rect.y,
            width: rect.width,
            height: rect.height,
            bottom: rect.bottom,
            viewportWidth: window.innerWidth,
            viewportHeight: window.innerHeight,
            borderRadius: cs.borderRadius,
            backdropFilter: cs.backdropFilter || cs.webkitBackdropFilter || '',
        };
    }""")

    if dock_info:
        # Height should be ~40px (h-10)
        check(f"Dock height ~40px (actual={dock_info['height']:.0f})",
              30 < dock_info["height"] < 50,
              f"height={dock_info['height']:.0f}")

        # Should be near bottom of viewport
        check(f"Dock near bottom (bottom={dock_info['bottom']:.0f}, viewport={dock_info['viewportHeight']})",
              dock_info["bottom"] > dock_info["viewportHeight"] - 30,
              f"bottom={dock_info['bottom']:.0f}")

        # Should NOT be full viewport width
        check(f"Dock not full width (w={dock_info['width']:.0f} < viewport={dock_info['viewportWidth']})",
              dock_info["width"] < dock_info["viewportWidth"] - 100,
              f"width={dock_info['width']:.0f}")

        # Should be centered within editor area (not full viewport — sidebar takes ~52px left)
        # The dock's transform: -translate-x-1/2 centers it relative to its parent (editor content)
        # Dock x should be roughly centered within the available editor area, accounting for sidebar
        sidebar_width = 52  # Collapsed sidebar approximate width
        editor_center_x = sidebar_width + (dock_info["viewportWidth"] - sidebar_width) / 2
        dock_center_x = dock_info["x"] + dock_info["width"] / 2
        center_offset = abs(dock_center_x - editor_center_x)
        check(f"Dock centered in editor area (offset={center_offset:.0f}px)", center_offset < 60,
              f"dock_center={dock_center_x:.0f}, editor_center~{editor_center_x:.0f}")

        # Should have rounded corners (rounded-full = very large border-radius)
        check(f"Dock has rounded corners ({dock_info['borderRadius']})",
              dock_info["borderRadius"] != "0px" and dock_info["borderRadius"] != "",
              f"borderRadius={dock_info['borderRadius']}")

        # Should have backdrop-blur (glassmorphism)
        check(f"Dock has backdrop-blur ({dock_info['backdropFilter'][:30]}...)",
              "blur" in dock_info["backdropFilter"],
              f"backdropFilter={dock_info['backdropFilter']}")
    else:
        check("Dock element found for dimension check", False, "Not found")

    # ═══════════════════════════════════════
    print("\n=== TEST 3: Dock pointer-events layering ===")

    pe_info = page.evaluate("""() => {
        // Find the pointer-events:none outer wrapper
        const all = document.querySelectorAll('div');
        for (const el of all) {
            const cs = window.getComputedStyle(el);
            const rect = el.getBoundingClientRect();
            if (cs.position === 'absolute' && cs.pointerEvents === 'none'
                && rect.bottom > 860 && rect.height < 60 && rect.height > 20) {
                const inner = el.querySelector('[data-slot="lab-status-dock"], [data-slot="lab-footer"]');
                if (!inner) continue;
                const innerCs = window.getComputedStyle(inner);
                return {
                    found: true,
                    outerPE: cs.pointerEvents,
                    innerPE: innerCs.pointerEvents,
                };
            }
        }
        return { found: false };
    }""")

    if pe_info and pe_info.get("found"):
        check("Outer wrapper pointer-events: none", pe_info["outerPE"] == "none")
        check("Inner dock pointer-events: auto", pe_info["innerPE"] == "auto")
    else:
        check("Pointer-events layering found", False, "Wrapper not found")

    # ═══════════════════════════════════════
    print("\n=== TEST 4: Dock left side — file tabs area ===")

    # Check for file tab elements
    file_tabs = page.locator('[data-slot="lab-status-dock"] [data-slot="dock-file-tabs"], [data-slot="lab-footer"] [data-slot="dock-file-tabs"]')
    check("File tabs area exists", file_tabs.count() > 0, "data-slot='dock-file-tabs' not found")

    # Check for new file button
    new_file_btn = page.locator('[data-slot="lab-status-dock"] [aria-label="New file"], [data-slot="lab-footer"] [aria-label="New file"]')
    check("New file (+) button exists", new_file_btn.count() > 0, "No 'New file' button found")

    # ═══════════════════════════════════════
    print("\n=== TEST 5: Dock right side — status indicators ===")

    dock_selector = '[data-slot="lab-status-dock"], [data-slot="lab-footer"]'

    # Status indicators that should be present on the right side
    # Check for machine stats (CPU/memory)
    machine_stats = page.locator(f'{dock_selector} [data-testid="machine-stats"]')
    has_machine_stats = machine_stats.count() > 0
    # Fallback: look for any element with CPU or memory text
    if not has_machine_stats:
        machine_stats = page.evaluate("""() => {
            const dock = document.querySelector('[data-slot="lab-status-dock"]')
                      || document.querySelector('[data-slot="lab-footer"]');
            if (!dock) return false;
            return dock.textContent.includes('CPU') || dock.textContent.includes('Memory')
                || dock.textContent.includes('%');
        }""")
        has_machine_stats = bool(machine_stats)
    check("Machine stats present in dock", has_machine_stats, "No CPU/Memory stats found")

    # Check for connection/kernel status indicator
    kernel_status = page.locator(f'{dock_selector} [data-slot="dock-kernel-status"]')
    has_kernel = kernel_status.count() > 0
    if not has_kernel:
        # Fallback: check for connection-related text/icons
        has_kernel = page.evaluate("""() => {
            const dock = document.querySelector('[data-slot="lab-status-dock"]')
                      || document.querySelector('[data-slot="lab-footer"]');
            if (!dock) return false;
            return dock.textContent.includes('Connected') || dock.textContent.includes('Kernel')
                || dock.querySelector('[data-testid="backend-status"]') !== null;
        }""") or False
    check("Kernel/connection status in dock", has_kernel, "No kernel status found")

    # Check warnings/errors count
    issue_indicators = page.evaluate("""() => {
        const dock = document.querySelector('[data-slot="lab-status-dock"]')
                  || document.querySelector('[data-slot="lab-footer"]');
        if (!dock) return { found: false };
        // Look for warning/error icons (AlertTriangle, XCircle from lucide)
        const svgs = dock.querySelectorAll('svg');
        let hasWarning = false, hasError = false;
        for (const svg of svgs) {
            const cls = svg.getAttribute('class') || '';
            // lucide icons have specific class patterns
            if (svg.closest('[data-testid="footer-panel"]')) {
                hasWarning = true;
                hasError = true;
            }
        }
        // Also check for footer-panel testid
        const footerPanel = dock.querySelector('[data-testid="footer-panel"]');
        return { found: true, hasWarning, hasError, hasFooterPanel: !!footerPanel };
    }""")
    if issue_indicators and issue_indicators.get("found"):
        check("Issue indicators present in dock",
              issue_indicators.get("hasFooterPanel") or issue_indicators.get("hasWarning"),
              "No warning/error indicators found")

    # ═══════════════════════════════════════
    print("\n=== TEST 6: Dock layout — left file tabs, right status ===")

    layout_info = page.evaluate("""() => {
        const dock = document.querySelector('[data-slot="lab-status-dock"]')
                  || document.querySelector('[data-slot="lab-footer"]');
        if (!dock) return null;
        const dockRect = dock.getBoundingClientRect();

        // Find file tabs area (left)
        const fileTabs = dock.querySelector('[data-slot="dock-file-tabs"]');
        const fileTabsRect = fileTabs ? fileTabs.getBoundingClientRect() : null;

        // Find status area (right)
        const statusArea = dock.querySelector('[data-slot="dock-status"]');
        const statusRect = statusArea ? statusArea.getBoundingClientRect() : null;

        return {
            dockLeft: dockRect.left,
            dockRight: dockRect.right,
            fileTabsLeft: fileTabsRect ? fileTabsRect.left : null,
            statusRight: statusRect ? statusRect.right : null,
        };
    }""")

    if layout_info and layout_info.get("fileTabsLeft") is not None:
        # File tabs should be on the left side
        check("File tabs on left side",
              abs(layout_info["fileTabsLeft"] - layout_info["dockLeft"]) < 50,
              f"fileTabsLeft={layout_info['fileTabsLeft']:.0f}, dockLeft={layout_info['dockLeft']:.0f}")
    else:
        check("Dock has file tabs and status areas with proper slots", False,
              "Missing data-slot='dock-file-tabs' or 'dock-status'")

    # ═══════════════════════════════════════
    page.screenshot(path="/tmp/lab-dock-test-2.png")

    print(f"\n{'='*50}")
    print(f"Results: {PASS} passed, {FAIL} failed")
    if FAIL > 0:
        print("SOME TESTS FAILED — expected for TDD before implementation")
        sys.exit(1)
    else:
        print("ALL TESTS PASSED")

    browser.close()
