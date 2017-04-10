/**
 * Created by jlw on 2017/4/6.
 */

'use strict'
var through = require('through2')
var gutil = require('gulp-util')
var path = require('path')

var utils = require('./libs/utils')
var getUsedImages = require('./libs/getUsedImages')

// 插件名称
var PLUGIN_NAME = 'gulp-unimage'

/**
 * 过滤没有使用过的图片 主函数
 * @param options {object}
 * @param options.files {glob}
 * @returns {*}
 */
function unUsedImage(options){

	options = options || {}

	// 已使用图片的列表
	var usedImages = null
	// 过滤的文件列表
	var unUsed = {
		image: [],
		other: []
	}

	/**
	 * 添加被过滤列表
	 * @param filePath
	 * @param type
	 */
	function unUsedAdd(filePath, type){
		var nomalPath = path.normalize(filePath)
		type && !!unUsed[type] ? unUsed[type].push(nomalPath) : unUsed['other'].push(nomalPath)
	}

	/**
	 * through2 buffer操作
	 * @param file
	 * @param encoding
	 * @param callBack
	 * @returns {*}
	 */
	function bufferContents(file, encoding, callBack){

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
			unUsedAdd(file.path)
			return callBack()
		}

		/**
		 * 过滤没有使用的图片
		 * @returns {*}
		 */
		var filterImages = function(){
			if(!utils.isUsedImage(file.path, usedImages)){
				unUsedAdd(file.path, 'image')
				return callBack()
			}
			callBack(null, file)
		}

		// 如果还没生成使用图片的列表，先生成列表
		if(usedImages === null){
			getUsedImages(options.files, function(uesdImgs){
				usedImages = uesdImgs || []
				filterImages()
			})
		}else{
			filterImages()
		}

	}

	/**
	 * 结束文件流操作
	 * @param callBack
	 * @returns {*}
	 */
	function endStream(callBack){

		gutil.log('--------------------------------------')
		gutil.log(PLUGIN_NAME + ': Skipping files list: ')
		gutil.log('Unused images: ' + unUsed.image.length)
		gutil.log('And others: ' + unUsed.other.length)
		gutil.log('--------------------------------------')
		// 控制台输出被过滤列表
		for(var key in unUsed){
			for(var i = 0, len = unUsed[key].length; i < len; i++){
				gutil.log(gutil.colors.blue(unUsed[key][i]))
			}
		}
		gutil.log('--------------------------------------')
		callBack()

	}

	var stream = through.obj(bufferContents, endStream)

	// 返回流
	return stream

}

module.exports = unUsedImage
