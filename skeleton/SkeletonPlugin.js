const PLUGIN_NAME = 'SkeletonPlugin'
const Server = require('./Server')
const Skeleton = require('./Skeleton')
const path = require('path')
const fs = require('fs')
class SkeletonPlugin {
  constructor(options) {
    this.options = options
  }
  apply(compiler) {
    compiler.hooks.done.tap(PLUGIN_NAME, async () => {
      await this.startServer()
      this.skeleton = new Skeleton(this.options)
      await this.skeleton.init()
      const skeletonHTML = await this.skeleton.genHTML(this.options.origin)
      const originPath = path.resolve(this.options.staticDir, 'index.html')
      let originHTML = await fs.readFileSync(originPath, 'utf-8')
      originHTML = originHTML.replace('<!-- shell -->', skeletonHTML)
      fs.writeFileSync(originHTML)
      await this.skeleton.destroy()
      await this.server.close()
    })
  }

  async startServer() {
    this.server = new Server(this.options)
    await this.server.listen()
  }
}

module.exports = SkeletonPlugin