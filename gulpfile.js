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
const uglify = require('gulp-uglify-es').default;
const inject = require('gulp-inject');
const imagemin = require('gulp-imagemin');
const newer = require('gulp-newer');
const ghPages = require('gulp-gh-pages');

function buildHTML() {
  const html = src('app/pages/**/*.pug')
    .pipe(data(function (file) {
      return {
        require: require,
      };
    }))
    .pipe(pug())
    .pipe(rename({ dirname: '', extname: '.html' }));

  const sources = src(['dist/*.js', 'dist/*.css'], { read: false });

  return html.pipe(inject(sources, { addRootSlash: false, ignorePath: 'dist/' }))
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

function buildJS() {
  return src('app/components/**/*.js')
    .pipe(concat('scripts.min.js'))
    .pipe(uglify())
    .pipe(dest('dist'))
    .pipe(browserSync.stream());
}

function transferImages() {
  return src('app/images/*')
    .pipe(newer('dist/images'))
    .pipe(imagemin())
    .pipe(dest('dist/images'));
}

function cleanDistFolder() {
  return del('dist', { force: true });
}

function startWatch() {
  watch(['app/pages/**/*.pug', 'app/components/**/*.pug', 'app/data/*'], buildHTML)
    .on('change', browserSync.reload);
  watch(['app/pages/**/*.scss', 'app/components/**/*.scss'], buildStyles);
  watch('app/components/**/*.js', buildJS);
  watch('app/images', transferImages).on('change', browserSync.reload);
}

function browsersync() {
  browserSync.init({
    server: { baseDir: 'dist/' },
  });
}

function ghDeploy() {
  return src('dist/**/*')
    .pipe(ghPages());
}

exports.buildHTML = buildHTML;
exports.buildStyles = buildStyles;
exports.buildJS = buildJS;
exports.transferImages = transferImages;
exports.cleanDistFolder = cleanDistFolder;
exports.startWatch = startWatch;
exports.browsersync = browsersync;

exports.ghDeploy = ghDeploy;

exports.build = series(
  cleanDistFolder,
  buildStyles,
  buildJS,
  buildHTML,
  transferImages,
);

exports.default = series(
  cleanDistFolder,
  parallel(
    transferImages,
    buildStyles,
    buildJS,
  ),
  parallel(
    buildHTML,
    startWatch,
    browsersync,
  ),
);
