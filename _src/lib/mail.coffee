module.exports = class Mail extends require( "./basic" )

	constructor: ( @id, @factory, options = {} )->

		@created = Date.now()

		super( options )
		return


