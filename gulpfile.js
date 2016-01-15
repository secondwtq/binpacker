
var gulp = require('gulp');
var tsb = require('gulp-tsb');
var uglify = require('gulp-uglify');
var del = require('del');
var sass = require('gulp-sass');
var minify = require('gulp-minify-css');

var tsConfig = tsb.create('tsconfig.json');
function buildJS(isDist) {
    var ret = gulp.src([
                'typings/**/*.d.ts',
                'assets/ts/**/*.ts',
                'assets/ts/**/*.tsx'
            ])
            .pipe(tsConfig());
    if (isDist) {
        ret = ret.pipe(uglify());
    }
    return ret.pipe(gulp.dest('assets/js'));
}

function buildCSS(isDist) {
    var ret = gulp.src([
        'assets/scss/*.scss'
    ]).pipe(sass().on('error', sass.logError));
    if (isDist) {
        ret = ret.pipe(minify()); }
    return ret.pipe(gulp.dest('assets/css'));
}

gulp.task('build-js', buildJS.bind(null, false));
gulp.task('build-js:dist', buildJS.bind(null, true));

gulp.task('build-css', buildCSS.bind(null, false));
gulp.task('build-css:dist', buildCSS.bind(null, true));

gulp.task('build', [ 'build-js', 'build-css' ]);
gulp.task('build-dist', [ 'build-js:dist', 'build-css:dist' ]);

gulp.task('clean', function () {
    del('assets/css/*.css');
    return del('assets/js/*.js');
});

gulp.task('watch', function () {
    gulp.watch('assets/ts/*.ts', [ 'build-js' ]);
    gulp.watch('assets/ts/*.tsx', [ 'build-js' ]);
    gulp.watch('assets/scss/*.scss', [ 'build-css' ]);
});

gulp.task('default', [ 'build' ]);
