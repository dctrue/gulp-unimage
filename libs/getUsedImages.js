/**
 * Created by jlw on 2017/4/7.
 */

var vfs = require('vinyl-fs')
var through = require('through2')
var path = require('path')
var css = require('css')
var htmlParser = require('htmlparser2')

var utils = require('./utils')

/**
 * 读取源过滤文件，获取过滤列表
 * @param filesGlob
 * @param callBack
 */
function getUsedImages(filesGlob, callBack){

	callBack = callBack || function(){}

	var usedImages = []

	/**
	 * 已使用图片列表添加
	 * @param url
	 * @returns {Array}
	 */
	var usedImagesAdd = function(url){
		// base64、非本地地址排除
		if(url.match(/(data|http|https):/)) return

		// 去掉重复的url
		var flag = false
		for(var i = 0, len = usedImages.length; i < len; i++){
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
	var parseCss = function(content, basePath){
		var CSS_REGEXP = new RegExp(/url\(("|'|)(.+?)\1\)/)
		var ast = css.parse(content)
		ast.stylesheet.rules.forEach(function(rule){
			if(rule.type == 'rule'){
				rule.declarations.forEach(function(declaration){
					var match = declaration.value.match(CSS_REGEXP)
					if(match){
						usedImagesAdd(path.resolve(basePath, match[2]))
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
	var parseHtml = function(content, basePath){

		var parser = new htmlParser.Parser({
			onopentag: function(name, attribs){
				var src = null
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

	var bufferContents = function(file, encoding, cb){

		// 样式文件处理
		var fileType = utils.typeByUrl(file.path)
		var fileContents = String(file.contents)
		if(fileType == 'css'){
			parseCss(fileContents, file.base)
		}else if(fileType == 'html'){
			parseHtml(fileContents, file.base)
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