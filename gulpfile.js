var gulp        = require('gulp');
var jshint      = require('gulp-jshint');
var uglify      = require('gulp-uglify');
var sass        = require('gulp-sass');
var autoprefix  = require('gulp-autoprefixer');
var jade        = require('gulp-jade');
var imagemin    = require('gulp-imagemin');
var del         = require('del');
var browserSync = require('browser-sync').create();


// the default task
gulp.task('default', [
  'build',
  'watch'
]);

gulp.task('build', [
  'jade',
  'jshint',
  'scripts',
  'styles',
  'images'
]);

// jade templating
gulp.task('jade', function() {
  gulp.src('dev/index.jade')
    .pipe(jade({pretty: true}))
    .pipe(gulp.dest('dist/'))
    .pipe(browserSync.stream());
});

gulp.task('jshint', function() {
  return gulp.src('dev/js/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
})


// minify && concat scripts
gulp.task('scripts', function() {
  gulp.src('dev/js/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'))
    .pipe(browserSync.stream());
});


// minify && concat styles
gulp.task('styles', function() {
  gulp.src('dev/css/**/*.scss')
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(autoprefix({browsers: ['last 2 versions'], cascade: false}))
    .pipe(gulp.dest('dist/css'))
    .pipe(browserSync.stream());
});

// image optimization
gulp.task('images', function() {
  return gulp.src('dev/img/*.{png,gif,jpg}')
    .pipe(imagemin({
      progressive: true,
      // svgoPlugins: [{removeViewBox: false}],
      optimizationLevel: 5
    }))
    .pipe(gulp.dest('dist/img'))
    .pipe(browserSync.stream());
})


// watch the files
gulp.task('watch', function() {
  browserSync.init({
    server: "dist/"
  });
  gulp.watch('dev/**/*.jade', ['jade']);
  gulp.watch('dev/js/*.js', ['scripts']);
  gulp.watch('dev/css/**/*.scss', ['styles']);
  gulp.watch('dev/img/*', ['images']);
});


gulp.task('clean', function() {
  del.sync(['dist/**/*', 'dist/']);
});

gulp.task('rebuild', ['clean', 'build']);
