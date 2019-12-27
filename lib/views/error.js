const fs = require('fs')
const Handlebars = require('handlebars')
const path = require('path')

module.exports = (req, err) => new Promise(
  (resolve, reject) => {
    const filename = path.join(
      path.dirname(path.dirname(__filename)),
      'templates',
      '500.hbs'
    )

    fs.readFile(filename,
      (errr, data) => {
        if (errr) {
          reject(errr)
          return
        }

        let template = null
        let html = null

        try {
          template = Handlebars.compile(data.toString())
          html = template()
        } catch (errr) {
          reject(errr)
          return
        }

        resolve(
          (res) => {
            res.writeHead(
                500,
                {
                    'Content-Type': 'text/html'
                }
            )

            res.write(html)
            res.end()
            process.stdout.write('[500]\n')
            console.error(err)
          }
        )
      }
    )
  }
)
