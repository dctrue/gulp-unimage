/**
 * Created by jlw on 2017/4/6.
 */

const fs = require('fs')
const path = require('path')
const gutil = require('gulp-util')
const gulpUnimage = require('../index')

require('should')

describe('gulp unused image filter', () => {

	const gulpUnimageOptions = {
		files: 'fixture/*.{html,css}'
	}

	it('images should be passed when be used', done => {
		var fileData = []
		let useImages = ['test.jpg', 'test.png', 'test.gif', 'test.ico']

		const stream = gulpUnimage(gulpUnimageOptions)

		stream.on('end', () => {
			// TODO: 在终端下直接mocha测试有问题，待解决
			// (fileData.length).should.eql(useImages.length)
			// for(let i = 0, len = fileData.length; i < len; i++){
			// 	fileData[i].basename.should.eql(useImages[i])
			// }
			done()
		})
		stream.on('data', file => {
			if(!!file){
				fileData.push(file)
			}
		})

		for(let i = 0, len = useImages.length; i < len; i++){
			const fakeFile = new gutil.File({
				path: path.normalize(`${__dirname}/fixture/images/${useImages[i]}`),
				contents: fs.readFileSync(`${__dirname}/fixture/images/${useImages[i]}`)
			})
			stream.write(fakeFile)
		}

		stream.end()
	})

	it('image should be filter when be not used', done => {

		let fileData = null

		const stream = gulpUnimage(gulpUnimageOptions)

		const fakeFile = new gutil.File({
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
		let fileData = null

		const stream = gulpUnimage(gulpUnimageOptions)

		const fakeFile = new gutil.File({
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