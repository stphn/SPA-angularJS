var gulp = require('gulp'),
  gutil = require('gulp-util'),
  concat = require('gulp-concat'),
  browserify = require('gulp-browserify'),
  webserver = require('gulp-webserver'),
  browserSync = require('browser-sync'),
  compass = require('gulp-compass');


var jsSources = [
  'components/scripts/pixgrid.js',
  'components/scripts/rclick.js',
  'components/scripts/tagline.js'
];
var sassSources = ['components/sass/style.scss'];

var htmlSources = ['builds/development/*.html'];

gulp.task('js', function() {
  gulp.src(jsSources)
    .pipe(concat('script.js'))
    .pipe(browserify())
    .pipe(gulp.dest('builds/development/js'))
});

gulp.task('html', function() {
  gulp.src(htmlSources)
});

gulp.task('compass', function() {
  gulp.src(sassSources)
    .pipe(compass({
      css: 'stylesheets',
      sass: 'components/sass',
      image: 'builds/development/images',
      style: 'expanded'
    }))
    .pipe(gulp.dest('builds/development/css'));
});

gulp.task('watch', function() {
  gulp.watch(jsSources, ['jsSources']);
  gulp.watch('components/sass/*.scss', ['compass']);
  gulp.watch(['builds/development/*.html',
    'builds/development/views/*.html'], ['html']);
});

gulp.task('webserver', function() {

  gulp.src('builds/development/')
    .pipe(webserver({
      // host: 'localhost',
      // port: 9000,
      livereload: true,
      open: true
    }));
});

gulp.task('browser-sync', function () {
   var files = [
      'builds/development/*.html',
      'builds/development/css/*.css',
      'builds/development/images/**/*.png',
      'builds/development/js/**/*.js'
   ];

   browserSync.init(files, {
      server: {
         baseDir: './'
      }
   });
});

gulp.task('default', ['html', 'js','compass' ,'browser-sync','watch']);
