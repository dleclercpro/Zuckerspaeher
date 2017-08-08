/*******************************************************************************

Title : gulpfile.js
Author : David Leclerc
Date : 14.09.2016
Notes : -

*******************************************************************************/

// Load plugins
var gulp = require("gulp"),
	babel = require("gulp-babel"),
	sass = require("gulp-sass"),
	jshint = require("gulp-jshint"),
	rename = require("gulp-rename"),
	concat = require("gulp-concat"),
	cache = require("gulp-cache"),
	plumber = require("gulp-plumber"),
	uglify = require("gulp-uglify"),
	cssnano = require("gulp-cssnano"),
	imagemin = require("gulp-imagemin"),
	jpegtran = require("imagemin-jpegtran"),
	optipng = require("imagemin-optipng"),
	gifsicle = require("imagemin-gifsicle"),
	svgo = require("imagemin-svgo"),
	imageresize = require("gulp-image-resize"),
	del = require("del"),
	php = require("gulp-connect-php"),
	sync = require("browser-sync");


// Define paths
var paths = {
	php: "dev/**/*.php",
	html: "dev/**/*.html",
	css: "path/assets/css/*.css",
	scss: ["dev/assets/scss/normalize.scss",
		   "dev/assets/scss/base.scss",
		   "dev/assets/scss/config.scss",
		   "dev/assets/scss/mixins.scss",
		   "dev/assets/scss/placeholders.scss",
		   "dev/assets/scss/index.scss",
		   "dev/modules/**/*.scss"],
	js: ["dev/assets/js/helpers/*.js",
		 "dev/assets/js/lib.js",
		 "dev/assets/js/index.js"],
	img: "dev/**/*.+(jpg|png|gif|bmp|tiff)",
	fonts: "dev/**/*.+(ttf)"
};

// TASKS
// PHP task
gulp.task("php",
	gulp.series(function(done){
		php.server({
			base: "dev",
			port: 8000,
			keepalive: true,
			stdio: "ignore"
		});

		done();
	})
);

// Synchronize browser task
gulp.task("sync",
	gulp.series("php", function(done){
		sync({
			proxy: "127.0.0.1:8000",
			port: 8010,
			open: true,
			notify: false,
			logLevel: "silent"
		});

		done();
	})
);

// Cleaning public folder
gulp.task("clean",
	gulp.series(function(done){
		del("public/**/*");
		
		done();
	})
);

// SASS-compiling task
gulp.task("old-sass",
	gulp.series(function(done){
		gulp.src(paths.scss)
			.pipe(plumber())
			.pipe(sass())
			.pipe(sync.stream())
			.pipe(gulp.dest(function(f){
				var filename = f.path.split("/").pop();
				var filepath = f.dirname.split("/").slice(6, -1).join("/");
				f.dirname = "";
				return "./dev/" + filepath + "/css/" + filename;
			}));
		
		done();
	})
);

// SASS-compiling and minimizing task
gulp.task("sass",
	gulp.series(function(done){
		gulp.src(paths.scss)
			.pipe(plumber())
			.pipe(concat("index.scss"))
			.pipe(sass())
			.pipe(rename("index.min.css"))
			.pipe(gulp.dest("public/assets/css"));

		done();
	})
);

// JS-optimization task
gulp.task("js",
	gulp.series(function(done){
		gulp.src(paths.js)
			.pipe(plumber())
			.pipe(concat("index.js"))
			//.pipe(babel({
			//	presets: ["env"]
			//}))
			//.pipe(uglify())
			.pipe(rename("index.min.js"))
			.pipe(gulp.dest("public/assets/js"));

		done();
	})
);

// Optimization of images
gulp.task("img",
	gulp.series(function(done){
		gulp.src(paths.img)
			.pipe(imageresize({
				width: 1600,
				upscale: false
			}))
			.pipe(imagemin({
				verbose: true,
				progressive: true,
				use: [
					jpegtran(),
					optipng(),
					gifsicle(),
					svgo()]
			}))
			.pipe(gulp.dest(function(f){
				var filename = f.path.split("/").pop();
				var filepath = f.dirname.split("/").slice(6, -1).join("/");
				f.dirname = "";
				return "./public/" + filepath + "/img/" + filename;
			}));

		done();
	})
);

// Copy of fonts to public folder
gulp.task("fonts", 
	gulp.series(function(done){
		gulp.src(paths.fonts)
			.pipe(gulp.dest("public"));

		done();
	})
);

// JS-linting task
gulp.task("lint:js",
	gulp.series(function(done){
		gulp.src([paths.js, "!./dev/assets/js/lib/**/*.js"])
			.pipe(jshint())
			.pipe(jshint.reporter("default"));

		done();
	})
);

// Watch task
gulp.task("watch",
	gulp.series("sass", "sync", 
		gulp.parallel(function(done){
			gulp.watch(paths.php)
				.on("change", gulp.series(sync.reload));
			gulp.watch(paths.html)
				.on("change", gulp.series(sync.reload));
			gulp.watch(paths.scss)
				.on("change", gulp.series("sass"));
			gulp.watch(paths.js)
				//.on("change", gulp.series("lint:js", sync.reload));
                .on("change", gulp.series(sync.reload));
			
			done();
		})
	)
);

// Compile task
gulp.task("compile",
    gulp.series("sass", "js",
        function(done){
            gulp.src([paths.php, paths.html])
                .pipe(gulp.dest("public"));

            done();
        }
    )
);

// Build task
gulp.task("build",
	gulp.series("clean", "compile", "img")
);

// Default gulp task
gulp.task("default",
	gulp.series("watch")
);
