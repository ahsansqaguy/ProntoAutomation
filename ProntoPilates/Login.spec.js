const { test, expect } = require("@playwright/test");

// Login test
test("Login - Positive", async function ({ page }) {
  await page.goto("https://app.prontopilates.com/login");
  await page.type("input[id='email']", "muhammad.sqa8@gmail.com");
  await page.getByPlaceholder("Password").type("Testing123!");
  await page.click("//input[@value='Login']");
  await expect(page).toHaveURL("https://app.prontopilates.com/dashboard");
});

// Invalid credentials - Incorrect Email
test("Login - Invalid credentials (Incorrect Email)", async function ({ page }) {
  await page.goto("https://app.prontopilates.com/login");
  await page.getByPlaceholder("Email").type("muhammad.sqa8@gmail.co"); // Invalid email
  await page.getByPlaceholder("Password").type("Testing123!");
  await page.click("//input[@value='Login']");
  await expect(page.locator('text="No account exists with this email address."')).toBeVisible();
});

// Invalid credentials - Incorrect Password
test("Login - Invalid credentials (Incorrect Password)", async function ({ page }) {
  await page.goto("https://app.prontopilates.com/login");
  await page.getByPlaceholder("Email").type("muhammad.sqa8@gmail.com");
  await page.getByPlaceholder("Password").type("WrongPassword123!"); // Incorrect password
  await page.click("//input[@value='Login']");
  await expect(page.locator('text="Password is incorrect!"')).toBeVisible();
});

// Empty fields - Email
test("Login - Empty fields (Email)", async function ({ page }) {
  await page.goto("https://app.prontopilates.com/login");
  await page.getByPlaceholder("Email").fill(""); // Leave email blank
  await page.getByPlaceholder("Password").type("Testing123!");
  await page.click("//input[@value='Login']");
  await expect(page.locator('text="Email is required."')).toBeVisible();
});

// Empty fields - Password
test("Login - Empty fields (Password)", async function ({ page }) {
  await page.goto("https://app.prontopilates.com/login");
  await page.getByPlaceholder("Email").type("muhammad.sqa8@gmail.com");
  await page.getByPlaceholder("Password").fill(""); // Leave password blank
  await page.click("//input[@value='Login']");
  await expect(page.locator('text="Password is required."')).toBeVisible();
});

