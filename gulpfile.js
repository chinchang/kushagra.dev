var gulp = require('gulp'),
	minifyCSS = require('gulp-minify-css');

gulp.task('minify-css', function() {
  gulp.src('./css/style.css')
    .pipe(minifyCSS({ keepBreaks:true }))
    .pipe(gulp.dest('./css/min/'))
});

gulp.task('default', function() {
  // place code for your default task here
});