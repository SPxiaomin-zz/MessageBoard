var gulp = require('gulp');
var plumber = require('gulp-plumber');
var livereload = require('gulp-livereload');
var rename = require('gulp-rename');
var notify = require('gulp-notify');
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');

var less = require('gulp-less');
var autoprefixer = require('gulp-autoprefixer')
var cssnano = require('gulp-cssnano');

var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');


var paths = {
    css: ['./public/stylesheets/build/{reset,common}.less', './public/stylesheets/build/board.header.less', './public/stylesheets/build/board.main.{form,list}.less', './public/stylesheets/build/board.main.less'],
    js: ['./public/javascript/build/form.interaction.js']
};


gulp.task('css', function() {
    var cssDest = './public/stylesheets/src';

    var stream = gulp.src(paths.css)
        .pipe(plumber({
            errorHandler: notify.onError('Message:\n\t<%= error.message %>\nDetails:\n\tlineNumber: <%= error.lineNumber %>')
        }))
        .pipe(less())
        .pipe(autoprefixer())
        .pipe(concat('all.css'))
        .pipe(gulp.dest(cssDest))
        .pipe(cssnano())
        .pipe(rename({
            extname: '.min.css'
        }))
        .pipe(gulp.dest(cssDest))
        .pipe(livereload());

    return stream;
});

gulp.task('js', function() {
    var jsDest = './public/javascript/src';

    var stream = gulp.src(paths.js)
        .pipe(sourcemaps.init())
        .pipe(plumber({
            errorHandler: notify.onError('Message:\n\t<%= error.message %>\nDetails:\n\tlineNumber: <%= error.lineNumber %>')
        }))
        .pipe(jshint())
        .pipe(notify(function(file) {
            if ( file.jshint.success ) {
                return false;
            }

            var errors = file.jshint.results.map(function(data) {
                if ( data.error ) {
                    return 'line ' + data.error.line + ', col ' + data.error.character + ', ' + data.error.reason;
                }
            }).join('\n');
            return file.relative + ' (' + file.jshint.results.length + ' errors)\n' + errors;
        }))
        .pipe(uglify({
        }))
        .pipe(rename({
            extname: '.min.js'
        }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(jsDest))
        .pipe(livereload());

    return stream;
});

function watcherCallback(event) {
    console.log('File ' + event.path + ' was ' + event.type + ', task running...');
}

gulp.task('default', ['css', 'js'], function() {
    livereload.listen();

    var watcherCss = gulp.watch(paths.css, ['css']);
    watcherCss.on('change', watcherCallback);

    var watcherJs = gulp.watch(paths.js, ['js']);
    watcherJs.on('change', watcherCallback);
});
