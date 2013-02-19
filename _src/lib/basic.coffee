# # Basic Module

# Basics to handle errors and initialize modules

_ = require( "underscore" )

module.exports = class Basic extends require('events').EventEmitter
	# ## internals

	# **config** *Object* basic object to hold configs
	config: {}

	# **defaukt** *Object* basic object to hold config defaults. Will be overwritten by the constructor options
	defaults: =>
		{}

	###	
	## constructor 

	`new Baisc( {} )`
	
	Basie constriuctor. Define the configuration by options and defaults, init logging and init the error handler

	@param {Object} options Basic config object

	###
	constructor: ( options )->

		@_cnf = _.extend( {}, @defaults(), options )

		# init errors
		if @initErrors? then @initErrors() else @_initErrors()

		return

	# handle a error
	###
	## _handleError
	
	`basic._handleError( cb, err [, data] )`
	
	Baisc error handler. It creates a true error object and returns it to the callback, logs it or throws the error hard
	
	@param { Function|String } cb Callback function or NAme to send it to the logger as error 
	@param { String|Error|Object } err Error type, Obejct or real error object
	
	@api private
	###
	_handleError: ( cb, err, data = {} )=>
		# try to create a error Object with humanized message
		if _.isString( err )
			_err = new Error()
			_err.name = err
			_err.message = @_ERRORS?[ err ]?( data ) or "no details"
		else if err instanceof Error
			_err = err
			_err.message = @_ERRORS?[ err.name ]?( data ) or err.message
		else
			_err = err

		if _.isFunction( cb )
			cb( _err )
		else if cb is true
			throw _err
		return

	###
	## _initErrors
	
	`basic._initErrors(  )`
	
	convert error messages to underscore templates
	
	@api private
	###
	_initErrors: =>
		@_ERRORS = @ERRORS()
		for key, msg of @_ERRORS
			if not _.isFunction( msg )
				@_ERRORS[ key ] = _.template( msg )
		return

	# validation helpers
	_validateEmailRegex: /^(?:[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+\.)*[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+@(?:(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9\-](?!\.)){0,61}[a-zA-Z0-9]?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9\-](?!$)){0,61}[a-zA-Z0-9]?)|(?:\[(?:(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\.){3}(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\]))$/
	_validateEmail: ( type, value, required = false, arrayAllowed = true )=>
		if not value? and not required
			return

		if arrayAllowed and _.isArray( value )
			for str in value when not str.match( @_validateEmailRegex )
				@_handleError( true, "validation-#{type.toLowerCase()}" ) 
		else if _.isArray( value ) and not arrayAllowed
			@_handleError( true, "validation-#{type.toLowerCase()}" ) 
		else if not value.match( @_validateEmailRegex )
			@_handleError( true, "validation-#{type.toLowerCase()}" ) 
		
		return

	# validation helpers
	_validateUrlRegex: /^(?!mailto:)(?:(?:https?|ftp):\/\/)?(?:\S+(?::\S*)?@)?(?:(?:(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))|localhost)(?::\d{2,5})?(?:\/[^\s]*)?$/i
	_validateUrl: ( type, value, required = false, arrayAllowed = false )=>
		if not value? and not required
			return

		if arrayAllowed and _.isArray( value )
			for str in value when str.length >= 2083 and not str.match( @_validateUrlRegex )
				@_handleError( true, "validation-#{type.toLowerCase()}" ) 
		else if _.isArray( value ) and not arrayAllowed
			@_handleError( true, "validation-#{type.toLowerCase()}" ) 
		else if not value.match( @_validateUrlRegex )
			@_handleError( true, "validation-#{type.toLowerCase()}" ) 
		
		return

	_validateObject: ( type, value, required = false )=>
		if not value? and not required
			return

		if not _.isObject( value )
			@_handleError( true, "validation-#{type.toLowerCase()}" ) 
		
		return

	_validateString: ( type, value, required = false )=>
		if not value? and not required
			return

		if not _.isString( value )
			@_handleError( true, "validation-#{type.toLowerCase()}" ) 
		
		return

	_validateCharset: ( type, value, required = false )=>
		if not value? and not required
			return

		if not _.isString( value )
			@_handleError( true, "validation-#{type.toLowerCase()}" ) 
		
		return


	ERRORS: =>
		{}

