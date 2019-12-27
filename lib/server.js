const chalk = require('chalk')
const chokidar = require('chokidar')
const fs = require('fs')
const http = require('http')
const path = require('path')
const url = require('url')
const Builder = require('./builder')
const tmp = require('tmp')

const error = require('./views/error')
const routing = require('./routing')

module.exports = (dir) => {
  const watcher = chokidar.watch(
    dir,
    {
      ignored: /^\./,
      persistent: true
    }
  )

  let game = null

  const server = http.createServer(
    (req, res) => {
      process.stdout.write(
        `${req.method} ` + url.parse(req.url).pathname + ' '
      )

      try {
        routing(req, game).then(
          (response) => response(res)
        )
      } catch (err) {
        error(req).then(
          (response) => response(res)
        )
      }
    }
  )

  const reload = () => {
    server.close()

    try {
      game = require(path.join(dir, 'story', 'game'))
    } catch (err) {
      console.error('Error loading game:')
      console.error(err)
      return
    }

    server.listen(8000)
    console.info('Play-test server now listening at http://0.0.0.0:8000/')
  }

  routing.addRoute(
    '/game\.js',
    (req) => new Promise(
      (resolve, reject) => {
        const builder = new Builder(dir)

        tmp.dir(
          (err, tempDir, cleanup) => {
            builder.build(['js'], tempDir).then(
              (filenames) => {
                fs.readFile(
                  filenames[0],
                  (errr, data) => {
                    if(errr) {
                      reject(errr)
                      return
                    }

                    resolve(
                      (res) => {
                        res.writeHead(
                          200,
                          {
                            'Content-Type': 'text/javascript'
                          }
                        )

                        res.end(data, 'utf-8')
                        process.stdout.write('[200]\n')
                        cleanup()
                      }
                    )
                  }
                )
              }
            ).catch(
              (err) => {
                error(req, err).then(resolve).catch(reject)
              }
            )
          }
        )
      }
    )
  )

  watcher.on('change',
    () => {
      console.info('Reloading development server')
      reload()
    }
  ).on('unlink',
    () => {
      console.info('Reloading development server')
      reload()
    }
  ).on('error',
    (err) => {
      console.warn(err)
    }
  )

  console.info()
  console.info(`Watching ${dir} for changes`)
  reload()
  return server
}
