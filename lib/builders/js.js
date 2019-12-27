const path = require('path')
const webpack = require('webpack')
const babel = () => {
  return {
    loader: require.resolve('babel-loader'),
    options: {
      presets: [
        [
          require.resolve('@babel/preset-env'),
          {
            useBuiltIns: 'entry',
            corejs: 2
          }
        ]
      ],
      plugins: [
        require.resolve('@babel/plugin-syntax-dynamic-import'),
        require.resolve('@babel/plugin-syntax-import-meta'),
        require.resolve('@babel/plugin-proposal-class-properties'),
        require.resolve('@babel/plugin-proposal-json-strings'),
        [
          require.resolve('@babel/plugin-proposal-decorators'),
          {
            legacy: true
          }
        ],
        require.resolve('@babel/plugin-proposal-function-sent'),
        require.resolve('@babel/plugin-proposal-export-namespace-from'),
        require.resolve('@babel/plugin-proposal-numeric-separator'),
        require.resolve('@babel/plugin-proposal-throw-expressions')
      ]
    }
  }
}

module.exports = (source, dest) => new Promise(
  (resolve, reject) => {
    const webpackConfig = {
      module: {
        rules: [
          {
            test: /\.m?js$/,
            exclude: /(node_modules|tests)/,
            use: babel()
          }
        ]
      },
      entry: [
        require.resolve('@babel/polyfill'),
        path.resolve(path.join(source, 'story', 'game.js'))
      ],
      output: {
        filename: 'game.js',
        path: dest,
        libraryTarget: 'window',
        library: 'game'
      },
      plugins: [
        new webpack.IgnorePlugin(/readline/)
      ],
      devtool: 'cheap-source-map',
      mode: 'production'
    }

    const compiler = webpack(
      webpackConfig,
      (err, stats) => {
        if (err) {
          console.error(err.stack || err)
          if (err.details) {
            console.error(err.details)
          }

          return
        }

        const info = stats.toJson()

        if (stats.hasErrors()) {
          info.errors.forEach(
            (err) => {
              console.error(err)
            }
          )

          reject(info.errors)
          return
        }

        if (stats.hasWarnings()) {
          info.warnings.forEach(
            (wrn) => {
              console.warn(wrn)
            }
          )
        }

        resolve(
          [
            path.join(dest, 'game.js'),
            path.join(dest, 'game.js.map')
          ]
        )
      }
    )
  }
)
