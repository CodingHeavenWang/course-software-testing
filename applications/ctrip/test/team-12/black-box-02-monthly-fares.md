# 02. Monthly fares accepts a past departure date

## Method and requirement

Black-box boundary testing across two UI controls that set the same departure date. [REQ-2.3](https://github.com/code-philia/course-software-testing/blob/024c2bcef427351918168a0eb414cf907822b4ac/applications/ctrip/requirements/requirements.yaml) identifies July 18 as disabled because it precedes the July 19 business date. REQ-2.8 defines the results page's nearby and monthly fare navigation.

The [REQ-2.3 baseline](https://github.com/code-philia/course-software-testing/blob/024c2bcef427351918168a0eb414cf907822b4ac/applications/ctrip/test/baseline/REQ-2.3.spec.ts) checks the past-date boundary in the homepage calendar. The [REQ-2.8 baseline](https://github.com/code-philia/course-software-testing/blob/024c2bcef427351918168a0eb414cf907822b4ac/applications/ctrip/test/baseline/REQ-2.8.spec.ts) opens Monthly fares and checks July 22 and its fare. This case exercises the past-date boundary through Monthly fares.

## Reproduction

Use the signed-out homepage in a fresh browser session.

1. Search **Chengdu** to **Guangzhou** with **Departure date** set to **2026-07-21**.
2. On **Flight results**, open the **Departure date** picker and check that **2026-07-18** is disabled. Click **Close date picker**.
3. Click **More dates** in **Date bar**.
4. In **Monthly fares**, click **2026-07-18** and inspect the results criteria.

## Expected and observed

**Expected.** The past date should be unavailable in Monthly fares, or selecting it should leave the valid departure unchanged. Both controls set the departure for the same search.

**Observed.** July 18 is disabled in the date picker and enabled in Monthly fares. Clicking it closes the dialog, changes the departure to **2026-07-18** and displays **No flights found** for that date.

[Date picker control](assets/02-calendar-disabled.png) · [Monthly fare action](assets/02-monthly-enabled.png) · [Search updated to July 18](assets/02-past-date-applied.png)
