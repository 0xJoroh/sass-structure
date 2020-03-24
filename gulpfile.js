'use strict';

const autoprefixer = require('gulp-autoprefixer');
const csso = require('gulp-csso');
const del = require('del');
const gulp = require('gulp');
const htmlmin = require('gulp-htmlmin');
const runSequence = require('run-sequence');
const sass = require('gulp-sass');
const uglify = require('gulp-uglify');
const browserSync = require('browser-sync').create();

// Set the browser that you want to support
const AUTOPREFIXER_BROWSERS = [
	'ie >= 10',
	'ie_mob >= 10',
	'ff >= 30',
	'chrome >= 34',
	'safari >= 7',
	'opera >= 23',
	'ios >= 7',
	'android >= 4.4',
	'bb >= 10'
];

// Gulp task to minify CSS files
gulp.task('styles', function () {
	return gulp.src('./src/assets/scss/**/*.scss')
		// Compile SASS files
		.pipe(sass({
			outputStyle: 'nested',
			precision: 10,
			includePaths: ['.'],
			onError: console.error.bind(console, 'Sass error:')
		}))
		// Auto-prefix css styles for cross browser compatibility
		.pipe(autoprefixer({
			browsers: AUTOPREFIXER_BROWSERS
		}))
		// Minify the file
		.pipe(csso())
		.pipe(gulp.dest('./build/assets/css'))
		.pipe(browserSync.stream());
});

// Gulp task to minify JavaScript files
gulp.task('scripts', function () {
	return gulp.src('./src/assets/js/**/*.js')
		// Minify the file
		.pipe(uglify())
		.pipe(gulp.dest('./build/assets/js'))
		.pipe(browserSync.stream());
});

// Gulp task to minify HTML files
gulp.task('pages', function () {
	return gulp.src('./src/**/*.html')
		.pipe(htmlmin({
			collapseWhitespace: true,
			removeComments: true
		}))
		.pipe(gulp.dest('./build'))
		.pipe(browserSync.stream());
});

// Gulp task to
gulp.task('others', function () {
	return gulp.src(['./src/assets/fonts', './src/assets/img'])
		.pipe(gulp.dest('./build/assets/'))
		.pipe(browserSync.stream());
});

// Clean output directory
gulp.task('clean', () => del(['build']));

// Gulp task to minify all files
gulp.task('default', ['clean'], function () {
	runSequence(
		'styles',
		'scripts',
		'pages',
		'others'
	);
});

gulp.task('watch', function () {
	browserSync.init({
		server: {
			baseDir: './build/'
		}
	});
	gulp.watch('./src/assets/scss/**/*.scss', styles);
	gulp.watch('./src/assets/scss/**/*.scss', browserSync.reload);
	gulp.watch('./**/*.html').on('change', browserSync.reload);
	gulp.watch('./src/assets/**/*.js').on('change', browserSync.reload);
});
