var gulp = require('gulp');
var uglify = require('gulp-uglify');
var browserSync = require('browser-sync').create();
var concat = require('gulp-concat');
var minifyCss = require('gulp-clean-css');
var autoprefixer = require('gulp-autoprefixer');
var plumber = require('gulp-plumber');
var sourcemaps = require('gulp-sourcemaps');
var sass = require('gulp-sass');
var babel = require('gulp-babel');

// image compression
var imagemin = require('gulp-imagemin');
var imageminPngquant = require('imagemin-pngquant');
var imageminJpegRecompress = require('imagemin-jpeg-recompress');

// file paths
var DIST_PATH = 'public';
var SCRIPTS_PATH = 'src/js/**/*.js';
var CSS_PATH = 'public/css/**/*.css';
var IMAGES_PATH = 'src/images/**/*.{png,jpeg,jpg,svg,gif}';

// scss styles
gulp.task('styles', function () {
  console.log('starting styles task');

  return gulp.src('src/scss/styles.scss')
    .pipe(plumber(function (err) {
      console.log('STYLES task error');
      console.log(err);
      this.emit('end');
    }))
    .pipe(sourcemaps.init())
    .pipe(autoprefixer())
    .pipe(sass({
      outputStyle: 'compressed'
    }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(DIST_PATH + '/css'))
});

// scripts
gulp.task('scripts', function () {
  console.log('starting scripts task');

  return gulp.src(SCRIPTS_PATH)
    .pipe(plumber(function (err) {
      console.log('SCRIPTS task error');
      console.log(err);
      this.emit('end');
    }))
    .pipe(sourcemaps.init())
    .pipe(babel({
      presets: ['env']
    }))
    .pipe(uglify())
    .pipe(concat('scripts.js'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(DIST_PATH + '/js'))
});

// images
gulp.task('images', function () {
  return gulp.src(IMAGES_PATH)
    .pipe(imagemin(
      [
        imagemin.gifsicle(),
        imagemin.jpegtran(),
        imagemin.optipng(),
        imagemin.svgo(),
        imageminPngquant(),
        imageminJpegRecompress()
      ]
    ))
    .pipe(gulp.dest(DIST_PATH + '/images'));

});

// default task
gulp.task('default', ['images', 'styles', 'scripts'], function () {
  console.log('starting default task');
});

// watch
gulp.task('watch', ['default'], function () {
  console.log('starting watch task');
  browserSync.init({
    server: {
      baseDir: "./public"
    },
    browser: "google chrome"
  });
  gulp.watch("public/**").on("change", browserSync.reload);
  gulp.watch(SCRIPTS_PATH, ['scripts']);
  gulp.watch('src/scss/**/*.scss', ['styles']);
});
