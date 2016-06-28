var gulp = require('gulp');
var server = require('gulp-express');
var nodemon = require('gulp-nodemon');
var browserify = require('browserify');
var watchify = require('watchify');
var reactify = require('reactify');
var source = require('vinyl-source-stream');
var streamify = require('gulp-streamify');
var uglify = require('gulp-uglify');
var htmlreplace = require('gulp-html-replace');
var clean = require('gulp-clean');
var livereload = require('gulp-livereload');
var sass = require('gulp-sass');
var cssmin = require('gulp-cssmin');
var rename = require('gulp-rename');

var path = {
  SERVER: 'server/server.js',
  HTML: 'client/index.html',
  OUT: 'build.js',
  DEST: 'public',
  DEST_BUILD: 'public/build',
  MINIFIED_OUT: 'build.min.js',
  DEST_JS: 'public/js',
  COMPILED_CSS: 'client/css',
  ENTRY_POINT: './client/js/app.js',
  ALL_BOWER_COMPONENT: 'bower_components/**/*',
  CLIENT: {
    ROOT: 'client',
    JS: 'client/js/**/*.js',
    SCSS: 'client/scss/**/*.scss',
    CSS: 'client/css/app.css'
  }
}

/*
  Task
gulp clean : clean 'public' directory.
gulp (build) : builds the client into ./public

 */

gulp.task('default', ['build']);
gulp.task('build', ['scripts', 'scss', 'css-minify', 'copy']);
gulp.task('develop', ['build', 'serve', 'livereload', 'watch']);


// clean build directory
gulp.task('clean', function(){
  gulp.src(path.DEST, {read: false})
    .pipe(clean());
});

/*
  nodemon은 프로젝트 폴더의 파일들을 모니터링 하고 있다가 파일이 수정될 경우 자동으로 서버를 리스타트 시켜준다.
  run app using nodemon
*/

gulp.task('serve', ['build'], function(){
  return nodemon({
    script: path.SERVER, options: '-i client/**/*'
  });
});

// will watch client files and rebuild on change
gulp.task('watch', function(){
  livereload.listen();
  gulp.watch(path.CLIENT.JS, ['scripts']);
  gulp.watch(path.CLIENT.SCSS, ['scss']);
});

// livereload browser on client app changes
gulp.task('livereload', ['serve'], function(){
  livereload();
  console.log(server);
  var all_build_files = path.DEST + '/**/*';
  return gulp.watch(path.DEST_BUILD + '/*', function(evt){
    console.log('build.min.js파일 변경');
    livereload.reload();
  });

});

gulp.task('copy', function(){
  gulp.src(path.HTML)
    .pipe(htmlreplace({
      'css': 'style/style.min.css',
      'js': 'build/' + path.MINIFIED_OUT
    }))
    .pipe(gulp.dest(path.DEST));
  gulp.src(path.ALL_BOWER_COMPONENT)
    .pipe(gulp.dest(path.DEST+'/bower_components/'));
});

gulp.task('scripts', function(){
  browserify({
    entries: [path.ENTRY_POINT],
    transform: [reactify],
  })
    .bundle()
    .pipe(source(path.MINIFIED_OUT))
    .pipe(streamify(uglify(path.MINIFIED_OUT)))
    .pipe(gulp.dest(path.DEST_BUILD));
});

gulp.task('lint', function(){
  console.log('js가 변경되었어!');
});

gulp.task('scss-compile', function(){
  console.log('scss watch started..');
  gulp.watch(path.CLIENT.SCSS, ['scss']);
});

gulp.task('scss', function(){
  console.log('scss가 변경되었어!');
  gulp.src(path.CLIENT.SCSS)
    .pipe(sass())
    .pipe(gulp.dest(path.COMPILED_CSS));
});

gulp.task('css-minify', function(){
  console.log('css file minify.');
  gulp.src(path.CLIENT.CSS)
    .pipe(cssmin())
    .pipe(rename('style.min.css'))
    .pipe(gulp.dest('public/style/'));
});