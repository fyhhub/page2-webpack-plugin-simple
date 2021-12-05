const puppeteer = require('puppeteer')
const fs = require('fs')
const path = require('path')
const { sleep } = require('./utils')
class Skeleton {
  constructor(options) {
    this.options = options
  }

  async init() {
    // 打开一个浏览器
    this.browser = await puppeteer.launch({
      headless: false
    })
  }

  async newPage() {
    const page = await this.browser.newPage()
    const device = this.options.device
    await page.emulate(puppeteer.devices[device])
    return page
  }

  async makeSkeleton(page) {
    const { defer = 5000 } = this.options
    // 读取脚本内容
    let scriptContent = await fs.readFileSync(path.resolve(__dirname, 'skeletonScript.js'), 'utf-8')

    // 注入脚本
    await page.addScriptTag({ content: scriptContent })
    await sleep(defer)
    await page.evaluate(options => {
      Skeleton.genSkeleton(options)
    }, this.options)
  }

  async genHTML(url) {
    const page = await this.newPage()
    const res = await page.goto(url, { waitUntil: 'networkidle2' })
    if (res && !res.ok()) {
      throw new Error(`${res.status} on ${url}`)
    }
    await this.makeSkeleton(page)
    const { html, styles } = await page.evaluate(() => Skeleton.genHtmlAndStyle())
    let result = `
      <style>${styles.join('\n')}</style>
      ${html}
    `
    return result
  }

  async destroy() {
    if (this.browser) {
      await this.browser.close()
      this.browser = null
    }
  }
}
module.exports = Skeleton