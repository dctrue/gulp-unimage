
const should = require('should')

const excludeFiles = require('../libs/excludeFiles')

describe('#excludeFiles test', () => {

	it('should be return exclude files path list', (done) => {
		excludeFiles('./fixture/**/*')
			.should.be.fulfilled()
			.then(filesPaths => {
				// filesPaths.should.be.instanceOf(Array)
				(filesPaths.length).should.be.above(0)
				done()
			})
			.catch(err => {
				console.log(err)
			})
	})

})