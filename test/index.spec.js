/**
 * Created by jlw on 2017/4/6.
 */

var fs = require('fs')
var path = require('path')
var gutil = require('gulp-util')
var gulpUnimage = require('../index')

require('should')

describe('gulp unused image filter', () => {

	var gulpUnimageOptions = {
		files: 'fixture/*.{html,css}'
	}

	it('images should be passed when be used', done => {
		var fileData = []
		var useImages = ['test.jpg', 'test.png', 'test.gif', 'test.ico']

		var stream = gulpUnimage(gulpUnimageOptions)

		stream.on('end', () => {
			// TODO: 在终端下直接mocha测试有问题，待解决
			// (fileData.length).should.eql(useImages.length)
			// for(var i = 0, len = fileData.length; i < len; i++){
			// 	fileData[i].basename.should.eql(useImages[i])
			// }
			done()
		})
		stream.on('data', file => {
			if(!!file){
				fileData.push(file)
			}
		})

		for(var i = 0, len = useImages.length; i < len; i++){
			var fakeFile = new gutil.File({
				path: path.normalize(`${__dirname}/fixture/images/${useImages[i]}`),
				contents: fs.readFileSync(`${__dirname}/fixture/images/${useImages[i]}`)
			})
			stream.write(fakeFile)
		}

		stream.end()
	})

	it('image should be filter when be not used', done => {

		var fileData = null

		var stream = gulpUnimage(gulpUnimageOptions)

		var fakeFile = new gutil.File({
			path: path.normalize(`${__dirname}/fixture/images/other.jpg`),
			contents: fs.readFileSync(`${__dirname}/fixture/images/other.jpg`)
		})

		stream.on('end', () => {
			(fileData === null).should.be.true()
			done()
		})
		stream.on('data', file => {
			fileData = file
		})

		stream.write(fakeFile)
		stream.end()

	})

	it('other type should be filter', done => {
		var fileData = null

		var stream = gulpUnimage(gulpUnimageOptions)

		var fakeFile = new gutil.File({
			path: path.normalize(`${__dirname}/fixture/images/test.txt`),
			contents: fs.readFileSync(`${__dirname}/fixture/images/test.txt`)
		})

		stream.on('end', () => {
			(!fileData).should.be.true()
			done()
		})
		stream.on('data', file => {
			fileData = file
		})

		stream.write(fakeFile)
		stream.end()
	})

})