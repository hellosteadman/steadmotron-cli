const fs = require('fs')
const path = require('path')
const Builder = require('../lib/builder')
const help = () => {
  console.log('Build a game that can run on Windows, Mac or Linux.')
  console.log('Usage:')
  console.log('    build <dir>: Build the game in the specified or current working directory')
}

const build = (storyDir) => {
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
