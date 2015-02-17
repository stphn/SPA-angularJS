var gulp = require('gulp'),
  gutil = require('gulp-util'),
  concat = require('gulp-concat'),
  browserify = require('gulp-browserify'),
  browserSync = require('browser-sync'),
  reload = browserSync.reload,
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

// Watch Files For Changes & Reload
gulp.task('serve', ['compass'], function () {
  browserSync({
    notify: true,
    ghostMode: {
      clicks: true,
      forms: true,
      scroll: true
    },
    // Run as an https by uncommenting 'https: true'
    // Note: this uses an unsigned certificate which on first access
    //       will present a certificate warning in the browser.
    // https: true,
    server: ['builds/development']
  });

  gulp.watch(['builds/development/*.html','builds/development/views/*.html'], ['html', reload]);
  gulp.watch(['components/sass/*.scss'], ['compass', reload]);
  gulp.watch(jsSources, ['jsSources']);
  gulp.watch(['builds/development/images/**/*'], reload);
});



gulp.task('default', ['html', 'js','compass','watch']);
