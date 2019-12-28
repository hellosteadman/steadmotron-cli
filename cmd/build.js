const fs = require('fs')
const path = require('path')
const Builder = require('../lib/builder')
const Exception = require('../lib/errors')

const help = () => {
  console.log('Build a game that can run in the browser.')
  console.log('Usage:')
  console.log('    build <dir>: Build the game in the specified or current working directory')
}

const build = (storyDir) => {
  const dir = storyDir ? path.resolve(storyDir) : process.cwd()

  if (!fs.existsSync(dir)) {
    throw new Exception(
      {
        message: `Unable to load story module from directory ${dir}`
      }
    )
  }

  new Builder(dir).build().catch(
    (err) => {
      console.error(err)
    }
  )
}

module.exports = {
  help: help,
  default: build
}
