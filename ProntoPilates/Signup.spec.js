
const {test, expect} = require("@playwright/test");

// Select Studio tab test suite
test.describe("Signup - Select Studio Tab - Test Cases", () => {

    test('Casual Plan URL', async ({ page }) => {
      await page.goto('https://www.prontopilates.com.au/prices/');
      await expect(page.locator('text="Casual Plan"')).toBeVisible();
      await page.click("(//a[@id='price-cta'])[1]");
      const currentURL = await page.url();
      expect(currentURL).toContain('chargebee_id=Casual-Plan-AUD-Monthly');
    });
  
    test("Next button Disable", async ({ page }) => {
      await page.goto("https://app.prontopilates.com/signup?chargebee_id=Casual-Plan-AUD-Monthly&landing_url=/prices/");
    
      const StateDropdownButton = page.locator('#headlessui-listbox-button-\\:r5\\:');
      const StudioDropdownButton = page.locator('#headlessui-listbox-button-\\:r6\\:');
      const MediaDropdownButton = page.locator('#headlessui-listbox-button-\\:r7\\:');
    
      await StateDropdownButton.waitFor({ state: "visible" });
      await StudioDropdownButton.waitFor({ state: "visible" });
      await MediaDropdownButton.waitFor({ state: "visible" });
    
      async function getTextWithRetry(locator) {
        for (let i = 0; i < 5; i++) {
          const text = await locator.textContent();
          if (text && text.trim() !== "") return text.trim();
          await page.waitForTimeout(500); 
        }
        return "";
      }
    
      const StateText = await getTextWithRetry(StateDropdownButton);
      const StudioText = await getTextWithRetry(StudioDropdownButton);
      const MediaText = await getTextWithRetry(MediaDropdownButton);
    
      console.log('State Text:', StateText);
      console.log('Studio Text:', StudioText);
      console.log('Media Text:', MediaText);
    
      await page.waitForTimeout(1000);
    
      if (StateText === 'Select State' || StudioText === 'Select Studio' || MediaText === 'Please Select') {
        console.log("Inside If");
        await expect(page.getByRole('button', { name: 'Next' })).toBeDisabled({ timeout: 5000 });
      } else {
        console.log("Inside Else");
        await expect(page.getByRole('button', { name: 'Next' })).toBeEnabled({ timeout: 5000 });
      }
    });
    
  
    test('Verify next payment date is correct', async ({ page }) => {
      const nextPaymentDate = new Date();
      nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);
  
      const formattedDate = `${nextPaymentDate.getDate().toString().padStart(2, '0')}-${nextPaymentDate.toLocaleString('default', { month: 'short' })}-${nextPaymentDate.getFullYear()}`;
  
      await page.goto('https://app.prontopilates.com/signup?chargebee_id=Casual-Plan-AUD-Monthly&landing_url=/prices/');
      const extractedDate = await page.locator('text=Next monthly payment').textContent();
      await expect(extractedDate).toContain(formattedDate);
    });
  
    test('Radio button selection', async ({ page }) => {
      await page.goto('https://app.prontopilates.com/signup?chargebee_id=Casual-Plan-AUD-Monthly&landing_url=/prices/');
    
      const yesRadio = page.locator("//input[@id='yes']");
      const noRadio = page.locator("//input[@id='no']");
      const elementLocator = page.locator("body > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(3) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1)");
    
      await expect(page.locator("label[for='yes']")).toBeVisible();
      const isCheckedYes = await yesRadio.isChecked();
      if (isCheckedYes) {
        await expect(elementLocator).toBeVisible();
        await expect(page.locator("//div[normalize-space()='All-Access Add-on:']")).toBeVisible();
      } else {
        await expect(elementLocator).toBeHidden();
        await expect(page.locator("//div[normalize-space()='All-Access Add-on:']")).toBeHidden();
      }
    
      await expect(page.locator("label[for='no']")).toBeVisible();
      await noRadio.click();
      const isCheckedNo = await noRadio.isChecked();
      if (isCheckedNo) {
        await expect(elementLocator).toBeHidden();
        await expect(page.locator("//div[normalize-space()='All-Access Add-on:']")).toBeHidden();
      }
    });
  
    test("Select State", async ({ page }) => {
      await page.goto("https://app.prontopilates.com/signup?chargebee_id=Casual-Plan-AUD-Monthly&landing_url=/prices/");
      await page.locator("text=Select State").click();
      await expect (page.locator('[role="listbox"]')).toBeVisible();
      await expect(page.locator("text=New South Wales")).toBeVisible();
      await expect(page.locator("text=Victoria")).toBeVisible();
      await expect(page.locator("text=Queensland")).toBeVisible();
      await expect(page.locator("text=Western Australia")).toBeVisible();
      await expect(page.locator("text=South Australia")).toBeVisible();
      await expect(page.locator("text=Tasmania")).toBeVisible();
    });
  
    test("Social Media Drop-downs", async ({ page }) => {
      await page.goto("https://app.prontopilates.com/signup?chargebee_id=Casual-Plan-AUD-Monthly&landing_url=/prices/");
  
      const mediaDropdownButton = page.locator('#headlessui-listbox-button-\\:r7\\:'); 
      const mediaDropdownOptions = page.locator('ul[role="listbox"] li[role="option"]'); 
  
      await expect(mediaDropdownButton).toBeVisible();
  
      await mediaDropdownButton.click();
  
      const optionsContainer = page.locator('ul[role="listbox"]'); 
      await expect(optionsContainer).toBeVisible();
  
      const optionsCount = await mediaDropdownOptions.count();
      console.log(`Options count: ${optionsCount}`);
      expect(optionsCount).toBe(5);
  
      for (let i = 0; i < optionsCount; i++) {
        const optionText = await mediaDropdownOptions.nth(i).innerText();
        console.log(`Option ${i + 1}: ${optionText}`);
      }
    });
  
    test("Discount Code button", async ({ page }) => { 
      await page.goto("https://app.prontopilates.com/signup?chargebee_id=Casual-Plan-AUD-Monthly&landing_url=/prices/");
  
      const discountCodeButton = page.getByRole('button', { name: 'Apply' })
  
      await discountCodeButton.click();
      expect(page.locator("text=Coupon not found")).toBeVisible();
      await page.getByPlaceholder("Enter Code").type("Testing123!");
      await discountCodeButton.click();
      expect(page.locator("text=Coupon not found")).toBeVisible();
  
      await page.getByPlaceholder("Enter Code").fill('');
      await page.getByPlaceholder("Enter Code").type("Manly50X2");
      await discountCodeButton.click();
      await expect(page.locator("text=Coupon is Applied")).toBeVisible();
      await expect(page.locator("text=Coupon MANLY50X2 applied")).toBeVisible();
  
      const price = page.locator("text=$27.5");
      await expect(price.nth(1)).toBeVisible();
      await expect(price.nth(2)).toBeVisible();
      await expect(page.locator('span.line-through:has-text("$55")')).toBeVisible();
  
      await page.getByPlaceholder("Enter Code").fill('');
      await page.getByPlaceholder("Enter Code").type("Legacy-Gratis");
      await discountCodeButton.click();
      await expect(page.locator('text="Coupon is Applied"')).toBeVisible();
      await expect(page.locator('text="100% discount forever"').nth(2)).toBeVisible();
      await expect(page.locator('text="Coupon LEGACY-GRATIS applied"').nth(1)).toBeVisible();
    });
  
  });
  
