const fs = require('fs')
const path = require('path')
const Exception = require('../lib/errors')
const help = () => {
  console.log('Play-test a game in a web browser.')
  console.log('Usage:')
  console.log('    serve <dir>: Serve the game from the specified or current working directory')
}

const server = require('../lib/server')
const serve = (storyDir) => {
  const dir = path.join(
    storyDir ? path.resolve(storyDir) : process.cwd()
  )

  if (!fs.existsSync(dir)) {
    throw new Exception(
      {
        message: `Unable to load story module from directory ${dir}`
      }
    )
  }

  server(dir)
}

module.exports = {
  help: help,
  default: serve
}
