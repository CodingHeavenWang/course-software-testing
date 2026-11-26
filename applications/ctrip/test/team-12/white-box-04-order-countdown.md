# 04. Switching order tabs increases the countdown

## Method and requirement

White-box lifecycle testing. [`renderOrders` in `frontend/pages-account.js`](https://github.com/code-philia/course-software-testing/blob/024c2bcef427351918168a0eb414cf907822b4ac/applications/ctrip/frontend/pages-account.js#L759) loads the order list once. Each tab click invokes [`renderList`](https://github.com/code-philia/course-software-testing/blob/024c2bcef427351918168a0eb414cf907822b4ac/applications/ctrip/frontend/pages-account.js#L798), which recalculates the start time from `Date.now()` while reusing the original `remaining_seconds`. Use a tab that keeps the same pending order visible so the before and after readings refer to one order.

[REQ-4 and REQ-4.2](https://github.com/code-philia/course-software-testing/blob/024c2bcef427351918168a0eb414cf907822b4ac/applications/ctrip/requirements/requirements.yaml) describe pending-order countdowns based on elapsed time and tab filtering by lifecycle state. The [REQ-4.2 baseline](https://github.com/code-philia/course-software-testing/blob/024c2bcef427351918168a0eb414cf907822b4ac/applications/ctrip/test/baseline/REQ-4.2.spec.ts) checks which records are visible after filtering. The [REQ-4.4 baseline](https://github.com/code-philia/course-software-testing/blob/024c2bcef427351918168a0eb414cf907822b4ac/applications/ctrip/test/baseline/REQ-4.4.spec.ts) checks that the timer decreases on an uninterrupted detail page. This case checks countdown continuity across a list rerender.

## Reproduction

Use an unexpired **CTRIP20260721001** from the fresh test data. Sign in as `ctrip_order_read@example.com` with the local fixture password in [`fixtures/data.ts`](https://github.com/code-philia/course-software-testing/blob/024c2bcef427351918168a0eb414cf907822b4ac/applications/ctrip/test/baseline/fixtures/data.ts).

1. Open **My account → Orders** and leave **All orders** selected.
2. Locate **CTRIP20260721001** and write down **Time remaining**.
3. Wait at least six seconds and record the lower reading for the same order.
4. Click **Pending payment**. Immediately compare the timer for that same order with the second reading.

## Expected and observed

**Expected.** Filtering should preserve the countdown for the same order. The reading immediately after the switch should be equal to or lower than the reading just before it.

**Observed.** In the captured run, the display counted down from **23:58:36** to **23:58:30**, then jumped back to **23:58:36** after the tab changed. The starting reading varies with the age of the test database.

[Timer before filtering](assets/04-countdown-before.png) · [Timer after filtering](assets/04-countdown-after.png)
