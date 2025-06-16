import { test, expect } from '@playwright/test'

test.beforeEach(async ({ request }) => {
  const res = await request.post('http://localhost:3001/api/test/reset')
  expect(res.status()).toBe(200)
})

test('all registration flow', async ({ page }) => {
  await page.goto('/auth/register')

  await page.getByPlaceholder('Email address').fill('user@example.com')
  await page.getByPlaceholder('Username').fill('username')
  await page.getByPlaceholder('Password').fill('ValidPass123!')

  await page.waitForTimeout(600)

  const submitButton = await page.getByTestId('register-button')
  await expect(submitButton).not.toBeDisabled()
  await submitButton.click()
  await page.waitForURL('**/auth/notification')
  await expect(page.getByText('Thank you for registering!')).toBeVisible()
})
