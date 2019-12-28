const fs = require('fs')
const path = require('path')

module.exports = (source, dest) => new Promise(
  (resolve, reject) => {
    const sourceFilename = path.join(
      path.dirname(path.dirname(path.dirname(__filename))),
      'static',
      'screen.css'
    )

    const destFilename = path.join(dest, 'screen.css')

    fs.readFile(
      sourceFilename,
      (err, data) => {
        if (err) {
          reject(err)
          return
        }

        fs.writeFile(
          destFilename,
          data,
          (err) => {
            if (err) {
              reject(err)
              return
            }

            resolve([destFilename])
          }
        )
      }
    )
  }
)
