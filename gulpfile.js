var gulp = require('gulp');
var {buildDir} = require("./webpack.variable");

gulp.task('default',  function() {
    return gulp.src('src/public/*')
      .pipe(gulp.dest(buildDir+"/public"))
});