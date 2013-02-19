_ = require( "underscore" )
async = require( "async" )
request = require( "request" )

Mail = require( "./mail" )

module.exports = class MailFactory extends require( "./basic" )

	mailCache: {}
	mailCacheCurrIdx: 0

	# ## defaults
	defaults: =>
		_.extend super, 
			# **sendermail** *String* The sender mail address. This could also be defined in server based on the `appid`
			sendermail: null
			# **endpoint** *String* The target url
			endpoint: "http://localhost:3000/email/send"
			# **security** *Object* The security credentials
			security: {}
			# **returnPath** *String* Adress for returning mails
			returnPath: "bounces@tcs.de"
			# **from** *String* Usually this will be the sender mail. But it's possible to us a human friendly naming. If not set `config.sendermail` will be used
			from: null
			# **reply** *String | Array* A single reply address or an array of multiple addresses as standard reply. This could be overwritten by `Mail.reply( mails )
			reply: null
			# **charset** *String* General charset. Changing this config will effect all charsets that are not defined specially via `.config()` or `Mail` methods.
			charset: "utf-8"
			# **charsetSubject** *String* Subject charset. Will only be send to server if not `utf-8`.
			charsetSubject: null
			# **charsetText** *String* Text charset. Will only be send to server if not `utf-8`.
			charsetText: null
			# **charsetHtml** *String* Html charset. Will only be send to server if not `utf-8`.
			charsetHtml: null
			# **simulate** *Boolean* Switch to run factory in simulation mode. Used within test scripts.
			simulate: false

			# TODO template configuration

	constructor: ( @appid, options = {} )->
		
		super( options )
		@config( @_cnf )

		return

	# ## public methods

	config: ( config = {} )=>
		@_cnf = _.extend( @_cnf, @_validateConfig( config ) ) if config? and not _.isEmpty( config )

		@_cnf

	create: =>
		id = @_createNewMailID()
		mailObj = new Mail( id, @ )
		@mailCache[ id ] = mailObj

		@_bindMailEvents( id, mailObj )

		mailObj

	get: ( id )=>
		@mailCache[ id ]

	each: ( iterator )=>
		for id, mail of @mailCache
			iterator( id, mail )
		return

	count: =>
		_.keys( @mailCache ).length

	sendAll: ( callback )=>
		afns = []
		for id, mail of @mailCache
			afns.push _.bind( ( ( mail, cba )-> mail.send( cba ) ), @, mail )

		async.series afns, ( err, results )=>
			if err
				@_handleError( callback, err )
				return		
			callback( results )
			return
		return

	# ## private methods
	
	_send: ( mailData, callback )=>

		reqOpt = 
			url: @_cnf.endpoint
			method: "POST"
			json: mailData

		if @_cnf.simulate
			_.delay( =>
				console.log "\n\nSIMULATED SEND\nreceiver:", _.compact( _.union( reqOpt.json.email?.ToAddresses, reqOpt.json.email?.CcAddresses, reqOpt.json.email?.BccAddresses ) ).join( ", " ), "\nsubject:", reqOpt.json.email.Subject
				callback( null, { simulated: true } )
			, 300 )
		else
			console.log "SEND", reqOpt.json
			request( reqOpt, callback )

		return
	

	_validateConfig: ( config )=>
		for key, val of config
			switch key
				when "sendermail", "returnPath" ,"from" then @_validateEmail( "config-#{ key }", val, false, false )
				when "reply" then @_validateEmail( "config-#{ key }", val, false, true )
				when "endpoint" then @_validateUrl( "config-#{ key }", val, true )
				when "security" then @_validateObject( "config-#{ key }", val )
				when "charset", "charsetSubject", "charsetText", "charsetHtml" then @_validateCharset( "config-#{ key }", val )
			
		config

	_createNewMailID: =>
		id = "mid#{ @mailCacheCurrIdx }"

		@mailCacheCurrIdx++
		
		id

	_bindMailEvents: ( id, mailObj )=>
		mailObj.on "destroy", =>
			@_destroyMail( id )
			return

		mailObj.on "send.success", =>
			@_destroyMail( id )
			return

		return

	_destroyMail: ( id )=>
		@mailCache = _.omit( @mailCache, id )
		return


	# # Errors detail helper
	ERRORS: =>
		_.extend super, 
			# config 
			"validation-config-sendermail": "The given sendermail is not a valid e-mail"
			"validation-config-endpoint": "The given endpoint is not a vaild url"
			"validation-config-security": "The given security credentials are not an object"
			"validation-config-returnpath": "The given returnPath address is not valid"
			"validation-config-from": "The given from address is not valid"
			"validation-config-reply": "The given from contains one ore more invalid addresses"
			"validation-config-charset": "The given charset is not a string"
			"validation-config-charsetsubject": "The given charsetSubject is not a string"
			"validation-config-charsettext": "The given charsetText is not a string"
			"validation-config-charsethtml": "The given charsetHtml is not a string"