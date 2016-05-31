
var minimistOptions = {
  alias: {
    help: 'h'
  }
}

var argv = minimist(process.argv.slice(2), minimistOptions)



'use strict'

const path = require('path')
const find = require('findit')


// console.log(path.join(__dirname, '/node_modules/material-design-icons'))

var finder = find(path.join(__dirname, '/node_modules/material-design-icons'))
module.exports = function (options) {
  let files = []

  options.icons.forEach(function (mdi) {
    let fileName = mdi.icon + '_' + (mdi.size || '24px') + '.svg'
    finder.on('file', function (file, stat) {
      if (fileName === path.basename(file)) files.push(fileName)
    }
  })

}
  // const finder = require('findit')(path.join(config.homeDir, '/node_modules/material-design-icons') || process.argv[2] || './node_modules/material-design-icons')
  //
  // config.icons.forEach(function (icon) {

  //
// finder.find(fileName)
  //
finder.on('file', function (file, stat) {
  if (fileName === path.basename(file)) console.log(file, '\nbirthtime: \n', stat.birthtime)
})


  // })
