/**
 * Created by jlw on 2017/4/12.
 */
'use strict'

const vfs = require('vinyl-fs')
const through = require('through2')
const glob = require('glob')
const path = require('path')
const css = require('css')
const htmlParser = require('htmlparser2')
const Promise = require('bluebird')

const usedImages = function(filesGlob, base) {

	return new Promise(function(resolve){

		let usedImages = []

		/**
		 * 已使用图片列表添加
		 * @param url
		 * @returns {Array}
		 */
		const usedImagesAdd = function(url) {
			// base64、非本地地址排除
			if(url.match(/(data|http|https):/)) return

			// 去掉重复的url
			// TODO: 优化代码
			let flag = false
			for(let i = 0, len = usedImages.length; i < len; i++){
				// usedImages[i] === url && (flag = true)
				if(usedImages[i] === url){
					flag = true
					break
				}
			}
			if(!flag) usedImages.push(url)
			return usedImages
		}

		/**
		 * 样式类型处理
		 * @param content
		 * @param dirname
		 * @param file
		 */
		const parseCss = function(content, dirname, file){
			const CSS_REGEXP = new RegExp(/url\(("|'|)(.+?)\1\)/)
			const ast = css.parse(content, {source: file.path})
			ast.stylesheet.rules.forEach(function(rule){
				if(rule.type == 'rule'){
					rule.declarations.forEach(function(declaration){
						if(!!declaration.value){
							const values = declaration.value.split(',')
							for(let i = 0, len = values.length; i < len; i++){
								const match = values[i].match(CSS_REGEXP)
								if(match){
									usedImagesAdd(path.resolve(dirname, match[2]))
								}
							}
						}
					})
				}

			})
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
				parseHtml(fileContents, dirname)
			}

			cb()
		}

		const endStream = function(cb){
			resolve(usedImages)
			cb()
		}

		vfs.src(filesGlob)
			.pipe(through.obj(bufferContents, endStream))

	})

}

module.exports = usedImages