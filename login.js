const puppet = require('puppeteer')
const CREDS = require('./creds')

async function login() {
  const browser = await puppet.launch({headless: false})
  const page = await browser.newPage()

  await page.goto('https://github.com/login')

  const USERNAME_SELECTOR = '#login_field'
  const PASSWORD_SELECTOR = '#password'
  const BUTTON_SELECTOR = '#login > form > div.auth-form-body.mt-3 > input.btn.btn-primary.btn-block'

  await page.click(USERNAME_SELECTOR)
  await page.type(CREDS.username)

  await page.click(PASSWORD_SELECTOR)
  await page.type(CREDS.password)

  await page.click(BUTTON_SELECTOR)

  await page.waitForNavigation()

  await page.screenshot({ path: 'screenshots/login.png' })
  
  browser.close()
}

login()