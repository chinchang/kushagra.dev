var gulp = require('gulp'),
	minifyCSS = require('gulp-minify-css');
	concat = require('gulp-concat');

gulp.task('minify-css', function() {
  gulp.src(['./css/style.css', './css/prism.css'])
    .pipe(concat('./css/style.min.css'))
    .pipe(minifyCSS())
    .pipe(gulp.dest('./'))
});

gulp.task('default', function() {
  // place code for your default task here
});