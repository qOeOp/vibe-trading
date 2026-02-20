"""TDD: Verify sidebar drawer styling in lab mode.

When a sidebar panel opens in lab mode:
  - Background should be mine-page-bg (米色, not transparent/white)
  - No left border between icon column and panel (seamless connection)
  - Right edge has a subtle visual transition to the editor area
"""
from playwright.sync_api import sync_playwright
import sys

PASS = 0
FAIL = 0

def check(name, condition, detail=""):
    global PASS, FAIL
    if condition:
        PASS += 1
        print(f"  \u2713 {name}")
    else:
        FAIL += 1
        print(f"  \u2717 {name} \u2014 {detail}")

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

    # Open sidebar panel by clicking an editor icon
    first_icon = page.locator('[data-slot="lab-sidebar"] button[title="View files"]')
    if first_icon.count() > 0:
        first_icon.click()
        page.wait_for_timeout(800)

    page.screenshot(path="/tmp/lab-sidebar-drawer-test-1.png")

    # ================================================
    print("\n=== TEST 1: Helper panel exists and is open ===")

    helper = page.locator('[data-testid="helper"]')
    check("Helper panel exists", helper.count() > 0, "data-testid='helper' not found")

    helper_box = None
    if helper.count() > 0:
        helper_box = helper.bounding_box()
        check("Helper panel has width > 0", helper_box and helper_box["width"] > 50,
              f"width={helper_box['width'] if helper_box else 0}")

    # ================================================
    print("\n=== TEST 2: Background is mine-page-bg (not transparent) ===")

    bg_info = page.evaluate("""() => {
        const helper = document.querySelector('[data-testid="helper"]');
        if (!helper) return null;
        const cs = window.getComputedStyle(helper);
        const bg = cs.backgroundColor;
        // Check the panel body container too
        const body = helper.querySelector('[class*="flex-col"]') || helper.firstElementChild;
        const bodyCs = body ? window.getComputedStyle(body) : null;
        return {
            panelBg: bg,
            bodyBg: bodyCs ? bodyCs.backgroundColor : null,
            isTransparent: bg === 'rgba(0, 0, 0, 0)' || bg === 'transparent',
        };
    }""")

    if bg_info:
        # Panel should NOT be transparent — it should have mine-page-bg
        check("Panel background is NOT transparent",
              not bg_info["isTransparent"],
              f"bg={bg_info['panelBg']}")
    else:
        check("Panel found for bg check", False, "Not found")

    # ================================================
    print("\n=== TEST 3: No left border (seamless with icon column) ===")

    border_info = page.evaluate("""() => {
        const helper = document.querySelector('[data-testid="helper"]');
        if (!helper) return null;
        const cs = window.getComputedStyle(helper);
        return {
            borderLeftWidth: cs.borderLeftWidth,
            borderLeftStyle: cs.borderLeftStyle,
            borderRightWidth: cs.borderRightWidth,
            borderRightStyle: cs.borderRightStyle,
        };
    }""")

    if border_info:
        has_left_border = border_info["borderLeftWidth"] != "0px" and border_info["borderLeftStyle"] != "none"
        check("No left border on panel",
              not has_left_border,
              f"borderLeft: {border_info['borderLeftWidth']} {border_info['borderLeftStyle']}")
    else:
        check("Panel found for border check", False, "Not found")

    # ================================================
    print("\n=== TEST 4: Right border or edge treatment exists ===")

    if border_info:
        has_right_border = border_info["borderRightWidth"] != "0px" and border_info["borderRightStyle"] != "none"
        # Right side should have SOME visual separation (border or shadow)
        right_edge = page.evaluate("""() => {
            const helper = document.querySelector('[data-testid="helper"]');
            if (!helper) return null;
            const cs = window.getComputedStyle(helper);
            const rect = helper.getBoundingClientRect();
            return {
                borderRight: cs.borderRightWidth + ' ' + cs.borderRightStyle,
                boxShadow: cs.boxShadow,
                hasVisualEdge: cs.borderRightWidth !== '0px' || cs.boxShadow !== 'none',
            };
        }""")
        if right_edge:
            check("Right edge has visual treatment",
                  right_edge["hasVisualEdge"],
                  "No border or shadow on right edge")

    # ================================================
    print("\n=== TEST 5: Panel header styling ===")

    header_info = page.evaluate("""() => {
        const helper = document.querySelector('[data-testid="helper"]');
        if (!helper) return null;
        // Find the header element (first child with flex row, typically contains title + close button)
        const header = helper.querySelector('header, [class*="border-b"]');
        if (!header) return { found: false };
        const cs = window.getComputedStyle(header);
        return {
            found: true,
            borderBottom: cs.borderBottomWidth + ' ' + cs.borderBottomStyle,
        };
    }""")

    if header_info and header_info.get("found"):
        check("Panel header exists", True)
    else:
        # Header might use different structure
        check("Panel header found", False, "No header element detected")

    # ================================================
    page.screenshot(path="/tmp/lab-sidebar-drawer-test-2.png")

    print(f"\n{'='*50}")
    print(f"Results: {PASS} passed, {FAIL} failed")
    if FAIL > 0:
        print("SOME TESTS FAILED")
        sys.exit(1)
    else:
        print("ALL TESTS PASSED")

    browser.close()
