var fs = require('fs')
var path = require('path')

fs.appendFile(
  path.resolve(__dirname, 'log.md'),
  `fetch data at ${new Date()} \n`,
  'utf8',
  (err) => {
    if (err) {
      return console.error(err)
    }
  }
)
