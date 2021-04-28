var gulp = require('gulp'),
  gulpif = require('gulp-if'),
  rimraf = require('rimraf'),
  sass = require('gulp-sass'),
  sassMagicImporter = require('node-sass-magic-importer'),
  postcss = require('gulp-postcss'),
  rename = require('gulp-rename'),
  browserSync = require('browser-sync').create(),
  runSequence = require('run-sequence'),
  imagemin = require('gulp-imagemin')
  gutil = require('gulp-util'),
  named = require('vinyl-named'),
  webpack = require('webpack'),
  webpackStream = require('webpack-stream'),
  copy = require('gulp-copy'),
  plumber = require('gulp-plumber'),
  autoprefixer = require('autoprefixer'),
  util = require('util'),
  sourcemaps = require('gulp-sourcemaps'),
  svgstore = require('gulp-svgstore'),
  twig = require('gulp-twig');

var PRODUCTION = false;

var srcFolder = 'static/src/',
  destFolder = 'static/';

gulp.task('copy-assets', function () {
  return gulp.src(srcFolder + 'assets/**/*')
    .pipe(gulp.dest(destFolder));
});

gulp.task('main-js', function () {
  return gulp.src(srcFolder + 'js/*.js')
    .pipe(plumber())
    .pipe(named())
    .pipe(webpackStream({
      output: {
        filename: '[name].min.js',
        chunkFilename: '[name].min.js',
        publicPath: '/' + destFolder + 'js/'
      },
      module: {
        rules: [
          {
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: [
                  ['@babel/preset-env', {
                    useBuiltIns: 'usage',
                    corejs: 2
                  }]
                ],
                plugins: ['@babel/plugin-syntax-dynamic-import']
              }
            }
          }
        ]
      },
      mode: PRODUCTION ? 'production' : 'development',
      devtool: PRODUCTION ? false : 'cheap-source-map',
      optimization: {
        splitChunks: {
          chunks: 'all',
          minChunks: Infinity
        }
      },
      performance: PRODUCTION ? { maxAssetSize: 300000 } : false
    }, webpack))
    .pipe(gulp.dest(destFolder + 'js'))
    .pipe(gulpif(!PRODUCTION, browserSync.stream()));
});

gulp.task('main-css', function () {
  return gulp.src(srcFolder + 'sass/*.scss')
    .pipe(plumber())
    .pipe(gulpif(!PRODUCTION, sourcemaps.init()))
    .pipe(sass({
      includePaths: ['node_modules', srcFolder + 'sass'],
      precision: 10,
      outputStyle: 'compressed',
      importer: sassMagicImporter({
        disableImportOnce: true
      })
    }).on('error', sass.logError))
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(destFolder + 'css'))
    .pipe(gulpif(!PRODUCTION, browserSync.stream()));
});

gulp.task('imagemin', function () {
  return gulp.src(destFolder + 'img/**/*.{jpg,jpeg,png,gif}')
    .pipe(imagemin({
      progressive: true,
      optimizationLevel: 3
    }))
    .on("error", gutil.log)
    .pipe(gulp.dest(destFolder + 'img'));
});

gulp.task('svg-symbols', function () {
  return gulp.src(srcFolder + 'assets/img/symbols/*.svg')
    .pipe(rename({
      prefix: 'symbol-'
    }))
    .pipe(svgstore())
    .pipe(gulp.dest(destFolder + 'img'));
});

gulp.task('clean', function (cb) {
  rimraf('.tmp', cb);
});

gulp.task('watch', function () {
  gulp.watch(srcFolder + 'assets/img/**/*', ['copy-assets']).on('change', browserSync.reload);
  gulp.watch(srcFolder + 'assets/img/symbols/*.svg', ['svg-symbols']).on('change', browserSync.reload);
  gulp.watch(srcFolder + 'js/**/*.js', ['main-js']);
  gulp.watch(srcFolder + 'sass/**/*.scss', ['main-css']);
});

gulp.task('serve', ['watch'], function () {
  browserSync.init({
    proxy: "http://localhost:9040/",
    files: [
      'templates/**/*.html'
    ],
    ghostMode: false,
    online: true,
    open: false,
    notify: false
  });
});

gulp.task('pre-build', ['main-js', 'main-css', 'copy-assets', 'svg-symbols']);
gulp.task('default', ['pre-build', 'serve']);
gulp.task('build', function () {
  PRODUCTION = true;
  // runSequence(['pre-build', 'imagemin', 'clean']);
  runSequence(['pre-build', 'clean']);
});

gulp.task('prototype', function () {
  return gulp.src('prototype/**/*.html')
    .pipe(plumber())
    .pipe(twig({
      base: 'prototype',
      data: {
        settings: {
          SITE_TITLE: 'Manifeste 2021'
        },
        LANGUAGE_CODE: 'fr',
      },
      extend: function (Twig) {
        // Static
        Twig.exports.extendTag({
          type: 'static',
          regex: /^static\s+(.+)$/,
          next: [],
          open: true,
          compile: function (token) {
            var expression = token.match[1];

            token.stack = Twig.expression.compile.apply(this, [{
              type: Twig.expression.type.expression,
              value: expression
            }]).stack;

            delete token.match;
            return token;
          },
          parse: function (token, context, chain) {
            return {
              chain: false,
              output: '/static/' + Twig.expression.parse.apply(this, [token.stack, context])
            };
          }
        });

        // Echo (inline)
        ['trans', 'url'].forEach(function (name) {
          Twig.exports.extendTag({
            type: name,
            regex: new RegExp('^' + name + '(?:\\s+(.+))?$'),
            next: [],
            open: true,
            compile: function (token) {
              var expression = token.match[1];

              token.stack = Twig.expression.compile.apply(this, [{
                type: Twig.expression.type.expression,
                value: expression
              }]).stack;

              delete token.match;
              return token;
            },
            parse: function (token, context, chain) {
              return {
                chain: false,
                output: Twig.expression.parse.apply(this, [token.stack, context])
              };
            }
          });
        });
      },
      functions: [],
      filters: []
    })).on('error', util.log.bind(util, 'Twig Error'))
    .pipe(gulp.dest(destFolder + 'prototype'));
});

gulp.task('serve:prototype', ['pre-build', 'prototype', 'watch'], function () {
  browserSync.init({
    ui: false,
    files: [
      destFolder + 'css/**/*.{png,jpg,gif,svg}',
      destFolder + 'img/**/*.css',
      destFolder + 'js/**/*.js',
      destFolder + '**/*.html'
    ],
    server: {
      baseDir: destFolder + 'prototype',
      routes: {
        '/static': destFolder
      }
    },
    ghostMode: false,
    online: true,
    open: false,
    notify: false
  });

  gulp.watch('prototype/**/*.html', ['prototype']);
});
