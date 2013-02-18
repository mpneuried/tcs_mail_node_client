(function() {
  var Mail, MailFactory, async, _,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ = require("underscore");

  async = require("async");

  Mail = require("./mail");

  module.exports = MailFactory = (function(_super) {

    __extends(MailFactory, _super);

    MailFactory.prototype.mailCache = {};

    MailFactory.prototype.mailCacheCurrIdx = 0;

    MailFactory.prototype.defaults = function() {
      return _.extend(MailFactory.__super__.defaults.apply(this, arguments), {
        sendermail: null,
        endpoint: "http://node.tcs.de/email/send",
        security: {},
        returnPath: "bounces@tcs.de",
        from: null,
        reply: null,
        charset: "utf-8",
        charsetSubject: null,
        charsetText: null,
        charsetHtml: null
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

      this.sendAll = __bind(this.sendAll, this);

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
      _.extend(this._cnf, this._validateConfig(config));
      return this._cnf;
    };

    MailFactory.prototype.create = function() {
      var id, mailObj;
      id = this._createNewMailID();
      mailObj = new Mail(id, this);
      mailCache[id] = mailObj;
      this._bindMailEvents(id, mailObj);
      return mailObj;
    };

    MailFactory.prototype.get = function(id) {
      return mailCache[id];
    };

    MailFactory.prototype.each = function(iterator) {
      var id, mail;
      for (id in mailCache) {
        mail = mailCache[id];
        iterator(id, mail);
      }
    };

    MailFactory.prototype.sendAll = function(callback) {
      var id, mail,
        _this = this;
      for (id in mailCache) {
        mail = mailCache[id];
        afns.push(function(cba) {
          return mail.send(cba);
        });
      }
      async.series(afns, function(err, results) {
        if (err) {
          _this._handleError(cb, err);
          return;
        }
        cb(results);
      });
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
          case "security":
            this._validateObject("config-" + key, val);
            break;
          case "charset":
          case "charsetSubject":
          case "charsetText":
          case "charsetHtml":
            this._validateString("config-" + key, val);
        }
      }
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
      var mailCache;
      mailCache = _.omit(mailCache, id);
    };

    MailFactory.prototype.ERRORS = function() {
      return _.extend(MailFactory.__super__.ERRORS.apply(this, arguments), {
        "validation-config-sendermail": "The given sendermail is not a valid e-mail",
        "validation-config-endpoint": "The given endpoint is not a vaild url",
        "validation-config-security": "The given security credentials are not an object",
        "validation-config-returnpath": "The given returnPath address is not valid",
        "validation-config-from": "The given from address is not valid",
        "validation-config-reply": "The given from contains one ore more invalid addresses",
        "validation-config-charset": "The given charset is not a string",
        "validation-config-charsetsubject": "The given charsetSubject is not a string",
        "validation-config-charsettext": "The given charsetText is not a string",
        "validation-config-charsethtml": "The given charsetHtml is not a string"
      });
    };

    return MailFactory;

  })(require("./basic"));

}).call(this);
