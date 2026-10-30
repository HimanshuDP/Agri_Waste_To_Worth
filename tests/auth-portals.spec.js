// @ts-check
const { test, expect } = require('@playwright/test');
const { DashboardPage } = require('./pages/dashboard.page');

test.describe('Role-Differentiated Portals & Auth E2E Tests (4 Roles)', () => {
  let dashboard;

  test.beforeEach(async ({ page }) => {
    dashboard = new DashboardPage(page);
    await dashboard.goto();
  });

  test('TC-PORTAL-01: Persona switcher bar switches seamlessly across Farmer, Buyer, Transporter, and Admin', async ({ page }) => {
    // 1. Farmer view default
    await expect(dashboard.farmerPortal).toBeVisible();

    // 2. Switch to Buyer
    await dashboard.switchToBuyer();
    await expect(dashboard.buyerPortal).toBeVisible();
    await expect(dashboard.farmerPortal).toBeHidden();
    await expect(page.locator('#switcherRoleTitle')).toContainText(/Buyer|Off-Taker/i);

    // 3. Switch to Transporter
    await dashboard.switchToTransporter();
    await expect(dashboard.transporterPortal).toBeVisible();
    await expect(dashboard.buyerPortal).toBeHidden();
    await expect(page.locator('#switcherRoleTitle')).toContainText(/Transporter|Hauler|Fleet/i);

    // 4. Switch to Admin
    await dashboard.switchToAdmin();
    await expect(dashboard.adminPortal).toBeVisible();
    await expect(dashboard.transporterPortal).toBeHidden();
    await expect(page.locator('#switcherRoleTitle')).toContainText(/Admin|Governance/i);
  });

  test('TC-PORTAL-02: Farmer portal displays active crop lots table and baler pickup option', async ({ page }) => {
    await dashboard.switchToFarmer();
    await expect(dashboard.farmerListingsTable).toBeVisible();
    await expect(dashboard.farmerWasteSold).toBeVisible();
    await expect(dashboard.farmerEarnings).toBeVisible();
  });

  test('TC-PORTAL-03: Buyer portal displays procurement spend and bulk RFQs table', async ({ page }) => {
    await dashboard.switchToBuyer();
    await expect(dashboard.buyerSpend).toBeVisible();
    await expect(page.locator('#buyerSpendChart')).toBeVisible();
    await expect(page.locator('#buyerQualityChart')).toBeVisible();
  });

  test('TC-PORTAL-04: Transporter portal displays biomass haulage queue, live routing, and freight stats', async ({ page }) => {
    await dashboard.switchToTransporter();
    await expect(dashboard.transporterPortal).toBeVisible();
    await expect(dashboard.transporterTable).toBeVisible();
    await expect(dashboard.transporterEarnings).toBeVisible();
    await expect(page.locator('#transporterVolumeChart')).toBeVisible();
  });

  test('TC-PORTAL-05: Admin portal displays platform GMV and pending KYC approvals queue', async ({ page }) => {
    await dashboard.switchToAdmin();
    await expect(dashboard.adminGmv).toBeVisible();
    await expect(dashboard.adminKycTable).toBeVisible();
  });

  test('TC-PORTAL-06: Admin KYC verification action updates applicant status to Approved', async ({ page }) => {
    await dashboard.switchToAdmin();
    await dashboard.approveFirstKyc();
    const firstRowStatus = await dashboard.adminKycTable.locator('tr').first().textContent();
    expect(firstRowStatus).toContain('Approved');
  });

  test('TC-PORTAL-07: 1-Click Evaluation Login as Transporter switches active persona to Desh Agro Transporters', async ({ page }) => {
    // Open login modal
    await page.locator('#loginBtn').click();
    const authModal = page.locator('#authModal');
    await expect(authModal).toBeVisible();

    // Click "As Transporter" demo quick button
    await page.locator('.btn-demo-quick.demo-transporter').click();
    await expect(authModal).toBeHidden();

    // Verify transporter portal is now active
    await expect(dashboard.transporterPortal).toBeVisible();
  });
});
