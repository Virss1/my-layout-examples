const { src, dest, parallel, series, watch } = require('gulp');
const rename = require('gulp-rename');
const concat = require('gulp-concat');
const del = require('del');
const pug = require('gulp-pug');
const scss = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const cleancss = require('gulp-clean-css');
const data = require('gulp-data');
const browserSync = require('browser-sync').create();

function buildHTML() {
  return src('app/pages/**/*.pug')
    .pipe(data(function (file) {
      return {
        require: require,
      };
    }))
    .pipe(pug())
    .pipe(rename({ dirname: '', extname: '.html' }))
    .pipe(dest('dist'));
}

function buildStyles() {
  return src('app/**/*.scss')
    .pipe(scss())
    .pipe(concat('styles.min.css'))
    .pipe(autoprefixer())
    .pipe(cleancss())
    .pipe(dest('dist'))
    .pipe(browserSync.stream());
}

function transferImages() {
  return src('app/images/*')
    .pipe(dest('dist'));
}

function cleanDistFolder() {
  return del('dist', { force: true });
}

function startWatch() {
  watch(['app/pages/*.pug', 'app/components/**/*.pug', 'app/data/*'], buildHTML)
    .on('change', browserSync.reload);
  watch(['app/pages/*.scss', 'app/components/**/*.scss'], buildStyles);
}

function browsersync() {
  browserSync.init({
    server: { baseDir: 'dist/' },
  });
}

exports.buildHTML = buildHTML;
exports.buildStyles = buildStyles;
exports.transferImages = transferImages;
exports.startWatch = startWatch;
exports.browsersync = browsersync;

exports.build = series(
  series,
  buildHTML,
  buildStyles,
  transferImages
);

exports.default = series(
  cleanDistFolder,
  parallel(
    buildHTML,
    buildStyles,
    transferImages,
    startWatch,
    browsersync,
  ),
);