// Personal Details tab test suite
test.describe("Signup - Personal Details tab - Negative Test Cases", () => {

    test("Signup - Missing First Name", async ({ page }) => {
      await page.goto("https://app.prontopilates.com/signup?chargebee_id=Casual-Plan-AUD-Monthly&landing_url=/prices/");
      await page.click("text=Select State") 
      await page.click("text=New South Wales")
      await page.click("button[id='headlessui-listbox-button-:r6:']")
      await page.click("text=Manly")
      await page.click("text=Please Select")
      await page.click("text=Social Media")
      await page.click("//button[normalize-space()='Next']")
      await page.type("input[id='last_name']", "Test");
      await page.type("input[type='tel']", "+61321324325");
      await page.type("input[id='email']", "Muhammadtest17");
      await page.type("input[id='password']", "Testing123!");
      await page.type("input[id='passwordConfirm']", "Testing123!");
      await page.type("input[id='dob']", "12/27/1995");
      await page.click("input[id='t_and_c']");
      await page.click("input[id='marketing_email']");
      await page.click("input[id='marketing_sms']");
      await expect(page.locator('//button[text()="Next"]')).toBeDisabled();
    });
  
    test("Signup - Missing Last Name", async ({ page }) => {
      await page.goto("https://app.prontopilates.com/signup?chargebee_id=Casual-Plan-AUD-Monthly&landing_url=/prices/");
      await page.click("text=Select State") 
      await page.click("text=New South Wales")
      await page.click("button[id='headlessui-listbox-button-:r6:']")
      await page.click("text=Manly")
      await page.click("text=Please Select")
      await page.click("text=Social Media")
      await page.click("//button[normalize-space()='Next']")
      await page.type("input[id='first_name']", "Muhammad");
      await page.type("input[type='tel']", "+61321324325");
      await page.type("input[id='email']", "Muhammadtest17");
      await page.type("input[id='password']", "Testing123!");
      await page.type("input[id='passwordConfirm']", "Testing123!");
      await page.type("input[id='dob']", "12/27/1995");
      await page.click("input[id='t_and_c']");
      await page.click("input[id='marketing_email']");
      await page.click("input[id='marketing_sms']");
      await expect(page.locator('//button[text()="Next"]')).toBeDisabled();
    });
  
    //This is failed because the button is enabled even if the email is invalid
    test("Signup - Invalid Email Format", async ({ page }) => {
      await page.goto("https://app.prontopilates.com/signup?chargebee_id=Casual-Plan-AUD-Monthly&landing_url=/prices/");
      await page.click("text=Select State") 
      await page.click("text=New South Wales")
      await page.click("button[id='headlessui-listbox-button-:r6:']")
      await page.click("text=Manly")
      await page.click("text=Please Select")
      await page.click("text=Social Media")
      await page.click("//button[normalize-space()='Next']")
      await page.type("input[id='first_name']", "Muhammad");
      await page.type("input[id='last_name']", "Test");
      await page.type("input[type='tel']", "+61321324325");
      await page.type("input[id='email']", "invalid-email");
      await page.type("input[id='password']", "Testing123!");
      await page.type("input[id='passwordConfirm']", "Testing123!");
      await page.type("input[id='dob']", "12/27/1995");
      await page.click("input[id='t_and_c']");
      await page.click("input[id='marketing_email']");
      await page.click("input[id='marketing_sms']");
      await expect(page.locator('//button[text()="Next"]')).toBeDisabled(); //This is failed because the button is enabled even if the email is invalid
    });
  
    test("Signup - Passwords Do Not Match", async ({ page }) => {
      await page.goto("https://app.prontopilates.com/signup?chargebee_id=Casual-Plan-AUD-Monthly&landing_url=/prices/");
      await page.click("text=Select State") 
      await page.click("text=New South Wales")
      await page.click("button[id='headlessui-listbox-button-:r6:']")
      await page.click("text=Manly")
      await page.click("text=Please Select")
      await page.click("text=Social Media")
      await page.click("//button[normalize-space()='Next']")
      await page.type("input[id='first_name']", "Muhammad");
      await page.type("input[id='last_name']", "Test");
      await page.type("input[type='tel']", "+61321324325");
      await page.type("input[id='email']", "Muhammadtest17");
      await page.type("input[id='password']", "Testing123!");
      await page.type("input[id='passwordConfirm']", "DifferentPassword!");
      await page.type("input[id='dob']", "12/27/1995");
      await page.click("input[id='t_and_c']");
      await page.click("input[id='marketing_email']");
      await page.click("input[id='marketing_sms']");
      await expect(page.locator('//button[text()="Next"]')).toBeDisabled();

    });
  
    test("Signup - Invalid Date of Birth", async ({ page }) => {
      await page.goto("https://app.prontopilates.com/signup?chargebee_id=Casual-Plan-AUD-Monthly&landing_url=/prices/");
      await page.click("text=Select State") 
      await page.click("text=New South Wales")
      await page.click("button[id='headlessui-listbox-button-:r6:']")
      await page.click("text=Manly")
      await page.click("text=Please Select")
      await page.click("text=Social Media")
      await page.click("//button[normalize-space()='Next']")
      await page.type("input[id='first_name']", "Muhammad");
      await page.type("input[id='last_name']", "Test");
      await page.type("input[type='tel']", "+61321324325");
      await page.type("input[id='email']", "Muhammadtest17");
      await page.type("input[id='password']", "Testing123!");
      await page.type("input[id='passwordConfirm']", "Testing123!");
      await page.type("input[id='dob']", "01/02/2022");
      await page.click("input[id='t_and_c']");
      await page.click("input[id='marketing_email']");
      await page.click("input[id='marketing_sms']");
      await expect(page.locator('//button[text()="Next"]')).toBeDisabled();
    });
  
    test("Signup - Unchecked Terms and Conditions", async ({ page }) => {
      await page.goto("https://app.prontopilates.com/signup?chargebee_id=Casual-Plan-AUD-Monthly&landing_url=/prices/");
      await page.click("text=Select State") 
      await page.click("text=New South Wales")
      await page.click("button[id='headlessui-listbox-button-:r6:']")
      await page.click("text=Manly")
      await page.click("text=Please Select")
      await page.click("text=Social Media")
      await page.click("//button[normalize-space()='Next']")
      await page.type("input[id='first_name']", "Muhammad");
      await page.type("input[id='last_name']", "Test");
      await page.type("input[type='tel']", "+61321324325");
      await page.type("input[id='email']", "Muhammadtest17");
      await page.type("input[id='password']", "Testing123!");
      await page.type("input[id='passwordConfirm']", "Testing123!");
      await page.type("input[id='dob']", "12/27/1995");
      await page.click("input[id='marketing_email']");
      await page.click("input[id='marketing_sms']");
      await expect(page.locator('//button[text()="Next"]')).toBeDisabled();
    });
  
  });
  
