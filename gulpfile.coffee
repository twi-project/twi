'use strict'

# Common plugins
gulp = require 'gulp'
gutil = require 'gulp-util'
gulpif = require 'gulp-if'
plumber = require 'gulp-plumber'
clean = require 'gulp-rimraf'
rimraf = require 'rimraf'
newer = require 'gulp-newer'
livereload = require 'gulp-livereload'

# Stylus plugins
stylus = require 'gulp-stylus'
csso = require 'gulp-csso'
autoprefixer = require 'gulp-autoprefixer'

# JS plugins
coffee = require 'gulp-coffee'
uglify = require 'gulp-uglify'
browserify = require 'browserify'
source = require 'vinyl-source-stream' # For rename js bundle
vinylBuffer = require 'vinyl-buffer' # For gulp-uglify
vueify = require 'gulp-vueify'

# SVG
svgmin = require 'gulp-svgmin'

# Grid system
jeet = require 'jeet'

# Breakpoint system
rupture = require 'rupture'

__ROOT__ = __dirname
COMPONENTS_SRC = __ROOT__ + '/frontend/components'
COFFEE_SRC = __ROOT__ + '/frontend/coffee'
COFFEE_DEST = __ROOT__ + '/public/assets/js'
COFFEE_TMP = __ROOT__ + '/frontend/gulp-runtime'
STYLUS_SRC = __ROOT__ + '/frontend/stylus'
STYLUS_DEST = __ROOT__ + '/public/assets/css'

# Is devel task running?
bIsDevel = no

###
# SIGINT signal listener
# -
# Clean frontend/gulp-runtime before exit if devel task has been running
###
process.on 'SIGINT', ->
  if bIsDevel
    rimraf COFFEE_TMP, ->
      process.exit 0
    return
  process.exit 0

###
# Error Handler
# -
# @param Error err
###
errorHandler = (err) ->
  gutil.log do err.toString
  unless bIsDevel
    process.exit 1

###
# Build Stylus
###
gulp.task 'stylus', ->
  gulp.src [
      STYLUS_SRC + '/common/common.styl'
      STYLUS_SRC + '/404.styl'
    ]
    .pipe newer STYLUS_SRC + '/**/*.styl'
    .pipe plumber errorHandler
    .pipe gulpif bIsDevel, newer STYLUS_SRC + '/**/*.styl'
    .pipe stylus use: [
      do jeet
      do rupture
    ]
    .pipe autoprefixer browsers: ['last 4 versions']
    .pipe gulpif not bIsDevel, do csso # Compress CSS only for production
    .pipe gulp.dest STYLUS_DEST
    .pipe gulpif bIsDevel, do livereload

###
# Compile CoffeeScript
# Note: Do not use this task directly.
###
gulp.task 'coffee:compile', ->
  gulp.src COFFEE_SRC + '/*.coffee'
    .pipe plumber errorHandler
    .pipe gulpif bIsDevel, newer COFFEE_SRC + '/*.coffee'
    .pipe do coffee
    .pipe gulp.dest COFFEE_TMP

###
# Compile Vue.js components
# Note: Do not use this task directly.
###
gulp.task 'vuefy', ->
  gulp.src COMPONENTS_SRC + '/*.vue'
    .pipe newer COMPONENTS_SRC + '/*.vue'
    .pipe do vueify
    .pipe gulp.dest COFFEE_TMP + '/components'

###
# Build CoffeeScript with Browserify
# Note: Do not use this task directly.
###
gulp.task 'coffee', ['vuefy', 'coffee:compile'], ->
  browserify COFFEE_TMP + '/main.js',
    insertGlobals: yes
    debug: bIsDevel
  .bundle()
  .pipe plumber errorHandler
  .pipe source 'common.js'
  .pipe do vinylBuffer
  .pipe gulpif not bIsDevel, do uglify # Optimize JS for production
  .pipe gulp.dest __ROOT__ + '/public/assets/js'
  .pipe gulpif bIsDevel, do livereload

###
# Optimizing SVG.
###
gulp.task 'svg', ->
  gulp.src __ROOT__ + '/frontend/svg/**/*.svg'
    .pipe plumber errorHandler
    .pipe do svgmin
    .pipe gulp.dest __ROOT__ + '/public/img'
    # .pipe gulpif bIsDevel, do livereload

###
# Refreshing page with livereload
# Note: Do not use this task directly.
###
gulp.task 'refresh', ->
  gulp.src __ROOT__ + '/views/**/*.jade'
    .pipe newer __ROOT__ + '/views/**/*.jade'
    .pipe do livereload

###
# Devel task with gulp.watch and livereload
# -
# Run: gulp devel
###
gulp.task 'devel', ->
  do livereload.listen
  bIsDevel = yes
  gulp.watch STYLUS_SRC + '/**/*.styl', ['stylus']
  gulp.watch [
    COFFEE_SRC + '/*.coffee'
    COMPONENTS_SRC + '/*.vue'
  ], ['build:coffee']
  gulp.watch __ROOT__ + '/frontend/svg/**/*.svg', ['svg']
  gulp.watch __ROOT__ + '/views/**/*.jade', ['refresh']

###
# Build coffee and clean working directory
###
gulp.task 'build:coffee', ['coffee'], ->
  unless bIsDevel
    gulp.src COFFEE_TMP, read: no
      .pipe do clean

gulp.task 'build', ['svg', 'stylus', 'build:coffee']

gulp.task 'default', ['build']