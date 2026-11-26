const { test, expect } = require('@playwright/test');

test.use({
  baseURL: process.env.CTRIP_BASE_URL || 'http://127.0.0.1:3000',
  timezoneId: 'Asia/Shanghai',
});

const named = (scope, role, name) => scope.getByRole(role, { name, exact: true });
const button = (scope, name) => named(scope, 'button', name);
const field = (scope, name) => named(scope, 'textbox', name);
const region = (scope, name) => named(scope, 'region', name);
const tab = (scope, name) => named(scope, 'tab', name);

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await expect(named(page, 'heading', 'Ctrip Travel')).toBeVisible();
});

async function chooseDate(page, label, date) {
  await field(page, label).click();
  await button(page, date).click();
}

async function searchChengduToGuangzhou(page) {
  await field(page, 'Origin').fill('Chengdu');
  await field(page, 'Destination').fill('Guangzhou');
  await chooseDate(page, 'Departure date', '2026-07-21');
  await button(page, 'Search flights').click();
  await expect(named(page, 'heading', 'Flight results')).toBeVisible();
}

async function signIn(page, fixture) {
  await named(page, 'link', 'Log in and Register').click();
  await field(page, 'Account').fill(fixture);
  await page.getByLabel('Password', { exact: true }).fill('Travel1234');
  await named(page, 'checkbox', 'Agree to terms').check();
  await button(page, 'Log in').click();
  await expect(button(page, 'My account')).toBeVisible();
  await expect(named(page, 'heading', 'Ctrip Travel')).toBeVisible();
}

async function openService(page, name) {
  await button(page, 'More services').click();
  await button(page, name).click();
}

function seconds(countdown) {
  expect(countdown).toMatch(/^(?:\d{2}:)?\d{2}:\d{2}$/);
  return countdown.split(':').reduce((total, part) => total * 60 + Number(part), 0);
}

test('01 REQ-2.3 — changing departure must not display a negative trip duration', async ({ page }) => {
  await chooseDate(page, 'Departure date', '2026-07-21');
  await button(page, 'Add return').click();
  await button(page, '2026-07-25').click();
  const duration = page.locator('#trip-duration');
  await expect(duration).toHaveText('4 days');

  await chooseDate(page, 'Departure date', '2026-07-26');

  const shown = (await duration.allTextContents()).join(' ');
  expect(shown, 'Changing departure left the earlier return and displayed a negative duration.')
    .not.toMatch(/-\d+ days?/);
});

test('02 REQ-2.3/2.8 — Monthly fares must not offer a selectable past departure', async ({ page }) => {
  await searchChengduToGuangzhou(page);
  await field(page, 'Departure date').click();
  await expect(button(page, '2026-07-18')).toBeDisabled();
  await button(page, 'Close date picker').click();
  await button(region(page, 'Date bar'), 'More dates').click();
  const monthly = named(page, 'dialog', 'Monthly fares');
  await expect(monthly).toBeVisible();
  const past = button(monthly, '2026-07-18');

  if (await past.isVisible()) {
    await expect(past, 'The past date disabled in the departure picker is selectable in Monthly fares.')
      .toBeDisabled();
  }
});

test('03 REQ-2.4/2.9/2.13 — a rejected route update must not change the active filter query', async ({ page }) => {
  await searchChengduToGuangzhou(page);
  const flights = region(page, 'Flight list').getByRole('listitem');
  const nonstop = named(page, 'checkbox', 'Nonstop only');
  await expect(flights).toHaveCount(3);
  await nonstop.check();
  await expect(flights).toHaveCount(2);
  await nonstop.uncheck();

  await field(page, 'Destination').fill('Chengdu');
  await button(page, 'Update results').click();
  await expect(page.getByText('Origin and destination cannot be the same', { exact: true })).toBeVisible();
  await expect(flights).toHaveCount(3);
  await nonstop.check();

  await expect(flights, 'Filtering should still use the last accepted Chengdu–Guangzhou route.')
    .toHaveCount(2);
  await expect(named(region(page, 'Flight list'), 'listitem', 'Flight CZ3401')).toBeVisible();
  await expect(named(region(page, 'Flight list'), 'listitem', 'Flight MU5234')).toBeVisible();
});

test('04 REQ-4.2 — the same pending order must not gain countdown time after tab filtering', async ({ page }) => {
  await page.clock.install();
  await signIn(page, 'ctrip_order_read@example.com');
  await button(page, 'My account').click();
  await named(page, 'link', 'Orders').click();
  const order = named(region(page, 'Order list'), 'listitem', 'Record CTRIP20260721001');
  const timer = named(order, 'timer', 'Time remaining');
  await expect(timer).toHaveText(/^(?:\d{2}:)?\d{2}:\d{2}$/);
  const started = seconds(await timer.innerText());
  expect(started, 'Use a fresh app database with an unexpired seeded order.').toBeGreaterThan(6);
  await page.clock.runFor(6000);
  const before = await timer.innerText();
  expect(seconds(before)).toBeLessThan(started);

  await tab(page, 'Pending payment').click();

  const after = await timer.innerText();
  expect(seconds(after), `Same order CTRIP20260721001: timer changed from ${before} to ${after}.`)
    .toBeLessThanOrEqual(seconds(before));
});

test('05 REQ-3.9/8.3 — a paid eligible booking must appear under Pending vouchers', async ({ page }) => {
  await signIn(page, 'ctrip_voucher_pending@example.com');
  await searchChengduToGuangzhou(page);
  const flight = named(region(page, 'Flight list'), 'listitem', 'Flight JD5162');
  await button(flight, 'Show fares').click();
  await button(named(flight, 'group', 'Economy fare'), 'Book').click();
  const passenger = region(page, 'Passenger details');
  await field(passenger, 'Full name').fill('Wang Wu');
  await field(passenger, 'ID number').fill('110101199001011237');
  await field(page, 'Contact mobile').fill('13800000014');
  await named(page, 'checkbox', 'Agree to booking terms').check();
  await button(page, 'Submit order').click();
  await expect(named(page, 'heading', 'Payment')).toBeVisible();
  await named(page, 'radio', 'Alipay').check();
  await button(page, 'Pay now').click();
  await expect(page.getByRole('status').filter({ hasText: 'Payment successful' })).toBeVisible();
  const orderLabel = await page.locator('.page-subtitle').innerText();
  expect(orderLabel).toMatch(/^Order CTRIP\d+$/);
  const orderNumber = orderLabel.slice('Order '.length);

  await openService(page, 'Reimbursement vouchers');
  const pending = region(page, 'Pending vouchers');
  await expect(pending.getByText('CTRIP20260721005', { exact: true })).toBeVisible();
  await expect(pending.getByText(orderNumber, { exact: true }),
    `Payment succeeded for ${orderNumber}, but Pending only shows the seeded control and omits the new booking.`)
    .toBeVisible();
});

test('06 REQ-9.2/9.3 — the Chongqing link must open a Chongqing airport overview', async ({ page }) => {
  await openService(page, 'Domestic airport directory');
  const domestic = region(page, 'Domestic airports');
  await button(domestic, 'C').click();
  await named(domestic, 'link', 'Chongqing').click();

  const overview = region(page, 'Airport overview');
  await expect(overview, 'The overview should describe the city selected in the directory.')
    .toContainText('Chongqing');
});
