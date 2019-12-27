#!/usr/bin/env node

const _ = require('underscore')
const chalk = require('chalk')
const figlet = require('figlet')
const minimist = require('minimist')
const args = minimist(process.argv.slice(2))
const cmd = require('./cmd/index')
const Exception = require('./lib/errors')

console.log(
  chalk.yellow(
    figlet.textSync(
      'Stdmtrn',
      {
        horizontalLayout: 'full'
      }
    )
  )
)

const run = async () => {
  if (args._.length < 1) {
    cmd.help()
    return
  }

  if (args._[0] === 'help') {
    cmd.help()
    return
  }

  const context = cmd[args._[0]]
  let subArgs = args._.slice(1)
  const kwargs = _.omit(args, '_')

  if (typeof(context) === 'undefined') {
    console.error(
      chalk.red(`Unknown command: ${args._[0]}`)
    )

    return
  }

  let command = null

  if (typeof (context.default) === 'undefined') {
    if (subArgs.length) {
      subArgs = ['help']
    }
  }

  if (subArgs.length) {
    command = context[subArgs[0]]

    if (typeof (command) === 'undefined') {
      command = context.default
    } else {
      subArgs.shift(0)
    }
  } else {
    command = context.default
  }

  if (typeof (command) === 'undefined') {
    console.error(
      chalk.red(`Unrecognized subcommand: ${subArgs[0]}`)
    )

    return
  }

  let result = false

  try {
    result = await command.apply(this, [...subArgs], kwargs)
  } catch (err) {
    if (err instanceof Exception) {
      console.error(
        chalk.red(err.toString())
      )

      process.exit(1)
      return
    }

    throw err
  }

  if (result !== false && result !== null) {
    return
  }

  process.exit(1)
}

run().catch(
  (err) => {
    console.error(err)
  }
)
