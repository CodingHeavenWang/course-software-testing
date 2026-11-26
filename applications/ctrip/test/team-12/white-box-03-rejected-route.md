# 03. Filtering uses a route that Update results rejected

## Method and requirement

White-box state testing. In [`frontend/pages-flights.js`](https://github.com/code-philia/course-software-testing/blob/024c2bcef427351918168a0eb414cf907822b4ac/applications/ctrip/frontend/pages-flights.js#L45), `refreshCriteria` copies the draft input values into `view` before `navigateWith` can return from its same-city rejection branch. The [`visibleFlights` path](https://github.com/code-philia/course-software-testing/blob/024c2bcef427351918168a0eb414cf907822b4ac/applications/ctrip/frontend/pages-flights.js#L186) later reads `view` when a filter redraws the list. Choose a rejected update followed by a filter action to exercise both paths.

[REQ-2.4, REQ-2.9 and REQ-2.13](https://github.com/code-philia/course-software-testing/blob/024c2bcef427351918168a0eb414cf907822b4ac/applications/ctrip/requirements/requirements.yaml) require identical cities to be rejected, the nonstop filter to exclude stopovers, and an accepted criteria update to query the new route. The [REQ-2.4 baseline](https://github.com/code-philia/course-software-testing/blob/024c2bcef427351918168a0eb414cf907822b4ac/applications/ctrip/test/baseline/REQ-2.4.spec.ts) rejects identical cities on the homepage. The [REQ-2.13 baseline](https://github.com/code-philia/course-software-testing/blob/024c2bcef427351918168a0eb414cf907822b4ac/applications/ctrip/test/baseline/REQ-2.13.spec.ts) accepts a different route with no inventory. The [REQ-2.9 baseline](https://github.com/code-philia/course-software-testing/blob/024c2bcef427351918168a0eb414cf907822b4ac/applications/ctrip/test/baseline/REQ-2.9.spec.ts) filters valid results. This case filters after a rejected update on the results page.

## Reproduction

Use the signed-out homepage in a fresh browser session.

1. Search **Chengdu** to **Guangzhou** for **2026-07-21**. Confirm that CZ3401, JD5162 and MU5234 appear.
2. As a control, select **Nonstop only**. Confirm that CZ3401 and MU5234 remain. Clear the filter to restore all three flights.
3. In results criteria, replace **Destination** with **Chengdu** and click **Update results**. Confirm that the same-city alert appears and the three original flights are still visible.
4. Select **Nonstop only** without editing the route again.

## Expected and observed

**Expected.** The rejected draft should not become the active query. The filter should still show CZ3401 and MU5234 from Chengdu–Guangzhou.

**Observed.** After showing the validation error and the original three flights, toggling the filter produces **No flights found**. The heading still says **Chengdu to Guangzhou**.

[Rejected update with original flights](assets/03-rejected-route-before-filter.png) · [List after selecting Nonstop only](assets/03-rejected-route-after-filter.png)
