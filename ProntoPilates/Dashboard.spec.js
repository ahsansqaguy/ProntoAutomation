const {test, expect} = require("@playwright/test")
test("All texts visibility", async function ({ page }) {

    await page.goto("https://app.prontopilates.com/login")  
    await page.type("input[id='email']", "muhammad.sqa8@gmail.com")
    await page.getByPlaceholder("Password").type("Testing123!")
    await page.click("//input[@value='Login']")
    await expect(page).toHaveURL("https://app.prontopilates.com/dashboard")

    await page.waitForLoadState("load")

    const bookNowParagraph = page.locator('p:has-text("Book one now!")');

    await bookNowParagraph.waitFor({ state: 'visible', timeout: 5000 });
    
    if (await bookNowParagraph.isVisible()) {
        console.log('Book one now! paragraph is visible');

        // await bookNowParagraph.click();  
    } else {
        console.log('Book one now! paragraph is not visible');
        await expect
    }
// await bookNowParagraph.click();
// await expect(page).toHaveURL("https://app.prontopilates.com/book");
// await page.goBack()
// await page.waitForLoadState("load")
  
})