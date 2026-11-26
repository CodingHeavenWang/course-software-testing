# 05. A newly paid flight is missing from Pending vouchers

## Method and requirement

White-box lifecycle testing with a positive control. In [`backend/app.py`](https://github.com/code-philia/course-software-testing/blob/024c2bcef427351918168a0eb414cf907822b4ac/applications/ctrip/backend/app.py#L509), a UI-created order progresses through `orders.create` and `orders.pay`. The paid order has a payment date, but its voucher state stays unset. [`vouchers.list`](https://github.com/code-philia/course-software-testing/blob/024c2bcef427351918168a0eb414cf907822b4ac/applications/ctrip/backend/app.py#L630) skips unset voucher states before applying the paid-date eligibility rules. Create and pay for the same flight as the account's seeded eligible order to compare a normal UI-created order with a known eligible one.

[REQ-3.9 and REQ-8.3](https://github.com/code-philia/course-software-testing/blob/024c2bcef427351918168a0eb414cf907822b4ac/applications/ctrip/requirements/requirements.yaml) define successful simulated payment and the Pending list for eligible paid orders without a voucher application. The [REQ-8.3 baseline](https://github.com/code-philia/course-software-testing/blob/024c2bcef427351918168a0eb414cf907822b4ac/applications/ctrip/test/baseline/REQ-8.3.spec.ts) checks existing eligible records and an empty state. The [REQ-3.9 baseline](https://github.com/code-philia/course-software-testing/blob/024c2bcef427351918168a0eb414cf907822b4ac/applications/ctrip/test/baseline/REQ-3.9.spec.ts) ends at successful payment. This case follows a newly paid order into the voucher list.

## Reproduction

Use the local course app with the fixture account `ctrip_voucher_pending@example.com`. Its password is in [`fixtures/data.ts`](https://github.com/code-philia/course-software-testing/blob/024c2bcef427351918168a0eb414cf907822b4ac/applications/ctrip/test/baseline/fixtures/data.ts) and the seeded control order is **CTRIP20260721005**.

1. Sign in and search **Chengdu** to **Guangzhou** on **2026-07-21**.
2. On **Flight JD5162**, click **Show fares → Economy fare → Book**.
3. Enter the course passenger fixture **Wang Wu**, ID **110101199001011237**, and contact mobile **13800000014**. Select **Agree to booking terms** and click **Submit order**.
4. Select **Alipay**, click **Pay now**, confirm **Payment successful**, and record the new order number. All payment activity is simulated by the local app.
5. Open **More services → Reimbursement vouchers → Pending** and look for the new order and the seeded control.

## Expected and observed

**Expected.** The new order should appear alongside the control. Both are for the same flight under the same account, both were paid on the July 19 business date, and neither has a voucher application.

**Observed.** Payment succeeds for the new order, but the Pending list only exposes the seeded control. The captured new order number was **CTRIP20260719358**. A new run generates a different number.

[Successful payment](assets/05-payment-success.png) · [Pending vouchers with only the control](assets/05-pending-vouchers.png)
