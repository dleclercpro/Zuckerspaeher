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

// Define entry paths
const entries = {
    php: "dev/**/*.php",
    scss: "dev/assets/scss/index.scss",
    js: "dev/assets/js/index.js"
};

// Define module paths
const modules = {
    php: "dev/modules/**/*.php",
    scss: "dev/modules/**/*.scss",
    js: "dev/modules/**/*.js"
}

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
        gulp.src([entries.scss, modules.scss])
            .pipe(concat("index.scss"))
            .pipe(sass())
            .pipe(rename("index.min.css"))
            .pipe(gulp.dest("dev/assets/css"))
            .pipe(sync.stream());

        done();
    })
);

// JS-optimization task
gulp.task("js",
    gulp.series((done) => {
        gulp.src(entries.js)
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
gulp.task("js:lint",
    gulp.series((done) => {
        gulp.src(entries.js)
            .pipe(jshint())
            .pipe(jshint.reporter("default"));

        done();
    })
);

// Watch task
gulp.task("watch",
    gulp.series("sass", "js", "sync",
        gulp.parallel((done) => {
            gulp.watch("dev/**/*.php")
                .on("change", gulp.series(sync.reload));
            gulp.watch("dev/**/*.scss")
                .on("change", gulp.series("sass"));
            gulp.watch("dev/**/*.js")
                .on("change", gulp.series("js", sync.reload));

            done();
        })
    )
);

// Compile task
gulp.task("compile",
    gulp.series("sass", "js", (done) => {
        gulp.src([entries.php, modules.php])
            .pipe(gulp.dest("public"));

        done();
    })
);

// Build task
gulp.task("build",
    gulp.series("clean", "compile")
);

// Default gulp task
gulp.task("default",
    gulp.series("watch")
);
