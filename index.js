/**
 * Created by jlw on 2017/4/6.
 */

'use strict'
const through = require('through2')
const gutil = require('gulp-util')

const utils = require('./libs/utils')
const getUsedImages = require('./libs/getUsedImages')

// 插件名称
const PLUGIN_NAME = 'gulp-unimage'

function unUsedImage(options){

	options = options || {}

	//已使用图片的列表
	let usedImages = null

	const bufferContents = function(file, encoding, callBack){

		// 空文件直接返回
		if(file.isNull()){
			return callBack(null, file)
		}
		// 不支持文件流
		if(file.isStream()){
			return callBack(new gutil.PluginError(PLUGIN_NAME, 'Streaming is not supported'))
		}

		// 过滤不是图片的文件
		if(utils.typeByUrl(file.path) != 'image'){
			gutil.log(PLUGIN_NAME + ': Skipping unsupported image ' + gutil.colors.blue(file.relative))
			return callBack()
		}

		// 过滤非使用的图片
		const filterImages = function(){
			if(!utils.isUsedImage(file.path, usedImages)){
				return callBack()
			}
			callBack(null, file)
		}

		//如果未生成使用图片的列表，先获取列表
		if(usedImages === null){
			getUsedImages(options.files, function(uesdImgs){
				usedImages = uesdImgs || []
				filterImages()
			})
		}else{
			filterImages()
		}

	}

	const stream = through.obj(bufferContents)

	// 返回流
	return stream

}

module.exports = unUsedImage
