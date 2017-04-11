/**
 * Created by jlw on 2017/4/6.
 */

'use strict'
const fs = require('fs')
const path = require('path')
const gutil = require('gulp-util')
const gulpUnimage = require('../index')

require('should')

/**
 * use plug test
 * @param image
 * @param callBack
 */
function initTest(image, callBack){
	const gulpUnimageOptions = {
		files: 'fixture/**/*.{html,css}'
	}
	let fileData = null

	const stream = gulpUnimage(gulpUnimageOptions)

	const fakeFile = new gutil.File({
		path: path.normalize(`${__dirname}/${image}`),
		contents: fs.readFileSync(`${__dirname}/${image}`)
	})

	stream.on('end', () => {
		callBack(fileData)
	})
	stream.on('data', file => {
		fileData = file
	})

	stream.write(fakeFile)
	stream.end()
}

describe('gulp unused image filter', () => {

	it('images should be passed when be used', done => {
		const images = [
			'fixture/images/test.jpg',
			'fixture/images/test.png',
			'fixture/images/test.gif',
			'fixture/images/test.ico'
		]
		for(let i = 0, len = images.length; i < len; i++){
			initTest(images[i], function(file){
				(images[i].indexOf(file.basename)).should.not.be.eql(-1)
				if(i == len-1) done()
			})
		}
	})

	it('image in subfolder should be passed when sbe used', done => {
		initTest('fixture/subfolder/images/test.jpg', function(file){
			file.basename.should.eql('test.jpg')
			done()
		})
	})

	it('image should be filter when be not used', done => {
		initTest('fixture/images/other.jpg', function(file){
			(file === null).should.be.true()
			done()
		})
	})

	it('other type should be filter', done => {
		initTest('fixture/images/test.txt', function(file){
			(file === null).should.be.true()
			done()
		})
	})

})