"""TDD: Verify editor sidebar icons are clickable without being blocked by nav hover.

Core requirement: hovering on editor icon area should NOT trigger nav expansion.
Only hovering near Factor button should trigger the full sidebar nav to appear.
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

    connect_btn = page.locator("text=Connect")
    if connect_btn.count() > 0:
        connect_btn.first.click()
        page.wait_for_timeout(3000)
        page.wait_for_load_state("networkidle")

    # ================================================
    print("\n=== TEST 1: Editor icons visible before any hover ===")

    editor_icons = page.locator('[data-slot="lab-sidebar"] button[title="View files"]')
    check("View files icon exists", editor_icons.count() > 0, "Not found")
    if editor_icons.count() > 0:
        box = editor_icons.first.bounding_box()
        check("View files icon has size", box and box["width"] > 0, "Zero size")

    # ================================================
    print("\n=== TEST 2: Hovering editor icon does NOT trigger nav expansion ===")

    # Move mouse to the first editor icon
    if editor_icons.count() > 0:
        box = editor_icons.first.bounding_box()
        if box:
            page.mouse.move(box["x"] + box["width"] / 2, box["y"] + box["height"] / 2)
            page.wait_for_timeout(500)

            # Editor icons should STILL be visible (not replaced by nav items)
            icon_after_hover = page.locator('[data-slot="lab-sidebar"] button[title="View files"]')
            after_box = icon_after_hover.bounding_box() if icon_after_hover.count() > 0 else None
            check("Editor icon still visible after hovering it",
                  after_box and after_box["width"] > 0,
                  "Editor icon disappeared on hover!")

            # Nav items like "Dashboard" should NOT be visible
            dashboard_btn = page.locator('[data-slot="lab-sidebar"] button[title="Dashboard"]')
            dash_visible = False
            if dashboard_btn.count() > 0:
                dash_box = dashboard_btn.first.bounding_box()
                if dash_box:
                    # Check opacity via evaluate
                    dash_visible = page.evaluate("""() => {
                        const btn = document.querySelector('[data-slot="lab-sidebar"] button[title="Dashboard"]');
                        if (!btn) return false;
                        const parent = btn.closest('[style*="opacity"]') || btn.parentElement;
                        const cs = window.getComputedStyle(parent);
                        return parseFloat(cs.opacity) > 0.5;
                    }""")
            check("Nav items NOT expanded while hovering editor icon",
                  not dash_visible,
                  "Dashboard button became visible — nav expanded!")

    # ================================================
    print("\n=== TEST 3: Editor icon is clickable (opens sidebar panel) ===")

    # Click the "View files" editor icon
    if editor_icons.count() > 0:
        editor_icons.first.click()
        page.wait_for_timeout(800)

        # Helper panel should open
        helper = page.locator('[data-testid="helper"]')
        helper_box = helper.bounding_box() if helper.count() > 0 else None
        check("Sidebar panel opened after clicking editor icon",
              helper_box and helper_box["width"] > 50,
              f"width={helper_box['width'] if helper_box else 0}")

    page.screenshot(path="/tmp/lab-editor-icon-click-1.png")

    # ================================================
    print("\n=== TEST 4: Hovering Factor DOES trigger nav expansion ===")

    # Close the panel first
    page.mouse.move(700, 500)
    page.wait_for_timeout(300)

    # Find Factor button
    factor = page.locator('[data-testid="factor-anchor"]')
    if factor.count() > 0:
        factor_box = factor.bounding_box()
        if factor_box:
            page.mouse.move(
                factor_box["x"] + factor_box["width"] / 2,
                factor_box["y"] + factor_box["height"] / 2
            )
            page.wait_for_timeout(500)

            # Now Dashboard should be visible (nav expanded)
            dash_visible = page.evaluate("""() => {
                const btn = document.querySelector('[data-slot="lab-sidebar"] button[title="Dashboard"]');
                if (!btn) return false;
                const parent = btn.closest('[style*="opacity"]') || btn.parentElement;
                const cs = window.getComputedStyle(parent);
                return parseFloat(cs.opacity) > 0.5;
            }""")
            check("Nav items expanded when hovering Factor",
                  dash_visible,
                  "Dashboard button NOT visible — nav didn't expand!")

    page.screenshot(path="/tmp/lab-editor-icon-click-2.png")

    # ================================================
    print("\n=== TEST 5: Moving away from Factor collapses nav again ===")

    page.mouse.move(700, 500)
    page.wait_for_timeout(500)

    # Editor icons should reappear
    icon_back = page.locator('[data-slot="lab-sidebar"] button[title="View files"]')
    icon_back_box = icon_back.bounding_box() if icon_back.count() > 0 else None
    check("Editor icons reappear after leaving Factor",
          icon_back_box and icon_back_box["width"] > 0,
          "Editor icons didn't come back")

    # ================================================
    page.screenshot(path="/tmp/lab-editor-icon-click-3.png")

    print(f"\n{'='*50}")
    print(f"Results: {PASS} passed, {FAIL} failed")
    if FAIL > 0:
        print("SOME TESTS FAILED")
        sys.exit(1)
    else:
        print("ALL TESTS PASSED")

    browser.close()
