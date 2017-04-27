
const should = require('should')
const rewire = require('rewire')

const index = rewire('../index.js')

describe('index test', () => {

	describe('private methods test in index', () => {

		describe('index private method #isImageByUrl() test', () => {

			const isNomalImage = index.__get__('isNomalImage')
			const MOCK_IMAGE_URL = [
				'../imges/test.jpg',
				'../imges/test.jpeg',
				'../imges/test.png',
				'../imges/test.gif',
				'../imges/test.ico',
				'../imges/test.svg'
			]
			const MOCK_UNIMAGE_URL = [
				'../other/test.txt',
				'../other/test.css',
				'../other/test.html',
			]

			it('should return true when typeof url is a image', () => {
				MOCK_IMAGE_URL.forEach(url => {
					isNomalImage(url).should.be.equal(true)
				})
			})

			it('should return false when typeof url is not a image', () => {
				MOCK_UNIMAGE_URL.forEach(url => {
					isNomalImage(url).should.be.equal(false)
				})
			})

		})

	})

})
