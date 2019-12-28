const fs = require('fs')
const path = require('path')
const Handlebars = require('handlebars')

module.exports = (source, dest) => new Promise(
  (resolve, reject) => {
    const sourceFilename = path.join(
      path.dirname(path.dirname(__filename)),
      'templates',
      'screen.hbs'
    )

    const destFilename = path.join(
      dest,
      'index.html'
    )

    fs.readFile(
      sourceFilename,
      (err, data) => {
        if (err) {
          reject(err)
          return
        }

        const template = Handlebars.compile(data.toString())
        const html = template(
          {
            STATIC_URL: './'
          }
        )

        fs.writeFile(
          destFilename,
          html,
          (err) => {
            if (err) {
              reject(err)
            } else {
              resolve([destFilename])
            }
          }
        )
      }
    )
  }
)
