//====== GULP ======//

// Variables
var gulp = require('gulp');
var autoprefixer = require('gulp-autoprefixer');
var concat = require("gulp-concat");
var connect = require("gulp-connect");
var del = require("del");
var ghpages = require("gulp-gh-pages");
var htmlbeautify = require("gulp-html-beautify");
var iconfont = require("gulp-iconfont");
var iconfontcss = require("gulp-iconfont-css");
//var imagemin = require("gulp-imagemin");
var kit = require("gulp-kit");
var notify = require("gulp-notify");
var plumber = require("gulp-plumber");
var rename = require("gulp-rename");
var sass = require("gulp-sass");
var sourcemaps = require("gulp-sourcemaps");
var uglify = require("gulp-uglify");
var watch = require("gulp-watch");
var zip = require("gulp-zip");

// Paths
var path = {
  src: './src/',
  dist: './dist/',
  kit: {
    input: './src/kit/',
    output: './dist/'
  },
  icons: {
    input: './src/assets/icons/',
    output: './dist/assets/icons/'
  },
  scss: {
    input: './src/assets/scss/',
    output: './dist/assets/css/'
  },
  fonts: {
    input: './src/assets/fonts/',
    output: './dist/assets/fonts/'
  },
  favicon: {
    input: './src/assets/favicon/',
    output: './dist/assets/favicon/'
  },
  js: {
    input: './src/assets/js/',
    output: './dist/assets/js/'
  },
  img: {
    input: './src/assets/img/',
    output: './dist/assets/img/'
  },
  svg: {
    input: './src/assets/svg/',
    output: './dist/assets/svg/'
  }
};

// Kit
gulp.task('kit:dev', function () {
  return gulp.src(path.kit.input + '/**/*.kit')
    .pipe(plumber({ errorHandler: notify.onError("Error: <%= error.message %>") }))
    .pipe(kit())
    .pipe(htmlbeautify({
      indent_size: 2,
      max_preserve_newlines: 1,
      extra_liners: []
    }))
    .pipe(gulp.dest(path.kit.output))
    .pipe(connect.reload());
});
gulp.task('kit:build', function () {
  return gulp.src(path.kit.input + '/**/*.kit')
    .pipe(plumber())
    .pipe(kit())
    .pipe(htmlbeautify({
      indent_size: 2,
      max_preserve_newlines: 0,
      extra_liners: []
    }))
    .pipe(gulp.dest(path.kit.output));
});

// Icons
gulp.task('icons:dev', function () {
  var runTimestamp = Math.round(Date.now() / 1000);
  return gulp.src(path.icons.input + '*.svg')
    .pipe(plumber({ errorHandler: notify.onError("<%= error.message %>") }))
    .pipe(iconfontcss({
      fontName: 'iconfont',
      path: 'css',
      targetPath: 'iconfont.css',
      fontPath: './'
    }))
    .pipe(iconfont({
      fontName: 'iconfont',
      prependUnicode: false,
      appendCodepoints: true,
      formats: ['ttf', 'eot', 'woff', 'woff2'],
      normalize: true,
      fontHeight: 1001,
      timestamp: runTimestamp
    }))
    .pipe(gulp.dest(path.icons.output))
    .pipe(connect.reload());
});
gulp.task('icons:build', function () {
  var runTimestamp = Math.round(Date.now() / 1000);
  return gulp.src(path.icons.input + '*.svg')
    .pipe(plumber())
    .pipe(iconfontcss({
      fontName: 'iconfont',
      path: 'css',
      targetPath: 'iconfont.css',
      fontPath: './'
    }))
    .pipe(iconfont({
      fontName: 'iconfont',
      prependUnicode: false,
      appendCodepoints: true,
      formats: ['ttf', 'eot', 'woff', 'woff2'],
      normalize: true,
      fontHeight: 1001,
      timestamp: runTimestamp
    }))
    .pipe(gulp.dest(path.icons.output));
});

