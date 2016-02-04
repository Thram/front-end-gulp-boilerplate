/**
 * Created by Thram on 10/11/15.
 *
 * Enjoy!
 */

'use strict';

var browserify  = require('browserify'),
    watchify    = require('watchify'),
    gulp        = require('gulp'),
    source      = require('vinyl-source-stream'),
    buffer      = require('vinyl-buffer'),
    rename      = require('gulp-rename'),
    uglify      = require('gulp-uglify'),
    concat      = require('gulp-concat'),
    sourcemaps  = require('gulp-sourcemaps'),
    gutil       = require('gulp-util'),
    htmlreplace = require('gulp-html-replace'),
    del         = require('del'),
    gulpif      = require('gulp-if'),
    argv        = require('yargs').argv,
    fileInclude = require('gulp-file-include'),
    browserSync = require('browser-sync').create(),
    jshint      = require('gulp-jshint'),
    sync        = require('gulp-sync')(gulp),
    sass        = require('gulp-sass'),
    fontgen     = require('gulp-fontgen'),
    imagemin    = require('gulp-imagemin'),
    karma       = require('karma').Server;
// set up the browserify instance on a task basis
var b     = watchify(browserify({
  entries: './src/scripts/app.js',
  debug  : !(argv.r || argv.release)
}));
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
        'css'   : 'css/styles.min.css',
        'vendor': 'js/vendor.min.js',
        'js'    : 'js/bundle.min.js'
      }))
      .pipe(gulp.dest('dist/'));
  },
  // Scripts
  scripts     : function () {
    return b.bundle()
      .pipe(source('bundle.min.js'))
      .pipe(buffer())
      .pipe(gulpif(!(argv.r || argv.release), sourcemaps.init({loadMaps: true})))
      // Add transformation tasks to the pipeline here.
      .pipe(gulpif((argv.r || argv.release), uglify()))
      .on('error', gutil.log)
      .pipe(gulpif(!(argv.r || argv.release), sourcemaps.write()))
      .pipe(gulp.dest('./dist/js/'));
  },
  vendor      : function () {
    return gulp.src('./src/scripts/vendor/**/*.js')
      .pipe(concat('vendor.min.js'))
      .pipe(gulpif((argv.r || argv.release), uglify()))
      .pipe(gulp.dest('./dist/js/'))
  },
  // Lint Task
  lint        : function () {
    return gulp.src(['src/scripts/**/*.js', '!src/scripts/vendor/**/*.js'])
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
  fonts       : function () {
    return gulp.src("./src/assets/fonts/**/*.{ttf,otf}")
      .pipe(gulpif(!(argv.f || argv.fonts), fontgen({
        dest: "./dist/assets/fonts/"
      })));
  },
  // Tests with Jasmine
  test        : function (done) {
    return karma.start({
      configFile: __dirname + '/karma.conf.js',
      singleRun : !(argv.w || argv.watch)
    }, function (res) {
      done();
    });
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
gulp.task('fonts', tasks.fonts);
gulp.task('test', tasks.test);
gulp.task('watch', tasks.watch);
gulp.task('vendor', tasks.vendor);
gulp.task('browser_sync', tasks.browser_sync);

// Build tasks
gulp.task('default', sync.sync(['clean', ['stylesheets', 'optimize', 'fonts', 'lint', 'vendor', 'scripts', 'layouts']]));
gulp.task('live', sync.sync(['clean', ['stylesheets', 'optimize', 'fonts', 'lint', 'vendor', 'scripts', 'layouts'], 'browser_sync', 'watch']));
