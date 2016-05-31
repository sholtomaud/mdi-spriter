#!/usr/bin/env node --harmony
const mdil = require('./')
const spawn = require('child_process').spawn
const minimist = require('minimist')
const package = require('./package.json')

var minimistOptions = {
  alias: {
    help: 'h'
  }
}

var argv = minimist(process.argv.slice(2), minimistOptions)

if (argv.help || argv._.length === 0) {
  console.log("Please check the documentation at ",package.repository.url)
}

var component = argv._[0]
var path = __dirname + '/node_modules/bionode-' + component + '/cli.js'
var args = argv._.slice(1)
var cli = spawn(path, args)

cli.stdout.pipe(process.stdout)
cli.stderr.pipe(process.stderr)

if (argv._[argv._.length - 1] === '-') {
  process.stdin.pipe(cli.stdin)
} else {
  cli.stdin.end()
