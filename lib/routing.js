const url = require('url')
const notFound = require('./views/not-found')
const staticFile = require('./views/static')
let routes = {
  '/': require('./views/index')
}

module.exports = (req, game) => new Promise(
  (resolve, reject) => {
    const urlPath = url.parse(req.url).pathname
    let resolved = false

    const views = Object.keys(routes).filter(
      (path) => {
        const ex = new RegExp('^' + path.replace('/', '\\/') + '$')
        const match = urlPath.match(ex)

        return !!match
      }
    )

    views.forEach(
      (path) => {
        if (resolved) {
          return
        }

        const route = routes[path]
        route(req, game).then(resolve).catch(reject)
        resolved = true
      }
    )

    if (!resolved) {
      staticFile(
        req
      ).then(
        (r) => {
          if (r === null) {
            notFound(req).then(resolve).catch(reject)
          } else {
            resolve(r)
          }
        }
      ).catch(reject)
    }
  }
)

module.exports.addRoute = (path, route) => {
  routes[path] = route
}