// Easy Payment test suite
  test.describe("Signup - Easy Payment Tab - Negative Test Cases", () => {

    test('Invalid Card Number', async ({ page }) => {
      // Ensure a fresh session
      await page.context().clearCookies();
      await page.context().clearPermissions();
      await page.addInitScript(() => window.localStorage.clear()); // Safe way to clear storage
    
      // Go to signup page
      await page.goto("https://app.prontopilates.com/signup?chargebee_id=Casual-Plan-AUD-Monthly&landing_url=/prices/");
      
      // Wait for elements before interacting
      await page.waitForSelector("text=Select State", { state: "visible" });
    
      // Fill signup form
      await page.click("text=Select State");
      await page.click("text=New South Wales");
      await page.click("button[id='headlessui-listbox-button-:r6:']");
      await page.click("text=Manly");
      await page.click("text=Please Select");
      await page.click("text=Social Media");
    
      await page.type('[placeholder="Enter Code"]', "Legacy-Gratis");
      await page.click("text=Apply");
      await page.click("//button[normalize-space()='Next']");
    
      // Personal details tab
      await page.type("input[id='first_name']", "Muhammad");
      await page.type("input[id='last_name']", "Test");
      await page.type("input[type='tel']", "+61321324325");
      await page.type("input[id='email']", "Muhammadtest17");
      await page.type("input[id='password']", "Testing123!");
      await page.type("input[id='passwordConfirm']", "Testing123!");
      await page.type("input[id='dob']", "12/27/1995");
      await page.click("input[id='t_and_c']");
      await page.click("input[id='marketing_email']");
      await page.click("input[id='marketing_sms']");
      await page.click('//button[text()="Next"]');
    
      // Enter invalid card details
      await page.fill("input[id='card_number']", "1234567890123456");  // Invalid card number
      await page.fill("input[id='card_expiry']", "08/28");
      await page.fill("input[id='card_cvv']", "279");
      await page.click("button[type='submit']");
    
      // Expect error message
      await expect(page.locator("div[role='alert']")).toBeVisible({ timeout: 5000 });
    });
    
    
  
    test('Invalid CVV', async ({ page }) => {
      await page.goto("https://app.prontopilates.com/signup?chargebee_id=Casual-Plan-AUD-Monthly&landing_url=/prices/");
      await page.waitForTimeout(5000)
      await page.click("text=Select State") 
      await page.click("text=New South Wales")
      await page.click("button[id='headlessui-listbox-button-:r6:']")
      await page.click("text=Manly")
      await page.click("text=Please Select")
      await page.click("text=Social Media")
      await page.type('[placeholder="Enter Code"]', "Legacy-Gratis")
      await page.click("text=Apply")
      await page.click("//button[normalize-space()='Next']")
      //persinal details tab 
      await page.type("input[id='first_name']", "Muhammad")
      await page.type("input[id='last_name']", "Test")
      await page.type("input[type='tel']", "+61321324325")
      await page.type("input[id='email']", "Muhammadtest17")
      await page.type("input[id='password']", "Testing123!")
      await page.type("input[id='passwordConfirm']", "Testing123!")
      await page.type("input[id='dob']", "12/27/1995")
      await page.click("input[id='t_and_c']")
      await page.click("input[id='marketing_email']")
      await page.click("input[id='marketing_sms']")
      await page.click('//button[text()="Next"]')
      await page.type("input[id='card_number']", "4782780036154360");
      await page.type("input[id='card_expiry']", "08/29");
      await page.type("input[id='card_cvv']", "123");  // Invalid CVV
      await page.getByRole('button', { name: 'Next' }).click();
      await page.waitForTimeout(2000);
      await expect(page.locator("div[role='alert']")).toBeVisible();  // Expect error message
    });
  
    test('Missing Card Number', async ({ page }) => {
      await page.goto("https://app.prontopilates.com/signup?chargebee_id=Casual-Plan-AUD-Monthly&landing_url=/prices/");
      await page.waitForTimeout(5000)
      await page.click("text=Select State") 
      await page.click("text=New South Wales")
      await page.click("button[id='headlessui-listbox-button-:r6:']")
      await page.click("text=Manly")
      await page.click("text=Please Select")
      await page.click("text=Social Media")
      await page.type('[placeholder="Enter Code"]', "Legacy-Gratis")
      await page.click("text=Apply")
      await page.click("//button[normalize-space()='Next']")
      //persinal details tab 
      await page.type("input[id='first_name']", "Muhammad")
      await page.type("input[id='last_name']", "Test")
      await page.type("input[type='tel']", "+61321324325")
      await page.type("input[id='email']", "Muhammadtest17")
      await page.type("input[id='password']", "Testing123!")
      await page.type("input[id='passwordConfirm']", "Testing123!")
      await page.type("input[id='dob']", "12/27/1995")
      await page.click("input[id='t_and_c']")
      await page.click("input[id='marketing_email']")
      await page.click("input[id='marketing_sms']")
      await page.click('//button[text()="Next"]')
      await page.type("input[id='card_expiry']", "08/28");
      await page.type("input[id='card_cvv']", "279");
      await expect(page.locator("button[type='submit']")).toBeDisabled();
    });
  
    test('Missing Expiry Date', async ({ page }) => {
      await page.goto("https://app.prontopilates.com/signup?chargebee_id=Casual-Plan-AUD-Monthly&landing_url=/prices/");
      await page.waitForTimeout(5000)
      await page.click("text=Select State") 
      await page.click("text=New South Wales")
      await page.click("button[id='headlessui-listbox-button-:r6:']")
      await page.click("text=Manly")
      await page.click("text=Please Select")
      await page.click("text=Social Media")
      await page.type('[placeholder="Enter Code"]', "Legacy-Gratis")
      await page.click("text=Apply")
      await page.click("//button[normalize-space()='Next']")
      //persinal details tab 
      await page.type("input[id='first_name']", "Muhammad")
      await page.type("input[id='last_name']", "Test")
      await page.type("input[type='tel']", "+61321324325")
      await page.type("input[id='email']", "Muhammadtest17")
      await page.type("input[id='password']", "Testing123!")
      await page.type("input[id='passwordConfirm']", "Testing123!")
      await page.type("input[id='dob']", "12/27/1995")
      await page.click("input[id='t_and_c']")
      await page.click("input[id='marketing_email']")
      await page.click("input[id='marketing_sms']")
      await page.click('//button[text()="Next"]')
      await page.type("input[id='card_number']", "5590490217708385");
      await page.type("input[id='card_cvv']", "279");
      await expect(page.locator("button[type='submit']")).toBeDisabled();

    });
  
    test('Missing CVV', async ({ page }) => {
      await page.goto("https://app.prontopilates.com/signup?chargebee_id=Casual-Plan-AUD-Monthly&landing_url=/prices/");
      await page.waitForTimeout(5000)
      await page.click("text=Select State") 
      await page.click("text=New South Wales")
      await page.click("button[id='headlessui-listbox-button-:r6:']")
      await page.click("text=Manly")
      await page.click("text=Please Select")
      await page.click("text=Social Media")
      await page.type('[placeholder="Enter Code"]', "Legacy-Gratis")
      await page.click("text=Apply")
      await page.click("//button[normalize-space()='Next']")
      //persinal details tab 
      await page.type("input[id='first_name']", "Muhammad")
      await page.type("input[id='last_name']", "Test")
      await page.type("input[type='tel']", "+61321324325")
      await page.type("input[id='email']", "Muhammadtest17")
      await page.type("input[id='password']", "Testing123!")
      await page.type("input[id='passwordConfirm']", "Testing123!")
      await page.type("input[id='dob']", "12/27/1995")
      await page.click("input[id='t_and_c']")
      await page.click("input[id='marketing_email']")
      await page.click("input[id='marketing_sms']")
      await page.click('//button[text()="Next"]')
      await page.type("input[id='card_number']", "5590490217708385");
      await page.type("input[id='card_expiry']", "08/28");
      await expect(page.locator("button[type='submit']")).toBeDisabled();      // Expect error message
    });
  
    test('Invalid Expiry Date Format', async ({ page }) => {
      await page.goto("https://app.prontopilates.com/signup?chargebee_id=Casual-Plan-AUD-Monthly&landing_url=/prices/");
      await page.waitForTimeout(5000)
      await page.click("text=Select State") 
      await page.click("text=New South Wales")
      await page.click("button[id='headlessui-listbox-button-:r6:']")
      await page.click("text=Manly")
      await page.click("text=Please Select")
      await page.click("text=Social Media")
      await page.type('[placeholder="Enter Code"]', "Legacy-Gratis")
      await page.click("text=Apply")
      await page.click("//button[normalize-space()='Next']")
      //persinal details tab 
      await page.type("input[id='first_name']", "Muhammad")
      await page.type("input[id='last_name']", "Test")
      await page.type("input[type='tel']", "+61321324325")
      await page.type("input[id='email']", "Muhammadtest17")
      await page.type("input[id='password']", "Testing123!")
      await page.type("input[id='passwordConfirm']", "Testing123!")
      await page.type("input[id='dob']", "12/27/1995")
      await page.click("input[id='t_and_c']")
      await page.click("input[id='marketing_email']")
      await page.click("input[id='marketing_sms']")
      await page.click('//button[text()="Next"]')
      await page.type("input[id='card_number']", "5590490217708385");
      await page.type("input[id='card_expiry']", "28/08");  // Invalid expiry date format
      await page.type("input[id='card_cvv']", "279");
      await page.click("button[type='submit']");
      await expect(page.locator("div[role='alert']")).toBeVisible();  // Expect error message
    });
  
  });
  
