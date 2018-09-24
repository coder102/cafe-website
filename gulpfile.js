var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync');
var babel = require('gulp-babel');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var cssnano = require('gulp-cssnano');
var autoprefixer = require('gulp-autoprefixer');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var del = require('del');
var runSequence = require('run-sequence');

// Development Tasks
// -----------------

// Start browserSync server
gulp.task('browserSync', function() {
  browserSync({
    server: true
  })
})

gulp.task('sass', function() {
  // return gulp.src('src/scss/**/*.scss')
  return gulp.src('src/scss/style.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(cssnano())
    .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
    .pipe(concat('style.min.css'))
    .pipe(gulp.dest('public/css'))
    .pipe(browserSync.reload({
      stream: true
    }));
})

// Watchers
gulp.task('watch', function() {
  gulp.watch('src/scss/**/*.scss', ['sass']);
  gulp.watch('*.html', browserSync.reload);
  gulp.watch('src/js/**/*.js', ['js']);
})

// Optimization Tasks
// ------------------

gulp.task('js', function () {
  return gulp.src('src/js/*.js')
  .pipe(babel({
    presets: ['@babel/env']
  }))
  .pipe(uglify())
  .pipe(concat('script.min.js'))
  .pipe(gulp.dest('public/js'))
  .pipe(browserSync.reload({
    stream: true
  }))
});

// Optimizing Images
gulp.task('images', function() {
  return gulp.src('src/img/**/*.+(png|jpg|jpeg|gif|svg)')
    // Caching images
    .pipe(cache(imagemin({
      interlaced: true,
    })))
    .pipe(gulp.dest('public/img'))
});

// Copying fonts
gulp.task('fonts', function() {
  return gulp.src('src/fonts/**/*')
    .pipe(gulp.dest('public/fonts'))
})

// Cleaning
gulp.task('clean', function() {
  return del.sync('public').then(function(cb) {
    return cache.clearAll(cb);
  });
})

gulp.task('clean:public', function() {
  return del.sync(['public/**/*', '!public/images', '!public/images/**/*']);
});

// Build Sequences
// ---------------

gulp.task('default', function(callback) {
  runSequence(['sass', 'js', 'browserSync'], 'watch',
    callback
  )
})

gulp.task('build', function(callback) {
  runSequence(
    'clean:public',
    'sass',
    ['js', 'images', 'fonts'],
    callback
  )
})
