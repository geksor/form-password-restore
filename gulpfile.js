var gulp = require('gulp');
var concat = require('gulp-concat');
var autoprefixer = require('gulp-autoprefixer');
var cleanCSS = require('gulp-clean-css');
var uglify = require('gulp-uglify');
var del = require('del');
var browserSync = require('browser-sync').create();
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var sasswatch = require('gulp-watch');
var file = require('gulp-file');

var cssLibs = [
  './src/libs/reset-css/reset.css',
  './build/css/style.css'
]

function styles() {
  return gulp.src(cssLibs)
    .pipe(concat('style.css'))
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(cleanCSS({
      level: 2
    }))
    .pipe(gulp.dest('./build/css'))
    .pipe(browserSync.stream())
}

var jsFiles = [
  // './src/libs/jquery/dist/jquery.min.js',
  './src/js/script.js'
];

function scripts() {
  return gulp.src(jsFiles)
    .pipe(concat('script.js'))
    .pipe(uglify({
      toplevel: true
    }))
    .pipe(gulp.dest('./build/js'))
    .pipe(browserSync.stream())
}

function clean() {
  return del(['./build/*'])
}

gulp.task('sass-compile', function () {
  return gulp.src('./src/scss/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./build/css/'))
    .pipe(browserSync.stream());
})

function watch() {
  browserSync.init({
    server: {
      baseDir: "./"
    }
  });
  gulp.watch('./src/js/**/*.js', scripts);
  gulp.watch('./*.html', ).on('change', browserSync.reload);
  gulp.watch('./src/scss/**/*.scss', gulp.series('sass-compile', 'styles'));
}

gulp.task('directories', function () {
  return gulp.src('*.*', {
      read: false
    })
    .pipe(gulp.dest('./build'))
    .pipe(gulp.dest('./build/css'))
    .pipe(gulp.dest('./build/js'))
    .pipe(gulp.dest('./src'))
    .pipe(gulp.dest('./src/scss'))
    .pipe(gulp.dest('./src/js'))
})
gulp.task('filejs', function () {
  return gulp.src('./src/js/*.js')
    .pipe(file('script.js', ''))
    .pipe(gulp.dest('./src/js'))

})
gulp.task('filehtml', function () {
  return gulp.src('./*.html')
    .pipe(file('index.html', ''))
    .pipe(gulp.dest('./'))
})
gulp.task('filescss', function () {
  return gulp.src('./src/scss/*.scss')
    .pipe(file('style.scss', ''))
    .pipe(gulp.dest('./src/scss'))

})
gulp.task('styles', styles);
gulp.task('scripts', scripts);
gulp.task('del', clean);
gulp.task('watch', watch);
gulp.task('init', gulp.series('directories', 'filehtml', 'filescss', 'filejs'));
gulp.task('build', gulp.series(clean, 'sass-compile', gulp.parallel(styles, scripts), 'watch'));
