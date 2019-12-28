const fs = require('fs')
const path = require('path')

module.exports = (source, dest) => new Promise(
  (resolve, reject) => {
    let sourceFilenames = [
      path.join(
        path.dirname(path.dirname(path.dirname(__filename))),
        'static',
        'screen.woff'
      ),
      path.join(
        path.dirname(path.dirname(path.dirname(__filename))),
        'static',
        'screen.woff2'
      )
    ]

    let destFilenames = []

    const nextFile = () => {
      if (sourceFilenames.length) {
        const filename = sourceFilenames.shift()

        fs.readFile(
          filename,
          (err, data) => {
            if (err) {
              reject(err)
              return
            }

            const destFilename = path.join(dest, path.basename(filename))

            fs.writeFile(
              destFilename,
              data,
              (err) => {
                if (err) {
                  reject(err)
                } else {
                  destFilenames.push(destFilename)
                  nextFile()
                }
              }
            )
          }
        )
      } else {
        resolve(destFilenames)
      }
    }

    nextFile()
  }
)
