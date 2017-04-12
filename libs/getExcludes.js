/**
 * Created by jlw on 2017/4/12.
 */
'use strict'

const vfs = require('vinyl-fs')
const through = require('through2')

/**
 * 获取排除处理的图片url列表，该列表直接不经过插件处理直接通过
 * @param excludeGlob
 * @param callBack
 */
function getExcludes(excludeGlob, callBack){

	callBack = callBack || function(){}
	let excludeFiles = []

	const bufferContents = function(file, encoding, cb){
		excludeFiles.push(file.path)
		cb()
	}

	vfs.src(excludeGlob)
		.pipe(through.obj(bufferContents))
		.on('finish', function(){
			callBack(excludeFiles)
		})

}

module.exports = getExcludes