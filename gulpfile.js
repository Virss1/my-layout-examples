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
    .pipe(rename({ extname: '.html' }))
    .pipe(dest('dist'));
}

function buildStyles() {
  return src('app/**/*.scss')
    .pipe(scss())
    .pipe(concat('styles.min.css'))
    .pipe(autoprefixer())
    .pipe(cleancss())
    .pipe(dest('dist'));
}

function cleanDistFolder() {
  return del('dist', { force: true });
}

exports.buildHTML = buildHTML;
exports.buildStyles = buildStyles;
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
  )
);
