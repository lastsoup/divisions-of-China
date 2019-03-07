/*https://blog.csdn.net/wildye/article/details/80516847*/ 
var gulp = require('gulp'),
gulpif = require('gulp-if'),
gulpjavascriptObfuscator = require('gulp-javascript-obfuscator');
var isProduction = process.env.NODE_ENV === 'production' ? true : false;
var buildDir=isProduction?"build":"dev";

var condition = function(f){
  if(isProduction){
  if(f.path.indexOf('json')>0||f.path.indexOf('.css')>0)
    return false;
  else
    return true;
  }else
   return false;
};

gulp.task('default',  function() {
    return gulp.src(['src/public/**'])
      .pipe(gulpif(condition,gulpjavascriptObfuscator()))
      .pipe(gulp.dest(buildDir+"/public"))
});



