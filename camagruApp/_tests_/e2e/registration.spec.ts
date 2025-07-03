import { test, expect } from '@playwright/test'

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

// test('all signin flow', async ({ page, request }) => {
//   await request.post('http://localhost:3001/api/auth/register', {
//     data: {
//       email: 'user@example.com',
//       username: 'username',
//       password: 'ValidPass123!',
//     },
//     headers: { 'Content-Type': 'application/json' },
//   })

//   await request.post('http://localhost:3001/api/test/verify-email', {
//     data: { email: 'user@example.com' },
//     headers: { 'Content-Type': 'application/json' },
//   })

//   await page.goto('/auth/signin')

//   await page.getByPlaceholder('Username').fill('username')
//   await page.getByPlaceholder('Password').fill('ValidPass123!')

//   const submitButton = await page.getByTestId('signin-button')
//   await expect(submitButton).not.toBeDisabled()
//   await submitButton.click()

//   await page.waitForURL('**/user/')
//   await expect(page.getByText('username')).toBeVisible()
// })
