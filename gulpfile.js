var gulp =        require('gulp'),
    gutil =       require('gulp-util'),
    concat =      require('gulp-concat'),
    browserify =  require('gulp-browserify'),
    browserSync = require('browser-sync'),
    reload =      browserSync.reload,
    compass =     require('gulp-compass'),
    uglify =      require('gulp-uglify'),
    gulpif =      require('gulp-if'),
    minifyHTML =  require('gulp-minify-html');

var env,
    jsSources,
    angularSources,
    sassSources,
    htmlSources,
    outputDir,
    outputDirViews,
    sassStyle;
    
env = process.env.NODE_ENV || 'development';

/* ENVIRONEMENTS*/
if (env === 'development') {
  outputDir = 'builds/development/';
  sassStyle = 'expanded';
} else{
  outputDir = 'builds/production/';
  sassStyle = 'compressed';
};

/* SOURCES*/
jsSources = [
  'components/scripts/pixgrid.js',
  'components/scripts/rclick.js',
  'components/scripts/tagline.js',
  'components/scripts/script.js'

];
angularSources =    [outputDir + '**/*.js'];
sassSources =       ['components/sass/style.scss'];
htmlSources =       [outputDir + '**/*.html'];


/* TASKS*/

gulp.task('js', function() {
  gulp.src(jsSources)
    .pipe(concat('script.js'),reload)
    .pipe(browserify())
    .pipe(gulpif(env === 'production', uglify() ))
    .pipe(gulp.dest(outputDir + 'js'))
});

gulp.task('angular', function() {
  gulp.src(['builds/development/**/*js']) // index and views

    .pipe(gulpif(env === 'production',uglify() ))
    .pipe(gulpif(env ==='production',gulp.dest(outputDir) ))
});

gulp.task('html', function() {
  gulp.src(['builds/development/**/*html']) // index and views
    .pipe(gulpif(env ==='production',minifyHTML() ))
    .pipe(gulpif(env ==='production',gulp.dest(outputDir) ))
  
});


gulp.task('compass', function() {

  gulp.src(sassSources)
    .pipe(compass({
      css: outputDir + 'css',
      sass: 'components/sass',
      image: outputDir + 'images',
      style: sassStyle
    }))
    .pipe(gulp.dest(outputDir + 'css'));
});


gulp.task('watch', function() {
  gulp.watch(['builds/development/*.html','builds/development/views/*.html'], ['html', reload]);
  gulp.watch(['builds/development/js/app.js'], ['angular', reload]);
  gulp.watch(['components/sass/**/*.scss'], ['compass', reload]);
  gulp.watch(jsSources, ['js', reload]);
  gulp.watch([outputDir + 'images/**/*'], reload);
});

// Watch Files For Changes & Reload
gulp.task('serve',['html','angular','compass','js','watch'], function () {

  browserSync({

    // available options here: http://www.browsersync.io/docs/options/
    server: [outputDir],

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

  
gulp.task('default', ['angular','serve','watch']); //gulp
