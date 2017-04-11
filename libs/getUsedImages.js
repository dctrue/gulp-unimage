/**
 * Created by jlw on 2017/4/7.
 */

'use strict'

const vfs = require('vinyl-fs')
const through = require('through2')
const path = require('path')
const css = require('css')
const htmlParser = require('htmlparser2')

const utils = require('./utils')

/**
 * 读取源过滤文件，获取过滤列表
 * @param filesGlob
 * @param callBack
 */
function getUsedImages(filesGlob, callBack){

	callBack = callBack || function(){}

	let usedImages = []

	/**
	 * 已使用图片列表添加
	 * @param url
	 * @returns {Array}
	 */
	const usedImagesAdd = function(url){
		// base64、非本地地址排除
		if(url.match(/(data|http|https):/)) return

		// 去掉重复的url
		let flag = false
		for(let i = 0, len = usedImages.length; i < len; i++){
			if(usedImages[i] === url){
				flag = true
			}
		}
		if(!flag) usedImages.push(url)
		return usedImages
	}

	/**
	 * 样式类型处理
	 * @param content
	 * @param basePath
	 */
	const parseCss = function(content, basePath){
		const CSS_REGEXP = new RegExp(/url\(("|'|)(.+?)\1\)/)
		const ast = css.parse(content)
		ast.stylesheet.rules.forEach(function(rule){
			if(rule.type == 'rule'){
				rule.declarations.forEach(function(declaration){
					if(!!declaration.value){
						const match = declaration.value.match(CSS_REGEXP)
						if(match){
							usedImagesAdd(path.resolve(basePath, match[2]))
						}
					}
				})
			}

		})
	}

	/**
	 * html类型处理
	 * @param content
	 * @param basePath
	 */
	const parseHtml = function(content, basePath){

		const parser = new htmlParser.Parser({
			onopentag: function(name, attribs){
				let src = null
				// 正常图片
				if(name === 'img') {
					if(attribs.src){
						src = attribs.src
					}
					if(attribs['ng-src']) {
						src = attribs['ng-src']
					}
				}
				// fav icon
				else if(name === 'link' && attribs.href){
					src = attribs.href
				}
				// msapplication-xxx content
				else if(name === 'meta' && attribs.content){
					src = attribs.content
				}
				// video posters
				else if(name == 'video' && attribs.poster){
					src = attribs.poster
				}
				if(!!src) usedImagesAdd(path.resolve(basePath, src))
			}
		})

		parser.write(content)

	}

	const bufferContents = function(file, encoding, cb){

		// 样式文件处理
		const fileType = utils.typeByUrl(file.path)
		const fileContents = String(file.contents)
		if(fileType == 'css'){
			parseCss(fileContents, path.dirname(file.path))
		}else if(fileType == 'html'){
			parseHtml(fileContents, path.dirname(file.path))
		}

		cb()
	}

	vfs.src(filesGlob)
		.pipe(through.obj(bufferContents))
		.on('finish', function(){
			callBack(usedImages)
		})

}

module.exports = getUsedImages