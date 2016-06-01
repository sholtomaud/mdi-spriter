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

kgo('required', function (done) {
  debug('kgo:required config')
  if (!argv.c && (argv.help || argv._.length === 0)) {
    debug('Required arguments not passed in. Please check the documentation')
    let msg = 'you need a config.json file'
    done(msg)
  }
  let config = require(path.join(process.cwd(), '/', argv.c))
  done(null, config)
})('search', ['required'], function (config, done) {
  debug('kgo:search for files')
  let icons = config.mdi
  processIcons(icons, function (error, files) {
    if (error) done(error)

    done(null, files)
  })
})('mkdir', ['required', 'search'], function (config, files, done) {
  debug('kgo:mkdir')
  let tmpDirs = config.tempDirs
  let objCount = 0
  let size = Object.keys(tmpDirs).length

  for (var dir in tmpDirs) {
    objCount++
    let tmpDir = path.join(__dirname, tmpDirs[dir])
    fs.emptyDirSync(tmpDir, function (err) {
      if (err) { done(err) }
      debug('kgo:mkdir clean dir created ', dir)
    })
    if (objCount === size) {
      done(null, files)
    }
  }
})('copy', ['required', 'mkdir'], function (config, files, done) {
  var tmpDirs = config.tempDirs
  files.forEach(function (source, index, array) {
    var target = path.join(tmpDirs.temp, '/', path.basename(source))
    debug('kgo:copy clobbering target file', target)
    fs.copySync(source, target, {clobber: true}, function (err) {
      if (err) debug('copy error', err)
    })

    if (index === array.length - 1) {
      debug('done copy', array.length, index)
      done(null, tmpDirs)
    }
  })
})('sprite', ['required', 'copy'], function (config, tmpDirs, done) {
  var temp = path.join(__dirname, tmpDirs.temp)
  debug('kgo:sprite creating sprite')
  const spriter = new SVGSpriter({
    dest: argv.o || config.dest,
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

  fs.walk(temp)
    .on('readable', function () {
      var item
      while ((item = this.read())) {
        if (item.stats.isFile()) {
          spriter.add(new File({
            path: item.path,                         // Absolute path to the SVG file
            base: temp,                                          // Base path (see `name` argument)
            contents: fs.readFileSync(item.path)     // SVG file contents
          }))
        }
      }
    })
    .on('end', function () {
      spriter.compile(function (error, result, data) {
        if (error) done(error)
        for (var type in result.css) {
          mkdirp.sync(path.dirname(result.css[type].path))
          fs.writeFileSync(result.css[type].path, result.css[type].contents)
        }
      })
      debug('kgo:sprite done')
      done(null)
    })
})(['*'], function (err) {
  debug('Error: ' + err)
  return
})

function processIcons (icons, callback) {
  let files = []
  debug('processIcons')
  finder.on('file', function (file, stat) {
    icons.forEach(function (mdi, index, array) {
      let fileName = 'ic_' + mdi.icon + '_' + (mdi.size || '24px') + '.svg'
      if (fileName === path.basename(file)) {
        files.push(file)
      }
    })
  })
  finder.on('end', function () {
    debug('processIcons end. Files')
    callback(null, files)
  })
  finder.on('error', function (err) {
    debug('finder err', err)
    callback(err)
  })
}
