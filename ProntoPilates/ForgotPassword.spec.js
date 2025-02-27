const { test, expect } = require("@playwright/test");
// Forgot Password - Navigate to Forgot Password page
test("Forgot Password - Navigate", async function ({ page }) {
    await page.goto("https://app.prontopilates.com/login");
    await page.locator('text="Forgot Password?"').click();
    await expect(page).toHaveURL("https://app.prontopilates.com/forgot-password");
  });
  
  // Forgot Password - Invalid Email
  test("Forgot Password - Invalid Email", async function ({ page }) {
    await page.goto("https://app.prontopilates.com/forgot-password");
    await page.getByPlaceholder("Email").fill("invalid-email"); // Invalid email
    await page.locator('text="Send Email"').click();
    await expect(page.locator('text="Failed to request password reset"')).toBeVisible();
  });
  
  // Forgot Password - Valid Email
  test("Forgot Password - Valid Email", async function ({ page }) {
    await page.goto("https://app.prontopilates.com/forgot-password");
    await page.getByPlaceholder("Email").fill("jibranch101@gmail.com"); // Valid email
    await page.locator('text="Send Email"').click();
    await expect(page.getByAltText("Thumbs up")).toBeVisible();
  });
  
  // Forgot Password - Email is required
  test("Forgot Password - Email is required", async function ({ page }) {
    await page.goto("https://app.prontopilates.com/forgot-password");
    await page.locator('text="Send Email"').click(); // No email entered
    await expect(page.locator('text="Email is required."')).toBeVisible();
  });
  
  // Forgot Password - Back to Login
  test("Forgot Password - Back to Login", async function ({ page }) {
    await page.goto("https://app.prontopilates.com/forgot-password");
    await page.locator('text="Back to Login"').click();
    await expect(page).toHaveURL("https://app.prontopilates.com/login");
  });
  
  // Forgot Password - Go Back
  test("Forgot Password - Go Back", async function ({ page }) {
    await page.goto("https://app.prontopilates.com/login");
    await page.locator('text="Forgot Password?"').click();
    // await page.waitForLoadState("load");
    // await page.goBack();
    await page.locator('text="Back to Login"').click();
    await expect(page).toHaveURL("https://app.prontopilates.com/login");
  });
  