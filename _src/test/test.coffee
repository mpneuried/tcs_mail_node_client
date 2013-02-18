_ = require("underscore")
should = require('should')

MailFactory = require("../lib/index")

_Cnf = {}

describe 'MAIL-FACTORY-TEST', ->

	before ( done )->
		done()
		return

	after ( done )->
		done()
		return


	describe 'initialize & configure', ->

		mailFactoryA = null

		it 'create new factory', ( done )->
			mailFactoryA = new MailFactory( "wmshop" )

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
			done()

			return

		it 'change configuration - wrong sendermail', ( done )->
			try
				_cnf = mailFactoryA.config( sendermail: "wrongmail" )
				throw "wrong sendermail not thrown"
			catch _err
				_err.name.should.equal( "validation-config-sendermail" )
				done()

			return

		it 'change configuration - multiple sendermails', ( done )->
			try
				_cnf = mailFactoryA.config( sendermail: [ "test@success.de", "check@success.com" ] )
				throw "wrong sendermail not thrown"
			catch _err
				_err.name.should.equal( "validation-config-sendermail" )
				done()

			return

		it 'change configuration - endpoint', ( done )->
			_cnf = mailFactoryA.config( endpoint: "http://nodetest.tcs.de/email/send" )
			done()

			return

		it 'change configuration - wrong endpoint', ( done )->
			try
				_cnf = mailFactoryA.config( endpoint: "wrongurl" )
				throw "wrong endpoint not thrown"
			catch _err
				_err.name.should.equal( "validation-config-endpoint" )
				done()

			return

		it 'change configuration - multiple endpoints', ( done )->
			try
				_cnf = mailFactoryA.config( endpoint: [ "http://node.tcs.de/email/send", "http://nodetest.tcs.de/email/send" ] )
				throw "wrong endpoint not thrown"
			catch _err
				_err.name.should.equal( "validation-config-endpoint" )
				done()

			return

		it 'change configuration - security', ( done )->
			_cnf = mailFactoryA.config( security: { a: 123 } )
			done()

			return

		it 'change configuration - wrong security', ( done )->
			try
				_cnf = mailFactoryA.config( security: "123" )
				throw "wrong security not thrown"
			catch _err
				_err.name.should.equal( "validation-config-security" )
				done()

			return

		it 'change configuration - returnpath', ( done )->
			_cnf = mailFactoryA.config( returnPath: "return@tcs.de" )
			done()

			return

		it 'change configuration - returnpath null', ( done )->
			_cnf = mailFactoryA.config( returnPath: null )
			done()

			return

		it 'change configuration - wrong returnpath', ( done )->
			try
				_cnf = mailFactoryA.config( returnPath: "wrongmail" )
				throw "wrong returnpath not thrown"
			catch _err
				_err.name.should.equal( "validation-config-returnpath" )
				done()

			return

		it 'change configuration - multiple returnpaths', ( done )->
			try
				_cnf = mailFactoryA.config( returnPath: [ "test@success.de", "check@success.com" ] )
				throw "wrong returnpath not thrown"
			catch _err
				_err.name.should.equal( "validation-config-returnpath" )
				done()

			return

		it 'change configuration - from', ( done )->
			_cnf = mailFactoryA.config( from: "return@tcs.de" )
			done()

			return

		it 'change configuration - wrong from', ( done )->
			try
				_cnf = mailFactoryA.config( from: "wrongmail" )
				throw "wrong from not thrown"
			catch _err
				_err.name.should.equal( "validation-config-from" )
				done()

			return

		it 'change configuration - multiple froms', ( done )->
			try
				_cnf = mailFactoryA.config( from: [ "test@success.de", "check@success.com" ] )
				throw "wrong from not thrown"
			catch _err
				_err.name.should.equal( "validation-config-from" )
				done()

			return

		it 'change configuration - reply', ( done )->
			_cnf = mailFactoryA.config( reply: "return@tcs.de" )
			done()

			return

		it 'change configuration - wrong reply', ( done )->
			try
				_cnf = mailFactoryA.config( reply: "wrongmail" )
				throw "wrong reply not thrown"
			catch _err
				_err.name.should.equal( "validation-config-reply" )
				done()

			return

		it 'change configuration - multiple replys', ( done )->
			
			_cnf = mailFactoryA.config( reply: [ "test@success.de", "check@success.com" ] )
			done()

			return

		it 'change configuration - multiple replys + one wrong', ( done )->
			try
				_cnf = mailFactoryA.config( reply: [ "test@success.de", "wrongmail" ] )
				throw "wrong reply not thrown"
			catch _err
				_err.name.should.equal( "validation-config-reply" )
				done()

			return

		it 'change configuration - charset', ( done )->
			_cnf = mailFactoryA.config( charset: "ISO-8859-1" )
			done()

			return

		it 'change configuration - charset null', ( done )->
			_cnf = mailFactoryA.config( charset: null )
			done()

			return

		it 'change configuration - wrong charset', ( done )->
			try
				_cnf = mailFactoryA.config( charset: 1365 )
				throw "wrong charset not thrown"
			catch _err
				_err.name.should.equal( "validation-config-charset" )
				done()

			return

		it 'change configuration - multiple charsets', ( done )->
			try
				_cnf = mailFactoryA.config( charset: [ "ISO-8859-1", "utf-16" ] )
				throw "wrong charset not thrown"
			catch _err
				_err.name.should.equal( "validation-config-charset" )
				done()

			return

		it 'change configuration - charsetsubject', ( done )->
			_cnf = mailFactoryA.config( charsetSubject: "ISO-8859-1" )
			done()

			return

		it 'change configuration - charsetsubject null', ( done )->
			_cnf = mailFactoryA.config( charsetSubject: null )
			done()

			return

		it 'change configuration - wrong charsetsubject', ( done )->
			try
				_cnf = mailFactoryA.config( charsetSubject: 1365 )
				throw "wrong charsetsubject not thrown"
			catch _err
				_err.name.should.equal( "validation-config-charsetsubject" )
				done()

			return

		it 'change configuration - multiple charsetsubjects', ( done )->
			try
				_cnf = mailFactoryA.config( charsetSubject: [ "ISO-8859-1", "utf-16" ] )
				throw "wrong charsetsubject not thrown"
			catch _err
				_err.name.should.equal( "validation-config-charsetsubject" )
				done()

			return

		it 'change configuration - charsettext', ( done )->
			_cnf = mailFactoryA.config( charsetText: "ISO-8859-1" )
			done()

			return

		it 'change configuration - charsettext null', ( done )->
			_cnf = mailFactoryA.config( charsetText: null )
			done()

			return

		it 'change configuration - wrong charsettext', ( done )->
			try
				_cnf = mailFactoryA.config( charsetText: 1365 )
				throw "wrong charsettext not thrown"
			catch _err
				_err.name.should.equal( "validation-config-charsettext" )
				done()

			return

		it 'change configuration - multiple charsettexts', ( done )->
			try
				_cnf = mailFactoryA.config( charsetText: [ "ISO-8859-1", "utf-16" ] )
				throw "wrong charsettext not thrown"
			catch _err
				_err.name.should.equal( "validation-config-charsettext" )
				done()

			return

		it 'change configuration - charsethtml', ( done )->
			_cnf = mailFactoryA.config( charsetHtml: "ISO-8859-1" )
			done()

			return

		it 'change configuration - charsethtml null', ( done )->
			_cnf = mailFactoryA.config( charsetHtml: null )
			done()

			return

		it 'change configuration - wrong charsethtml', ( done )->
			try
				_cnf = mailFactoryA.config( charsetHtml: 1365 )
				throw "wrong charsethtml not thrown"
			catch _err
				_err.name.should.equal( "validation-config-charsethtml" )
				done()

			return

		it 'change configuration - multiple charsethtmls', ( done )->
			try
				_cnf = mailFactoryA.config( charsetHtml: [ "ISO-8859-1", "utf-16" ] )
				throw "wrong charsethtml not thrown"
			catch _err
				_err.name.should.equal( "validation-config-charsethtml" )
				done()

			return

		return
	return