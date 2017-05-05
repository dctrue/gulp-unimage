/**
 * Created by jlw on 2017/4/6.
 */

'use strict'
const fs = require('fs')
const path = require('path')
const gutil = require('gulp-util')
const gulpUnimage = require('../index')

const should = require('should')

/**
 * use plug test
 * @param image
 * @param plugOptions
 * @param callBack
 */
function initTest(image, plugOptions, callBack){
	let gulpUnimageOptions = {
		files: 'fixture/**/*.{html,css}'
	}
	if(arguments.length == 2){
		callBack = plugOptions
	}else{
		gulpUnimageOptions = Object.assign(gulpUnimageOptions, plugOptions)
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

	it('images should be piped when be used', done => {
		const images = [
			'fixture/images/test.jpg',
			'fixture/images/test.png',
			'fixture/images/test.gif',
			'fixture/images/test.ico'
		]
		for(let i = 0, len = images.length; i < len; i++){
			initTest(images[i], function(file){
				should.exist(file)
				file.path.indexOf(images[i].split('/')[2]).should.above(-1)
				if(i == len-1) done()
			})
		}
	})

	it('image in subfolder should be piped when be used', done => {
		initTest('fixture/subfolder/images/test.jpg', function(file){
			should.exist(file)
			file.path.indexOf('test.jpg').should.above(-1)
			done()
		})
	})

	it('some image not be used but in exclude file list should be piped', done => {
		const plugOptions = {
			exclude: 'fixture/images/exclude/**/*'
		}
		initTest('fixture/images/exclude/exclude.jpg', plugOptions, function(file){
			should.exist(file)
			file.path.indexOf('exclude.jpg').should.above(-1)
			done()
		})
	})

	it('image should be filter when be not used', done => {
		initTest('fixture/images/other.jpg', function(file){
			should.not.exist(file)
			done()
		})
	})

	it('other type should be piped', done => {
		initTest('fixture/images/test.txt', function(file){
			should.exist(file)
			file.path.indexOf('test.txt').should.above(-1)
			done()
		})
	})

})