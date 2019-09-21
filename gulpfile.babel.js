/*
 ************************************************************************
 ****************************  DEPENDENCIES  ****************************
 ************************************************************************
 */

import cleanCSS from "gulp-clean-css";
import del from "del";
import gulp from "gulp";
import gulpif from "gulp-if";
import imagemin from "gulp-imagemin";
import named from "vinyl-named";
import packageDotJSON from "./package.json";
import replace from "gulp-replace";
import sass from "gulp-sass";
import sourcemaps from "gulp-sourcemaps";
import webpack from "webpack-stream";
import yargs from "yargs";
import zip from "gulp-zip";

/*
 ************************************************************************
 *****************************  ENVIRONMENT  ****************************
 ************************************************************************
 */

// Environment Setup
const PRODUCTION = yargs.argv.prod;

/*
 ************************************************************************
 *******************************  PATHS  ********************************
 ************************************************************************
 */

// Paths for folders and files
const paths = {
  styles: {
    src: "",
    dest: "dist/assets/css",
    watch: "src/assets/scss/**/*.scss"
  },
  scripts: {
    src: "",
    dest: "dist/assets/js",
    watch: "src/assets/js/**/*.js"
  },
  images: {
    src: "src/assets/images/**/*.{jpg,jpeg,png,gif,svg}",
    dest: "dist/assets/images"
  },
  etc: {
    src: [
      "src/assets/**/*",
      "!src/assets/{images,js,scss}",
      "!src/assets/{images,js,scss}/**/*"
    ],
    dest: "dist/assets"
  },
  php: {
    watch: "**/*.php"
  },
  server: {
    url: "http://127.0.0.1/wptest1/"
  },
  package: {
    src: [
      "**/*",
      "!.vscode",
      "!node_modules{,/**}",
      "!packaged{,/**}",
      "!src{,/**}",
      "!.babelrc",
      "!.gitignore",
      "!gulpfile.babel.js",
      "!package.json",
      "!package-lock.json",
      "!README.md"
    ],
    dest: "packaged"
  }
};

/*
 ************************************************************************
 *******************************  TASKS  ********************************
 ************************************************************************
 */

// Clean the "dist" folder
export const clean = () => del(["dist"]);

// Compile scss
export const styles = done => {
  if (paths.styles.src === "") {
    console.log("No styles found! Continuing...");
    done();
    return;
  }
  gulp
    .src(paths.styles.src)
    .pipe(gulpif(!PRODUCTION, sourcemaps.init()))
    .pipe(sass().on("error", sass.logError))
    .pipe(gulpif(PRODUCTION, cleanCSS({ combatibility: "ie8" })))
    .pipe(gulpif(!PRODUCTION, sourcemaps.write()))
    .pipe(gulp.dest(paths.styles.dest));
  done();
};

// Compile JS
export const scripts = done => {
  if (paths.scripts.src === "") {
    console.log("No scripts found! Continuing...");
    done();
    return;
  }
  gulp
    .src(paths.scripts.src)
    .pipe(named())
    .pipe(
      webpack({
        module: {
          rules: [
            {
              test: /\.js$/,
              use: {
                loader: "babel-loader",
                options: { presets: ["babel-preset-env"] }
              }
            }
          ]
        },
        output: {
          filename: "[name].js"
        },
        externals: {
          jquery: "jQuery"
        },
        devtool: !PRODUCTION ? "inline-source-map" : false,
        mode: PRODUCTION ? "production" : "development"
      })
    )
    .pipe(gulp.dest(paths.scripts.dest));
  done();
};

// Minify images
export const images = () =>
  gulp
    .src(paths.images.src)
    .pipe(gulpif(PRODUCTION, imagemin()))
    .pipe(gulp.dest(paths.images.dest));

// Copy additional files
export const copy = () =>
  gulp.src(paths.etc.src).pipe(gulp.dest(paths.etc.dest));

// Watchers
export const watch = () => {
  gulp.watch(paths.styles.watch, styles);
  gulp.watch(paths.scripts.watch, scripts);
  gulp.watch(paths.images.src, images);
  gulp.watch(paths.etc.src, copy);
  gulp.watch(paths.php.watch, copy);
};

// Zip for distribution
export const compress = () =>
  gulp
    .src(paths.package.src, { base: "../" })
    .pipe(replace("_pluginname", packageDotJSON.name))
    .pipe(replace("_themename", packageDotJSON.theme))
    .pipe(zip(`${packageDotJSON.theme}-${packageDotJSON.name}.zip`))
    .pipe(gulp.dest(paths.package.dest));

export const dev = gulp.series(
  clean,
  gulp.parallel(styles, images, scripts, copy),
  watch
);

export const build = gulp.series(
  clean,
  gulp.parallel(styles, images, scripts, copy)
);

export const bundle = gulp.series(build, compress);

export default dev;
