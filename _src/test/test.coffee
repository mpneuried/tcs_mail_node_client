fs = require("fs")
_ = require("lodash")
should = require('should')

MailFactory = require("../lib/index")

Mail = require("../lib/index").mail

try
	_factoryB = require( "../test_config_factoryB.js" )
	console.info "Using config for FactoryB of file `test_config_factoryB.js"
catch _err
	_factoryB =
		appid: "wmshop"
		config:
			endpoint: "http://localhost:3000/email/send"

_Cnf =
	realReceiver: "mp@tcs.de"
	realCcReceiver: "mp+cc@tcs.de"
	realBccReceiver: "mp+bcc@tcs.de"
	factoryA:
		appid: "wmshop"
		config:
			simulate: true
	factoryB: _factoryB
		

randRange = ( lowVal, highVal )->
	Math.floor( Math.random()*(highVal-lowVal+1 ))+lowVal

randomString = ( string_length = 5, specialLevel = 0, spaces = .1, breaks = 0  ) ->
	chars = "BCDFGHJKLMNPQRSTVWXYZbcdfghjklmnpqrstvwxyz"
	chars += "0123456789" if specialLevel >= 1
	chars += "_-@:." if specialLevel >= 2
	chars += "!\"§$%&/()=?*'_:;,.-#+¬”#£ﬁ^\\˜·¯˙˚«∑€®†Ω¨⁄øπ•‘æœ@∆ºª©ƒ∂‚å–…∞µ~∫√ç≈¥" if specialLevel >= 3

	randomstring = ""
	i = 0
	
	while i < string_length
		rnum = Math.floor(Math.random() * chars.length)
		if spaces > 0 and ( randRange( 0, 100 ) < ( 100 * spaces ) )
			randomstring += " "
		else if breaks > 0 and ( randRange( 0, 100 ) < ( 100 * breaks ) )
			randomstring += "\n"
		else
			randomstring += chars.substring(rnum, rnum + 1)
		i++
		randomstring

	randomstring

