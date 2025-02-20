import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://app.prontopilates.com/forgot-password');
  await page.getByRole('button', { name: 'Send Email' }).click();
  await page.getByText('Email is required.').click();
  await page.getByPlaceholder('Email').click();
  await page.getByPlaceholder('Email').click();
  await page.getByPlaceholder('Email').fill('muhammad.sqaexpert@gmail.com');
  await page.getByRole('button', { name: 'Send Email' }).click();
  await page.locator('.mt-20 > div:nth-child(3)').click();
  await page.getByRole('link', { name: 'contact support' }).click();
  await expect(page.locator('.mt-20 > div:nth-child(3)')).toBeVisible()});