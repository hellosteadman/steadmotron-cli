const path = require('path')

builders = {
  js: require('./builders/js'),
  css: require('./builders/css'),
  fonts: require('./builders/fonts'),
  html: require('./builders/html')
}

module.exports = class Builder {
  constructor(dir) {
    this.dir = dir

    this.build = (elements, outdir) => {
      if (typeof (elements) === 'undefined') {
        elements = ['js', 'fonts', 'css', 'html']
      }

      return new Promise(
        (resolve, reject) => {
          const dest = outdir ? path.resolve(outdir) : path.resolve(path.join(this.dir, 'build'))
          let builderFuncs = []
          let outputs = []

          const nextBuilder = () => {
            if (builderFuncs.length) {
              const func = builderFuncs.shift()
              const promise = func(dir, dest)

              promise.then(
                (o) => {
                  o.forEach(
                    (u) => {
                      console.log(path.basename(u))
                      outputs.push(u)
                    }
                  )

                  nextBuilder()
                }
              ).catch(
                (err) => {
                  reject(err)
                }
              )
            } else {
              resolve(outputs)
            }
          }

          try {
            elements.forEach(
              (name) => {
                const builder = builders[name]

                if (typeof (builder) === 'undefined') {
                  throw new Error(
                    `No builder found with name '${name}'`
                  )
                }

                builderFuncs.push(builder)
              }
            )
          } catch (err) {
            reject(err)
            return
          }

          if (builderFuncs.length) {
            nextBuilder()
          }
        }
      )
    }
  }
}
