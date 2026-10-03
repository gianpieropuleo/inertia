import { expect, test } from '@playwright/test'
import { scrollElementTo } from './support'

declare const process: { env: { PACKAGE?: string } }

test('restores a scroll region when going back before deferred props load', async ({ page }) => {
  test.skip(process.env.PACKAGE !== 'react', 'React-only reproduction')

  await page.goto('/scroll-region-deferred-back')
  await page.getByText('Article 3', { exact: true }).click()
  await expect(page.getByText('Selected: 1')).toBeVisible()

  await scrollElementTo(
    page,
    page.evaluate(() => document.querySelector('#grid')?.scrollTo(0, 3000)),
  )
  await expect.poll(() => page.evaluate(() => window.history.state?.scrollRegions?.[0]?.top)).toBe(3000)

  await page.getByRole('link', { name: 'New article' }).click()
  await expect(page).toHaveURL('/scroll-region-deferred-back/create')
  await expect(page.getByText('Loading options...')).toBeVisible()

  // Go back while the deferred props request is still in flight.
  await page.goBack()
  await expect(page).toHaveURL('/scroll-region-deferred-back')
  await expect(page.getByText('Selected: 1')).toBeVisible()

  await expect.poll(() => page.locator('#grid').evaluate((element) => element.scrollTop)).toBe(3000)
  expect(await page.evaluate(() => window.history.state?.scrollRegions)).toEqual([{ top: 3000, left: 0 }])
})
