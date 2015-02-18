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
  gutil.log ('compassing')
  gulp.src(sassSources)
    .pipe(compass({
      css: 'builds/development/css',
      sass: 'components/sass',
      image: 'builds/development/images',
      style: 'expanded'
    }))
    .pipe(gulp.dest('builds/development/css'));
});


gulp.task('watch', function() {
  gulp.watch(['builds/development/*.html','builds/development/views/*.html'], ['html', reload]);
  gulp.watch(['components/sass/*.scss'], ['compass', reload]);
  gulp.watch(jsSources, ['js']);
  gulp.watch(['builds/development/images/**/*'], reload);
});

// Watch Files For Changes & Reload
gulp.task('serve',['compass','js','html','watch'], function () {

  browserSync({

    // available options here: http://www.browsersync.io/docs/options/
    server: ['builds/development'],

    /* Run as an https by uncommenting 'https: true'
    Note: this uses an unsigned certificate which on first access will present a certificate warning in the browser.*/
    // https: true,

    // all off by default, but enables multiple browsers to all browse in sync
    ghostMode: {
      clicks: true,
      forms: true,
      scroll: true
    },
    
    // Open the site in default browser when you run "gulp"
    open: true,

    // Uncommenting the line below and this will open the site in Chrome & Firefox
    //browser: ["google chrome", "firefox"],

    // displays message in browser when reload happens or styles injected
    notify: true,

    // Log information about changed files
    logFileChanges: true,

    // A delay between changes and reloading so 2 changes in quick succession don't get missed
    reloadDelay: 2000,

    // shows browsers connected in command line
    logConnections: true,

    // Uncommenting the line below and this will change the console logging prefix. Useful if you're creating your own project based on BrowserSync
    //logPrefix: "My Awesome Project"
  });
 
});

  
gulp.task('default', ['watch','serve']); //gulp
