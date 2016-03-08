_assignIn = require( "lodash/assignIn" )
_isEmpty = require( "lodash/isEmpty" )
_keys = require( "lodash/keys" )
_bind = require( "lodash/bind" )
_delay = require( "lodash/delay" )
_compact = require( "lodash/compact" )
_union = require( "lodash/union" )
_pick = require( "lodash/pick" )
_omit = require( "lodash/omit" )
async = require( "async" )
request = require( "request" )

Mail = require( "./mail" )

module.exports = class MailFactory extends require( "./basic" )

	mailCache: {}
	mailCacheCurrIdx: 0
	_allowedSecurityKeys: [ "apikey" ]

	# ## defaults
	defaults: =>
		_assignIn super,
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
			# only simulate sending as console output. Just for testing.
			simulate: false

			# TODO template configuration

	constructor: ( @appid, options = {} )->
		
		super( options )
		@config( @_cnf )

		return

	# ## public methods

	config: ( config = {} )=>
		@_cnf = _assignIn( @_cnf, @_validateConfig( config ) ) if config? and not _isEmpty( config )

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
		_keys( @mailCache ).length

	sendAll: ( callback )=>
		afns = []
		for id, mail of @mailCache
			afns.push _bind( ( ( mail, cba )-> mail.send( cba ) ), @, mail )

		async.series afns, ( err, results )=>
			if err
				@_handleError( callback, err )
				return
			callback( null, results )
			return
		return

	# ## private methods
	
	_send: ( mailData, callback )=>

		reqOpt =
			url: @_cnf.endpoint
			method: "POST"
			json: mailData

		reqOpt.headers = @_cnf.security

		if @_cnf.simulate
			_delay( ->
				_recipients = _compact( _union( reqOpt.json.email?.ToAddresses, reqOpt.json.email?.CcAddresses, reqOpt.json.email?.BccAddresses ) )
				_sout = """
===========================================
=              SIMULATED MAIL             =
===========================================
    FROM: #{ reqOpt?.json?.email?.ToAddresses?.join( ", " ) or "-" }
    REPLYTO: #{ reqOpt?.json?.email?.ReplyToAddresses?.join( ", " ) or "-" }
    TO: #{ _recipients.join( ", " ) or "-" }
    SUBJECT: #{ reqOpt?.json?.email?.Subject or "-" }

"""
				if reqOpt.json.email?.Text?.length
					_sout += """
--- BODY: text -----------------------------
#{reqOpt.json.email.Text}

				"""
				if reqOpt.json.email?.Html?.length
					_sout += """

--- BODY: html -----------------------------
#{reqOpt.json.email.Html}

				"""
				_sout += """
============================================
=                  END                     =
============================================



				"""
				console.log _sout
				callback( null, { statusCode: 200, body: { simulated: true, recipients: _recipients } } )
			, 300 )
			return
		
		#console.log "SEND", reqOpt.json
		request( reqOpt, callback )

		return
	

	_validateConfig: ( config )=>
		for key, val of config
			switch key
				when "sendermail", "returnPath" ,"from" then @_validateEmail( "config-#{ key }", val, false, false )
				when "reply" then @_validateEmail( "config-#{ key }", val, false, true )
				when "endpoint" then @_validateUrl( "config-#{ key }", val, true )
				when "security"
					@_validateObject( "config-#{ key }", val )
					config.security = _pick( config.security, "apikey" )
			
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
		@mailCache = _omit( @mailCache, id )
		return


	# # Errors detail helper
	ERRORS: =>
		_assignIn super,
			# config 
			"validation-config-sendermail": "The given sendermail is not a valid e-mail"
			"validation-config-endpoint": "The given endpoint is not a vaild url"
			"validation-config-returnpath": "The given returnPath address is not valid"
			"validation-config-from": "The given from address is not valid"
			"validation-config-reply": "The given from contains one ore more invalid addresses"
			"validation-config-security": "The given security credentials are not an object. Only the keys: `#{ @_allowedSecurityKeys.join( "," ) }` are allowed."
