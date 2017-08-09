/*******************************************************************************

 Title : gulpfile.js
 Author : David Leclerc
 Date : 14.09.2016
 Notes : -

 *******************************************************************************/

// Load plugins
const gulp = require("gulp"),
    babel = require("gulp-babel"),
    webpack = require("webpack-stream"),
    sass = require("gulp-sass"),
    rename = require("gulp-rename"),
    concat = require("gulp-concat"),
    uglify = require("gulp-uglify"),
    php = require("gulp-connect-php"),
    sync = require("browser-sync");


// Define paths
const paths = {
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
    js: ["dev/assets/js/index.js",
        "dev/assets/js/lib.js",
        "dev/modules/**/*.js"]
};

// TASKS
// PHP task
gulp.task("php",
    gulp.series((done) => {
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
    gulp.series("php", (done) => {
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
    gulp.series((done) => {
        del("public/**/*");

        done();
    })
);

// SASS-compiling and minimizing task
gulp.task("sass",
    gulp.series((done) => {
        gulp.src(paths.scss)
            .pipe(concat("index.scss"))
            .pipe(sass())
            .pipe(sync.stream())
            .pipe(rename("index.min.css"))
            .pipe(gulp.dest("dev/assets/css"));

        done();
    })
);

// JS-optimization task
gulp.task("js",
    gulp.series((done) => {
        gulp.src(paths.js[0])
            .pipe(babel({
                presets: ["es2015"]
            }))
            .pipe(webpack())
            //.pipe(uglify())
            .pipe(rename("index.min.js"))
            .pipe(gulp.dest("dev/assets/js"));

        done();
    })
);

// JS-linting task
gulp.task("lint:js",
    gulp.series((done) => {
        gulp.src([paths.js, "!./dev/assets/js/lib/**/*.js"])
            .pipe(jshint())
            .pipe(jshint.reporter("default"));

        done();
    })
);

// Watch task
gulp.task("watch",
    gulp.series("sass", "js", "sync",
        gulp.parallel((done) => {
            gulp.watch(paths.php)
                .on("change", gulp.series(sync.reload));
            gulp.watch(paths.html)
                .on("change", gulp.series(sync.reload));
            gulp.watch(paths.scss)
                .on("change", gulp.series("sass"));
            gulp.watch(paths.js)
                .on("change", gulp.series("js", sync.reload));

            done();
        })
    )
);

// Compile task
gulp.task("compile",
    gulp.series("sass", "js",
        (done) => {
            gulp.src([paths.php, paths.html])
                .pipe(gulp.dest("public"));

            done();
        }
    )
);

// Build task
gulp.task("build",
    gulp.series("clean", "compile")
);

// Default gulp task
gulp.task("default",
    gulp.series("watch")
);
