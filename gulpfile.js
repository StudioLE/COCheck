'use strict'

// Core modules
var p = require('path')
var ver = require('./package.json').version

// Node modules
var gulp = require('gulp')
var gp_bump = require('gulp-bump')
var gp_clean = require('gulp-clean')
var gp_html = require('gulp-html-replace')
var gp_concat = require('gulp-concat')
var gp_rename = require('gulp-rename')
var gp_uglify = require('gulp-uglify')
var gp_clean_css = require('gulp-clean-css')
var gp_less = require('gulp-less')
var p = require('path')

var build = {
  /**
   * Format build directory path
   */
  path: function(path) {
    if( ! path) path = ''
    return p.join('build', path)
  },


  /**
   * Format version query string
   */
  version: function() {
    return '?v' + ver
  }
}

// Bump version
gulp.task('bump', function(){
  gulp.src(['./package.json'])
  .pipe(gp_bump({
    type: 'patch'
  }))
  .pipe(gulp.dest('./'))
})

// Clean build directory
 gulp.task('clean', function () {
  return gulp.src('build', {
    // read: false
  })
  .pipe(gp_clean())
})

// Build index.html
gulp.task('index', function() {
  gulp.src('src/index.html')
  .pipe(gp_html({
    'css': 'assets/app.css' + build.version(),
    'vendor-css': 'assets/vendor.css' + build.version(),
    'js': 'assets/app.js' + build.version(),
    'vendor-js': 'assets/vendor.js' + build.version()
  }))
  .pipe(gulp.dest(build.path()))
})

// Copy static assets
gulp.task('assets', function() {
  // Images
  gulp.src('src/assets/*.png')
  .pipe(gulp.dest(build.path('assets')))
  // Errors
  gulp.src('src/assets/404.html')
  .pipe(gulp.dest(build.path('assets')))
  // Humans.txt, Robots.txt
  // gulp.src('src/*.txt')
  // .pipe(gulp.dest(build.path()))
})

// Build app CSS
gulp.task('css', function() {
  gulp.src('src/assets/app.less')
  .pipe(gp_less({ paths: [
    // 'src/bower_components/bootstrap/less/bootstrap.less'
  ]}))
  .pipe(gp_rename('app.css'))
  .pipe(gp_clean_css({keepSpecialComments: 0}))
  .pipe(gulp.dest(build.path('assets')))
})

// Build vendor CSS
gulp.task('vendor-css', function() {
  gulp.src([
    'node_modules/uikit/dist/css/uikit.min.css'
  ])
  .pipe(gp_concat('concat.js'))
  .pipe(gp_rename('vendor.css'))
  .pipe(gp_clean_css({keepSpecialComments: 0}))
  .pipe(gulp.dest(build.path('assets')))
})

// Build app JS
gulp.task('js', function() {
  gulp.src([
      'src/assets/app.js'
    ])
  .pipe(gp_concat('concat.js'))
  .pipe(gp_rename('app.js'))
  // .pipe(gp_uglify())
  .pipe(gulp.dest(build.path('assets')))
})

// Build vendor JS
gulp.task('vendor-js', function() {
  gulp.src([
    'node_modules/uikit/dist/js/uikit.min.js',
    'node_modules/uikit/dist/js/uikit-icons.min.js',
    'node_modules/jquery/dist/jquery.min.js'

  ])
  .pipe(gp_concat('concat.js'))
  .pipe(gp_rename('vendor.js'))
  // .pipe(gp_uglify())
  .pipe(gulp.dest(build.path('assets')))
})

// Build task
gulp.task('build', ['index', 'assets', 'css', 'vendor-css', 'js', 'vendor-js'])

// Default task
gulp.task('default', ['build'])
