import { test, expect } from '@playwright/test'

test('shows error when email is already taken', async ({ page }) => {
  await page.route('**/api/auth/check-email**', async (route) => {
    const url = new URL(route.request().url())
    const email = decodeURIComponent(url.searchParams.get('email') || '')

    if (email === 'existing@example.com') {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ available: false }),
      })
    } else {
      route.continue()
    }
  })

  await page.goto('/auth/register')

  await page.getByPlaceholder('Email address').fill('existing@example.com')
  await page.getByPlaceholder('Username').fill('validusername')
  await page.getByPlaceholder('Password').fill('ValidPass123!')

  // Ждём debounce
  await page.waitForTimeout(600)

  const error = await page.getByTestId('email-error')

  await expect(error).toBeVisible()
  await expect(error).toHaveText('Email is already taken')

  const submitButton = await page.getByTestId('register-button')
  await expect(submitButton).toBeDisabled()
})
