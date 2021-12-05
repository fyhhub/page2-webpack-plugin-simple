const express = require('express')
const http = require('http')
class Server {
  constructor(options) {
    this.options = options
  }
  async listen() {
    const app = this.app = express()
    app.use(express.static(this.options.static))
    this.httpServer = http.createServer(app)
    return new Promise(resolve => {
      this.httpServer.listen(this.options.port, () => {
        console.log(this.options.origin);
        resolve()
      })
    })
  }
  async close() {
    return new Promise(resolve => {
      this.httpServer.close(this.options.port, () => {
        console.log('关闭服务');
        resolve()
      })
    })
  }
}
module.exports = Server