describe 'MAIL-FACTORY-TEST', ->

	before ( done )->
		done()
		return

	after ( done )->
		done()
		return

	mailFactoryA = null

	describe 'initialize & configure', ->

		it 'create new factory', ( done )->
			mailFactoryA = new MailFactory( _Cnf.factoryA.appid, _Cnf.factoryA.config )

			mailFactoryA.should.be.an.instanceOf MailFactory

			done()
			return

		it 'change configuration with no content', ( done )->

			_cnf = mailFactoryA.config()
			_cnf.should.be.an.instanceOf Object

			done()

			return

		it 'change configuration - wrong sendermail', ( done )->

			_cnf = mailFactoryA.config( sendermail: "test@tcs.de" )

			_cnf.should.have.property( "sendermail" ).with.be.a.String().and.equal "test@tcs.de"
			done()

			return

		it 'change configuration - wrong sendermail', ( done )->
			try
				_cnf = mailFactoryA.config( sendermail: "wrongmail" )
			catch _err
				_err.name.should.equal( "validation-config-sendermail" )
				done()
				return

			throw new Error( "wrong sendermail not thrown" )

			return

		it 'change configuration - multiple sendermails', ( done )->
			try
				_cnf = mailFactoryA.config( sendermail: [ "test@success.de", "check@success.com" ] )
			catch _err
				_err.name.should.equal( "validation-config-sendermail" )
				done()
				return

			throw new Error( "wrong sendermail not thrown" )
			return

		it 'change configuration - endpoint', ( done )->
			_cnf = mailFactoryA.config( endpoint: "http://nodetest.tcs.de/email/send" )

			_cnf.should.have.property( "endpoint" ).with.be.a.String().and.equal "http://nodetest.tcs.de/email/send"
			done()

			return

		it 'change configuration - wrong endpoint', ( done )->
			try
				_cnf = mailFactoryA.config( endpoint: "wrongurl" )
			catch _err
				_err.name.should.equal( "validation-config-endpoint" )
				done()
				return

			throw new Error( "wrong endpoint not thrown" )
			return

		it 'change configuration - multiple endpoints', ( done )->
			try
				_cnf = mailFactoryA.config( endpoint: [ "http://node.tcs.de/email/send", "http://nodetest.tcs.de/email/send" ] )
			catch _err
				_err.name.should.equal( "validation-config-endpoint" )
				done()
				return

			throw new Error( "wrong endpoint not thrown" )
			return

		it 'change configuration - security with ignored keys', ( done )->
			_cnf = mailFactoryA.config( security: { b: "asdf", a: 123 } )

			_cnf.should.have.property( "security" ).with.be.a.Object().and.eql {}

			done()

			return

		it 'change configuration - security', ( done )->
			_cnf = mailFactoryA.config( security: { apikey: "abcdefg", xxx: 1233 } )

			_cnf.should.have.property( "security" ).with.be.a.Object().and.eql { apikey: "abcdefg" }

			done()

			return

		it 'change configuration - wrong security', ( done )->
			try
				_cnf = mailFactoryA.config( security: "123" )
			catch _err
				_err.name.should.equal( "validation-config-security" )
				done()
				return

			throw new Error( "wrong security not thrown" )
			return

		it 'change configuration - returnpath', ( done )->
			_cnf = mailFactoryA.config( returnPath: "return@tcs.de" )

			_cnf.should.have.property( "returnPath" ).with.be.a.String().and.equal "return@tcs.de"

			done()

			return

		it 'change configuration - returnpath null', ( done )->
			_cnf = mailFactoryA.config( returnPath: null )


			done()

			return

		it 'change configuration - wrong returnpath', ( done )->
			try
				_cnf = mailFactoryA.config( returnPath: "wrongmail" )
			catch _err
				_err.name.should.equal( "validation-config-returnpath" )
				done()
				return

			throw new Error( "wrong returnpath not thrown" )
			return

		it 'change configuration - multiple returnpaths', ( done )->
			try
				_cnf = mailFactoryA.config( returnPath: [ "test@success.de", "check@success.com" ] )
			catch _err
				_err.name.should.equal( "validation-config-returnpath" )
				done()
				return

			throw new Error( "wrong returnpath not thrown" )
			return

		it 'change configuration - from', ( done )->
			_cnf = mailFactoryA.config( from: "return@tcs.de" )
			done()

			return

		it 'change configuration - wrong from', ( done )->
			try
				_cnf = mailFactoryA.config( from: "wrongmail" )
			catch _err
				_err.name.should.equal( "validation-config-from" )
				done()
				return

			throw new Error( "wrong from not thrown" )
			return

		it 'change configuration - multiple froms', ( done )->
			try
				_cnf = mailFactoryA.config( from: [ "test@success.de", "check@success.com" ] )
			catch _err
				_err.name.should.equal( "validation-config-from" )
				done()
				return

			throw new Error( "wrong from not thrown" )
			return

		it 'change configuration - reply', ( done )->
			_cnf = mailFactoryA.config( reply: "return@tcs.de" )

			_cnf.should.have.property( "reply" ).with.be.a.String().and.equal "return@tcs.de"
			done()

			return

		it 'change configuration - wrong reply', ( done )->
			try
				_cnf = mailFactoryA.config( reply: "wrongmail" )
			catch _err
				_err.name.should.equal( "validation-config-reply" )
				done()
				return

			throw new Error( "wrong reply not thrown" )
			return

		it 'change configuration - multiple replys', ( done )->
			
			_cnf = mailFactoryA.config( reply: [ "test@success.de", "check@success.com" ] )

			_cnf.should.have.property( "reply" ).with.be.an.instanceOf( Array ).and.have.length( 2 )

			done()

			return

		it 'change configuration - multiple replys + one wrong', ( done )->
			try
				_cnf = mailFactoryA.config( reply: [ "test@success.de", "wrongmail" ] )
				throw new Error( "wrong reply not thrown" )
			catch _err
				_err.name.should.equal( "validation-config-reply" )
				done()

			return

		return


	describe 'factory methods', ->

		mails = []

		it 'create a mail', ( done )->
			mail = mailFactoryA.create()

			mails.push( mail )
			mail.should.be.instanceOf Mail

			mails[ 0 ].should.eql( mail )

			done()

			return

		it 'get a mail', ( done )->
			mail = mailFactoryA.get( mails[ 0 ].id )

			mail.should.be.instanceOf Mail

			mails[ 0 ].should.eql( mail )

			done()

			return

		it 'destroy a mail', ( done )->
			mail = mailFactoryA.get( mails[ 0 ].id )

			mail.destroy()

			mail = mailFactoryA.get( mails[ 0 ].id )
			should.not.exist( mail )

			mails = []

			done()

			return

		it 'add 4 mails', ( done )->
			for i in [0..3]
				mails.push mailFactoryA.create().subject( "TEST #{i}" ).text( "CONTENT #{i}" ).to( "test#{i}@tcs.de" )
			
			mailFactoryA.count().should.equal mails.length
			done()

			return

		it 'send all mails', ( done )->
			mailFactoryA.sendAll ( err )->

				should.not.exist( err )

				mailFactoryA.count().should.equal 0
				mails = []
				done()
				return
			

			return

		return

	describe 'mail methods', ->

		mails = []
		mailA = null

		it 'create a test mail', ( done )->
			mailA = mailFactoryA.create()

			mails.push( mailA )
			mailA.should.be.instanceOf Mail

			mails[ 0 ].should.eql( mailA )

			done()

			return

		it 'set to - single', ( done )->
			_to = mailA.to( "test@tcs.de" ).to()

			_to.should.be.a.String().and.equal "test@tcs.de"

			done()

			return

		it 'set to - reset', ( done )->
			_to = mailA.to( false ).to()

			should.not.exist( _to )

			done()

			return

		it 'set to - multiple', ( done )->
			_to = mailA.to( [ "testA@tcs.de", "testB@tcs.de", "testC@tcs.de" ] ).to()

			_to.should.be.an.Array().and.have.length( 3 )

			done()

			return

		it 'set to - single wrong', ( done )->

			try
				_to = mailA.to( "testAtcs.de" )
			catch _err
				_err.name.should.equal( "validation-mail-to" )
				done()
				return

			throw new Error( "wrong to - single not thrown" )
			return

		it 'set to - multiple wrong', ( done )->

			try
				_to = mailA.to( [ "testA@tcs.de", "testBtcs.de", "testC@tcs.de" ] )
			catch _err
				_err.name.should.equal( "validation-mail-to" )
				done()
				return

			throw new Error( "wrong to - multiple not thrown" )
			return

		it 'set cc - single', ( done )->
			_cc = mailA.cc( "test@tcs.de" ).cc()

			_cc.should.be.a.String().and.equal "test@tcs.de"

			done()

			return

		it 'set cc - multiple', ( done )->
			_cc = mailA.cc( [ "testA@tcs.de", "testB@tcs.de", "testC@tcs.de" ] ).cc()

			_cc.should.be.an.Array().and.have.length( 3 )

			done()

			return

		it 'set cc - single wrong', ( done )->

			try
				_cc = mailA.cc( "testAtcs.de" )
			catch _err
				_err.name.should.equal( "validation-mail-cc" )
				done()
				return

			throw new Error( "wrong cc - single not thrown" )
			return

		it 'set cc - multiple wrong', ( done )->

			try
				_cc = mailA.cc( [ "testA@tcs.de", "testBtcs.de", "testC@tcs.de" ] )
			catch _err
				_err.name.should.equal( "validation-mail-cc" )
				done()
				return

			throw new Error( "wrong cc - multiple not thrown" )
			return

		it 'set cc - reset', ( done )->
			_cc = mailA.cc( false ).cc()

			should.not.exist( _cc )

			done()

			return


		it 'set bcc - single', ( done )->
			_bcc = mailA.bcc( "test@tcs.de" ).bcc()

			_bcc.should.be.a.String().and.equal "test@tcs.de"

			done()

			return

		it 'set bcc - multiple', ( done )->
			_bcc = mailA.bcc( [ "testA@tcs.de", "testB@tcs.de", "testC@tcs.de" ] ).bcc()

			_bcc.should.be.an.Array().and.have.length( 3 )

			done()

			return

		it 'set bcc - single wrong', ( done )->

			try
				_bcc = mailA.bcc( "testAtcs.de" )
			catch _err
				_err.name.should.equal( "validation-mail-bcc" )
				done()
				return

			throw new Error( "wrong bcc - single not thrown" )
			return

		it 'set bcc - multiple wrong', ( done )->

			try
				_bcc = mailA.bcc( [ "testA@tcs.de", "testBtcs.de", "testC@tcs.de" ] )
			catch _err
				_err.name.should.equal( "validation-mail-bcc" )
				done()
				return

			throw new Error( "wrong bcc - multiple not thrown" )
			return

		it 'set bcc - reset', ( done )->
			_bcc = mailA.bcc( false ).bcc()

			should.not.exist( _bcc )

			done()

			return

		it 'set subject', ( done )->
			_subject = mailA.subject( "Test Subject" ).subject()

			_subject.should.be.a.String().and.equal "Test Subject"

			done()

			return

		it 'set subject - long', ( done )->
			_val = randomString( 150, 2, .2, .05 )
			_subject = mailA.subject( _val ).subject()

			_subject.should.be.a.String().and.equal _val

			done()

			return

		it 'set subject - html', ( done )->
			_val = "<b>This is my html string</b>"
			_subject = mailA.subject( _val ).subject()

			_subject.should.be.a.String().and.equal _val

			done()

			return

		it 'set subject - reset', ( done )->
			try
				mailA.subject( false )
			catch _err
				_err.name.should.equal( "validation-mail-subject" )

				_val = "<b>This is my html string</b>"
				_subject = mailA.subject()
				_subject.should.be.a.String().and.equal _val
				done()
				return

			throw new Error( "wrong subject - reset not thrown" )
			return

		it 'set subject - wrong type', ( done )->
			_val = [ "my array subject" ]
		
			try
				mailA.subject( _val )
			catch _err
				_err.name.should.equal( "validation-mail-subject" )
				done()
				return

			throw new Error( "wrong subject - type not thrown" )
			return

		it 'set text', ( done )->
			_val = randomString( 150, 2, .2, .05 )
			_text = mailA.text( _val ).text()

			_text.should.be.a.String().and.equal _val

			done()

			return

		it 'set text - html', ( done )->
			_val = "<b>My HTML subject</b>"
			_text = mailA.text( _val ).text()

			_text.should.be.a.String().and.equal _val

			done()

			return

		it 'set text - reset', ( done )->
			_val = false
			_text = mailA.text( _val ).text()

			should.not.exist( _text )

			done()

			return

		it 'set text - long', ( done )->
			_val = randomString( 1000, 2, .2, .05 )
			_text = mailA.text( _val ).text()

			_text.should.be.a.String().and.equal _val

			done()

			return

		it 'set text - wrong type', ( done )->
			_val = [ "my array text" ]
		
			try
				mailA.text( _val )
			catch _err
				_err.name.should.equal( "validation-mail-text" )
				done()
				return

			throw new Error( "wrong text - type not thrown" )
			return

		it 'set html', ( done )->
			_val = randomString( 150, 2, .2, .05 )
			_html = mailA.html( _val ).html()

			_html.should.be.a.String().and.equal _val

			done()

			return

		it 'set html - html from file', ( done )->
			fs.readFile './test/data/html_example.html', ( err, file )->
				if err
					throw err
					return
				_val = file.toString( "utf-8" )
				_html = mailA.html( _val ).html()

				_html.should.be.a.String().and.equal _val

				done()
				return

			return

		it 'set html - reset', ( done )->
			_val = false
			_html = mailA.html( _val ).html()

			should.not.exist( _html )

			done()

			return

		it 'set html - wrong type', ( done )->
			_val = [ "my array html" ]
		
			try
				mailA.html( _val )
			catch _err
				_err.name.should.equal( "validation-mail-html" )
				done()
				return

			throw new Error( "wrong html - type not thrown" )
			return

		it 'set reply - single', ( done )->
			_reply = mailA.reply( "test@tcs.de" ).reply()

			_reply.should.be.a.String().and.equal "test@tcs.de"

			done()

			return

		it 'set reply - reset', ( done )->
			_reply = mailA.reply( false ).reply()

			should.not.exist( _reply )

			done()

			return

		it 'set reply - multiple', ( done )->
			_reply = mailA.reply( [ "testA@tcs.de", "testB@tcs.de", "testC@tcs.de" ] ).reply()

			_reply.should.be.an.Array().and.have.length( 3 )

			done()

			return

		it 'set reply - single wrong', ( done )->

			try
				_reply = mailA.reply( "testAtcs.de" )
				throw new Error( "wrong reply - single not thrown" )
			catch _err
				_err.name.should.equal( "validation-mail-reply" )
				done()

			return

		it 'set reply - multiple wrong', ( done )->

			try
				_reply = mailA.reply( [ "testA@tcs.de", "testBtcs.de", "testC@tcs.de" ] )
			catch _err
				_err.name.should.equal( "validation-mail-reply" )
				done()
				return

			throw new Error( "wrong reply - multiple not thrown" )
			return


		it 'set returnPath - single', ( done )->
			_returnPath = mailA.returnPath( "test@tcs.de" ).returnPath()

			_returnPath.should.be.a.String().and.equal "test@tcs.de"

			done()

			return

		it 'set returnPath - reset', ( done )->
			_returnPath = mailA.returnPath( false ).returnPath()

			should.not.exist( _returnPath )

			done()

			return

		it 'set returnPath - multiple', ( done )->

			try
				_returnPath = mailA.returnPath( [ "testA@tcs.de", "testB@tcs.de", "testC@tcs.de" ] )
			catch _err
				_err.name.should.equal( "validation-mail-returnpath" )
				done()
				return

			throw new Error( "wrong returnPath - multiple not thrown" )
			return

		it 'set returnPath - single wrong', ( done )->

			try
				_returnPath = mailA.returnPath( "testAtcs.de" )
			catch _err
				_err.name.should.equal( "validation-mail-returnpath" )
				done()
				return

			throw new Error( "wrong returnPath - single not thrown" )
			return

		it 'send this mail', ( done )->
			mailA.send ( err )->
				if err
					throw err
					return
				done()
				return
			return

		return

	describe 'mail send tests', ->

		mailFactoryB = null

		it 'create new factory', ( done )->
			mailFactoryB = new MailFactory( _Cnf.factoryB.appid, _Cnf.factoryB.config )

			mailFactoryB.should.be.an.instanceOf MailFactory

			done()
			return

		it 'create and send mail - simple', ( done )->

			_mail = mailFactoryB.create().subject( "Simple Test" ).text( "TEST" ).to( _Cnf.realReceiver )
			_mail.send ( err, result )->
				should.not.exist( err )
				result.should.have.property( "recipients" ).with.be.an.Array().and.containEql( _Cnf.realReceiver )
				done()
				return
			return

		it 'create and send mail - missing subject', ( done )->

			mailFactoryB.create().to( "testB@tcs.de" ).send ( err )->
				should.exist( err )
				err.should.have.property( "name" ).with.be.a.String().and.equal "validation-mail-subject-missing"
				done()
				return
			return

		it 'create and send mail - missing receiver', ( done )->

			mailFactoryB.create().subject( "no receiver" ).send ( err )->
				should.exist( err )
				err.should.have.property( "name" ).with.be.a.String().and.equal "validation-mail-receiver-missing"
				done()
				return
			return

		it 'create and send mail - missing content', ( done )->

			mailFactoryB.create().subject( "missing content" ).bcc( _Cnf.realReceiver ).send ( err, result )->
				should.exist( err )
				err.should.have.property( "name" ).with.be.a.String().and.equal "validation-mail-content-missing"
				done()
				return
			return

		it 'create and send mail - with html content', ( done )->

			mailFactoryB.create().subject( "HTML TEST" ).html( "<html><header><style>h1{color:#f00;}</style></header><body><h1 class=\"test\">Simple html content</h1><p>Test the sending of mails</p></html></body>" ).to( _Cnf.realReceiver ).send ( err, result )->
				should.not.exist( err )

				result.should.have.property( "recipients" ).with.be.an.Array().and.containEql( _Cnf.realReceiver )
				done()
				return
			return

		it 'create and send mail - with large html content', ( done )->
			fs.readFile './test/data/html_example.html', ( err, file )->
				if err
					throw err
					return
				_val = file.toString( "utf-8" )
				mailFactoryB.create().subject( "TCS E-Mail Node Client" ).html( _val ).to( _Cnf.realReceiver ).bcc( _Cnf.realCcReceiver ).send ( err, result )->
					should.not.exist( err )

					result.should.have.property( "recipients" ).with.be.an.Array().and.containEql( _Cnf.realReceiver )
					done()
					return
				return
			return

		return

	return
