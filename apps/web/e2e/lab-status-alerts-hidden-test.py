"""TDD: Verify connection status alerts are hidden in lab mode editor area.

In lab mode, all connection/status alerts should be consolidated to the
bottom dock. The editor area should only show code cells.
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

    page.screenshot(path="/tmp/lab-status-alerts-1.png")

    # ================================================
    print("\n=== TEST 1: NotebookBanner NOT visible in editor ===")

    # NotebookBanner renders banners like "Reconnected" with alert-circle icon
    banner_info = page.evaluate("""() => {
        // Look for banner elements with "Reconnected" or "kernel" text
        const banners = document.querySelectorAll('[data-testid="remove-banner-button"]');
        if (banners.length > 0) return { found: true, count: banners.length };
        // Also check for the banner container
        const alertIcons = document.querySelectorAll('.lucide-alert-circle');
        for (const icon of alertIcons) {
            const parent = icon.closest('.flex.flex-col.gap-4');
            if (parent) {
                const rect = parent.getBoundingClientRect();
                if (rect.height > 0) return { found: true, text: parent.textContent.substring(0, 50) };
            }
        }
        return { found: false };
    }""")
    check("No NotebookBanner visible in editor",
          not banner_info.get("found"),
          f"Banner found: {banner_info}")

    # ================================================
    print("\n=== TEST 2: StatusOverlay NOT visible ===")

    status_overlay = page.evaluate("""() => {
        // StatusOverlay renders disconnect/running/locked icons at top-left
        const overlayIcons = document.querySelectorAll('.lucide-unlink, .lucide-hourglass, .lucide-lock');
        for (const icon of overlayIcons) {
            const parent = icon.closest('[class*="z-50"][class*="top-4"]');
            if (parent) {
                const rect = parent.getBoundingClientRect();
                if (rect.height > 0) return { found: true };
            }
        }
        return { found: false };
    }""")
    check("No StatusOverlay icons visible",
          not status_overlay.get("found"),
          "StatusOverlay icons found in editor area")

    # ================================================
    print("\n=== TEST 3: Connection status IS shown in dock ===")

    dock_status = page.evaluate("""() => {
        const dock = document.querySelector('[data-slot="lab-status-dock"]');
        if (!dock) return { found: false };
        // Check for kernel/backend status indicator
        const kernelBtn = dock.querySelector('[data-testid="backend-status"]');
        const hasKernelText = dock.textContent.includes('Kernel');
        return {
            found: true,
            hasKernelIndicator: !!kernelBtn || hasKernelText,
        };
    }""")
    check("Dock has kernel status indicator",
          dock_status.get("found") and dock_status.get("hasKernelIndicator"),
          f"Dock status: {dock_status}")

    # ================================================
    print("\n=== TEST 4: No 'kernel not found' tooltip in editor area ===")

    # The "kernel not found" tooltip should not appear as an overlay
    kernel_tooltip = page.evaluate("""() => {
        // Look for any visible element with "kernel not found" text
        const all = document.querySelectorAll('div, span, p');
        for (const el of all) {
            if (el.textContent && el.textContent.toLowerCase().includes('kernel not found')) {
                const rect = el.getBoundingClientRect();
                if (rect.height > 0 && rect.width > 0) {
                    return { found: true, text: el.textContent.substring(0, 80) };
                }
            }
        }
        return { found: false };
    }""")
    check("No 'kernel not found' overlay in editor",
          not kernel_tooltip.get("found"),
          f"Found: {kernel_tooltip}")

    # ================================================
    page.screenshot(path="/tmp/lab-status-alerts-2.png")

    print(f"\n{'='*50}")
    print(f"Results: {PASS} passed, {FAIL} failed")
    if FAIL > 0:
        print("SOME TESTS FAILED")
        sys.exit(1)
    else:
        print("ALL TESTS PASSED")

    browser.close()
