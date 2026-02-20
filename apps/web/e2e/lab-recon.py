"""Reconnaissance: inspect lab mode page DOM and element positions."""
from playwright.sync_api import sync_playwright
import json

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1440, "height": 900})

    # Navigate and wait for initial load
    page.goto("http://localhost:4200/factor/lab")
    page.wait_for_load_state("networkidle")
    page.screenshot(path="/tmp/lab-recon-1-initial.png", full_page=True)
    print("=== Screenshot 1: Initial state ===")

    # Handle beforeunload dialog
    page.on("dialog", lambda d: d.accept())

    # Click Connect button to enter lab mode
    connect_btn = page.locator("text=Connect")
    if connect_btn.count() > 0:
        connect_btn.first.click()
        page.wait_for_timeout(3000)  # Wait for animation + editor load
        page.wait_for_load_state("networkidle")

    page.screenshot(path="/tmp/lab-recon-2-labmode.png", full_page=True)
    print("=== Screenshot 2: Lab mode ===")

    # ── Sidebar analysis ──
    print("\n=== SIDEBAR ANALYSIS ===")

    # Find Factor anchor
    factor = page.locator('[data-testid="factor-anchor"]')
    if factor.count() > 0:
        box = factor.bounding_box()
        print(f"Factor anchor: x={box['x']:.0f} y={box['y']:.0f} w={box['width']:.0f} h={box['height']:.0f}")
    else:
        print("Factor anchor: NOT FOUND")

    # Find lab-sidebar container
    sidebar = page.locator('[data-slot="lab-sidebar"]')
    if sidebar.count() > 0:
        box = sidebar.bounding_box()
        print(f"Lab sidebar container: x={box['x']:.0f} y={box['y']:.0f} w={box['width']:.0f} h={box['height']:.0f}")

    # Find all buttons in sidebar area (x < 80)
    all_buttons = page.locator("button").all()
    sidebar_buttons = []
    for btn in all_buttons:
        box = btn.bounding_box()
        if box and box["x"] < 80:
            label = btn.get_attribute("aria-label") or btn.get_attribute("title") or btn.inner_text()[:20]
            sidebar_buttons.append({
                "label": label,
                "x": round(box["x"]),
                "y": round(box["y"]),
                "w": round(box["width"]),
                "h": round(box["height"]),
            })
    sidebar_buttons.sort(key=lambda b: b["y"])
    print(f"\nSidebar buttons ({len(sidebar_buttons)}):")
    for b in sidebar_buttons:
        print(f"  y={b['y']:4d} h={b['h']:2d} | {b['label']}")

    # Check for overlaps
    print("\n=== OVERLAP CHECK ===")
    for i in range(len(sidebar_buttons) - 1):
        a = sidebar_buttons[i]
        b = sidebar_buttons[i + 1]
        gap = b["y"] - (a["y"] + a["h"])
        if gap < 0:
            print(f"  OVERLAP: '{a['label']}' (y={a['y']}) overlaps '{b['label']}' (y={b['y']}) by {-gap}px")
        else:
            print(f"  OK: '{a['label']}' → '{b['label']}' gap={gap}px")

    # ── Topbar analysis ──
    print("\n=== TOPBAR ANALYSIS ===")

    topbar = page.locator('[data-slot="lab-topbar-zone"]')
    if topbar.count() > 0:
        box = topbar.bounding_box()
        print(f"Topbar zone: x={box['x']:.0f} y={box['y']:.0f} w={box['width']:.0f} h={box['height']:.0f}")

    lab_pill = page.locator('[data-testid="lab-pill-anchor"]')
    if lab_pill.count() > 0:
        box = lab_pill.bounding_box()
        print(f"Lab pill anchor: x={box['x']:.0f} y={box['y']:.0f} w={box['width']:.0f} h={box['height']:.0f}")

    # Find topbar buttons (y < 60)
    topbar_buttons = []
    for btn in all_buttons:
        box = btn.bounding_box()
        if box and box["y"] < 60 and box["x"] > 80:
            label = btn.get_attribute("aria-label") or btn.inner_text()[:20]
            visible = btn.is_visible()
            topbar_buttons.append({
                "label": label,
                "x": round(box["x"]),
                "y": round(box["y"]),
                "visible": visible,
            })
    topbar_buttons.sort(key=lambda b: b["x"])
    print(f"\nTopbar buttons ({len(topbar_buttons)}):")
    for b in topbar_buttons:
        vis = "visible" if b["visible"] else "HIDDEN"
        print(f"  x={b['x']:4d} | {vis:7s} | {b['label']}")

    # ── Clickability test ──
    print("\n=== CLICKABILITY TEST ===")

    # Test: can we click Notifications button?
    bell = page.locator('button[aria-label="Notifications"]')
    if bell.count() > 0:
        try:
            bell.click(timeout=2000)
            print("Bell button: CLICKABLE")
        except Exception as e:
            print(f"Bell button: BLOCKED - {e}")

    # Test: can we click Settings button?
    settings = page.locator('button[aria-label="Settings"]')
    if settings.count() > 0:
        try:
            # Move mouse away first to reset hover
            page.mouse.move(700, 400)
            page.wait_for_timeout(500)
            settings.click(timeout=2000)
            print("Settings button: CLICKABLE")
        except Exception as e:
            print(f"Settings button: BLOCKED - {e}")

    # Test: can we click Disconnect button?
    disconnect = page.locator('button[aria-label="Disconnect"]')
    if disconnect.count() > 0:
        try:
            page.mouse.move(700, 400)
            page.wait_for_timeout(500)
            disconnect.click(timeout=2000)
            print("Disconnect button: CLICKABLE")
        except Exception as e:
            print(f"Disconnect button: BLOCKED - {e}")

    # ── Bottom dock analysis ──
    print("\n=== BOTTOM DOCK ANALYSIS ===")
    dock = page.locator(".absolute.bottom-3")
    if dock.count() > 0:
        box = dock.bounding_box()
        print(f"Floating dock: x={box['x']:.0f} y={box['y']:.0f} w={box['width']:.0f} h={box['height']:.0f}")
        # Check what it covers
        print(f"  Covers y range: {box['y']:.0f} to {box['y'] + box['height']:.0f}")

    # Check for elements behind the dock
    footer_z = page.evaluate("""() => {
        const dock = document.querySelector('.absolute.bottom-3');
        if (!dock) return null;
        return window.getComputedStyle(dock).zIndex;
    }""")
    print(f"  z-index: {footer_z}")

    page.screenshot(path="/tmp/lab-recon-3-final.png", full_page=True)
    print("\n=== Done. Screenshots saved to /tmp/lab-recon-*.png ===")
    browser.close()
