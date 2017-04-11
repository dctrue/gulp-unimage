# gulp-unimage

gulp-unimage is a gulp plugin to remove unused image when package images.

## Install

With [npm](https://www.npmjs.com/package/gulp-unimage) do:

```
npm install gulp-unimage --save-dev
```
## Example

You can use sigle files, globbing patterns or URLS to run gulp-unimage:

```js
var gulp = require('gulp')
var gulpUnimage = require('../index')

gulp.task('default', function(){
	gulp.src('../test/fixture/images/**/*')
		.pipe(gulpUnimage({
			files: '../test/fixture/*.{css,html}'
		}))
		.pipe(gulp.dest('dist/images/'))
})
```
## Options

### option.files

Type: `Array|String`
*Required value*

The base files(html|css), we find in this base files, and make sure the image is used or not.

## Release History

* 0.0.3 Fix some bugs:
** some image path can't be found
* 0.0.2 Readme detail
* 0.0.1 Initial release