# gulp-unimage

gulp-unimage is a gulp plugin to remove unused image when package images.

## Install

With [npm](https://www.npmjs.com/package/gulp-unimage) do:

```
npm install gulp-unimage --save-dev
```
## Example

You can use single files, globbing patterns or URLS to run gulp-unimage:

```js
gulp.task('default', function(){
	gulp.src(['../test/fixture/images/**/*', '../test/fixture/subfolder/images/**/*'], {base: '../test/fixture/'})
		.pipe(gulpUnimage({
			files: '../test/fixture/**/*.{css,html}',
			exclude: '../test/fixture/images/exclude/**/*'
		}))
		.pipe(gulp.dest('dist1/'))
})
```
## Options

### option.files

Type: `Array|String`
*Required value*

The base files(html|css), we find in this base files, and make sure the image is used or not.

### option.exclude

Type: 'Array|String'

The File want to be exclude

## Release History

* 0.0.3
 + add exclude files support
 + some known bugs fixed
* 0.0.2 Readme detail
* 0.0.1 Initial release