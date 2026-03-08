import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/')
  await page.evaluate(() => localStorage.clear())
  await page.reload()
})

// ---------------------------------------------------------------------------
// Flow 1 — Add Transaction
// ---------------------------------------------------------------------------

test.describe('Add Transaction', () => {
  test('income item appears in list and income summary updates', async ({ page }) => {
    // Switch to Income type
    await page.getByRole('button', { name: 'Income' }).first().click()

    await page.locator('#amount').fill('500')
    await page.locator('#description').fill('Test Income')
    await page.getByRole('button', { name: 'Add Transaction' }).click()

    await expect(page.locator('li').filter({ hasText: 'Test Income' })).toBeVisible()
    // Income summary should reflect the new item (5200 + 500 = 5700)
    await expect(page.getByText('$5700.00')).toBeVisible()
  })

  test('expense item (default type) appears in list', async ({ page }) => {
    await page.locator('#amount').fill('75')
    await page.locator('#description').fill('Test Expense')
    await page.getByRole('button', { name: 'Add Transaction' }).click()

    await expect(page.locator('li').filter({ hasText: 'Test Expense' })).toBeVisible()
  })

  test('savings item appears in list after changing category select', async ({ page }) => {
    // Expense type is default; change category to Savings
    await page.locator('#category').selectOption('savings')
    await page.locator('#amount').fill('200')
    await page.locator('#description').fill('Test Savings')
    await page.getByRole('button', { name: 'Add Transaction' }).click()

    await expect(page.locator('li').filter({ hasText: 'Test Savings' })).toBeVisible()
  })

  test('form fields clear after submission', async ({ page }) => {
    await page.locator('#amount').fill('100')
    await page.locator('#description').fill('Clear Test')
    await page.getByRole('button', { name: 'Add Transaction' }).click()

    await expect(page.locator('#description')).toHaveValue('')
    await expect(page.locator('#amount')).toHaveValue('')
  })
})

// ---------------------------------------------------------------------------
// Flow 2 — Delete Transaction
// ---------------------------------------------------------------------------

test.describe('Delete Transaction', () => {
  test('item is removed from list after delete', async ({ page }) => {
    const row = page.locator('li').filter({ hasText: 'Groceries' })
    await row.hover()
    await page.getByRole('button', { name: 'Delete Groceries' }).click()

    await expect(row).not.toBeVisible()
  })

  test('summary balance updates correctly after deletion', async ({ page }) => {
    // Delete Rent (expense, $1500) → balance goes from $2300 to $3800
    const row = page.locator('li').filter({ hasText: 'Rent' })
    await row.hover()
    await page.getByRole('button', { name: 'Delete Rent' }).click()

    await expect(page.getByText('$3800.00')).toBeVisible()
  })

  test('deleting all 7 items shows empty state', async ({ page }) => {
    const descriptions = [
      'Monthly Salary',
      'Freelance Project',
      'Rent',
      'Groceries',
      'Utilities',
      'Retirement Fund',
      'Emergency Fund',
    ]
    for (const desc of descriptions) {
      const row = page.locator('li').filter({ hasText: desc })
      await row.hover()
      await page.getByRole('button', { name: `Delete ${desc}` }).click()
    }

    await expect(page.getByText('No transactions yet')).toBeVisible()
  })
})

// ---------------------------------------------------------------------------
// Flow 3 — Edit Transaction
// ---------------------------------------------------------------------------

test.describe('Edit Transaction', () => {
  test('modal opens pre-filled with item data', async ({ page }) => {
    const row = page.locator('li').filter({ hasText: 'Groceries' })
    await row.hover()
    await page.getByRole('button', { name: 'Edit Groceries' }).click()

    await expect(page.locator('#edit-amount')).toHaveValue('400')
    await expect(page.locator('#edit-description')).toHaveValue('Groceries')
  })

  test('changed values appear in list after Save', async ({ page }) => {
    const row = page.locator('li').filter({ hasText: 'Groceries' })
    await row.hover()
    await page.getByRole('button', { name: 'Edit Groceries' }).click()

    await page.locator('#edit-amount').fill('450')
    await page.locator('#edit-description').fill('Groceries Updated')
    await page.getByRole('button', { name: 'Save Changes' }).click()

    await expect(page.locator('li').filter({ hasText: 'Groceries Updated' })).toBeVisible()
    await expect(page.locator('li').filter({ hasText: 'Groceries Updated' }).getByText('$450.00', { exact: false })).toBeVisible()
  })

  test('Cancel closes modal without saving changes', async ({ page }) => {
    const row = page.locator('li').filter({ hasText: 'Groceries' })
    await row.hover()
    await page.getByRole('button', { name: 'Edit Groceries' }).click()

    await page.locator('#edit-description').fill('Should Not Save')
    await page.getByRole('button', { name: 'Cancel' }).click()

    await expect(page.locator('#edit-description')).not.toBeVisible()
    await expect(page.locator('li').filter({ hasText: 'Groceries' })).toBeVisible()
    await expect(page.locator('li').filter({ hasText: 'Should Not Save' })).not.toBeVisible()
  })

  test('ESC key closes modal without saving changes', async ({ page }) => {
    const row = page.locator('li').filter({ hasText: 'Groceries' })
    await row.hover()
    await page.getByRole('button', { name: 'Edit Groceries' }).click()

    await page.locator('#edit-description').fill('Should Not Save')
    await page.keyboard.press('Escape')

    await expect(page.locator('#edit-description')).not.toBeVisible()
    await expect(page.locator('li').filter({ hasText: 'Groceries' })).toBeVisible()
  })
})
