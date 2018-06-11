
/*eslint-env node*/
var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync').create();
var reload      = browserSync.reload;
var eslint = require('gulp-eslint');
var jasmine = require('gulp-jasmine-phantom');
var uglify = require('gulp-uglify');
var pump = require('pump');
var babel = require('gulp-babel');
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');
var imagemin = require('imagemin');
var imageminPngquant = require('imagemin-pngquant');
var imageminJpegtran = require('imagemin-jpegtran');
//**********************
//gulp.task('default',
// gulp 4 optimazation:

 // gulp.series('build', gulp.parallel('browser-sync', 'watch', 'karma-watch')),
// function(){
	//console.log("hello world")
	//gulp.watch(',['styles'])
 // gulp.series(gulp.parallel('styles', 'lint','copyhtml','copyimg'));
//    gulp.watch('sass/**/*.scss', gulp.series('styles'));
//    gulp.watch('js/**/*.js', gulp.series('lint'));
//    gulp.watch('index/html', gulp.series('copyhtml'));

//});
//************************

//function for the autoprefixer sass to css
gulp.task('styles', function(){
  return gulp.src('sass/**/*.scss')
    .pipe(sass().on('error' ,sass.logError))
    .pipe(autoprefixer({browsers:['last 2 versions']}))
    .pipe(gulp.dest('dist/css/'));
});

//**********
/*broserSync
 browserSync.init({
     server: "./"
 });
 browserSync.stream();
*/

// Save a reference to the `reload` method

// Watch scss AND html files, doing different things with each.
//*************

// auto sync edits with the browser
gulp.task('serve', function () {

    // Serve files from the root of this project
    browserSync.init({
        server: {
            baseDir: "./dist"
        }
    });

    gulp.watch("*.html").on("change", reload);
    gulp.watch("css/*.css").on("change", reload);

});

//*********
//gulp.watch('/index.html')
// .on('change',browerSync.reload)
//**********

//gulp eslint task

gulp.task('lint', () => {
    // ESLint ignores files with "node_modules" paths.
    // So, it's best to have gulp ignore the directory as well.
    // Also, Be sure to return the stream from the task;
    // Otherwise, the task may end before the stream has finished.
    return gulp.src(['**/*.js','!node_modules/**'])
        // eslint() attaches the lint output to the "eslint" property
        // of the file object so it can be used by other modules.
        .pipe(eslint())
        // eslint.format() outputs the lint results to the console.
        // Alternatively use eslint.formatEach() (see Docs).
        .pipe(eslint.format())
        // To have the process exit with an error code (1) on
        // lint error, return the stream and pipe to failAfterError last.
        .pipe(eslint.failAfterError());
});
 
// gulp tase for jasmine
 gulp.task('integrationTests', function() {
  return gulp.src('js/script.js')
          .pipe(jasmine({
            integration: true
          }));
});

gulp.task('unitTests', function () {
	return gulp.src('js/script.js')
		.pipe(jasmine());
});

// developemnt to productoin:
  gulp.task('copyhtml', function () {
  return gulp.src('./index.html')
          .pipe(gulp.dest('./dist'));
});

  gulp.task('copyimg', function () {
 /* return gulp.src('img/*')
          .pipe(imagemin({
            progressive: true,
            use: [imageminPngquant()]
          }))
          .pipe(gulp.dest('dist/img'));*/
    return      imagemin(['img/*.{jpg,png}'], 'dist/img', {
    plugins: [
        imageminJpegtran(),
        imageminPngquant({quality: '65-80'})
    ]
}).then(files => {
    console.log(files);
    //=> [{data: <Buffer 89 50 4e …>, path: 'build/images/foo.jpg'}, …]
});
});

gulp.task('scripts', function(){
  return gulp.src('js/**/*.js')
    .pipe(concat('all.js'))
    .pipe(gulp.dest('dist/js'));
});


// distripution task
// pump is used not pipe, pipe can be used
gulp.task('scripts-dist', function(cb){

  pump([
     gulp.src('js/**/*.js'),
     babel(),
   uglify(),
    concat('all.js'),
    sourcemaps.write(),
    gulp.dest('dist/js')
    ],cb);
    

});
// default gulp task calls styles, lint, copyhtml, copyimg tasks
// compatible with gulp 4
gulp.task('default',
// gulp 4 optimazation:
  gulp.series('styles', 'copyimg',/* 'lint', */gulp.parallel( 'copyhtml') ,
//,['task1','task2'], wont work in gulp 4
 function def(){
    gulp.watch('sass/**/*.scss', gulp.series('styles'));
    gulp.watch('js/**/*.js', gulp.series('lint'));
    gulp.watch('./index.html', gulp.series('copyhtml'));
    console.log('all done');
}));
