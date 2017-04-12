/**
 * Created by jlw on 2017/4/6.
 */

var gulp = require('gulp')
var gulpUnimage = require('../index')

gulp.task('default', function(){
	gulp.src(['../test/fixture/images/**/*', '../test/fixture/subfolder/images/**/*'], {base: '../test/fixture/'})
		.pipe(gulpUnimage({
			files: '../test/fixture/**/*.{css,html}',
			exclude: '../test/fixture/images/exclude/**/*'
		}))
		.pipe(gulp.dest('dist1/'))
})