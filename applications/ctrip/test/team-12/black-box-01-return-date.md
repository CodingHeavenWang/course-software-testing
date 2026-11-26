# 01. Changing departure leaves an earlier return selected

## Method and requirement

Black-box boundary testing. Start with a valid round trip, then move departure one day past the chosen return. [REQ-2.1 and REQ-2.3](https://github.com/code-philia/course-software-testing/blob/024c2bcef427351918168a0eb414cf907822b4ac/applications/ctrip/requirements/requirements.yaml) define round-trip dates and exclude a return before departure.

The [REQ-2.3 baseline](https://github.com/code-philia/course-software-testing/blob/024c2bcef427351918168a0eb414cf907822b4ac/applications/ctrip/test/baseline/REQ-2.3.spec.ts) checks a four-day trip and a disabled earlier return in the picker. This case changes the departure **after** a valid return has been selected.

## Reproduction

Use the signed-out homepage in a fresh browser session.

1. Open **Departure date** and choose **2026-07-21**.
2. Click **Add return** and choose **2026-07-25**. Check that **Round trip** is selected and the duration reads **4 days**.
3. Reopen **Departure date** and choose **2026-07-26**.
4. Read **Return date** and the trip duration.

## Expected and observed

**Expected.** The new date pair should obey the same ordering rule enforced by the return picker. If July 26 becomes the departure, the form should clear or correct the earlier return, or report that the date pair is invalid.

**Observed.** The form keeps July 25 as the selected return and displays **-1 days** without a date error.

[Screenshot after changing departure](assets/01-return-date.png)
