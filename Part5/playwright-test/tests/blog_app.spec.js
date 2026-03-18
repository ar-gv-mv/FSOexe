// @ts-check
const {createBlog, loginWith} = require('./helper')
const { test, expect } = require('@playwright/test')

test.describe('Blog app', () => {
  test.beforeEach(async ({ page, request }) => {
    await request.post('http://127.0.0.1:3003/api/testing/reset')
    await request.post('http://127.0.0.1:3003/api/users', {
      data: {
        username: 'Testik',
        name: 'Testikovich',
        password: 'passwordTest'
      }
    })
    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    const locator = await page.getByText('Log in to application')
    await expect(locator).toBeVisible()
  })

  test.describe('Login', () => {

    test('succeeds with correct credentials', async ({ page }) => {
      await page.getByTestId('username').fill('Testik')
      await page.getByTestId('password').fill('passwordTest')
      await page.getByRole('button', { name: 'login' }).click()
      await expect(page.getByText('logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await page.getByTestId('username').fill('wrongTestik')
      await page.getByTestId('password').fill('wrongPasswordTest')
      await page.getByRole('button', { name: 'login' }).click()
      await expect(page.getByText('Wrong username or password')).toBeVisible()
    })
  })

  test.describe('When logged in', () => {
    test.beforeEach(async ({ page }) => {
      await page.getByTestId('username').fill('Testik')
      await page.getByTestId('password').fill('passwordTest')
      await page.getByRole('button', { name: 'login' }).click()
    })

    test('a new blog can be created', async ({ page }) => {
      await page.getByRole('button', { name: 'new blog' }).click()
      await page.getByTestId('title').fill('The Test')
      await page.getByTestId('author').fill('Testikovich')
      await page.getByTestId('url').fill('testikovich.com')
      await page.getByRole('button', { name: 'Create' }).click()
      await expect(page.getByText('The Test').last()).toBeVisible()
    })

    test('a blog can be liked', async ({ page }) => {
      await page.getByRole('button', { name: 'new blog' }).click()
      await page.getByTestId('title').fill('Testik like')
      await page.getByTestId('author').fill('Tester')
      await page.getByTestId('url').fill('like.com')
      await page.getByRole('button', { name: 'Create' }).click()

      const blog = page.getByTestId('blog').filter({ hasText: 'Testik like Tester' }).first()
      await blog.waitFor()
      await blog.getByRole('button', { name: 'View' }).click()


      await expect(blog.getByText(/likes\s+\d+/)).toBeVisible()
      await blog.getByRole('button', { name: 'Like' }).click()
      await expect(blog.getByText('likes 1')).toBeVisible()
    })

    test('creator can delete a blog', async ({ page }) => {
      await page.getByRole('button', { name: 'new blog' }).click()
      await page.getByTestId('title').fill('Testik delete')
      await page.getByTestId('author').fill('Tester')
      await page.getByTestId('url').fill('delete.com')
      await page.getByRole('button', { name: 'Create' }).click()

      const blog = page.getByTestId('blog').filter({ hasText: 'Testik delete' })
      await blog.waitFor()
      await blog.getByRole('button', { name: 'View' }).click()
      page.once('dialog', dialog => dialog.accept())
      await blog.getByRole('button', { name: 'remove' }).click()
      await expect(page.getByTestId('blog').filter({ hasText: 'Testik delete' })).toHaveCount(0)
    })

    test('only creator sees remove button', async ({ page, request }) => {
      await page.getByRole('button', { name: 'new blog' }).click()
      await page.getByTestId('title').fill('Owner delete')
      await page.getByTestId('author').fill('Owner')
      await page.getByTestId('url').fill('owner.com')
      await page.getByRole('button', { name: 'Create' }).click()
      const blog = page.getByTestId('blog').filter({ hasText: 'Owner delete' }).first()
      await blog.waitFor()

      await request.post('http://localhost:3003/api/users', {
        data: { username: 'Other', name: 'OtherUser', password: 'otherPass' }
      })

      await page.getByRole('button', { name: 'Logout' }).click()

      await page.getByTestId('username').fill('Other')
      await page.getByTestId('password').fill('otherPass')
      await page.getByRole('button', { name: 'login' }).click()
      await expect(page.getByText('logged in')).toBeVisible()

      await blog.waitFor()
      await blog.getByRole('button', { name: 'View' }).click()
      await expect(blog.getByRole('button', { name: 'remove' })).toHaveCount(0)
    })

    test('blogs are ordered by likes', async ({ page }) => {
      const make = async (title) => {
        await page.getByRole('button', { name: 'new blog' }).click()
        await page.getByTestId('title').fill(title)
        await page.getByTestId('author').fill('Tester')
        await page.getByTestId('url').fill('x.com')
        await page.getByRole('button', { name: 'Create' }).click()
        await page.getByTestId('blog').filter({ hasText: title }).first().waitFor()
      }

      await make('Blog A')
      await make('Blog B')
      await make('Blog C')

      const likeBlog = async (title, times) => {
        const blog = page.getByTestId('blog').filter({ hasText: title }).first()
        await blog.getByRole('button', { name: 'View' }).click()
        const likeBtn = blog.getByRole('button', { name: 'Like' })
        for (let i = 0; i < times; i++) {
          await likeBtn.click()
        }
        await blog.getByRole('button', { name: 'Hide' }).click()
      }

      await likeBlog('Blog C', 3)
      await likeBlog('Blog A', 2)
      await likeBlog('Blog B', 1)

      const blogs = (await page.getByTestId('blog').allTextContents()).slice(0, 3)
      expect(blogs[0]).toContain('Blog C')
      expect(blogs[1]).toContain('Blog A')
      expect(blogs[2]).toContain('Blog B')
    })

  })
})
