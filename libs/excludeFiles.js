/**
 * Created by jlw on 2017/4/12.
 */
'use strict'

const vfs = require('vinyl-fs')
const through = require('through2')
const Promise = require('bluebird')

/**
 * 获取排除处理的图片url列表，该列表直接不经过插件处理直接通过
 * @param excludeGlob
 */
function excludeFiles(excludeGlob){

	return new Promise(function(resolve){

		let excludeFiles = []

		const bufferContents = function(file, encoding, cb){
			excludeFiles.push(file.path)
			cb()
		}

		const endStream = function(cb){
			resolve(excludeFiles)
			cb()
		}

		vfs.src(excludeGlob)
			.pipe(through.obj(bufferContents, endStream))

	})

}

module.exports = excludeFiles