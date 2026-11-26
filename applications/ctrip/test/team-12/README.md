# Ctrip fault-revealing tests — Team 12

**Members:** YuLezhi (team lead, GitHub: yulezhi), WangZiyin

| Test | Method | Requirements |
| --- | --- | --- |
| [01. Changing departure leaves an earlier return selected](black-box-01-return-date.md) | Black-box | REQ-2.1, REQ-2.3 |
| [02. Monthly fares accepts a past departure date](black-box-02-monthly-fares.md) | Black-box | REQ-2.3, REQ-2.8 |
| [03. Filtering uses a route that Update results rejected](white-box-03-rejected-route.md) | White-box | REQ-2.4, REQ-2.9, REQ-2.13 |
| [04. Switching order tabs increases the countdown](white-box-04-order-countdown.md) | White-box | REQ-4, REQ-4.2 |
| [05. A newly paid flight is missing from Pending vouchers](white-box-05-paid-voucher.md) | White-box | REQ-3.9, REQ-8.3 |
| [06. The Chongqing directory link opens Beijing](black-box-06-airport-link.md) | Black-box | REQ-9.2, REQ-9.3 |

## Reproduction environment

Tested twice on the course implementation at commit `024c2bcef427351918168a0eb414cf907822b4ac` using Python 3.12.4, SQLite and Microsoft Edge. From `applications/ctrip`, run `.\start.bat` on Windows or `sh start.sh` on macOS or Linux. Use the local URL printed by the launcher. The app supplies the July 19, 2026 business date in Asia/Shanghai. Use a fresh browser session for each case and a fresh local checkout if an earlier run modified the seeded orders. Restarting the launcher retains its database.

Each case includes browser steps and evidence. The [verification log](assets/verification.txt) records two rounds of browser observations and the Playwright assertion results. Seed accounts and passenger inputs referenced in the cases are fixtures for the local course app. All checkout payments are simulated.

## Run the Playwright tests

Start the local course app as described above. In a second terminal, enter `applications/ctrip/test/team-12`. With Node.js 18 or later, install the pinned runner and Chromium:

```sh
npm install --prefix . --no-save --no-package-lock @playwright/test@1.57.0
npx playwright install chromium
```

The [test script](ctrip-team12.spec.cjs) defaults to `http://127.0.0.1:3000`. Run all six tests with:

```sh
npx playwright test ctrip-team12.spec.cjs --workers=1
```

If the launcher prints a different port, set `CTRIP_BASE_URL` to its URL. For example, on PowerShell:

```powershell
$env:CTRIP_BASE_URL = 'http://127.0.0.1:4127'
npx.cmd playwright test ctrip-team12.spec.cjs --workers=1
```

On macOS or Linux, use `CTRIP_BASE_URL=http://127.0.0.1:4127 npx playwright test ctrip-team12.spec.cjs --workers=1`. Use `npm.cmd` and `npx.cmd` on Windows if PowerShell blocks the script wrappers.

The tests assert the required behavior. A failed assertion on the supplied Ctrip implementation identifies the documented discrepancy.

The [requirements](https://github.com/code-philia/course-software-testing/blob/024c2bcef427351918168a0eb414cf907822b4ac/applications/ctrip/requirements/requirements.yaml) and [baseline tests](../baseline/) provide the expected behavior and coverage comparisons.
