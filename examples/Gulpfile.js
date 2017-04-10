/**
 * Created by jlw on 2017/4/6.
 */

var gulp = require('gulp')
var gulpUnimage = require('../index')

gulp.task('default', function(){
	gulp.src('../test/fixture/images/**/*')
		.pipe(gulpUnimage({
			files: '../test/fixture/*.{css,html}'
		}))
		.pipe(gulp.dest('dist/images/'))
})