/**
 * Created by jlw on 2017/4/6.
 */

const gulp = require('gulp')
const gulpUnimage = require('../index')

gulp.task('default', function(){
	// gulp.src('fixtures/**/*.{png,jpg,gif}')
	gulp.src('fixtures/images/**/*')
		.pipe(gulpUnimage({
			// files: 'fixtures/*.css'
			files: 'fixtures/*.{css,html}'
		}))
		.pipe(gulp.dest('expected/images/'))
})