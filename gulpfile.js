var gulp = require("gulp");
var rename = require("gulp-rename");
var sass = require("gulp-sass");
var autoprefixer = require("gulp-autoprefixer");
var sourcemaps = require("gulp-sourcemaps");
var styleSRC = "./src/scss/style.scss";
var styleDIST = "./dist/css";

var browserify = require("browserify");
var babelify = require("babelify");
var source = require("vinyl-source-stream");
var buffer = require("vinyl-buffer");
var uglify = require("gulp-uglify");
var imagemin = require("gulp-imagemin");
var svgmin = require("gulp-svgmin");
var svgstore = require("gulp-svgstore");

var svgSRC = "./src/images/*.svg";
var svgDEST = "./dist/images";
var imgSRC = "./src/images/*";
var imgDEST = "./dist/images";

var jsSRC = "./src/js/script.js";
var jsDIST = "./dist/js/";

gulp.task("style", function (done) {
  gulp
    .src(styleSRC)
    .pipe(sourcemaps.init())
    .pipe(
      sass({
        errLogToConsole: true,
        outputStyle: "compressed",
      })
    )
    .on("errror", console.error.bind(console))
    .pipe(
      autoprefixer({
        cascade: false,
      })
    )
    .pipe(rename({ suffix: ".min" }))
    .pipe(sourcemaps.write("./"))
    .pipe(gulp.dest(styleDIST));
  done();
});

var jfFiles = [jsSRC];

gulp.task("js", function (done) {
  jfFiles.map(function (entry) {
    browserify({ entries: [entry] })
      .transform(babelify, {
        presets: ["env"],
      })
      .bundle()
      .pipe(source(entry))
      .pipe(rename({ extname: ".min.js" }))
      .pipe(buffer())
      .pipe(sourcemaps.init({ loadMaps: true }))
      .pipe(uglify())
      .pipe(sourcemaps.write("./"))
      .pipe(gulp.dest(jsDIST));
  });

  // gulp.src(jsSRC).pipe(gulp.dest(jsDIST));
  //browserify
  //transform using babel babelify[env]
  // bundle(one single file)
  //source
  //rename .min
  //buffer
  //initialise sourcemaps
  //uglify minimizing
  //write sourcemaps
  //dist

  done();
});
styleWatch = "./src/scss/**/*.scss";
jsWatch = "./src/js/**/*.js";

gulp.task("watch", function () {
  gulp.watch(styleWatch, gulp.series("style")),
    gulp.watch(jsWatch, gulp.series("js"));
});

gulp.task("image", function (done) {
  gulp.src(imgSRC).pipe(imagemin()).pipe(gulp.dest(imgDEST));
  done();
});

gulp.task("icon", function (done) {
  gulp
    .src(svgSRC)
    .pipe(svgmin())
    // .pipe(svgstore())
    .pipe(rename("icon.svg"))
    .pipe(gulp.dest(svgDEST));
  done();
});

gulp.task("default", gulp.parallel("style", "js"), function (done) {
  done();
});
