#!/usr/bin/env node --harmony

'use strict'
const debug = require('debug')('mdi')
const path = require('path')
const find = require('findit')
const fs = require('fs-extra')
const SVGSpriter = require('svg-sprite')
const File = require('vinyl')
const kgo = require('kgo')
const nodeDir = path.join(__dirname, '/node_modules/material-design-icons')
const argv = require('minimist')(process.argv.slice(2))
const mkdirp = require('mkdirp')
const finder = find(nodeDir)
const xml2js = require('xml2js')
const parser = new xml2js.Parser()
const builder = new xml2js.Builder({headless: true})
const utf8 = require('utf8')

kgo('required', function (done) {
  debug('kgo:required config')
  if (!argv.c && (argv.help || argv._.length === 0)) {
    debug('Required arguments not passed in. Please check the documentation')
    let msg = 'you need a config.json file'
    done(msg)
  }
  let config = require(path.join(process.cwd(), '/', argv.c))
  config.output = (argv.o) ? path.join(process.cwd(), '/', argv.o) : ((config.dest) ? path.join(process.cwd(), '/', config.dest) : path.join(process.cwd(), '/assets'))

  config.tmp = (config.temp) ? path.join(process.cwd(), '/', config.temp) : path.join(process.cwd(), '/temp')

  fs.ensureDir(config.output, function (err) {
    if (err) done(err)
  })
  fs.ensureDir(config.tmp, function (err) {
    if (err) done(err)
    debug(' - done')
    done(null, config)
  })
})('search', ['required'], function (config, done) {
  debug('kgo:search for files')
  let icons = config.mdi
  processIcons(icons, function (err, files) {
    if (err) done(err)

    debug(' - done')
    done(null, files)
  })
})('copy', ['required', 'search'], function (config, files, done) {
  // files.forEach(function (source, index, array) {
  const length = Object.keys(files).length
  const tempFiles = {}
  let i = 1

  for (var source in files) {
    let last = i === length // true if last, false if not last
    // debug('last', last, 'i', i, 'length', length, 'source', source, 'file ', files[source])

    if (!files.hasOwnProperty(source)) {
      debug('hasOwnProperty')
      continue
    }

    let target = path.join(config.tmp, '/', path.basename(source))
    tempFiles[target] = files[source]

    debug('kgo:copy clobbering target file', target)
    fs.copySync(source, target, {clobber: true}, function (err) {
      if (err) done(err)
    })
    // if (index === array.length - 1) {

    if (last) {
      debug(' - done')
      done(null, tempFiles)
    }
    i++
  // })
  }
})('color', ['required', 'copy'], function (config, tempFiles, done) {
  debug('kgo:color')

  fs.walk(config.tmp)
  .on('readable', function () {
    var item
    while ((item = this.read())) {
      if (item.stats.isFile()) {
        let file = item.path
  // const length = Object.keys(tempFiles).length
  // let i = 1
  // for (var file in tempFiles) {
    // let last = i === length // true if last, false if not last
        debug('file: ', file)

    // if (!tempFiles.hasOwnProperty(file)) {
    //   debug('hasOwnProperty')
    //   continue
    // }

        fs.readFile(file, 'utf8', function (err, data) {
          if (err) done(err)

          debug('readFile: ', file)

          parser.parseString(data, function (err, result) {
            if (err) debug(err)
            let svgPath = result.svg.path
            svgPath.forEach(function (svg, index, array) {
              // if (!svg.$.fill) result.svg.path[index].$.fill = config.fill

              debug('file: ', file)
              debug('fill: ', tempFiles[file].fill)

              if (!svg.$.fill) result.svg.path[index].$.fill = tempFiles[file].fill
            })
            let xml = builder.buildObject(result)
            fs.writeFileSync(file, xml, 'utf8')

        // if (last) {
        //   debug(' - done')
        //   done(null, tempFiles)
        // }
        // i++
          })
        })
  // }


      }
    }
  })
  .on('end', function () {
    debug(' - done')
    done(null)
  })
})('sprite', ['required', 'color'], function (config, color, done) {
  debug('kgo:sprite creating sprite')
  const spriter = new SVGSpriter({
    dest: config.output,
    mode: {
      css: {
        render: {
          css: true,
          styl: true
        },
        example: true
      }
    }
  })

  fs.walk(config.tmp)
    .on('readable', function () {
      var item
      while ((item = this.read())) {
        if (item.stats.isFile()) {
          spriter.add(new File({
            path: item.path,                         // Absolute path to the SVG file
            base: config.tmp,                                          // Base path (see `name` argument)
            contents: fs.readFileSync(item.path)     // SVG file contents
          }))
        }
      }
    })
    .on('end', function () {
      spriter.compile(function (err, result, data) {
        if (err) done(err)
        for (var type in result.css) {
          mkdirp.sync(path.dirname(result.css[type].path))
          fs.writeFileSync(result.css[type].path, result.css[type].contents)
        }
      })

      fs.removeSync(config.tmp, function (err) {
        if (err) done(err)
      })

      debug(' - done')
      done(null)
    })
})(['*'], function (err) {
  debug('err: ' + err)
  return
})

function processIcons (icons, callback) {
  // let files = []
  let files = {}
  let fileCheck = {}

  debug('processIcons')
  finder.on('file', function (file, stat) {
    icons.forEach(function (mdi, index, array) {
      let fileName = 'ic_' + mdi.icon + '_' + (mdi.size || '24px') + '.svg'
      if (fileName === path.basename(file) && !fileCheck[fileName]) {
        // files.push(file)
        files[file] = mdi
      } else {
        fileCheck[fileName]
      }
    })
  })
  finder.on('end', function () {
    callback(null, files)
  })
  finder.on('err', function (err) {
    debug('finder err', err)
    callback(err)
  })
}
