const fs = require('fs')
const path = require('path')
const url = require('url')
const mime = require('mime-types')

module.exports = (req) => new Promise(
  (resolve, reject) => {
    const parsed = url.parse(req.url)
    const reqPath = parsed.pathname

    if(reqPath.substr(0, '/static/'.length) == '/static/') {
      const extname = path.extname(reqPath)
      const filename = path.join(
        path.dirname(
          path.dirname(
            path.dirname(__filename)
          )
        ),
        reqPath
      )

      if (!fs.existsSync(filename)) {
        resolve(null)
        return
      }

      fs.readFile(
        filename,
        (err, data) => {
          if(err) {
            reject(err)
            return
          }

          resolve(
            (res) => {
              res.writeHead(
                200,
                {
                  'Content-Type': mime.lookup(extname)
                }
              )

              res.end(data, 'utf-8')
              process.stdout.write('[200]\n')
            }
          )
        }
      )

      return
    }

    resolve(null)
  }
)
