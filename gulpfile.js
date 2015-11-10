/**
 * Created by Thram on 10/11/15.
 * 
 * Enjoy!
 */

'use strict';

var browserify  = require('browserify'),
    gulp        = require('gulp'),
    source      = require('vinyl-source-stream'),
    buffer      = require('vinyl-buffer'),
    rename      = require('gulp-rename'),
    uglify      = require('gulp-uglify'),
    sourcemaps  = require('gulp-sourcemaps'),
    gutil       = require('gulp-util'),
    htmlreplace = require('gulp-html-replace'),
    del         = require('del'),
    gulpif      = require('gulp-if'),
    argv        = require('yargs').argv,
    fileInclude = require('gulp-file-include'),
    browserSync = require('browser-sync').create(),
    jshint      = require('gulp-jshint'),
    stylish     = require('jshint-stylish'),
    sync        = require('gulp-sync')(gulp),
    sass        = require('gulp-sass'),
    imagemin    = require('gulp-imagemin'),
    mocha       = require('gulp-mocha');

var tasks = {
  // Clean
  clean       : function (cb) {
    return del(['dist/*'], cb);
  },
  // Layouts
  layouts     : function () {
    return gulp.src('src/layouts/index.html')
      .pipe(fileInclude({
        template: '<script type="text/template" id="@filename"> @content </script>'
      }))
      .pipe(htmlreplace({
        'css': 'css/styles.min.css',
        'js' : 'js/bundle.min.js'
      }))
      .pipe(gulp.dest('dist/'));
  },
  // Scripts
  scripts     : function () {
    // set up the browserify instance on a task basis
    var b = browserify({
      entries: './src/scripts/app.js',
      debug  : !(argv.r || argv.release)
    });

    return b.bundle()
      .pipe(source('bundle.min.js'))
      .pipe(buffer())
      .pipe(gulpif(!(argv.r || argv.release), sourcemaps.init({loadMaps: true})))
      // Add transformation tasks to the pipeline here.
      .pipe(uglify())
      .on('error', gutil.log)
      .pipe(gulpif(!(argv.r || argv.release), sourcemaps.write()))
      .pipe(gulp.dest('./dist/js/'));
  },
  // Lint Task
  lint        : function () {
    return gulp.src('src/scripts/**/*.js')
      .pipe(jshint({expr: true}))
      .pipe(jshint.reporter('jshint-stylish'));
  },
  // Stylesheets
  stylesheets : function () {
    return gulp.src('src/stylesheets/app.scss')
      .pipe(gulpif(!(argv.r || argv.release), sourcemaps.init({loadMaps: true})))
      .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
      .pipe(rename('styles.min.css'))
      .pipe(gulpif(!(argv.r || argv.release), sourcemaps.write()))
      .pipe(gulp.dest('./dist/css/')).pipe(browserSync.stream());
  },
  // Optimize Images
  optimize    : function () {
    return gulp.src('./src/assets/**/*.{gif,jpg,png,svg}')
      .pipe(imagemin({
        progressive      : true,
        svgoPlugins      : [{removeViewBox: false}],
        // png optimization
        optimizationLevel: argv.r || argv.release ? 3 : 1
      }))
      .pipe(gulp.dest('./dist/assets/'));
  },
  // Tests with Mocha
  test        : function () {
    return gulp.src('./src/scripts/tests/**/*.js', {read: false})
      .pipe(mocha({
        'ui'      : 'bdd',
        'reporter': 'spec'
      })
    );
  },
  // Watchers
  watch       : function () {
    var src  = {
      layouts    : 'src/layouts/**/*.html',
      stylesheets: 'src/stylesheets/**/*.scss',
      scripts    : 'src/scripts/**/*.js'
    };
    var dist = {
      html: 'dist/index.html',
      css : 'dist/css/styles.min.css',
      js  : 'dist/js/bundle.min.js'
    };

    gulp.watch([src.layouts], ['layouts']);
    gulp.watch([src.scripts], ['lint', 'scripts']);
    gulp.watch([src.stylesheets], ['stylesheets']);
    gulp.watch([dist.html, dist.js]).on('change', browserSync.reload);
  },
  // Browser Sync
  browser_sync: function () {
    browserSync.init({
      server        : {
        baseDir: 'dist'
      },
      logLevel      : 'debug',
      logConnections: true
    });
  }
};

// Register Tasks
gulp.task('clean', tasks.clean);
gulp.task('layouts', tasks.layouts);
gulp.task('scripts', tasks.scripts);
gulp.task('lint', tasks.lint);
gulp.task('stylesheets', tasks.stylesheets);
gulp.task('optimize', tasks.optimize);
gulp.task('test', tasks.test);
gulp.task('watch', tasks.watch);
gulp.task('browser_sync', tasks.browser_sync);

// Build tasks
gulp.task('default', sync.sync(['clean', ['stylesheets', 'optimize', 'lint', 'scripts', 'layouts']]));
gulp.task('live', sync.sync(['clean', ['stylesheets', 'optimize', 'lint', 'scripts', 'layouts'], 'browser_sync', 'watch']));
