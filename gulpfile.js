// grab our packages
var gulp   = require('gulp'),
    less   = require('gulp-less'),
    jshint = require('gulp-jshint')
    browserSync = require('browser-sync').create()
    reload = browserSync.reload;

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

gulp.task('serve', ['less'], function(){
    browserSync.init({
        server: "./"
    });

    gulp.watch("less/*.less",['less']);
    gulp.watch("less/*.less").on('change', reload);
    gulp.watch("*.html").on('change', reload);
});

// configure which files to watch and what tasks to use on file changes
gulp.task('watch', function() {
    gulp.watch('js/*.js', ['jshint']);
});