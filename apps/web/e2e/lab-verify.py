"""Verify lab mode: sidebar, topbar, dock, Factor stability, icon spacing, pill alignment."""
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

    # ═══════════════════════════════════════
    # Phase A: Measure normal mode topbar Lab pill position
    # ═══════════════════════════════════════
    page.goto("http://localhost:4200/factor/lab")
    page.wait_for_load_state("networkidle")
    page.on("dialog", lambda d: d.accept())

    print("\n=== PHASE A: Normal mode — record Lab pill position ===")

    # Find the Lab pill in normal topbar (it's a link or button with "Lab" text inside nav pills)
    normal_lab_pill = page.locator('a:has-text("Lab"), button:has-text("Lab")').first
    normal_lab_box = None
    if normal_lab_pill.count() > 0:
        normal_lab_box = normal_lab_pill.bounding_box()
        if normal_lab_box:
            print(f"    Normal mode Lab pill: x={normal_lab_box['x']:.0f} y={normal_lab_box['y']:.0f}")
        else:
            print("    Normal mode Lab pill: no bounding box")
    else:
        print("    Normal mode Lab pill: not found")

    page.screenshot(path="/tmp/lab-verify-0-normal.png")

    # ═══════════════════════════════════════
    # Phase B: Enter lab mode
    # ═══════════════════════════════════════
    print("\n=== PHASE B: Enter lab mode ===")

    connect_btn = page.locator("text=Connect")
    if connect_btn.count() > 0:
        connect_btn.first.click()
        page.wait_for_timeout(3000)
        page.wait_for_load_state("networkidle")

    page.screenshot(path="/tmp/lab-verify-1-collapsed.png")

    # ═══════════════════════════════════════
    print("\n=== TEST 1: Lab pill X-position matches normal mode ===")

    lab_pill = page.locator('[data-testid="lab-pill-anchor"]')
    if lab_pill.count() > 0 and normal_lab_box:
        lab_box = lab_pill.bounding_box()
        if lab_box:
            x_drift = abs(lab_box["x"] - normal_lab_box["x"])
            print(f"    Normal Lab pill x: {normal_lab_box['x']:.0f}")
            print(f"    Lab mode pill x:   {lab_box['x']:.0f}")
            print(f"    X drift:           {x_drift:.0f}px")
            check(f"Lab pill X-position drift < 5px (drift={x_drift:.0f}px)", x_drift < 5,
                  f"Lab pill shifted {x_drift:.0f}px horizontally!")
        else:
            check("Lab pill has bounding box", False, "No bounding box")
    else:
        check("Lab pill X-position test (both pills found)", False,
              f"lab_pill={lab_pill.count()}, normal_box={'yes' if normal_lab_box else 'no'}")

    # ═══════════════════════════════════════
    print("\n=== TEST 2: Factor anchor position and stability ===")

    factor = page.locator('[data-testid="factor-anchor"]')
    check("Factor anchor exists", factor.count() > 0)

    if factor.count() > 0:
        factor_box_before = factor.bounding_box()
        factor_y_before = factor_box_before["y"]
        print(f"    Factor Y before hover: {factor_y_before:.0f}")

        sidebar = page.locator('[data-slot="lab-sidebar"]')
        if sidebar.count() > 0:
            sb = sidebar.bounding_box()
            page.mouse.move(sb["x"] + sb["width"] / 2, sb["y"] + sb["height"] / 2)
            page.wait_for_timeout(500)

            page.screenshot(path="/tmp/lab-verify-2-sidebar-hover.png")

            factor_box_during = factor.bounding_box()
            factor_y_during = factor_box_during["y"]
            shift = abs(factor_y_during - factor_y_before)
            print(f"    Factor Y during hover: {factor_y_during:.0f} (shift={shift:.0f}px)")
            check(f"Factor does NOT move on hover (shift={shift:.0f}px)", shift < 2,
                  f"Factor shifted by {shift:.0f}px!")

            page.mouse.move(700, 500)
            page.wait_for_timeout(500)

            factor_box_after = factor.bounding_box()
            factor_y_after = factor_box_after["y"]
            shift_back = abs(factor_y_after - factor_y_before)
            check(f"Factor returns to original position (shift={shift_back:.0f}px)", shift_back < 2)

    # ═══════════════════════════════════════
    print("\n=== TEST 3: Editor icons — no overlap ===")

    if factor.count() > 0:
        factor_box = factor.bounding_box()
        all_buttons = page.locator("button").all()
        editor_icons = []
        for btn in all_buttons:
            box = btn.bounding_box()
            if box and box["x"] < 80 and box["y"] < factor_box["y"] - 2 and box["width"] > 20:
                label = btn.get_attribute("aria-label") or btn.get_attribute("title") or ""
                editor_icons.append({"label": label, "y": box["y"], "h": box["height"]})

        editor_icons.sort(key=lambda b: b["y"])
        print(f"    Editor icons found: {len(editor_icons)}")
        for ic in editor_icons:
            print(f"      y={ic['y']:.0f} h={ic['h']:.0f} | {ic['label']}")

        overlap_count = 0
        for i in range(len(editor_icons) - 1):
            a = editor_icons[i]
            b = editor_icons[i + 1]
            gap = b["y"] - (a["y"] + a["h"])
            if gap < 0:
                overlap_count += 1
                print(f"    OVERLAP: '{a['label']}' vs '{b['label']}' = {gap:.0f}px")
        check(f"No overlapping editor icons ({overlap_count} overlaps)", overlap_count == 0)

        if editor_icons:
            last = editor_icons[-1]
            gap_to_factor = factor_box["y"] - (last["y"] + last["h"])
            check(f"Last editor icon above Factor (gap={gap_to_factor:.0f}px)", gap_to_factor >= 0,
                  f"Overlap by {-gap_to_factor:.0f}px")
            first = editor_icons[0]
            check(f"First editor icon visible (y={first['y']:.0f})", first["y"] >= 0,
                  f"Clipped at y={first['y']:.0f}")

    # ═══════════════════════════════════════
    print("\n=== TEST 4: Nav items converge near Factor when collapsed ===")

    if factor.count() > 0:
        factor_box = factor.bounding_box()
        nav_labels = ["Dashboard", "Market", "Research", "Analysis", "Screener",
                      "Portfolio", "Trading", "Journal", "Risk", "Settings"]
        converged = 0
        for btn in all_buttons:
            box = btn.bounding_box()
            label = btn.get_attribute("aria-label") or ""
            if box and box["x"] < 80 and label in nav_labels:
                dist = abs(box["y"] + box["height"]/2 - (factor_box["y"] + factor_box["height"]/2))
                if dist < 25:
                    converged += 1
        check(f"Collapsed nav items converge near Factor ({converged}/10)", converged >= 5)

    # ═══════════════════════════════════════
    print("\n=== TEST 5: Bottom dock ===")

    dock_info = page.evaluate("""() => {
        const all = document.querySelectorAll('div');
        for (const el of all) {
            const cs = window.getComputedStyle(el);
            const rect = el.getBoundingClientRect();
            if (cs.position === 'absolute' && cs.pointerEvents === 'none'
                && rect.bottom > 850 && rect.bottom < 910 && rect.height < 60
                && rect.height > 20) {
                const inner = el.querySelector('div');
                const innerCs = inner ? window.getComputedStyle(inner) : null;
                return {
                    found: true,
                    outerPE: cs.pointerEvents,
                    innerPE: innerCs ? innerCs.pointerEvents : 'n/a',
                    zIndex: cs.zIndex,
                    width: inner ? inner.getBoundingClientRect().width : 0,
                };
            }
        }
        return { found: false };
    }""")

    if dock_info and dock_info.get("found"):
        check("Floating dock found", True)
        check("Outer pointer-events: none", dock_info["outerPE"] == "none")
        check("Inner pointer-events: auto", dock_info["innerPE"] == "auto")
        check(f"Dock centered (w={dock_info['width']:.0f})", dock_info["width"] < 1400)
    else:
        check("Floating dock found", False, "Not found")

    # ═══════════════════════════════════════
    print("\n=== TEST 6: Topbar buttons accessible ===")

    # Hit-test non-destructive buttons
    for label in ["Notebook menu", "Editor settings", "Notifications"]:
        btn = page.locator(f'button[aria-label="{label}"]')
        if btn.count() > 0:
            box = btn.bounding_box()
            if box and box["width"] > 0:
                cx, cy = box["x"] + box["width"]/2, box["y"] + box["height"]/2
                hit = page.evaluate(f"""() => {{
                    const el = document.elementFromPoint({cx}, {cy});
                    if (!el) return 'nothing';
                    const btn = el.closest('button');
                    return btn ? btn.getAttribute('aria-label') || 'unlabeled' : el.tagName;
                }}""")
                check(f'"{label}" hit-test passes (hit={hit})', label in str(hit))
            else:
                check(f'"{label}" visible', False, f"box={box}")
        else:
            check(f'"{label}" exists', False, "Not found")

    # Blueprint button — hit-test only (clicking toggles doc mode)
    bp_btn = page.locator('button[aria-label="Open Blueprint"]')
    if bp_btn.count() > 0:
        box = bp_btn.bounding_box()
        if box and box["width"] > 0:
            cx, cy = box["x"] + box["width"]/2, box["y"] + box["height"]/2
            hit = page.evaluate(f"""() => {{
                const el = document.elementFromPoint({cx}, {cy});
                if (!el) return 'nothing';
                const btn = el.closest('button');
                return btn ? btn.getAttribute('aria-label') || 'unlabeled' : el.tagName;
            }}""")
            check(f'"Open Blueprint" hit-test passes (hit={hit})', "Blueprint" in str(hit))

    check("Disconnect button visible",
          page.locator('button[aria-label="Disconnect"]').bounding_box() is not None)

    # ═══════════════════════════════════════
    print("\n=== TEST 7: Hover zone isolation ===")

    lab_pill = page.locator('[data-testid="lab-pill-anchor"]')
    if lab_pill.count() > 0:
        lab_box = lab_pill.bounding_box()
        page.mouse.move(lab_box["x"] + lab_box["width"]/2, lab_box["y"] + lab_box["height"]/2)
        page.wait_for_timeout(500)

        # When hovering nav pills, editor controls should still exist
        # (they fade out but remain in DOM)
        menu_btn = page.locator('button[aria-label="Notebook menu"]')
        check("Editor controls in DOM during nav hover", menu_btn.count() > 0)

        page.mouse.move(700, 500)
        page.wait_for_timeout(500)

    # ═══════════════════════════════════════
    print("\n=== TEST 8: Topbar editor controls within nav bounds ===")

    lab_nav = page.locator('[data-slot="lab-nav"]')
    if lab_nav.count() > 0:
        nav_box = lab_nav.bounding_box()
        # The editor controls should be within the parent container
        # (the nav's parent <div class="relative">)
        parent_box = page.locator('[data-slot="lab-nav"]').locator("..").bounding_box()
        if parent_box:
            menu_btn = page.locator('button[aria-label="Notebook menu"]')
            if menu_btn.count() > 0:
                mb = menu_btn.bounding_box()
                if mb:
                    # Editor controls should not extend far beyond nav container
                    overshoot = mb["x"] + mb["width"] - (parent_box["x"] + parent_box["width"])
                    print(f"    Nav container right edge: {parent_box['x'] + parent_box['width']:.0f}")
                    print(f"    Menu button right edge:   {mb['x'] + mb['width']:.0f}")
                    print(f"    Overshoot:                {overshoot:.0f}px")
                    check(f"Editor controls within nav bounds (overshoot={overshoot:.0f}px)",
                          overshoot < 20, f"Controls extend {overshoot:.0f}px beyond nav")

    # ═══════════════════════════════════════
    page.screenshot(path="/tmp/lab-verify-3-final.png")

    print(f"\n{'='*50}")
    print(f"Results: {PASS} passed, {FAIL} failed")
    if FAIL > 0:
        print("SOME TESTS FAILED")
        sys.exit(1)
    else:
        print("ALL TESTS PASSED")

    browser.close()
