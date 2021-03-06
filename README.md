# gulp-unimage

It's a gulp plugin that help you filter some unsed image when package images.

## Install

With [npm](https://www.npmjs.com/package/gulp-unimage) do:

```
npm install gulp-unimage --save-dev
```
## Example

You can use single files, globbing patterns or URLS to run gulp-unimage:

```js
var gulp = require('gulp')
var gulpUnimage = require('../index')

gulp.task('default', function(){
	gulp.src(['../test/fixture/images/**/*', '../test/fixture/subfolder/images/**/*'], {base: '../test/fixture/'})
		.pipe(gulpUnimage({
			files: '../test/fixture/**/*.{css,html}',
			base: '../test/fixture/',
			exclude: '../test/fixture/images/exclude/**/*',
			debug: true
		}))
		.pipe(gulp.dest('dist/'))
})
```
## Options

### option.files

Type: `Array|String`
*Required value*

The base files(html|css), we find in this base files, and make sure the image is used or not.

### option.base

Type: `String`

Default: `''`

You can change html or css files base path to another, in order to find the right image path.

Please use carefully!!!

### option.exclude

Type: `Array|String`

The File want to be exclude

Default: `''`

### option.debug

Type: `boolean`

Default: `false`

Run with debug mode

## Release History

### 0.1.2
* add image base support
### 0.0.3
* add exclude files support
* some known bugs fixed
### 0.0.2 Readme detail
### 0.0.1 Initial release