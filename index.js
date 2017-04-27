/**
 * Created by jlw on 2017/4/6.
 */

'use strict'

const through = require('through2')
const gutil = require('gulp-util')
const path = require('path')

const getUsedImages = require('./libs/getUsedImages')
const getExcludes = require('./libs/getExcludes')

// 插件名称
const PLUGIN_NAME = 'gulp-unimage'

/**
 * 根据url类型判断是否是图片
 * @param url
 * @returns {boolean}
 */
function isNomalImage(url) {
	// 图片类的扩展名
	const IMG_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.svg', '.ico']
	const extension = path.extname(url).toLowerCase()
	return IMG_EXTENSIONS.indexOf(extension) !== -1
}

/**
 * 过滤没有使用过的图片 主函数
 * @param options {object}
 * @param options.files {glob} 过滤的参考基文件
 * @param options.exclude {glob} 排除过滤动作，直接通过的图片文件
 * @returns {*}
 */
function unUsedImage(options){

	const opts = Object.assign({
		files: null,
		base: '',
		exclude: '',
		debug: false
	}, JSON.parse(JSON.stringify(options)) || {})

	// 已使用图片的列表(不被过滤的图片列表)
	let usedImages = null
	// 过滤的文件列表
	let filters = []
	// 排除不经过插件处理的文件列表
	let excludes = null
	// 过滤文件大小存储
	let fileFilterSize = 0

	/**
	 * 判断是否是过滤的图片
	 * @param filePath
	 * @returns {boolean}
	 */
	function isUsedImage(filePath){
		return usedImages.indexOf(filePath) != -1
	}

	/**
	 * 判断是否在排除文件列表内
	 * @param filePath
	 * @returns {boolean}
	 */
	function isExclude(filePath){
		return (opts.exclude && excludes.indexOf(filePath) != -1) ? true : false
	}

	/**
	 * 把过滤文件加入过滤列表
	 * @param filePath
	 */
	function addFilter(filePath){
		filters.push(path.normalize(filePath))
	}

	/**
	 * 过滤之前事务处理  (已使用图片数据准备、排除不经过插件处理的文件数据准备)
	 * @param callBack
	 */
	function beforeFilter(callBack){

		let count = 0
		const check = function(){
			if(count == 2){
				callBack()
			}
		}

		// 加载排除文件数据
		if(!excludes && !!opts.exclude){
			getExcludes(opts.exclude, function(excludesRes){
				excludes = excludesRes
				++count
				check()
			})
		}else{
			++count
		}
		// 加载已使用图片列表数据
		if(!usedImages){
			getUsedImages(opts.files, opts.base, function(usedImagesRes){
				usedImages = usedImagesRes
				++count
				check()
			})
		}else{
			++count
		}

		check()
	}

	/**
	 * 过滤文件
	 * @param file
	 * @returns {boolean|string}
	 */
	function filter(file){

		const filePath = file.path

		if(isExclude(filePath) || isUsedImage(filePath) || !isNomalImage(filePath)){
			return false
		}
		// 过滤文件
		addFilter(filePath)
		fileFilterSize += file.contents.length
		return file

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

		// 参数传入错误
		if(!opts.files){
			return callBack(new gutil.PluginError(PLUGIN_NAME, 'Params error'))
		}

		// 数据准备
		beforeFilter(function(){

			// 文件过滤
			const result = filter(file)
			if(result){
				// 被过滤文件直接返回空
				return callBack()
			}else{
				// 不被过滤文件，把文件返回
				callBack(null, file)
			}

		})

	}

	/**
	 * 结束文件流操作
	 * @param callBack
	 * @returns {*}
	 */
	function endStream(callBack){

		gutil.log(PLUGIN_NAME + ': Filter '+ filters.length +' images unused. '
			+ gutil.colors.grey('(saved '+ (fileFilterSize/1024).toFixed(1) +' kb)'))
		if(opts.debug){
			gutil.log('--------------------------------------')
			// 控制台输出被过滤列表
			for(let i = 0, len = filters.length; i < len; i++){
				gutil.log('Filte: ' + gutil.colors.blue(filters[i]))
			}
			gutil.log('--------------------------------------')
		}
		callBack()

	}

	// 返回流
	return through.obj(bufferContents, endStream)

}

module.exports = unUsedImage