// Straight Signup > Happy path
test("Complete signup happy path", async ({ page }) => {
await page.goto("https://www.prontopilates.com.au/prices/")
await page.click("(//a[@id='price-cta'])[1]")
// await expect(page).toHaveURL("https://app.prontopilates.com/signup?chargebee_id=Casual-Plan-AUD-Monthly&landing_url=/prices/")
await page.waitForTimeout(5000)
await page.click("text=Select State") 
await page.click("text=New South Wales")
await page.click("button[id='headlessui-listbox-button-:r6:']")
await page.click("text=Manly")
await page.click("text=Please Select")
await page.click("text=Social Media")
await page.type('[placeholder="Enter Code"]', "Legacy-Gratis")
await page.click("text=Apply")
await page.click("//button[normalize-space()='Next']")
//persinal details tab 
await page.type("input[id='first_name']", "Muhammad")
await page.type("input[id='last_name']", "Test")
await page.type("input[type='tel']", "+61321324325")
await page.type("input[id='email']", "Muhammadtest17")
await page.type("input[id='password']", "Testing123!")
await page.type("input[id='passwordConfirm']", "Testing123!")
await page.type("input[id='dob']", "12/27/1995")
await page.click("input[id='t_and_c']")
await page.click("input[id='marketing_email']")
await page.click("input[id='marketing_sms']")
await page.click('//button[text()="Next"]')
//easy payment tab
await page.type("input[id='card_number']", "5590490217708385")
await page.type("input[id='card_expiry']", "08/28")
await page.type("input[id='card_cvv']", "279")
await page.click("button[type='submit']")
await page.waitForTimeout(5000)
})

