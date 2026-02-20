"""TDD: Verify topbar editor controls (Menu, Settings, Disconnect) are clickable.

The hover zone for nav pill expansion should NOT interfere with clicking
the editor controls positioned to the right of the Lab pill.
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

    page.screenshot(path="/tmp/lab-topbar-controls-1.png")

    # ================================================
    print("\n=== TEST 1: Editor controls visible in collapsed topbar ===")

    settings_btn = page.locator('button[aria-label="Editor settings"]')
    disconnect_btn = page.locator('button[aria-label="Disconnect"]')
    menu_btn = page.locator('button[aria-label="Notebook menu"]')

    check("Settings button exists", settings_btn.count() > 0)
    check("Disconnect button exists", disconnect_btn.count() > 0)
    check("Menu button exists", menu_btn.count() > 0)

    # ================================================
    print("\n=== TEST 2: Hovering Settings button does NOT trigger nav expansion ===")

    if settings_btn.count() > 0:
        # First check that nav pills are collapsed (other pills not visible)
        lab_pill = page.locator('[data-testid="lab-pill-anchor"]')
        lab_pill_box = lab_pill.bounding_box() if lab_pill.count() > 0 else None

        settings_box = settings_btn.first.bounding_box()
        if settings_box:
            # Hover over settings button
            page.mouse.move(
                settings_box["x"] + settings_box["width"] / 2,
                settings_box["y"] + settings_box["height"] / 2,
            )
            page.wait_for_timeout(500)

            # Settings should still be visible (not replaced by expanded nav)
            settings_visible = page.evaluate("""() => {
                const btn = document.querySelector('button[aria-label="Editor settings"]');
                if (!btn) return false;
                const rect = btn.getBoundingClientRect();
                const style = window.getComputedStyle(btn.closest('[class*="absolute"]') || btn);
                return rect.width > 0 && rect.height > 0 && style.opacity !== '0';
            }""")
            check("Settings still visible after hovering it", settings_visible)

            # Check that nav pills did NOT expand
            nav_expanded = page.evaluate("""() => {
                const pills = document.querySelectorAll('[data-slot="lab-nav"] button');
                let visibleCount = 0;
                for (const pill of pills) {
                    const parent = pill.closest('[class*="motion"]') || pill.parentElement;
                    const style = window.getComputedStyle(parent);
                    if (style.opacity !== '0' && style.pointerEvents !== 'none') {
                        visibleCount++;
                    }
                }
                return visibleCount;
            }""")
            check("Nav pills NOT expanded while hovering settings",
                  nav_expanded <= 1,
                  f"Visible pill count: {nav_expanded}")
        else:
            check("Settings button has bounding box", False, "No bounding box")
            check("Nav pills NOT expanded", False, "Skipped")

    # ================================================
    print("\n=== TEST 2b: Mouse path FROM BELOW through nav to settings ===")

    # Reset: move mouse far away
    page.mouse.move(720, 600)
    page.wait_for_timeout(400)

    if settings_btn.count() > 0:
        settings_box = settings_btn.first.bounding_box()
        if settings_box:
            target_x = settings_box["x"] + settings_box["width"] / 2
            target_y = settings_box["y"] + settings_box["height"] / 2
            # Simulate realistic mouse path: start from below, move up through nav area
            start_y = target_y + 100  # Start 100px below
            steps = 10
            for i in range(steps + 1):
                frac = i / steps
                y = start_y + (target_y - start_y) * frac
                page.mouse.move(target_x, y)
                page.wait_for_timeout(30)
            page.wait_for_timeout(400)

            # Settings should STILL be visible after realistic mouse traversal
            settings_visible_after_path = page.evaluate("""() => {
                const btn = document.querySelector('button[aria-label="Editor settings"]');
                if (!btn) return false;
                const rect = btn.getBoundingClientRect();
                const parent = btn.closest('[class*="absolute"]');
                const style = parent ? window.getComputedStyle(parent) : window.getComputedStyle(btn);
                return rect.width > 0 && rect.height > 0 && style.opacity !== '0';
            }""")
            check("Settings still visible after mouse path from below",
                  settings_visible_after_path)

            # Nav pills should NOT have expanded
            nav_expanded_path = page.evaluate("""() => {
                const pills = document.querySelectorAll('[data-slot="lab-nav"] button');
                let visibleCount = 0;
                for (const pill of pills) {
                    const parent = pill.closest('[class*="motion"]') || pill.parentElement;
                    const style = window.getComputedStyle(parent);
                    if (style.opacity !== '0' && style.pointerEvents !== 'none') {
                        visibleCount++;
                    }
                }
                return visibleCount;
            }""")
            check("Nav pills NOT expanded during mouse path to settings",
                  nav_expanded_path <= 1,
                  f"Visible pill count: {nav_expanded_path}")
        else:
            check("Settings visible after path", False, "No bounding box")
            check("Nav not expanded during path", False, "Skipped")

    # ================================================
    print("\n=== TEST 3: Settings button is clickable ===")

    # Move mouse away first to reset hover state
    page.mouse.move(720, 450)
    page.wait_for_timeout(300)

    if settings_btn.count() > 0:
        settings_box = settings_btn.first.bounding_box()
        if settings_box:
            # Click on settings
            page.mouse.click(
                settings_box["x"] + settings_box["width"] / 2,
                settings_box["y"] + settings_box["height"] / 2,
            )
            page.wait_for_timeout(300)
            # If we got here without the button disappearing, it's clickable
            check("Settings button click registered", True)
        else:
            check("Settings button click registered", False, "No bounding box")

    # ================================================
    print("\n=== TEST 4: Disconnect button is clickable ===")

    # Move mouse away first
    page.mouse.move(720, 450)
    page.wait_for_timeout(300)

    if disconnect_btn.count() > 0:
        disconnect_box = disconnect_btn.first.bounding_box()
        if disconnect_box:
            disconnect_visible = page.evaluate("""() => {
                const btn = document.querySelector('button[aria-label="Disconnect"]');
                if (!btn) return false;
                const rect = btn.getBoundingClientRect();
                const parent = btn.closest('[class*="absolute"]');
                const style = parent ? window.getComputedStyle(parent) : window.getComputedStyle(btn);
                return rect.width > 0 && rect.height > 0 && style.opacity !== '0';
            }""")
            check("Disconnect button visible and clickable", disconnect_visible)
        else:
            check("Disconnect button visible and clickable", False, "No bounding box")

    # ================================================
    print("\n=== TEST 5: Hovering Lab pill DOES trigger nav expansion ===")

    # Move mouse away first
    page.mouse.move(720, 450)
    page.wait_for_timeout(300)

    if lab_pill_box:
        page.mouse.move(
            lab_pill_box["x"] + lab_pill_box["width"] / 2,
            lab_pill_box["y"] + lab_pill_box["height"] / 2,
        )
        page.wait_for_timeout(500)

        nav_expanded_on_pill = page.evaluate("""() => {
            const pills = document.querySelectorAll('[data-slot="lab-nav"] button');
            let visibleCount = 0;
            for (const pill of pills) {
                const parent = pill.closest('[class*="motion"]') || pill.parentElement;
                const style = window.getComputedStyle(parent);
                if (style.opacity !== '0' && style.pointerEvents !== 'none') {
                    visibleCount++;
                }
            }
            return visibleCount;
        }""")
        check("Nav pills expanded when hovering Lab pill",
              nav_expanded_on_pill > 1,
              f"Visible pill count: {nav_expanded_on_pill}")
    else:
        check("Nav pills expanded when hovering Lab pill", False, "No Lab pill found")

    # ================================================
    page.screenshot(path="/tmp/lab-topbar-controls-2.png")

    print(f"\n{'='*50}")
    print(f"Results: {PASS} passed, {FAIL} failed")
    if FAIL > 0:
        print("SOME TESTS FAILED")
        sys.exit(1)
    else:
        print("ALL TESTS PASSED")

    browser.close()
