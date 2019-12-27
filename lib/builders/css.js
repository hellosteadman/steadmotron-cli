const fs = require('fs')
const path = require('path')

module.exports = (source, dest) => new Promise(
  (resolve, reject) => {
    const sourceFilename = path.join(
      path.dirname(path.dirname(path.dirname(__filename))),
      'static',
      'screen.css'
    )

    const fontsFilename = path.join(
      path.dirname(path.dirname(path.dirname(__filename))),
      'static',
      'fonts',
      'stylesheet.css'
    )

    const destFilename = path.join(
      dest,
      'screen.css'
    )

    fs.readFile(
      sourceFilename,
      (err, data) => {
        if (err) {
          reject(err)
          return
        }

        let content = '/*screen.css*/\n' + data.toString()

        fs.readFile(
          fontsFilename,
          (err, data) => {
            if (err) {
              reject(err)
              return
            }

            content += '\n\n/*fonts.css*/\n' + data.toString()

            fs.writeFile(
              destFilename,
              content,
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
  }
)