// Sass
gulp.task('scss:dev', function () {
  return gulp.src(path.scss.input + 'styles.scss')
    .pipe(plumber({ errorHandler: notify.onError("<%= error.message %>") }))
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(autoprefixer('last 5 versions'))
    .pipe(rename({ basename: "main", suffix: '.min' }))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(path.scss.output))
    .pipe(connect.reload());
});
gulp.task('scss:build', function () {
  return gulp.src(path.scss.input + 'styles.scss')
    .pipe(plumber())
    .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
    .pipe(autoprefixer('last 5 versions'))
    .pipe(rename({ basename: "main", suffix: '.min' }))
    .pipe(gulp.dest(path.scss.output));
});

// Javascript
gulp.task('js:dev', function () {
  var sources = require(path.js.input + 'lib.json');
  return gulp.src(sources)
    .pipe(plumber({ errorHandler: notify.onError("<%= error.message %>") }))
    .pipe(sourcemaps.init())
    .pipe(concat('main.js'))
    .pipe(uglify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(path.js.output))
    .pipe(connect.reload());
});
gulp.task('js:build', function () {
  var sources = require(path.js.input + 'lib.json');
  return gulp.src(sources)
    .pipe(plumber())
    .pipe(concat('main.js'))
    .pipe(uglify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(path.js.output));
});

// Fonts
gulp.task('fonts', function () {
  return gulp.src([path.fonts.input + '*', '!' + path.fonts.input + '*.scss'])
    .pipe(gulp.dest(path.fonts.output));
});

// Favicons
gulp.task('favicon', function () {
  return gulp.src(path.favicon.input + '*')
    .pipe(gulp.dest(path.favicon.output));
});

// Images
gulp.task('images', function () {
  var img = gulp.src([path.img.input + '*'])
    //.pipe(imagemin())
    .pipe(gulp.dest(path.img.output));
  var svg = gulp.src([path.svg.input + '*'])
    //.pipe(imagemin())
    .pipe(gulp.dest(path.svg.output));
  return img, svg;
});

// Clean
gulp.task('clean', function () {
  del.sync([path.dist, './.publish']);
});

// Server
gulp.task('server', function () {
  connect.server({
    root: './dist',
    port: 7000,
    host: '0.0.0.0',
    livereload: true
  });
});

// Watch
gulp.task('watch', function () {
  var kit = watch([path.kit.input + '**/*.kit'], function () {
    gulp.start('kit:dev');
  });
  var icons = watch(path.icons.input + '**/*.svg', function () {
    gulp.start('icons:dev');
  });
  var scss = watch([path.src + '**/*.scss'], function () {
    gulp.start('scss:dev');
  });
  var js = watch([path.js.input + 'lib.json', path.src + '**/*.js'], function () {
    gulp.start('js:dev');
  });
  var fonts = watch([path.fonts.input + '*', '!' + path.fonts.input + '*.scss'], function () {
    gulp.start('fonts');
    connect.reload()
  });
  var favicon = watch([path.favicon.input + '*'], function () {
    gulp.start('favicon');
    connect.reload()
  });
  var images = watch([path.img.input + '*', path.svg.input + '*'], function () {
    gulp.start('images');
    connect.reload()
  });  
  return kit, icons, scss, js, fonts, favicon;
});

gulp.task('dev', ['clean', 'kit:dev', 'icons:dev', 'scss:dev', 'js:dev', 'fonts', 'favicon', 'images'], function () {
  gulp.start('server');
  gulp.start('watch');
});
gulp.task('build', ['clean', 'kit:build', 'icons:build', 'scss:build', 'js:build', 'fonts', 'favicon', 'images'], function () {
});
gulp.task('zip', ['build'], function () {
  return gulp.src(path.dist + '**/*')
    .pipe(zip('dist.zip'))
    .pipe(gulp.dest('./'));
});
gulp.task('deploy', ['build'], function () {
  return gulp.src(path.dist + '**/*')
    .pipe(ghpages());
});
gulp.task('default', ['dev'], function () {});
