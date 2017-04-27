/**
 * Created by jlw on 2017/4/7.
 */

'use strict'

const vfs = require('vinyl-fs')
const through = require('through2')
const path = require('path')
const css = require('css')
const htmlParser = require('htmlparser2')

/**
 * 读取源过滤文件，获取过滤列表
 * @param filesGlob
 * @param base
 * @param callBack
 */
function getUsedImages(filesGlob, base, callBack){

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
	 * @param dirname
	 */
	const parseCss = function(content, dirname, file){
		const CSS_REGEXP = new RegExp(/url\(("|'|)(.+?)\1\)/)
		try{
			const ast = css.parse(content)
			ast.stylesheet.rules.forEach(function(rule){
				if(rule.type == 'rule'){
					rule.declarations.forEach(function(declaration){
						if(!!declaration.value){
							const match = declaration.value.match(CSS_REGEXP)
							if(match){
								usedImagesAdd(path.resolve(dirname, match[2]))
							}
						}
					})
				}

			})
		}catch(e){
			let err = new Error('[gulp-unimage]: ' +
				'file: ' + file.path +
				' ' + e.reason +
				' in line ' + e.line +
				' column ' + e.column)
			err.filename = file.basename
			err.path = file.path
			throw err
		}
	}

	/**
	 * html类型处理
	 * @param content
	 * @param dirname
	 */
	const parseHtml = function(content, dirname){

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
				if(!!src){
					usedImagesAdd(path.resolve(dirname, src))
				}
			}
		})

		parser.write(content)

	}

	const bufferContents = function(file, encoding, cb){

		// 样式文件处理
		const extname = file.extname
		const fileContents = String(file.contents)
		const dirname = base ? path.dirname(path.resolve(base, file.relative)) : file.dirname
		if(extname == '.css'){
			parseCss(fileContents, dirname, file)
		}else if(extname == '.html'){
			parseHtml(fileContents, dirname, file)
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