/**
 * Created by jlw on 2017/4/6.
 */

const path = require('path')

/**
 * 根据URL返回资源类型
 * @param url
 * @returns {*}
 */
exports.typeByUrl = function(url){
	let type = null
	const IMG_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', 'svg', '.ico']
	const HTML_EXTENSIONS = ['.html']
	const CSS_EXTENSIONS = ['.css']
	// 获取扩展名
	const extension = path.extname(url).toLowerCase()
	if(IMG_EXTENSIONS.indexOf(extension) !== -1){
		type = 'image'
	}else if(HTML_EXTENSIONS.indexOf(extension) !== -1){
		type = 'html'
	}else if(CSS_EXTENSIONS.indexOf(extension) !== -1){
		type = 'css'
	}
	return type
}

/**
 * 判断是否是使用的图片
 * @param url
 * @param used
 * @returns {boolean}
 */
exports.isUsedImage = function(url, used){
	let flag = false
	for(let i = 0, len = used.length; i < len; i++){
		if(used[i] === url){
			flag = true
			break
		}
	}
	return flag
}

