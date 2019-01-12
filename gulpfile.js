var gulp        = require('gulp'),
	 sass        = require('gulp-sass'),
	 prefixer    = require('gulp-autoprefixer'),
	 clean       = require('gulp-clean'),
	 csscomb     = require('gulp-csscomb'),
	 csso        = require('gulp-csso'),
	 rename      = require('gulp-rename'),
	 sourcemaps  = require('gulp-sourcemaps'),
	 imagemin    = require('gulp-imagemin'),
	 pngquant    = require('imagemin-pngquant'),
	 browserSync = require('browser-sync'),
	 reload      = browserSync.reload;

var path = {
	dist: {
		html: 'dist',
		css: 'dist/style',
		fonts: 'dist/fonts',
		img: 'dist/img'
	},
	src: {
		html: 'src/*.html',
		css: 'src/style/sass/**/*.scss',
		fonts: 'src/fonts/**/*.*',
		img: 'src/img/**/*.*'
	},
	watch: {
		html: 'src/*.html',
		css: 'src/style/sass/**/*.scss',
		fonts: 'src/fonts/**/*.*',
		img: 'src/img/**/*.*'
	},
	clean: 'dist'
};

gulp.task('browser-sync', function() {
	browserSync({
		server: "dist",
       startPath: "index.html", // After it browser running
       browser: 'chrome',
       host: 'localhost',
       port: 4000,
       open: true,
       tunnel: true
	});
});

gulp.task('html:build', function() {
	return gulp.src(path.src.html)
			 .pipe(gulp.dest(path.dist.html))
			 .pipe(reload({stream: true}))
});

gulp.task('css:build', function() {
	return gulp.src(path.src.css)
			 .pipe(sourcemaps.init())
			 .pipe(sass())
			 .pipe(prefixer())
			 .pipe(csscomb())
			 .pipe(csso())
			 .pipe(sourcemaps.write())
			 .pipe(gulp.dest(path.dist.css))
			 .pipe(reload({stream: true}))
});

gulp.task('image:build', function () {
    return gulp.src(path.src.img)
        .pipe(imagemin([
			    imagemin.gifsicle({interlaced: true}),
			    imagemin.jpegtran({progressive: true}),
			    imagemin.optipng({optimizationLevel: 5}),
			    imagemin.svgo({
			        plugins: [
			            {removeViewBox: true},
			            {cleanupIDs: false},
			            pngquant()
			        ]
			    })
			]))
        .pipe(gulp.dest(path.dist.img))
        .pipe(reload({stream: true}));
});

gulp.task('fonts:build', function() {
    return gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.dist.fonts))
});

gulp.task('css-libs', function() {
	return gulp.src('src/style/css/**/*.css')
			 .pipe(csso())
			 .pipe(rename({suffix: '.min'}))
			 .pipe(gulp.dest(path.dist.css))
});

gulp.task('watch', function() {
	gulp.watch(path.watch.html, gulp.parallel('html:build'));
	gulp.watch(path.watch.css, gulp.parallel('css:build'));
	gulp.watch(path.watch.img, gulp.parallel('image:build'));
	gulp.watch(path.watch.fonts, gulp.parallel('fonts:build'));
});

gulp.task('clean', function () {
	return gulp.src(path.clean, {read: false})
		.pipe(clean());
});

gulp.task('default', gulp.parallel('browser-sync', 'css-libs', 'watch'));