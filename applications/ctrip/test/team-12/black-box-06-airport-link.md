# 06. The Chongqing directory link opens Beijing

## Method and requirement

Black-box navigation testing using the identity of the selected destination as the oracle. [REQ-9.2](https://github.com/code-philia/course-software-testing/blob/024c2bcef427351918168a0eb414cf907822b4ac/applications/ctrip/requirements/requirements.yaml) specifies a **Chongqing** link in the domestic C group. REQ-9.3 defines opening the identified airport's overview. Follow the named city link and compare the selected city with the resulting overview.

The [REQ-9.2 baseline](https://github.com/code-philia/course-software-testing/blob/024c2bcef427351918168a0eb414cf907822b4ac/applications/ctrip/test/baseline/REQ-9.2.spec.ts) checks that the Chongqing link is visible. The [REQ-9.3 baseline](https://github.com/code-philia/course-software-testing/blob/024c2bcef427351918168a0eb414cf907822b4ac/applications/ctrip/test/baseline/REQ-9.3.spec.ts) follows Beijing Capital Airport and checks its details. This case follows a domestic index link and checks that the destination matches the chosen city.

## Reproduction

Use the signed-out homepage in a fresh browser session.

1. Open **More services → Domestic airport directory**.
2. In **Domestic airports**, select **C** and click **Chongqing**.
3. Read the destination page heading and the **Location** in **Airport overview**.

## Expected and observed

**Expected.** The overview reached through the Chongqing link should describe an airport in Chongqing. The check depends only on the selected city and its destination identity.

**Observed.** The page opens **Beijing Capital Airport**, with **Beijing** as the location.

[Chongqing link in the C directory](assets/06-chongqing-directory.png) · [Beijing airport page reached from the link](assets/06-beijing-detail.png)
