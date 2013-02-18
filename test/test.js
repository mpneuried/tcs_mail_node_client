(function() {
  var MailFactory, should, _, _Cnf;

  _ = require("underscore");

  should = require('should');

  MailFactory = require("../lib/index");

  _Cnf = {};

  describe('MAIL-FACTORY-TEST', function() {
    before(function(done) {
      done();
    });
    after(function(done) {
      done();
    });
    describe('initialize & configure', function() {
      var mailFactoryA;
      mailFactoryA = null;
      it('create new factory', function(done) {
        mailFactoryA = new MailFactory("wmshop");
        mailFactoryA.should.be.an.instanceOf(MailFactory);
        done();
      });
      it('change configuration with no content', function(done) {
        var _cnf;
        _cnf = mailFactoryA.config();
        _cnf.should.be.an.instanceOf(Object);
        done();
      });
      it('change configuration - wrong sendermail', function(done) {
        var _cnf;
        _cnf = mailFactoryA.config({
          sendermail: "test@tcs.de"
        });
        done();
      });
      it('change configuration - wrong sendermail', function(done) {
        var _cnf;
        try {
          _cnf = mailFactoryA.config({
            sendermail: "wrongmail"
          });
          throw "wrong sendermail not thrown";
        } catch (_err) {
          _err.name.should.equal("validation-config-sendermail");
          done();
        }
      });
      it('change configuration - multiple sendermails', function(done) {
        var _cnf;
        try {
          _cnf = mailFactoryA.config({
            sendermail: ["test@success.de", "check@success.com"]
          });
          throw "wrong sendermail not thrown";
        } catch (_err) {
          _err.name.should.equal("validation-config-sendermail");
          done();
        }
      });
      it('change configuration - endpoint', function(done) {
        var _cnf;
        _cnf = mailFactoryA.config({
          endpoint: "http://nodetest.tcs.de/email/send"
        });
        done();
      });
      it('change configuration - wrong endpoint', function(done) {
        var _cnf;
        try {
          _cnf = mailFactoryA.config({
            endpoint: "wrongurl"
          });
          throw "wrong endpoint not thrown";
        } catch (_err) {
          _err.name.should.equal("validation-config-endpoint");
          done();
        }
      });
      it('change configuration - multiple endpoints', function(done) {
        var _cnf;
        try {
          _cnf = mailFactoryA.config({
            endpoint: ["http://node.tcs.de/email/send", "http://nodetest.tcs.de/email/send"]
          });
          throw "wrong endpoint not thrown";
        } catch (_err) {
          _err.name.should.equal("validation-config-endpoint");
          done();
        }
      });
      it('change configuration - security', function(done) {
        var _cnf;
        _cnf = mailFactoryA.config({
          security: {
            a: 123
          }
        });
        done();
      });
      it('change configuration - wrong security', function(done) {
        var _cnf;
        try {
          _cnf = mailFactoryA.config({
            security: "123"
          });
          throw "wrong security not thrown";
        } catch (_err) {
          _err.name.should.equal("validation-config-security");
          done();
        }
      });
      it('change configuration - returnpath', function(done) {
        var _cnf;
        _cnf = mailFactoryA.config({
          returnPath: "return@tcs.de"
        });
        done();
      });
      it('change configuration - returnpath null', function(done) {
        var _cnf;
        _cnf = mailFactoryA.config({
          returnPath: null
        });
        done();
      });
      it('change configuration - wrong returnpath', function(done) {
        var _cnf;
        try {
          _cnf = mailFactoryA.config({
            returnPath: "wrongmail"
          });
          throw "wrong returnpath not thrown";
        } catch (_err) {
          _err.name.should.equal("validation-config-returnpath");
          done();
        }
      });
      it('change configuration - multiple returnpaths', function(done) {
        var _cnf;
        try {
          _cnf = mailFactoryA.config({
            returnPath: ["test@success.de", "check@success.com"]
          });
          throw "wrong returnpath not thrown";
        } catch (_err) {
          _err.name.should.equal("validation-config-returnpath");
          done();
        }
      });
      it('change configuration - from', function(done) {
        var _cnf;
        _cnf = mailFactoryA.config({
          from: "return@tcs.de"
        });
        done();
      });
      it('change configuration - wrong from', function(done) {
        var _cnf;
        try {
          _cnf = mailFactoryA.config({
            from: "wrongmail"
          });
          throw "wrong from not thrown";
        } catch (_err) {
          _err.name.should.equal("validation-config-from");
          done();
        }
      });
      it('change configuration - multiple froms', function(done) {
        var _cnf;
        try {
          _cnf = mailFactoryA.config({
            from: ["test@success.de", "check@success.com"]
          });
          throw "wrong from not thrown";
        } catch (_err) {
          _err.name.should.equal("validation-config-from");
          done();
        }
      });
      it('change configuration - reply', function(done) {
        var _cnf;
        _cnf = mailFactoryA.config({
          reply: "return@tcs.de"
        });
        done();
      });
      it('change configuration - wrong reply', function(done) {
        var _cnf;
        try {
          _cnf = mailFactoryA.config({
            reply: "wrongmail"
          });
          throw "wrong reply not thrown";
        } catch (_err) {
          _err.name.should.equal("validation-config-reply");
          done();
        }
      });
      it('change configuration - multiple replys', function(done) {
        var _cnf;
        _cnf = mailFactoryA.config({
          reply: ["test@success.de", "check@success.com"]
        });
        done();
      });
      it('change configuration - multiple replys + one wrong', function(done) {
        var _cnf;
        try {
          _cnf = mailFactoryA.config({
            reply: ["test@success.de", "wrongmail"]
          });
          throw "wrong reply not thrown";
        } catch (_err) {
          _err.name.should.equal("validation-config-reply");
          done();
        }
      });
      it('change configuration - charset', function(done) {
        var _cnf;
        _cnf = mailFactoryA.config({
          charset: "ISO-8859-1"
        });
        done();
      });
      it('change configuration - charset null', function(done) {
        var _cnf;
        _cnf = mailFactoryA.config({
          charset: null
        });
        done();
      });
      it('change configuration - wrong charset', function(done) {
        var _cnf;
        try {
          _cnf = mailFactoryA.config({
            charset: 1365
          });
          throw "wrong charset not thrown";
        } catch (_err) {
          _err.name.should.equal("validation-config-charset");
          done();
        }
      });
      it('change configuration - multiple charsets', function(done) {
        var _cnf;
        try {
          _cnf = mailFactoryA.config({
            charset: ["ISO-8859-1", "utf-16"]
          });
          throw "wrong charset not thrown";
        } catch (_err) {
          _err.name.should.equal("validation-config-charset");
          done();
        }
      });
      it('change configuration - charsetsubject', function(done) {
        var _cnf;
        _cnf = mailFactoryA.config({
          charsetSubject: "ISO-8859-1"
        });
        done();
      });
      it('change configuration - charsetsubject null', function(done) {
        var _cnf;
        _cnf = mailFactoryA.config({
          charsetSubject: null
        });
        done();
      });
      it('change configuration - wrong charsetsubject', function(done) {
        var _cnf;
        try {
          _cnf = mailFactoryA.config({
            charsetSubject: 1365
          });
          throw "wrong charsetsubject not thrown";
        } catch (_err) {
          _err.name.should.equal("validation-config-charsetsubject");
          done();
        }
      });
      it('change configuration - multiple charsetsubjects', function(done) {
        var _cnf;
        try {
          _cnf = mailFactoryA.config({
            charsetSubject: ["ISO-8859-1", "utf-16"]
          });
          throw "wrong charsetsubject not thrown";
        } catch (_err) {
          _err.name.should.equal("validation-config-charsetsubject");
          done();
        }
      });
      it('change configuration - charsettext', function(done) {
        var _cnf;
        _cnf = mailFactoryA.config({
          charsetText: "ISO-8859-1"
        });
        done();
      });
      it('change configuration - charsettext null', function(done) {
        var _cnf;
        _cnf = mailFactoryA.config({
          charsetText: null
        });
        done();
      });
      it('change configuration - wrong charsettext', function(done) {
        var _cnf;
        try {
          _cnf = mailFactoryA.config({
            charsetText: 1365
          });
          throw "wrong charsettext not thrown";
        } catch (_err) {
          _err.name.should.equal("validation-config-charsettext");
          done();
        }
      });
      it('change configuration - multiple charsettexts', function(done) {
        var _cnf;
        try {
          _cnf = mailFactoryA.config({
            charsetText: ["ISO-8859-1", "utf-16"]
          });
          throw "wrong charsettext not thrown";
        } catch (_err) {
          _err.name.should.equal("validation-config-charsettext");
          done();
        }
      });
      it('change configuration - charsethtml', function(done) {
        var _cnf;
        _cnf = mailFactoryA.config({
          charsetHtml: "ISO-8859-1"
        });
        done();
      });
      it('change configuration - charsethtml null', function(done) {
        var _cnf;
        _cnf = mailFactoryA.config({
          charsetHtml: null
        });
        done();
      });
      it('change configuration - wrong charsethtml', function(done) {
        var _cnf;
        try {
          _cnf = mailFactoryA.config({
            charsetHtml: 1365
          });
          throw "wrong charsethtml not thrown";
        } catch (_err) {
          _err.name.should.equal("validation-config-charsethtml");
          done();
        }
      });
      it('change configuration - multiple charsethtmls', function(done) {
        var _cnf;
        try {
          _cnf = mailFactoryA.config({
            charsetHtml: ["ISO-8859-1", "utf-16"]
          });
          throw "wrong charsethtml not thrown";
        } catch (_err) {
          _err.name.should.equal("validation-config-charsethtml");
          done();
        }
      });
    });
  });

}).call(this);
