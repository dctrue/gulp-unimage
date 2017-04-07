/**
 * Created by jlw on 2017/4/6.
 */

const gulp = require('gulp')
const gulpUnimage = require('../index')

describe('test', function(){

	it('just a test', function(done){
		gulp.src('test/fixtures/**/*.css')
			.pipe(gulp.dest('test/expected/'))
			.pipe(gulpUnimage())
			.on('end', function(){
				done()
			})
	})

})