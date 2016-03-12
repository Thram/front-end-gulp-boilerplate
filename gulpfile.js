/**
 * Created by Thram on 10/11/15.
 *
 * Enjoy!
 */

'use strict';

var browserify     = require('browserify'),
    watchify       = require('watchify'),
    riotify        = require('riotify'),
    browserifyData = require('browserify-data'),
    gulp           = require('gulp'),
    source         = require('vinyl-source-stream'),
    buffer         = require('vinyl-buffer'),
    rename         = require('gulp-rename'),
    uglify         = require('gulp-uglify'),
    sourcemaps     = require('gulp-sourcemaps'),
    gutil          = require('gulp-util'),
    htmlreplace    = require('gulp-html-replace'),
    del            = require('del'),
    gulpif         = require('gulp-if'),
    argv           = require('yargs').argv,
    fileInclude    = require('gulp-file-include'),
    browserSync    = require('browser-sync').create(),
    jshint         = require('gulp-jshint'),
    stylish        = require('jshint-stylish'),
    sync           = require('gulp-sync')(gulp),
    sass           = require('gulp-sass'),
    yaml           = require('gulp-yaml'),
    imagemin       = require('gulp-imagemin'),
    gzip           = require('gulp-gzip'),
    karma          = require('karma').Server;

var folders = {src: __dirname + '/src/', dst: __dirname + '/dist/', modules: __dirname + '/node_modules'};

var tasks = {
  // Clean
  clean       : function (cb) {
    return del([folders.dst + '*'], cb);
  },
  // Layouts
  layouts     : function () {
    return gulp.src(folders.src + 'index.html')
      .pipe(fileInclude({
        template: '<script type="text/template" id="@filename"> @content </script>'
      }))
      .pipe(htmlreplace({
        'css': 'css/styles.min.css',
        'js' : 'js/bundle.min.js'
      }))
      .pipe(gulp.dest(folders.dst));
  },
  // Scripts
  scripts     : function () {
    var b = watchify(browserify({
      paths  : [
        folders.src + 'scripts',
        folders.modules
      ],
      entries: folders.src + 'scripts/app.js',
      debug  : !(argv.r || argv.release || argv.g || argv.gzip)
    }).transform(browserifyData).transform(riotify));

    b.on('update', bundle); // on any dep update, runs the bundler
    b.on('log', gutil.log); // output build logs to terminal

    function bundle() {
      return b.bundle()
        //has to be the first in the pipe!
        .on('error', function (err) {
          console.log(err.message);
          this.emit("end");
        })
        .pipe(source('bundle.min.js'))
        .pipe(buffer())
        .pipe(gulpif(!(argv.r || argv.release || argv.g || argv.gzip), sourcemaps.init({loadMaps: true})))
        // Add transformation tasks to the pipeline here.
        .pipe(gulpif((argv.r || argv.release || argv.g || argv.gzip), uglify()))
        .pipe(gulpif(!(argv.r || argv.release || argv.g || argv.gzip), sourcemaps.write()))
        .pipe(gulpif((argv.g || argv.gzip), gzip()))
        .pipe(gulp.dest(folders.dst + 'js/'));
    }

    return bundle();
  },
  // Lint Task
  lint        : function () {
    return gulp.src(folders.src + 'scripts/**/*.js')
      .pipe(jshint({expr: true}))
      .pipe(jshint.reporter('jshint-stylish'));
  },
  // Stylesheets
  stylesheets : function () {
    return gulp.src(folders.src + 'stylesheets/app.scss')
      .pipe(gulpif(!(argv.r || argv.release || argv.g || argv.gzip), sourcemaps.init({loadMaps: true})))
      .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
      .pipe(rename('styles.min.css'))
      .pipe(gulpif(!(argv.r || argv.release || argv.g || argv.gzip), sourcemaps.write()))
      .pipe(gulp.dest(folders.dst + 'css/')).pipe(browserSync.stream());
  },
  // Optimize Images
  optimize    : function () {
    return gulp.src(folders.src + 'assets/**/*.{gif,jpg,png,svg}')
      .pipe(imagemin({
        progressive      : true,
        svgoPlugins      : [{removeViewBox: false}],
        // png optimization
        optimizationLevel: argv.r || argv.release || argv.g || argv.gzip ? 3 : 1
      }))
      .pipe(gulp.dest(folders.dst + 'assets/'));
  },
  // Tests with Jasmine
  lang        : function (done) {
    return gulp.src(folders.src + 'scripts/lang/*.yaml')
      .pipe(yaml({schema: 'DEFAULT_SAFE_SCHEMA'}))
      .pipe(gulp.dest(folders.dst + 'js/lang/'));
  },
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
      layouts    : folders.src + 'index.html',
      stylesheets: folders.src + 'stylesheets/**/*.scss',
      tags       : folders.src + 'scripts/tags/**/*.tag',
      scripts    : folders.src + 'scripts/**/*.js'
    };
    var dist = {
      html: folders.dst + 'index.html',
      css : folders.dst + 'css/styles.min.css',
      js  : folders.dst + 'js/bundle.min.js'
    };

    //b.on('update', function () {
    //  tasks.scripts();
    //});

    gulp.watch([src.layouts], ['layouts']);
    //gulp.watch([src.scripts, src.tags], ['lint', 'scripts']);
    gulp.watch([src.stylesheets], ['stylesheets']);
    gulp.watch([dist.html, dist.js]).on('change', browserSync.reload);
  },
  // Browser Sync
  browser_sync: function () {
    browserSync.init({
      server        : {
        baseDir: folders.dst
      },
      logLevel      : 'debug',
      logConnections: true
    }, function (err, bs) {
      if (argv.g || argv.gzip) {
        var middleware = require('connect-gzip-static')(folders.dst);
        bs.addMiddleware("*", middleware, {
          override: true
        });
      }

    });
  }
};

// Register Tasks
var task;
for (task in tasks) {
  gulp.task(task, tasks[task]);
}

// Build tasks
gulp.task('default', sync.sync(['clean', ['stylesheets', 'optimize', 'lang', 'lint', 'scripts', 'layouts']]));
gulp.task('live', sync.sync(['clean', ['stylesheets', 'optimize', 'lang', 'lint', 'scripts', 'layouts'], 'browser_sync', 'watch']));
