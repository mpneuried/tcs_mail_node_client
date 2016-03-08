_pick = require( "lodash/pick" )
_assignIn = require( "lodash/assignIn" )
_compact = require( "lodash/compact" )
_union = require( "lodash/union" )
_isArray = require( "lodash/isArray" )

module.exports = class Mail extends require( "./basic" )

	constructor: ( @id, @factory, options = {} )->

		@attributes = {}

		@created = Date.now()

		super( options )
		return

	# ## public methods

	send: ( callback )=>

		@_validateAndConvertAttributes @_getAttributes(), ( err, mailData )=>
			if err
				callback( err )
				return
			# start request
			@factory._send( mailData, @_handleSend( callback ) )
			return
		return


	destroy: =>

		@emit( "destroy" )

		return

	to: ( to )=>
		if to?
			if to is false
				@attributes.to = null
			else
				@_validateEmail( "mail-to", to, true, true )
				@attributes.to = to
			@
		else
			@attributes.to

	cc: ( cc )=>
		if cc?
			if cc is false
				@attributes.cc = null
			else
				@_validateEmail( "mail-cc", cc, true, true )
				@attributes.cc = cc
			@
		else
			@attributes.cc

	bcc: ( bcc )=>
		if bcc?
			if bcc is false
				@attributes.bcc = null
			else
				@_validateEmail( "mail-bcc", bcc, true, true )
				@attributes.bcc = bcc
			@
		else
			@attributes.bcc

	reply: ( reply )=>
		if reply?
			if reply is false
				@attributes.reply = null
			else
				@_validateEmail( "mail-reply", reply, true, true )
				@attributes.reply = reply
			@
		else
			@attributes.reply

	returnPath: ( returnPath )=>
		if returnPath?
			if returnPath is false
				@attributes.returnPath = null
			else
				@_validateEmail( "mail-returnpath", returnPath, true, false )
				@attributes.returnPath = returnPath
			@
		else
			@attributes.returnPath

	subject: ( subject )=>
		if subject?

			@_validateString( "mail-subject", subject, true, true )
			@attributes.subject = subject

			@
		else
			@attributes.subject

	text: ( text )=>
		if text?
			if text is false
				@attributes.text = null
			else
				@_validateString( "mail-text", text, true, true )
				@attributes.text = text

			@
		else
			@attributes.text

	html: ( html )=>
		if html?
			if html is false
				@attributes.html = null
			else
				@_validateString( "mail-html", html, true, true )
				@attributes.html = html

			@
		else
			@attributes.html

	tmpl: ( tmplName, data , language, type )->
		console.log "TODO"
		return


	# ## private methods
	
	_getAttributes: =>
		factoryDefaults = _pick( @factory.config(), [ "returnPath", "reply" ] )
		return _assignIn( {}, factoryDefaults, @attributes )

	_validateAndConvertAttributes: ( attrs, cb )=>

		# check for existing subject
		if not attrs.subject? or attrs.subject.length <= 0
			@_handleError( cb, "validation-mail-subject-missing" )
			return

		# check for at least one receiver
		if _compact( _union( [ attrs?.to, attrs?.cc, attrs?.bcc ] ) ).length <= 0
			@_handleError( cb, "validation-mail-receiver-missing" )
			return

		# check for content in text or html
		if ( not attrs?.text? or attrs?.text.length <= 0 ) and ( not attrs?.html? or attrs?.html.length <= 0 )
			@_handleError( cb, "validation-mail-content-missing" )
			return

		# do the conversion to the structure the service requires
		
		factoryConf = @factory.config()

		# define base object
		serviceData =
			appid: @factory.appid
			email: {}
		
		# define sender mail
		if factoryConf.senderemail?
			serviceData.senderemail = factoryConf.senderemail

			serviceData.email.Source = factoryConf.senderemail

		# overwrite source if it differs from sendermail
		if factoryConf.source? and factoryConf.source isnt factoryConf.senderemail
			serviceData.email.Source = factoryConf.source

		# set receivers
		serviceData.email.ToAddresses = ( if _isArray( attrs.to ) then attrs.to else [ attrs.to ] ) if attrs.to?
		serviceData.email.CcAddresses = ( if _isArray( attrs.cc ) then attrs.cc else [ attrs.cc ] ) if attrs.cc?
		serviceData.email.BccAddresses = ( if _isArray( attrs.bcc ) then attrs.bcc else [ attrs.bcc ] ) if attrs.bcc?

		# set bounce and rely adresses
		serviceData.email.ReplyToAddresses = ( if _isArray( attrs.reply ) then attrs.reply else [ attrs.reply ] ) if attrs.reply?

		if attrs.returnPath?
			serviceData.email.ReturnPath = attrs.returnPath
		else if factoryConf.returnPath?
			serviceData.email.ReturnPath = factoryConf.returnPath

		# set mail subject and content
		serviceData.email.Subject = attrs.subject

		if attrs.text?
			serviceData.email.Text = attrs.text

		if attrs.html?
			serviceData.email.Html = attrs.html

		cb( null, serviceData )
		return

	_handleSend: ( callback )=>
		return ( err, mailReturn )=>
			if err
				@emit( "send.error", err )
				@_handleError( callback, err )
				return
			else if mailReturn.statusCode isnt 200
				_err = @_decodeError( mailReturn.body )
				@emit( "send.error", _err )
				@_handleError( callback, _err )
				return

			_ret = @_decodeReturn( mailReturn.body )
			@emit( "send.success", _ret )
			callback( null, _ret )
			return

	_decodeError: ( raw )->
		ret = raw?.Body?.ErrorResponse?.Error

		if ret
			return ret
			
		return raw

	_decodeReturn: ( raw )->
		ret = {}

		ret.recipients = raw.recipients or null
		ret.recipients_blacklisted = raw.recipients_blacklisted  or null
		if ret
			return ret
		return raw

	# # Errors detail helper
	ERRORS: =>
		_assignIn super,
			"validation-mail-to": "The given `to` contains one ore more invalid addresses"
			"validation-mail-cc": "The given `cc` contains one ore more invalid addresses"
			"validation-mail-bcc": "The given `bcc` contains one ore more invalid addresses"
			"validation-mail-receiver-missing": "at least one email address in `to`, `cc` or `bcc` has to be defined"
			"validation-mail-reply": "The given reply contains one ore more invalid addresses"
			"validation-mail-returnpath": "The given returnPath address is not valid"
			"validation-mail-subject": "The given `subject` has to be a string"
			"validation-mail-subject-missing": "A subject ha to be set"
			"validation-mail-text": "The given `text` has to be a string"
			"validation-mail-html": "The given `html` has to be a string"
			"validation-mail-content-missing": "You have to define a content as `html and/or `text`"
