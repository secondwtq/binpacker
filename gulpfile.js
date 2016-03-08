
var gulp = require('gulp');
var uglify = require('gulp-uglify');
var del = require('del');
var sass = require('gulp-sass');
var minify = require('gulp-minify-css');

var source = require('vinyl-source-stream');
var browserify = require('browserify');
var babelify = require('babelify');
var gutil = require('gulp-util');
var tsify = require('tsify');

var dependencies = [
    'react',
    'react-dom',
    'freezer-js',
    'lodash',

    'react-addons-update'
];

var timeToRun = 0;

function bundle(production) {
    timeToRun++;
    
    var bundler = browserify()
        .add('assets/ts/binpacker-comp.tsx')
        .add('tsd.d.ts')
        .plugin(tsify);
        
    if (!production) {
		if (timeToRun === 1) {
			browserify({
				'require': dependencies,
				'debug': true
			}).bundle()
				.on('error', gutil.log)
				.pipe(source('vendor.js'))
				.pipe(gulp.dest('assets/js'));
		}
		dependencies.forEach((dep) =>
				bundler.external(dep));
	}
        
    return bundler.bundle()
        .on('error', gutil.log)
        .pipe(source('bundle.js'));
}

function buildJS(isDist) {
    var ret = bundle(isDist);
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
