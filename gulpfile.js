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

var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
var jpegtran = require('imagemin-jpegtran');


var paths = {
    css: ['./public/stylesheets/build/{reset,common}.less', './public/stylesheets/build/board.header.less', './public/stylesheets/build/board.main.{form,list}.less', './public/stylesheets/build/board.main.less'],
    js: ['./public/javascript/build/form.interaction.js'],
    image: ['./public/images/build/*']
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
            mangle: false
        }))
        .pipe(rename({
            extname: '.min.js'
        }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(jsDest))
        .pipe(livereload());

    return stream;
});

gulp.task('image', function() {
    var imageDest = './public/images/src';

    var stream = gulp.src(paths.image)
        .pipe(plumber({
            errorHandler: notify.onError('Message:\n\t<%= error.message %>\nDetails:\n\tlineNumber: <%= error.lineNumber %>')
        }))
        .pipe(imagemin({
            optimizationLevel: 1,
            progressive: true,
            interlaced: true,
            multipass: true,
            svgPlugins: [{removeViewBox: false}],
            use: [pngquant(), jpegtran()]
        }))
        .pipe(gulp.dest(imageDest))
        .pipe(livereload());

    return stream;
});


function watcherCallback(event) {
    console.log('File ' + event.path + ' was ' + event.type + ', task running...');
}

gulp.task('default', ['css', 'js', 'image'], function() {
    livereload.listen();

    var watcherCss = gulp.watch(paths.css, ['css']);
    watcherCss.on('change', watcherCallback);

    var watcherJs = gulp.watch(paths.js, ['js']);
    watcherJs.on('change', watcherCallback);

    var watcherImage = gulp.watch(paths.image, ['image']);
    watcherImage.on('change', watcherCallback);
});
