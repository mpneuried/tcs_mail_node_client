(function() {
  var Mail, MailFactory, async, request, _,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ = require("underscore");

  async = require("async");

  request = require("request");

  Mail = require("./mail");

  module.exports = MailFactory = (function(_super) {
    __extends(MailFactory, _super);

    MailFactory.prototype.mailCache = {};

    MailFactory.prototype.mailCacheCurrIdx = 0;

    MailFactory.prototype._allowedSecurityKeys = ["apikey"];

    MailFactory.prototype.defaults = function() {
      return _.extend(MailFactory.__super__.defaults.apply(this, arguments), {
        sendermail: null,
        endpoint: "http://localhost:3000/email/send",
        security: {},
        returnPath: "bounces@tcs.de",
        from: null,
        reply: null,
        charset: "utf-8",
        charsetSubject: null,
        charsetText: null,
        charsetHtml: null,
        simulate: false
      });
    };

    function MailFactory(appid, options) {
      this.appid = appid;
      if (options == null) {
        options = {};
      }
      this.ERRORS = __bind(this.ERRORS, this);
      this._destroyMail = __bind(this._destroyMail, this);
      this._bindMailEvents = __bind(this._bindMailEvents, this);
      this._createNewMailID = __bind(this._createNewMailID, this);
      this._validateConfig = __bind(this._validateConfig, this);
      this._send = __bind(this._send, this);
      this.sendAll = __bind(this.sendAll, this);
      this.count = __bind(this.count, this);
      this.each = __bind(this.each, this);
      this.get = __bind(this.get, this);
      this.create = __bind(this.create, this);
      this.config = __bind(this.config, this);
      this.defaults = __bind(this.defaults, this);
      MailFactory.__super__.constructor.call(this, options);
      this.config(this._cnf);
      return;
    }

    MailFactory.prototype.config = function(config) {
      if (config == null) {
        config = {};
      }
      if ((config != null) && !_.isEmpty(config)) {
        this._cnf = _.extend(this._cnf, this._validateConfig(config));
      }
      return this._cnf;
    };

    MailFactory.prototype.create = function() {
      var id, mailObj;
      id = this._createNewMailID();
      mailObj = new Mail(id, this);
      this.mailCache[id] = mailObj;
      this._bindMailEvents(id, mailObj);
      return mailObj;
    };

    MailFactory.prototype.get = function(id) {
      return this.mailCache[id];
    };

    MailFactory.prototype.each = function(iterator) {
      var id, mail, _ref;
      _ref = this.mailCache;
      for (id in _ref) {
        mail = _ref[id];
        iterator(id, mail);
      }
    };

    MailFactory.prototype.count = function() {
      return _.keys(this.mailCache).length;
    };

    MailFactory.prototype.sendAll = function(callback) {
      var afns, id, mail, _ref,
        _this = this;
      afns = [];
      _ref = this.mailCache;
      for (id in _ref) {
        mail = _ref[id];
        afns.push(_.bind((function(mail, cba) {
          return mail.send(cba);
        }), this, mail));
      }
      async.series(afns, function(err, results) {
        if (err) {
          _this._handleError(callback, err);
          return;
        }
        callback(null, results);
      });
    };

    MailFactory.prototype._send = function(mailData, callback) {
      var reqOpt,
        _this = this;
      reqOpt = {
        url: this._cnf.endpoint,
        method: "POST",
        json: mailData
      };
      reqOpt.headers = this._cnf.security;
      if (this._cnf.simulate) {
        _.delay(function() {
          var _recipients, _ref, _ref1, _ref10, _ref11, _ref12, _ref13, _ref14, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7, _ref8, _ref9, _sout;
          _recipients = _.compact(_.union((_ref = reqOpt.json.email) != null ? _ref.ToAddresses : void 0, (_ref1 = reqOpt.json.email) != null ? _ref1.CcAddresses : void 0, (_ref2 = reqOpt.json.email) != null ? _ref2.BccAddresses : void 0));
          _sout = "===========================================\n=              SIMULATED MAIL             =\n===========================================\n    FROM: " + ((reqOpt != null ? (_ref3 = reqOpt.json) != null ? (_ref4 = _ref3.email) != null ? (_ref5 = _ref4.ToAddresses) != null ? _ref5.join(", ") : void 0 : void 0 : void 0 : void 0) || "-") + "\n    REPLYTO: " + ((reqOpt != null ? (_ref6 = reqOpt.json) != null ? (_ref7 = _ref6.email) != null ? (_ref8 = _ref7.ReplyToAddresses) != null ? _ref8.join(", ") : void 0 : void 0 : void 0 : void 0) || "-") + "\n    TO: " + (_recipients.join(", ") || "-") + "\n    SUBJECT: " + ((reqOpt != null ? (_ref9 = reqOpt.json) != null ? (_ref10 = _ref9.email) != null ? _ref10.Subject : void 0 : void 0 : void 0) || "-") + "\n";
          if ((_ref11 = reqOpt.json.email) != null ? (_ref12 = _ref11.Text) != null ? _ref12.length : void 0 : void 0) {
            _sout += "--- BODY: text -----------------------------\n" + reqOpt.json.email.Text + "\n";
          }
          if ((_ref13 = reqOpt.json.email) != null ? (_ref14 = _ref13.Html) != null ? _ref14.length : void 0 : void 0) {
            _sout += "--- BODY: html -----------------------------\n" + reqOpt.json.email.Html + "\n";
          }
          _sout += "============================================\n=                  END                     =\n============================================\n\n\n";
          console.log(_sout);
          return callback(null, {
            statusCode: 200,
            body: {
              simulated: true,
              recipients: _recipients
            }
          });
        }, 300);
      } else {
        request(reqOpt, callback);
      }
    };

    MailFactory.prototype._validateConfig = function(config) {
      var key, val;
      for (key in config) {
        val = config[key];
        switch (key) {
          case "sendermail":
          case "returnPath":
          case "from":
            this._validateEmail("config-" + key, val, false, false);
            break;
          case "reply":
            this._validateEmail("config-" + key, val, false, true);
            break;
          case "endpoint":
            this._validateUrl("config-" + key, val, true);
            break;
          case "charset":
          case "charsetSubject":
          case "charsetText":
          case "charsetHtml":
            this._validateCharset("config-" + key, val);
            break;
          case "security":
            this._validateObject("config-" + key, val);
            config.security = _.pick(config.security, "apikey");
        }
      }
      return config;
    };

    MailFactory.prototype._createNewMailID = function() {
      var id;
      id = "mid" + this.mailCacheCurrIdx;
      this.mailCacheCurrIdx++;
      return id;
    };

    MailFactory.prototype._bindMailEvents = function(id, mailObj) {
      var _this = this;
      mailObj.on("destroy", function() {
        _this._destroyMail(id);
      });
      mailObj.on("send.success", function() {
        _this._destroyMail(id);
      });
    };

    MailFactory.prototype._destroyMail = function(id) {
      this.mailCache = _.omit(this.mailCache, id);
    };

    MailFactory.prototype.ERRORS = function() {
      return _.extend(MailFactory.__super__.ERRORS.apply(this, arguments), {
        "validation-config-sendermail": "The given sendermail is not a valid e-mail",
        "validation-config-endpoint": "The given endpoint is not a vaild url",
        "validation-config-returnpath": "The given returnPath address is not valid",
        "validation-config-from": "The given from address is not valid",
        "validation-config-reply": "The given from contains one ore more invalid addresses",
        "validation-config-charset": "The given charset is not a string",
        "validation-config-charsetsubject": "The given charsetSubject is not a string",
        "validation-config-charsettext": "The given charsetText is not a string",
        "validation-config-charsethtml": "The given charsetHtml is not a string",
        "validation-config-security": "The given security credentials are not an object. Only the keys: `" + (this._allowedSecurityKeys.join(",")) + "` are allowed."
      });
    };

    return MailFactory;

  })(require("./basic"));

}).call(this);
