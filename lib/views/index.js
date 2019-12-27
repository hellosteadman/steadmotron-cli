const fs = require('fs')
const Handlebars = require('handlebars')
const path = require('path')

module.exports = (req, game) => new Promise(
  (resolve, reject) => {
    const filename = path.join(
      path.dirname(path.dirname(__filename)),
      'templates',
      'index.hbs'
    )

    fs.readFile(filename,
      (err, data) => {
        if (err) {
          reject(err)
          return
        }

        let template = null
        let html = null

        try {
          template = Handlebars.compile(data.toString())
          html = template(
            {
              game: game
            }
          )
        } catch (errr) {
          reject(errr)
          return
        }

        resolve(
          (res) => {
            res.writeHead(
                200,
                {
                    'Content-Type': 'text/html'
                }
            )

            res.write(html)
            res.end()
            process.stdout.write('[200]\n')
          }
        )
      }
    )
  }
)
