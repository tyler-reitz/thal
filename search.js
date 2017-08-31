const puppet = require('puppeteer')
const CREDS = require('./creds')

const USERNAME_SELECTOR = '#login_field'
const PASSWORD_SELECTOR = '#password'
const SUBMIT_SELECTOR = '#login > form > div.auth-form-body.mt-3 > input.btn.btn-primary.btn-block'

let userToSearch = 'John'
let searchURL = 'https://github.com/search?q=' + userToSearch + '&type=Users&utf8=%E2%9C%93'

let LENGTH_SELECTOR_CLASS = '.user-list-item'

async function search() {
  const browser = await puppet.launch({ headless: false })
  const page = await browser.newPage()
  
  await page.setViewport({
    width: 1280,
    height: 800
  })

  await page.goto('https://github.com/login')

  // Login
  await page.click(USERNAME_SELECTOR)
  await page.type(CREDS.username)

  await page.click(PASSWORD_SELECTOR)
  await page.type(CREDS.password)

  await page.click(SUBMIT_SELECTOR)

  // Results
  await page.waitForNavigation()

  await page.goto(searchURL)
  await page.waitFor(2 * 1000)
  
  await page.screenshot({ path: 'screenshots/search-results.png' })

  // Scrape
  let LIST_USERNAME_SELECTOR = '#user_search_results > div.user-list > div:nth-child(INDEX) > div.d-flex > div > a'
  let LIST_EMAIL_SELECTOR = '#user_search_results > div.user-list > div:nth-child(INDEX) > div.d-flex > div > ul > li:nth-child(2) > a'
  let LENGTH_SELECTOR_CLASS = 'user-list-item'

  // console.log(LENGTH_SELECTOR_CLASS)

  let listLength = await page.evaluate(sel => {
    return document.getElementsByClassName(sel).length
  }, LENGTH_SELECTOR_CLASS)

  // console.log(listLength)

  for (let i = 1; i <= listLength; i++) {
    let usernameSelector = LIST_USERNAME_SELECTOR.replace('INDEX', i)
    let emailSelector = LIST_EMAIL_SELECTOR.replace('INDEX', i)

    // console.log(usernameSelector)
    // console.log(emailSelector)
   
    let username = await page.evaluate(sel => {
      return document.querySelector(sel).getAttribute('href').replace('/', '')
    }, usernameSelector)

    let email = await page.evaluate(sel => {
      let element = document.querySelector(sel)
      return element ? element.innerHTML : null
    }, emailSelector)

    if (!email)
      continue

    console.log(username, ' -> ', email)
    
  }

  browser.close()
}

search()
