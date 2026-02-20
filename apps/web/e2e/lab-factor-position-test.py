"""TDD: Verify Factor icon Y-position matches between normal sidebar and lab mode.

Factor should be at the SAME Y-coordinate on every page, and connecting
to lab mode must not shift it vertically. Editor icons above Factor should
have a divider line separating them from Factor.
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

    # ═══════════════════════════════════════
    print("\n=== PHASE A: Measure Factor Y on normal Factor page ===")

    page.goto("http://localhost:4200/factor/lab")
    page.wait_for_load_state("networkidle")

    # Find Factor icon in normal sidebar
    factor_normal = page.locator('button[aria-label="Factor"], button[title="Factor"]')
    factor_normal_y = None
    if factor_normal.count() > 0:
        box = factor_normal.first.bounding_box()
        if box:
            factor_normal_y = box["y"]
            print(f"    Factor Y on /factor/lab (normal): {factor_normal_y:.0f}")
    else:
        print("    Factor button not found in normal sidebar")

    # ═══════════════════════════════════════
    print("\n=== PHASE B: Measure Factor Y on another page ===")

    page.goto("http://localhost:4200/dashboard")
    page.wait_for_load_state("networkidle")

    factor_dashboard = page.locator('button[aria-label="Factor"], button[title="Factor"]')
    factor_dashboard_y = None
    if factor_dashboard.count() > 0:
        box = factor_dashboard.first.bounding_box()
        if box:
            factor_dashboard_y = box["y"]
            print(f"    Factor Y on /dashboard: {factor_dashboard_y:.0f}")
    else:
        print("    Factor button not found on dashboard")

    # ═══════════════════════════════════════
    print("\n=== PHASE C: Enter lab mode and measure Factor Y ===")

    page.goto("http://localhost:4200/factor/lab")
    page.wait_for_load_state("networkidle")

    connect_btn = page.locator("text=Connect")
    if connect_btn.count() > 0:
        connect_btn.first.click()
        page.wait_for_timeout(3000)
        page.wait_for_load_state("networkidle")

    factor_lab = page.locator('[data-testid="factor-anchor"]')
    factor_lab_y = None
    if factor_lab.count() > 0:
        box = factor_lab.bounding_box()
        if box:
            factor_lab_y = box["y"]
            print(f"    Factor Y in lab mode: {factor_lab_y:.0f}")
    else:
        print("    Factor anchor not found in lab mode")

    page.screenshot(path="/tmp/lab-factor-position.png")

    # ═══════════════════════════════════════
    print("\n=== TEST 1: Factor Y matches between normal and lab mode ===")

    if factor_normal_y is not None and factor_lab_y is not None:
        drift = abs(factor_lab_y - factor_normal_y)
        print(f"    Normal Y: {factor_normal_y:.0f}, Lab Y: {factor_lab_y:.0f}, Drift: {drift:.0f}px")
        check(f"Factor Y drift between normal and lab < 3px (drift={drift:.0f}px)",
              drift < 3,
              f"Factor moved {drift:.0f}px vertically when entering lab mode!")
    else:
        check("Both Factor positions measured",
              False,
              f"normal_y={'set' if factor_normal_y else 'missing'}, lab_y={'set' if factor_lab_y else 'missing'}")

    # ═══════════════════════════════════════
    print("\n=== TEST 2: Factor Y matches between dashboard and lab mode ===")

    if factor_dashboard_y is not None and factor_lab_y is not None:
        drift = abs(factor_lab_y - factor_dashboard_y)
        print(f"    Dashboard Y: {factor_dashboard_y:.0f}, Lab Y: {factor_lab_y:.0f}, Drift: {drift:.0f}px")
        check(f"Factor Y drift between dashboard and lab < 3px (drift={drift:.0f}px)",
              drift < 3,
              f"Factor at different position on dashboard vs lab mode!")
    else:
        check("Both positions measured", False, "Missing measurement")

    # ═══════════════════════════════════════
    print("\n=== TEST 3: Divider between editor icons and Factor ===")

    if factor_lab.count() > 0:
        # Look for a divider line between editor icons and Factor
        divider_info = page.evaluate("""() => {
            const factor = document.querySelector('[data-testid="factor-anchor"]');
            if (!factor) return { found: false };
            const factorRect = factor.getBoundingClientRect();

            // Look for a divider element above Factor but below editor icons
            // Check for <div> or <hr> with border/bg styling between editor icons and Factor
            const container = factor.closest('[data-slot="lab-sidebar"]');
            if (!container) return { found: false };

            const all = container.querySelectorAll('div, hr');
            for (const el of all) {
                const rect = el.getBoundingClientRect();
                const cs = window.getComputedStyle(el);
                // Divider: thin element (h < 5px) above Factor within ~60px
                if (rect.height > 0 && rect.height < 5
                    && rect.bottom < factorRect.top
                    && rect.bottom > factorRect.top - 60
                    && rect.width > 10) {
                    return {
                        found: true,
                        y: rect.y,
                        height: rect.height,
                        distToFactor: factorRect.top - rect.bottom,
                    };
                }
            }
            return { found: false };
        }""")

        check("Divider line between editor icons and Factor",
              divider_info and divider_info.get("found"),
              "No divider found between editor icons and Factor")

    # ═══════════════════════════════════════
    page.screenshot(path="/tmp/lab-factor-position-final.png")

    print(f"\n{'='*50}")
    print(f"Results: {PASS} passed, {FAIL} failed")
    if FAIL > 0:
        print("SOME TESTS FAILED")
        sys.exit(1)
    else:
        print("ALL TESTS PASSED")

    browser.close()
