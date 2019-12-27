const path = require('path')
const Exception = require('../lib/errors')
const help = () => {
  console.log('Play-test a game in the CLI.')
  console.log('Usage:')
  console.log('    play <dir>: Play the game from the specified or current working directory')
}

const play = (storyDir) => {
  const dir = path.join(
    storyDir ? path.resolve(storyDir) : process.cwd(),
    'story',
    'game'
  )

  let game = null

  try {
    game = require(dir)
  } catch (err) {
    throw new Exception(
      {
        message: `Unable to load story module from directory ${dir}`
      }
    )
  }

  game.play('cli')
}

module.exports = {
  help: help,
  default: play
}
