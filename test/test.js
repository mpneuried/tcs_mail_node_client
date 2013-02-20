(function() {
  var Mail, MailFactory, fs, randRange, randomString, should, _, _Cnf;

  fs = require("fs");

  _ = require("underscore");

  should = require('should');

  MailFactory = require("../lib/index");

  Mail = require("../lib/index").mail;

  _Cnf = {
    realReceiver: "mp@tcs.de",
    realCcReceiver: "pl@tcs.de",
    realBccReceiver: "mp+bcc@tcs.de"
  };

  randRange = function(lowVal, highVal) {
    return Math.floor(Math.random() * (highVal - lowVal + 1)) + lowVal;
  };

  randomString = function(string_length, specialLevel, spaces, breaks) {
    var chars, i, randomstring, rnum;
    if (string_length == null) {
      string_length = 5;
    }
    if (specialLevel == null) {
      specialLevel = 0;
    }
    if (spaces == null) {
      spaces = .1;
    }
    if (breaks == null) {
      breaks = 0;
    }
    chars = "BCDFGHJKLMNPQRSTVWXYZbcdfghjklmnpqrstvwxyz";
    if (specialLevel >= 1) {
      chars += "0123456789";
    }
    if (specialLevel >= 2) {
      chars += "_-@:.";
    }
    if (specialLevel >= 3) {
      chars += "!\"§$%&/()=?*'_:;,.-#+¬”#£ﬁ^\\˜·¯˙˚«∑€®†Ω¨⁄øπ•‘æœ@∆ºª©ƒ∂‚å–…∞µ~∫√ç≈¥";
    }
    randomstring = "";
    i = 0;
    while (i < string_length) {
      rnum = Math.floor(Math.random() * chars.length);
      if (spaces > 0 && (randRange(0, 100) < (100 * spaces))) {
        randomstring += " ";
      } else if (breaks > 0 && (randRange(0, 100) < (100 * breaks))) {
        randomstring += "\n";
      } else {
        randomstring += chars.substring(rnum, rnum + 1);
      }
      i++;
      randomstring;

    }
    return randomstring;
  };

  describe('MAIL-FACTORY-TEST', function() {
    var mailFactoryA;
    before(function(done) {
      done();
    });
    after(function(done) {
      done();
    });
    mailFactoryA = null;
    describe('initialize & configure', function() {
      it('create new factory', function(done) {
        mailFactoryA = new MailFactory("wmshop", {
          simulate: true
        });
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
        _cnf.should.have.property("sendermail")["with"].be.a("string").and.equal("test@tcs.de");
        done();
      });
      it('change configuration - wrong sendermail', function(done) {
        var _cnf;
        try {
          _cnf = mailFactoryA.config({
            sendermail: "wrongmail"
          });
        } catch (_err) {
          _err.name.should.equal("validation-config-sendermail");
          done();
          return;
        }
        throw "wrong sendermail not thrown";
      });
      it('change configuration - multiple sendermails', function(done) {
        var _cnf;
        try {
          _cnf = mailFactoryA.config({
            sendermail: ["test@success.de", "check@success.com"]
          });
        } catch (_err) {
          _err.name.should.equal("validation-config-sendermail");
          done();
          return;
        }
        throw "wrong sendermail not thrown";
      });
      it('change configuration - endpoint', function(done) {
        var _cnf;
        _cnf = mailFactoryA.config({
          endpoint: "http://nodetest.tcs.de/email/send"
        });
        _cnf.should.have.property("endpoint")["with"].be.a("string").and.equal("http://nodetest.tcs.de/email/send");
        done();
      });
      it('change configuration - wrong endpoint', function(done) {
        var _cnf;
        try {
          _cnf = mailFactoryA.config({
            endpoint: "wrongurl"
          });
        } catch (_err) {
          _err.name.should.equal("validation-config-endpoint");
          done();
          return;
        }
        throw "wrong endpoint not thrown";
      });
      it('change configuration - multiple endpoints', function(done) {
        var _cnf;
        try {
          _cnf = mailFactoryA.config({
            endpoint: ["http://node.tcs.de/email/send", "http://nodetest.tcs.de/email/send"]
          });
        } catch (_err) {
          _err.name.should.equal("validation-config-endpoint");
          done();
          return;
        }
        throw "wrong endpoint not thrown";
      });
      it('change configuration - security', function(done) {
        var _cnf;
        _cnf = mailFactoryA.config({
          security: {
            a: 123
          }
        });
        _cnf.should.have.property("security")["with"].be.a("object").and.eql({
          a: 123
        });
        done();
      });
      it('change configuration - wrong security', function(done) {
        var _cnf;
        try {
          _cnf = mailFactoryA.config({
            security: "123"
          });
        } catch (_err) {
          _err.name.should.equal("validation-config-security");
          done();
          return;
        }
        throw "wrong security not thrown";
      });
      it('change configuration - returnpath', function(done) {
        var _cnf;
        _cnf = mailFactoryA.config({
          returnPath: "return@tcs.de"
        });
        _cnf.should.have.property("returnPath")["with"].be.a("string").and.equal("return@tcs.de");
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
        } catch (_err) {
          _err.name.should.equal("validation-config-returnpath");
          done();
          return;
        }
        throw "wrong returnpath not thrown";
      });
      it('change configuration - multiple returnpaths', function(done) {
        var _cnf;
        try {
          _cnf = mailFactoryA.config({
            returnPath: ["test@success.de", "check@success.com"]
          });
        } catch (_err) {
          _err.name.should.equal("validation-config-returnpath");
          done();
          return;
        }
        throw "wrong returnpath not thrown";
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
        } catch (_err) {
          _err.name.should.equal("validation-config-from");
          done();
          return;
        }
        throw "wrong from not thrown";
      });
      it('change configuration - multiple froms', function(done) {
        var _cnf;
        try {
          _cnf = mailFactoryA.config({
            from: ["test@success.de", "check@success.com"]
          });
        } catch (_err) {
          _err.name.should.equal("validation-config-from");
          done();
          return;
        }
        throw "wrong from not thrown";
      });
      it('change configuration - reply', function(done) {
        var _cnf;
        _cnf = mailFactoryA.config({
          reply: "return@tcs.de"
        });
        _cnf.should.have.property("reply")["with"].be.a("string").and.equal("return@tcs.de");
        done();
      });
      it('change configuration - wrong reply', function(done) {
        var _cnf;
        try {
          _cnf = mailFactoryA.config({
            reply: "wrongmail"
          });
        } catch (_err) {
          _err.name.should.equal("validation-config-reply");
          done();
          return;
        }
        throw "wrong reply not thrown";
      });
      it('change configuration - multiple replys', function(done) {
        var _cnf;
        _cnf = mailFactoryA.config({
          reply: ["test@success.de", "check@success.com"]
        });
        _cnf.should.have.property("reply")["with"].be.an.instanceOf(Array).and.have.length(2);
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
        _cnf.should.have.property("charset")["with"].be.a("string").and.equal("ISO-8859-1");
        done();
      });
      it('change configuration - charset null', function(done) {
        var _cnf;
        _cnf = mailFactoryA.config({
          charset: null
        });
        _cnf.should.have.property("charset")["with"].eql(null);
        done();
      });
      it('change configuration - wrong charset', function(done) {
        var _cnf;
        try {
          _cnf = mailFactoryA.config({
            charset: 1365
          });
        } catch (_err) {
          _err.name.should.equal("validation-config-charset");
          done();
          return;
        }
        throw "wrong charset not thrown";
      });
      it('change configuration - multiple charsets', function(done) {
        var _cnf;
        try {
          _cnf = mailFactoryA.config({
            charset: ["ISO-8859-1", "utf-16"]
          });
        } catch (_err) {
          _err.name.should.equal("validation-config-charset");
          done();
          return;
        }
        throw "wrong charset not thrown";
      });
      it('change configuration - charsetsubject', function(done) {
        var _cnf;
        _cnf = mailFactoryA.config({
          charsetSubject: "ISO-8859-1"
        });
        _cnf.should.have.property("charsetSubject")["with"].be.a("string").and.equal("ISO-8859-1");
        done();
      });
      it('change configuration - charsetsubject null', function(done) {
        var _cnf;
        _cnf = mailFactoryA.config({
          charsetSubject: null
        });
        _cnf.should.have.property("charsetSubject")["with"].eql(null);
        done();
      });
      it('change configuration - wrong charsetsubject', function(done) {
        var _cnf;
        try {
          _cnf = mailFactoryA.config({
            charsetSubject: 1365
          });
        } catch (_err) {
          _err.name.should.equal("validation-config-charsetsubject");
          done();
          return;
        }
        throw "wrong charsetsubject not thrown";
      });
      it('change configuration - multiple charsetsubjects', function(done) {
        var _cnf;
        try {
          _cnf = mailFactoryA.config({
            charsetSubject: ["ISO-8859-1", "utf-16"]
          });
        } catch (_err) {
          _err.name.should.equal("validation-config-charsetsubject");
          done();
          return;
        }
        throw "wrong charsetsubject not thrown";
      });
      it('change configuration - charsettext null', function(done) {
        var _cnf;
        _cnf = mailFactoryA.config({
          charsetText: null
        });
        _cnf.should.have.property("charsetText")["with"].eql(null);
        done();
      });
      it('change configuration - charsettext', function(done) {
        var _cnf;
        _cnf = mailFactoryA.config({
          charsetText: "ISO-8859-1"
        });
        _cnf.should.have.property("charsetText")["with"].be.a("string").and.equal("ISO-8859-1");
        done();
      });
      it('change configuration - wrong charsettext', function(done) {
        var _cnf;
        try {
          _cnf = mailFactoryA.config({
            charsetText: 1365
          });
        } catch (_err) {
          _err.name.should.equal("validation-config-charsettext");
          done();
          return;
        }
        throw "wrong charsettext not thrown";
      });
      it('change configuration - multiple charsettexts', function(done) {
        var _cnf;
        try {
          _cnf = mailFactoryA.config({
            charsetText: ["ISO-8859-1", "utf-16"]
          });
        } catch (_err) {
          _err.name.should.equal("validation-config-charsettext");
          done();
          return;
        }
        throw "wrong charsettext not thrown";
      });
      it('change configuration - charsethtml', function(done) {
        var _cnf;
        _cnf = mailFactoryA.config({
          charsetHtml: "ISO-8859-1"
        });
        _cnf.should.have.property("charsetHtml")["with"].be.a("string").and.equal("ISO-8859-1");
        done();
      });
      it('change configuration - charsethtml null', function(done) {
        var _cnf;
        _cnf = mailFactoryA.config({
          charsetHtml: null
        });
        _cnf.should.have.property("charsetHtml")["with"].eql(null);
        done();
      });
      it('change configuration - wrong charsethtml', function(done) {
        var _cnf;
        try {
          _cnf = mailFactoryA.config({
            charsetHtml: 1365
          });
        } catch (_err) {
          _err.name.should.equal("validation-config-charsethtml");
          done();
          return;
        }
        throw "wrong charsethtml not thrown";
      });
      it('change configuration - multiple charsethtmls', function(done) {
        var _cnf;
        try {
          _cnf = mailFactoryA.config({
            charsetHtml: ["ISO-8859-1", "utf-16"]
          });
        } catch (_err) {
          _err.name.should.equal("validation-config-charsethtml");
          done();
          return;
        }
        throw "wrong charsethtml not thrown";
      });
    });
    describe('factory methods', function() {
      var mails;
      mails = [];
      it('create a mail', function(done) {
        var mail;
        mail = mailFactoryA.create();
        mails.push(mail);
        mail.should.be.instanceOf(Mail);
        mails[0].should.eql(mail);
        done();
      });
      it('get a mail', function(done) {
        var mail;
        mail = mailFactoryA.get(mails[0].id);
        mail.should.be.instanceOf(Mail);
        mails[0].should.eql(mail);
        done();
      });
      it('destroy a mail', function(done) {
        var mail;
        mail = mailFactoryA.get(mails[0].id);
        mail.destroy();
        mail = mailFactoryA.get(mails[0].id);
        should.not.exist(mail);
        mails = [];
        done();
      });
      it('add 4 mails', function(done) {
        var i, _i;
        for (i = _i = 0; _i <= 3; i = ++_i) {
          mails.push(mailFactoryA.create().subject("TEST " + i).text("CONTENT " + i).to("test" + i + "@tcs.de"));
        }
        mailFactoryA.count().should.equal(mails.length);
        done();
      });
      it('send all mails', function(done) {
        var _this = this;
        mailFactoryA.sendAll(function(err) {
          should.not.exist(err);
          mailFactoryA.count().should.equal(0);
          mails = [];
          done();
        });
      });
    });
    describe('mail methods', function() {
      var mailA, mails;
      mails = [];
      mailA = null;
      it('create a test mail', function(done) {
        mailA = mailFactoryA.create();
        mails.push(mailA);
        mailA.should.be.instanceOf(Mail);
        mails[0].should.eql(mailA);
        done();
      });
      it('set to - single', function(done) {
        var _to;
        _to = mailA.to("test@tcs.de").to();
        _to.should.be.a("string").and.equal("test@tcs.de");
        done();
      });
      it('set to - reset', function(done) {
        var _to;
        _to = mailA.to(false).to();
        should.not.exist(_to);
        done();
      });
      it('set to - multiple', function(done) {
        var _to;
        _to = mailA.to(["testA@tcs.de", "testB@tcs.de", "testC@tcs.de"]).to();
        _to.should.be.an["instanceof"](Array).and.have.length(3);
        done();
      });
      it('set to - single wrong', function(done) {
        var _to;
        try {
          _to = mailA.to("testAtcs.de");
        } catch (_err) {
          _err.name.should.equal("validation-mail-to");
          done();
          return;
        }
        throw "wrong to - single not thrown";
      });
      it('set to - multiple wrong', function(done) {
        var _to;
        try {
          _to = mailA.to(["testA@tcs.de", "testBtcs.de", "testC@tcs.de"]);
        } catch (_err) {
          _err.name.should.equal("validation-mail-to");
          done();
          return;
        }
        throw "wrong to - multiple not thrown";
      });
      it('set cc - single', function(done) {
        var _cc;
        _cc = mailA.cc("test@tcs.de").cc();
        _cc.should.be.a("string").and.equal("test@tcs.de");
        done();
      });
      it('set cc - multiple', function(done) {
        var _cc;
        _cc = mailA.cc(["testA@tcs.de", "testB@tcs.de", "testC@tcs.de"]).cc();
        _cc.should.be.an["instanceof"](Array).and.have.length(3);
        done();
      });
      it('set cc - single wrong', function(done) {
        var _cc;
        try {
          _cc = mailA.cc("testAtcs.de");
        } catch (_err) {
          _err.name.should.equal("validation-mail-cc");
          done();
          return;
        }
        throw "wrong cc - single not thrown";
      });
      it('set cc - multiple wrong', function(done) {
        var _cc;
        try {
          _cc = mailA.cc(["testA@tcs.de", "testBtcs.de", "testC@tcs.de"]);
        } catch (_err) {
          _err.name.should.equal("validation-mail-cc");
          done();
          return;
        }
        throw "wrong cc - multiple not thrown";
      });
      it('set cc - reset', function(done) {
        var _cc;
        _cc = mailA.cc(false).cc();
        should.not.exist(_cc);
        done();
      });
      it('set bcc - single', function(done) {
        var _bcc;
        _bcc = mailA.bcc("test@tcs.de").bcc();
        _bcc.should.be.a("string").and.equal("test@tcs.de");
        done();
      });
      it('set bcc - multiple', function(done) {
        var _bcc;
        _bcc = mailA.bcc(["testA@tcs.de", "testB@tcs.de", "testC@tcs.de"]).bcc();
        _bcc.should.be.an["instanceof"](Array).and.have.length(3);
        done();
      });
      it('set bcc - single wrong', function(done) {
        var _bcc;
        try {
          _bcc = mailA.bcc("testAtcs.de");
        } catch (_err) {
          _err.name.should.equal("validation-mail-bcc");
          done();
          return;
        }
        throw "wrong bcc - single not thrown";
      });
      it('set bcc - multiple wrong', function(done) {
        var _bcc;
        try {
          _bcc = mailA.bcc(["testA@tcs.de", "testBtcs.de", "testC@tcs.de"]);
        } catch (_err) {
          _err.name.should.equal("validation-mail-bcc");
          done();
          return;
        }
        throw "wrong bcc - multiple not thrown";
      });
      it('set bcc - reset', function(done) {
        var _bcc;
        _bcc = mailA.bcc(false).bcc();
        should.not.exist(_bcc);
        done();
      });
      it('set subject', function(done) {
        var _subject;
        _subject = mailA.subject("Test Subject").subject();
        _subject.should.be.a("string").and.equal("Test Subject");
        done();
      });
      it('set subject - long', function(done) {
        var _subject, _val;
        _val = randomString(150, 2, .2, .05);
        _subject = mailA.subject(_val).subject();
        _subject.should.be.a("string").and.equal(_val);
        done();
      });
      it('set subject - html', function(done) {
        var _subject, _val;
        _val = "<b>This is my html string</b>";
        _subject = mailA.subject(_val).subject();
        _subject.should.be.a("string").and.equal(_val);
        done();
      });
      it('set subject - reset', function(done) {
        var _subject, _val;
        try {
          mailA.subject(false);
        } catch (_err) {
          _err.name.should.equal("validation-mail-subject");
          _val = "<b>This is my html string</b>";
          _subject = mailA.subject();
          _subject.should.be.a("string").and.equal(_val);
          done();
          return;
        }
        throw "wrong subject - reset not thrown";
      });
      it('set subject - charset', function(done) {
        var _subject, _val;
        _val = "Test Subject charset";
        _subject = mailA.subject(_val, "ISO-8859-1").subject();
        _subject.should.be.a("string").and.equal(_val);
        mailA._getAttributes().should.have.property("charsetSubject")["with"].be.a("string").and.equal("ISO-8859-1");
        done();
      });
      it('set subject - wrong type', function(done) {
        var _val;
        _val = ["my array subject"];
        try {
          mailA.subject(_val);
        } catch (_err) {
          _err.name.should.equal("validation-mail-subject");
          done();
          return;
        }
        throw "wrong subject - type not thrown";
      });
      it('set text', function(done) {
        var _text, _val;
        _val = randomString(150, 2, .2, .05);
        _text = mailA.text(_val).text();
        _text.should.be.a("string").and.equal(_val);
        done();
      });
      it('set text - html', function(done) {
        var _text, _val;
        _val = "<b>My HTML subject</b>";
        _text = mailA.text(_val).text();
        _text.should.be.a("string").and.equal(_val);
        done();
      });
      it('set text - reset', function(done) {
        var _text, _val;
        _val = false;
        _text = mailA.text(_val).text();
        should.not.exist(_text);
        done();
      });
      it('set text - long', function(done) {
        var _text, _val;
        _val = randomString(1000, 2, .2, .05);
        _text = mailA.text(_val).text();
        _text.should.be.a("string").and.equal(_val);
        done();
      });
      it('set text - wrong type', function(done) {
        var _val;
        _val = ["my array text"];
        try {
          mailA.text(_val);
        } catch (_err) {
          _err.name.should.equal("validation-mail-text");
          done();
          return;
        }
        throw "wrong text - type not thrown";
      });
      it('set html', function(done) {
        var _html, _val;
        _val = randomString(150, 2, .2, .05);
        _html = mailA.html(_val).html();
        _html.should.be.a("string").and.equal(_val);
        done();
      });
      it('set html - html from file', function(done) {
        fs.readFile('./test/data/html_example.html', function(err, file) {
          var _html, _val;
          if (err) {
            throw err;
            return;
          }
          _val = file.toString("utf-8");
          _html = mailA.html(_val).html();
          _html.should.be.a("string").and.equal(_val);
          done();
        });
      });
      it('set html - reset', function(done) {
        var _html, _val;
        _val = false;
        _html = mailA.html(_val).html();
        should.not.exist(_html);
        done();
      });
      it('set html - wrong type', function(done) {
        var _val;
        _val = ["my array html"];
        try {
          mailA.html(_val);
        } catch (_err) {
          _err.name.should.equal("validation-mail-html");
          done();
          return;
        }
        throw "wrong html - type not thrown";
      });
      it('set html - charset "Windows 1252"', function(done) {
        fs.readFile('./test/data/html_example_win1252.html', function(err, file) {
          var _html, _val;
          _val = file.toString("utf-8");
          _html = mailA.html(_val, "Windows 1252").html();
          _html.should.be.a("string").and.equal(_val);
          mailA._getAttributes().should.have.property("charsetHtml")["with"].be.a("string").and.equal("Windows 1252".toUpperCase());
          done();
        });
      });
      it('set reply - single', function(done) {
        var _reply;
        _reply = mailA.reply("test@tcs.de").reply();
        _reply.should.be.a("string").and.equal("test@tcs.de");
        done();
      });
      it('set reply - reset', function(done) {
        var _reply;
        _reply = mailA.reply(false).reply();
        should.not.exist(_reply);
        done();
      });
      it('set reply - multiple', function(done) {
        var _reply;
        _reply = mailA.reply(["testA@tcs.de", "testB@tcs.de", "testC@tcs.de"]).reply();
        _reply.should.be.an["instanceof"](Array).and.have.length(3);
        done();
      });
      it('set reply - single wrong', function(done) {
        var _reply;
        try {
          _reply = mailA.reply("testAtcs.de");
          throw "wrong reply - single not thrown";
        } catch (_err) {
          _err.name.should.equal("validation-mail-reply");
          done();
        }
      });
      it('set reply - multiple wrong', function(done) {
        var _reply;
        try {
          _reply = mailA.reply(["testA@tcs.de", "testBtcs.de", "testC@tcs.de"]);
        } catch (_err) {
          _err.name.should.equal("validation-mail-reply");
          done();
          return;
        }
        throw "wrong reply - multiple not thrown";
      });
      it('set returnPath - single', function(done) {
        var _returnPath;
        _returnPath = mailA.returnPath("test@tcs.de").returnPath();
        _returnPath.should.be.a("string").and.equal("test@tcs.de");
        done();
      });
      it('set returnPath - reset', function(done) {
        var _returnPath;
        _returnPath = mailA.returnPath(false).returnPath();
        should.not.exist(_returnPath);
        done();
      });
      it('set returnPath - multiple', function(done) {
        var _returnPath;
        try {
          _returnPath = mailA.returnPath(["testA@tcs.de", "testB@tcs.de", "testC@tcs.de"]);
        } catch (_err) {
          _err.name.should.equal("validation-mail-returnpath");
          done();
          return;
        }
        throw "wrong returnPath - multiple not thrown";
      });
      it('set returnPath - single wrong', function(done) {
        var _returnPath;
        try {
          _returnPath = mailA.returnPath("testAtcs.de");
        } catch (_err) {
          _err.name.should.equal("validation-mail-returnpath");
          done();
          return;
        }
        throw "wrong returnPath - single not thrown";
      });
      it('send this mail', function(done) {
        var _this = this;
        mailA.send(function(err) {
          if (err) {
            throw err;
            return;
          }
          done();
        });
      });
    });
    describe('mail send tests', function() {
      var mailFactoryB;
      mailFactoryB = null;
      it('create new factory', function(done) {
        mailFactoryB = new MailFactory("wmshop");
        mailFactoryB.should.be.an.instanceOf(MailFactory);
        done();
      });
      it('create and send mail - simple', function(done) {
        var _this = this;
        mailFactoryB.create().subject("Simple Test").text("TEST").to(_Cnf.realReceiver).send(function(err, result) {
          should.not.exist(err);
          result.should.have.property("recipients")["with"].be.an["instanceof"](Array).and.include(_Cnf.realReceiver);
          done();
        });
      });
      it('create and send mail - missing subject', function(done) {
        var _this = this;
        mailFactoryB.create().to("testB@tcs.de").send(function(err) {
          should.exist(err);
          err.should.have.property("name")["with"].be.a("string").and.equal("validation-mail-subject-missing");
          done();
        });
      });
      it('create and send mail - missing receiver', function(done) {
        var _this = this;
        mailFactoryB.create().subject("no receiver").send(function(err) {
          should.exist(err);
          err.should.have.property("name")["with"].be.a("string").and.equal("validation-mail-receiver-missing");
          done();
        });
      });
      it('create and send mail - missing content', function(done) {
        var _this = this;
        mailFactoryB.create().subject("missing content").bcc(_Cnf.realReceiver).send(function(err, result) {
          should.exist(err);
          err.should.have.property("name")["with"].be.a("string").and.equal("validation-mail-content-missing");
          done();
        });
      });
      it('create and send mail - with html content', function(done) {
        var _this = this;
        mailFactoryB.create().subject("HTML TEST").html("<html><header><style>h1{color:#f00;}</style></header><body><h1 class=\"test\">Simple html content</h1><p>Test the sending of mails</p></html></body>").to(_Cnf.realReceiver).send(function(err, result) {
          should.not.exist(err);
          result.should.have.property("recipients")["with"].be.an["instanceof"](Array).and.include(_Cnf.realReceiver);
          done();
        });
      });
      it('create and send mail - with large html content', function(done) {
        fs.readFile('./test/data/html_example.html', function(err, file) {
          var _val,
            _this = this;
          if (err) {
            throw err;
            return;
          }
          _val = file.toString("utf-8");
          mailFactoryB.create().subject("TCS E-Mail Node Client").html(_val).to(_Cnf.realReceiver).bcc(_Cnf.realCcReceiver).send(function(err, result) {
            should.not.exist(err);
            result.should.have.property("recipients")["with"].be.an["instanceof"](Array).and.include(_Cnf.realReceiver);
            done();
          });
        });
      });
    });
  });

}).call(this);
