"""TDD: Verify dock stays within editor area, not spanning full viewport.

When sidebar is open, the dock should be positioned within the editor
content area (to the right of the sidebar), not centered across the
full viewport width.
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

    page.screenshot(path="/tmp/lab-dock-width-1.png")

    # ================================================
    print("\n=== TEST 1: Dock exists ===")

    dock = page.locator('[data-slot="lab-status-dock"]')
    check("Dock element exists", dock.count() > 0)

    # ================================================
    print("\n=== TEST 2: Dock is within editor body (no sidebar open) ===")

    if dock.count() > 0:
        dock_box = dock.first.bounding_box()
        editor_body = page.locator('#app-chrome-body')
        editor_box = editor_body.first.bounding_box() if editor_body.count() > 0 else None

        if dock_box and editor_box:
            # Dock left edge should be >= editor body left edge
            dock_within_editor = dock_box["x"] >= editor_box["x"] - 2
            check("Dock left edge within editor body",
                  dock_within_editor,
                  f"dock.x={dock_box['x']:.0f}, editor.x={editor_box['x']:.0f}")

            # Dock should be roughly centered in editor body
            editor_center = editor_box["x"] + editor_box["width"] / 2
            dock_center = dock_box["x"] + dock_box["width"] / 2
            center_diff = abs(dock_center - editor_center)
            check("Dock centered in editor body (within 50px)",
                  center_diff < 50,
                  f"dock_center={dock_center:.0f}, editor_center={editor_center:.0f}, diff={center_diff:.0f}")
        else:
            check("Dock within editor body", False,
                  f"dock_box={dock_box}, editor_box={editor_box}")
            check("Dock centered in editor", False, "Skipped")

    # ================================================
    print("\n=== TEST 3: Open sidebar and verify dock stays in editor area ===")

    # Click an editor sidebar icon to open a panel
    sidebar_icons = page.locator('[data-slot="lab-sidebar"] button')
    editor_icon = None
    for i in range(sidebar_icons.count()):
        btn = sidebar_icons.nth(i)
        label = btn.get_attribute("aria-label") or ""
        if "files" in label.lower() or "view" in label.lower():
            editor_icon = btn
            break

    if not editor_icon:
        # Try clicking any editor icon above the Factor button
        factor_btn = page.locator('[data-testid="factor-anchor"]')
        if factor_btn.count() > 0:
            factor_box = factor_btn.first.bounding_box()
            if factor_box:
                # Click first icon above Factor
                for i in range(sidebar_icons.count()):
                    btn = sidebar_icons.nth(i)
                    box = btn.bounding_box()
                    if box and box["y"] < factor_box["y"] - 10:
                        editor_icon = btn
                        break

    if editor_icon:
        editor_icon.click()
        page.wait_for_timeout(500)

        page.screenshot(path="/tmp/lab-dock-width-2.png")

        dock_box_after = dock.first.bounding_box() if dock.count() > 0 else None
        editor_box_after = page.locator('#app-chrome-body').first.bounding_box() if page.locator('#app-chrome-body').count() > 0 else None

        # Also get the sidebar panel width
        helper_panel = page.locator('[data-testid="helper"]')
        helper_box = helper_panel.first.bounding_box() if helper_panel.count() > 0 else None

        if dock_box_after and editor_box_after:
            # With sidebar open, dock should still be within editor body
            dock_in_editor = dock_box_after["x"] >= editor_box_after["x"] - 2
            check("Dock left edge still within editor body (sidebar open)",
                  dock_in_editor,
                  f"dock.x={dock_box_after['x']:.0f}, editor.x={editor_box_after['x']:.0f}")

            # Dock should NOT extend into the sidebar area
            if helper_box and helper_box["width"] > 10:
                sidebar_right = helper_box["x"] + helper_box["width"]
                dock_not_in_sidebar = dock_box_after["x"] >= sidebar_right - 5
                check("Dock does not extend into sidebar area",
                      dock_not_in_sidebar,
                      f"dock.x={dock_box_after['x']:.0f}, sidebar_right={sidebar_right:.0f}")
            else:
                check("Dock does not extend into sidebar area", True, "Sidebar not wide enough to test")

            # Dock center should be within editor body center
            editor_center_after = editor_box_after["x"] + editor_box_after["width"] / 2
            dock_center_after = dock_box_after["x"] + dock_box_after["width"] / 2
            center_diff_after = abs(dock_center_after - editor_center_after)
            check("Dock centered in editor (sidebar open, within 50px)",
                  center_diff_after < 50,
                  f"dock_center={dock_center_after:.0f}, editor_center={editor_center_after:.0f}")
        else:
            check("Dock in editor (sidebar open)", False, "Missing bounding boxes")
            check("Dock not in sidebar", False, "Skipped")
            check("Dock centered (sidebar open)", False, "Skipped")
    else:
        check("Could open sidebar panel", False, "No editor icon found")
        check("Dock in sidebar area", False, "Skipped")
        check("Dock centered", False, "Skipped")

    # ================================================
    page.screenshot(path="/tmp/lab-dock-width-3.png")

    print(f"\n{'='*50}")
    print(f"Results: {PASS} passed, {FAIL} failed")
    if FAIL > 0:
        print("SOME TESTS FAILED")
        sys.exit(1)
    else:
        print("ALL TESTS PASSED")

    browser.close()
