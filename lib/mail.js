(function() {
  var Mail, _,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ = require("underscore");

  module.exports = Mail = (function(_super) {
    __extends(Mail, _super);

    function Mail(id, factory, options) {
      this.id = id;
      this.factory = factory;
      if (options == null) {
        options = {};
      }
      this.ERRORS = __bind(this.ERRORS, this);
      this._decodeReturn = __bind(this._decodeReturn, this);
      this._decodeError = __bind(this._decodeError, this);
      this._handleSend = __bind(this._handleSend, this);
      this._validateAndConvertAttributes = __bind(this._validateAndConvertAttributes, this);
      this._getAttributes = __bind(this._getAttributes, this);
      this.tmpl = __bind(this.tmpl, this);
      this.html = __bind(this.html, this);
      this.text = __bind(this.text, this);
      this.subject = __bind(this.subject, this);
      this.returnPath = __bind(this.returnPath, this);
      this.reply = __bind(this.reply, this);
      this.bcc = __bind(this.bcc, this);
      this.cc = __bind(this.cc, this);
      this.to = __bind(this.to, this);
      this.destroy = __bind(this.destroy, this);
      this.send = __bind(this.send, this);
      this.attributes = {};
      this.created = Date.now();
      Mail.__super__.constructor.call(this, options);
      return;
    }

    Mail.prototype.send = function(callback) {
      var _this = this;
      this._validateAndConvertAttributes(this._getAttributes(), function(err, mailData) {
        if (err) {
          callback(err);
          return;
        }
        _this.factory._send(mailData, _this._handleSend(callback));
      });
    };

    Mail.prototype.destroy = function() {
      this.emit("destroy");
    };

    Mail.prototype.to = function(to) {
      if (to != null) {
        if (to === false) {
          this.attributes.to = null;
        } else {
          this._validateEmail("mail-to", to, true, true);
          this.attributes.to = to;
        }
        return this;
      } else {
        return this.attributes.to;
      }
    };

    Mail.prototype.cc = function(cc) {
      if (cc != null) {
        if (cc === false) {
          this.attributes.cc = null;
        } else {
          this._validateEmail("mail-cc", cc, true, true);
          this.attributes.cc = cc;
        }
        return this;
      } else {
        return this.attributes.cc;
      }
    };

    Mail.prototype.bcc = function(bcc) {
      if (bcc != null) {
        if (bcc === false) {
          this.attributes.bcc = null;
        } else {
          this._validateEmail("mail-bcc", bcc, true, true);
          this.attributes.bcc = bcc;
        }
        return this;
      } else {
        return this.attributes.bcc;
      }
    };

    Mail.prototype.reply = function(reply) {
      if (reply != null) {
        if (reply === false) {
          this.attributes.reply = null;
        } else {
          this._validateEmail("mail-reply", reply, true, true);
          this.attributes.reply = reply;
        }
        return this;
      } else {
        return this.attributes.reply;
      }
    };

    Mail.prototype.returnPath = function(returnPath) {
      if (returnPath != null) {
        if (returnPath === false) {
          this.attributes.returnPath = null;
        } else {
          this._validateEmail("mail-returnpath", returnPath, true, false);
          this.attributes.returnPath = returnPath;
        }
        return this;
      } else {
        return this.attributes.returnPath;
      }
    };

    Mail.prototype.subject = function(subject) {
      if (subject != null) {
        this._validateString("mail-subject", subject, true, true);
        this.attributes.subject = subject;
        return this;
      } else {
        return this.attributes.subject;
      }
    };

    Mail.prototype.text = function(text) {
      if (text != null) {
        if (text === false) {
          this.attributes.text = null;
        } else {
          this._validateString("mail-text", text, true, true);
          this.attributes.text = text;
        }
        return this;
      } else {
        return this.attributes.text;
      }
    };

    Mail.prototype.html = function(html) {
      if (html != null) {
        if (html === false) {
          this.attributes.html = null;
        } else {
          this._validateString("mail-html", html, true, true);
          this.attributes.html = html;
        }
        return this;
      } else {
        return this.attributes.html;
      }
    };

    Mail.prototype.tmpl = function(tmplName, data, language, type) {
      console.log("TODO");
    };

    Mail.prototype._getAttributes = function() {
      var factoryDefaults;
      factoryDefaults = _.pick(this.factory.config(), ["returnPath", "reply"]);
      return _.extend({}, factoryDefaults, this.attributes);
    };

    Mail.prototype._validateAndConvertAttributes = function(attrs, cb) {
      var factoryConf, serviceData;
      if ((attrs.subject == null) || attrs.subject.length <= 0) {
        this._handleError(cb, "validation-mail-subject-missing");
        return;
      }
      if (_.compact(_.union(attrs != null ? attrs.to : void 0, attrs != null ? attrs.cc : void 0, attrs != null ? attrs.bcc : void 0)).length <= 0) {
        this._handleError(cb, "validation-mail-receiver-missing");
        return;
      }
      if ((((attrs != null ? attrs.text : void 0) == null) || (attrs != null ? attrs.text.length : void 0) <= 0) && (((attrs != null ? attrs.html : void 0) == null) || (attrs != null ? attrs.html.length : void 0) <= 0)) {
        this._handleError(cb, "validation-mail-content-missing");
        return;
      }
      factoryConf = this.factory.config();
      serviceData = {
        appid: this.factory.appid,
        email: {}
      };
      if (factoryConf.senderemail != null) {
        serviceData.senderemail = factoryConf.senderemail;
        serviceData.email.Source = factoryConf.senderemail;
      }
      if ((factoryConf.source != null) && factoryConf.source !== factoryConf.senderemail) {
        serviceData.email.Source = factoryConf.source;
      }
      if (attrs.to != null) {
        serviceData.email.ToAddresses = (_.isArray(attrs.to) ? attrs.to : [attrs.to]);
      }
      if (attrs.cc != null) {
        serviceData.email.CcAddresses = (_.isArray(attrs.cc) ? attrs.cc : [attrs.cc]);
      }
      if (attrs.bcc != null) {
        serviceData.email.BccAddresses = (_.isArray(attrs.bcc) ? attrs.bcc : [attrs.bcc]);
      }
      if (attrs.reply != null) {
        serviceData.email.ReplyToAddresses = (_.isArray(attrs.reply) ? attrs.reply : [attrs.reply]);
      }
      if (attrs.returnPath != null) {
        serviceData.email.ReturnPath = attrs.returnPath;
      } else if (factoryConf.returnPath != null) {
        serviceData.email.ReturnPath = factoryConf.returnPath;
      }
      serviceData.email.Subject = attrs.subject;
      if (attrs.text != null) {
        serviceData.email.Text = attrs.text;
      }
      if (attrs.html != null) {
        serviceData.email.Html = attrs.html;
      }
      cb(null, serviceData);
    };

    Mail.prototype._handleSend = function(callback) {
      var _this = this;
      return function(err, mailReturn) {
        var _err, _ret;
        if (err) {
          _this.emit("send.error", err);
          _this._handleError(callback, err);
          return;
        } else if (mailReturn.statusCode !== 200) {
          _err = _this._decodeError(mailReturn.body);
          _this.emit("send.error", _err);
          _this._handleError(callback, _err);
          return;
        }
        _ret = _this._decodeReturn(mailReturn.body);
        _this.emit("send.success", _ret);
        callback(null, _ret);
      };
    };

    Mail.prototype._decodeError = function(raw) {
      var ret, _ref, _ref1;
      ret = raw != null ? (_ref = raw.Body) != null ? (_ref1 = _ref.ErrorResponse) != null ? _ref1.Error : void 0 : void 0 : void 0;
      if (ret) {
        return ret;
      } else {
        return raw;
      }
    };

    Mail.prototype._decodeReturn = function(raw) {
      var ret;
      ret = {};
      ret.recipients = raw.recipients || null;
      ret.recipients_blacklisted = raw.recipients_blacklisted || null;
      if (ret) {
        return ret;
      } else {
        return raw;
      }
    };

    Mail.prototype.ERRORS = function() {
      return _.extend(Mail.__super__.ERRORS.apply(this, arguments), {
        "validation-mail-to": "The given `to` contains one ore more invalid addresses",
        "validation-mail-cc": "The given `cc` contains one ore more invalid addresses",
        "validation-mail-bcc": "The given `bcc` contains one ore more invalid addresses",
        "validation-mail-receiver-missing": "at least one email address in `to`, `cc` or `bcc` has to be defined",
        "validation-mail-reply": "The given reply contains one ore more invalid addresses",
        "validation-mail-returnpath": "The given returnPath address is not valid",
        "validation-mail-subject": "The given `subject` has to be a string",
        "validation-mail-subject-missing": "A subject ha to be set",
        "validation-mail-text": "The given `text` has to be a string",
        "validation-mail-html": "The given `html` has to be a string",
        "validation-mail-content-missing": "You have to define a content as `html and/or `text`"
      });
    };

    return Mail;

  })(require("./basic"));

}).call(this);
