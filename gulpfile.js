/*https://blog.csdn.net/wildye/article/details/80516847*/ 
var gulp = require('gulp'),
gulpif = require('gulp-if'),
gulpjavascriptObfuscator = require('gulp-javascript-obfuscator');
var isProduction = process.env.NODE_ENV === 'production' ? true : false;
var buildDir=isProduction?"build":"dev";

var condition = function(f){
  if(f.path.indexOf('.json')>0)
    return false;
  else
    return true;
};
gulp.task('default',  function() {
    return gulp.src(['src/public/**','!src/public/json/*.js'])
      .pipe(gulpif(condition,gulpjavascriptObfuscator()))
      .pipe(gulp.dest(buildDir+"/public"))
});


