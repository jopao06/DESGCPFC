// grab our packages
var gulp   = require('gulp');
var less   = require('gulp-less');
var jshint = require('gulp-jshint');
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;
var exec = require('gulp-exec');

// define the default task and add the watch task to it
gulp.task('default', ['jshint','serve']);

// configure the jshint task
gulp.task('jshint', function() {
    return gulp.src('js/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'));
});

// compile less file
gulp.task('less', function(){
    return gulp.src('less/*.less')
        .pipe(less())
        .pipe(gulp.dest('css'));
});

// compile jison
// gulp.task('jison', function() {
//   return gulp.src('js/quorum.jison')
//     .pipe(exec('jison js/quorum.jison'));
// });

gulp.task('serve', ['less'], function(){
    browserSync.init({
        server: "./"
    });

    gulp.watch("less/*.less",['less']);
    gulp.watch("less/*.less").on('change', reload);
    // gulp.watch(['js/quorum.jison'], ['jison']);
    gulp.watch("*.html").on('change', reload);
    gulp.watch("js/*.js").on('change',reload);
});