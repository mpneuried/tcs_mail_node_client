_ = require( "underscore" )


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

	_handleSend: ( callback )=>
		return ( err, mailReturn )=>
			if err
				@emit( "send.error", err )
				@_handleError( callback, err )
				return

			@emit( "send.success", mailReturn )
			callback( null, mailReturn )
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

	subject: ( subject, charset )=>
		if subject?

			@_validateString( "mail-subject", subject, true, true )
			@attributes.subject = subject

			if charset?
				@_validateCharset( "mail-subject-charset", charset )
				@attributes.charsetSubject = charset.toUpperCase()

			@
		else
			@attributes.subject

	text: ( text, charset )=>
		if text?
			if text is false
				@attributes.text = null
			else
				@_validateString( "mail-text", text, true, true )
				@attributes.text = text

			if charset?
				@_validateCharset( "mail-text-charset", charset )
				@attributes.charsetText = charset.toUpperCase()

			@
		else
			@attributes.text

	html: ( html, charset )=>
		if html?
			if html is false
				@attributes.html = null
			else
				@_validateString( "mail-html", html, true, true )
				@attributes.html = html

			if charset?
				@_validateCharset( "mail-html-charset", charset )
				@attributes.charsetHtml = charset.toUpperCase()

			@
		else
			@attributes.html

	tmpl: ( tmplName, data , language, type )=>
		console.log "TODO"
		return


	# ## private methods
	
	_getAttributes: =>
		factoryDefaults = _.pick( @factory.config(), [ "returnPath", "reply", "charset", "charsetSubject", "charsetText", "charsetHtml" ] )
		_.extend( {}, factoryDefaults, @attributes )

	_validateAndConvertAttributes: ( attrs, cb )=>

		# check for existing subject
		if not attrs.subject? or attrs.subject.length <= 0
			@_handleError( cb, "validation-mail-subject-missing" )
			return

		# check for at least one receiver
		if _.compact( _.union( attrs?.to, attrs?.cc, attrs?.bcc ) ).length <= 0
			@_handleError( cb, "validation-mail-receiver-missing" )
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
		serviceData.email.ToAddresses = ( if _.isArray( attrs.to ) then attrs.to else [ attrs.to ] ) if attrs.to?
		serviceData.email.CcAddresses = ( if _.isArray( attrs.cc ) then attrs.cc else [ attrs.cc ] ) if attrs.cc?
		serviceData.email.BccAddresses = ( if _.isArray( attrs.bcc ) then attrs.bcc else [ attrs.bcc ] ) if attrs.bcc?

		# set bounce and rely adresses
		serviceData.email.ReplyToAddresses = ( if _.isArray( attrs.reply ) then attrs.reply else [ attrs.reply ] ) if attrs.reply?

		serviceData.email.ReturnPath = attrs.returnPath if attrs.returnPath?

		# set mail subject and content
		serviceData.email.Subject = attrs.subject
		if attrs.charsetSubject? and attrs.charsetSubject isnt "UTF-8"
			serviceData.email.SubjectCharset = attrs.charsetSubject

		if attrs.text?
			serviceData.email.Text = attrs.text
			if attrs.charsetText? and attrs.charsetText isnt "UTF-8"
				serviceData.email.TextCharset = attrs.charsetText

		if attrs.html?
			serviceData.email.Html = attrs.html
			if attrs.charsetHtml? and attrs.charsetHtml isnt "UTF-8"
				serviceData.email.HtmlCharset = attrs.charsetHtml

		cb( null, serviceData )
		return

	# # Errors detail helper
	ERRORS: =>
		_.extend super, 
			# config 
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
			"validation-mail-subject-charset": "The given charset for the subject is not a string"
			"validation-mail-text-charset": "The given charset for the text is not a string"
			"validation-mail-html-charset": "The given charset for the html is not a string"
