async function sleep(defer) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve()
    }, defer)
  })
}

module.exports = {
  sleep
}