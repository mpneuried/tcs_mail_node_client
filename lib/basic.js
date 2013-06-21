(function() {
  var Basic, _,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ = require("underscore");

  module.exports = Basic = (function(_super) {
    __extends(Basic, _super);

    Basic.prototype.config = {};

    Basic.prototype.defaults = function() {
      return {};
    };

    /*	
    	## constructor 
    
    	`new Baisc( {} )`
    	
    	Basie constriuctor. Define the configuration by options and defaults, init logging and init the error handler
    
    	@param {Object} options Basic config object
    */


    function Basic(options) {
      this.ERRORS = __bind(this.ERRORS, this);
      this._validateCharset = __bind(this._validateCharset, this);
      this._validateString = __bind(this._validateString, this);
      this._validateObject = __bind(this._validateObject, this);
      this._validateUrl = __bind(this._validateUrl, this);
      this._validateEmail = __bind(this._validateEmail, this);
      this._initErrors = __bind(this._initErrors, this);
      this._handleError = __bind(this._handleError, this);
      this.defaults = __bind(this.defaults, this);
      this._cnf = _.extend({}, this.defaults(), options);
      if (this.initErrors != null) {
        this.initErrors();
      } else {
        this._initErrors();
      }
      return;
    }

    /*
    	## _handleError
    	
    	`basic._handleError( cb, err [, data] )`
    	
    	Baisc error handler. It creates a true error object and returns it to the callback, logs it or throws the error hard
    	
    	@param { Function|String } cb Callback function or NAme to send it to the logger as error 
    	@param { String|Error|Object } err Error type, Obejct or real error object
    	
    	@api private
    */


    Basic.prototype._handleError = function(cb, err, data) {
      var _err, _name, _ref, _ref1;
      if (data == null) {
        data = {};
      }
      if (_.isString(err)) {
        _err = new Error();
        _err.name = err;
        _err.message = ((_ref = this._ERRORS) != null ? typeof _ref[err] === "function" ? _ref[err](data) : void 0 : void 0) || "no details";
      } else if (err instanceof Error) {
        _err = err;
        _err.message = ((_ref1 = this._ERRORS) != null ? typeof _ref1[_name = err.name] === "function" ? _ref1[_name](data) : void 0 : void 0) || err.message;
      } else {
        _err = err;
      }
      if (_.isFunction(cb)) {
        cb(_err);
      } else if (cb === true) {
        throw _err;
      }
    };

    /*
    	## _initErrors
    	
    	`basic._initErrors(  )`
    	
    	convert error messages to underscore templates
    	
    	@api private
    */


    Basic.prototype._initErrors = function() {
      var key, msg, _ref;
      this._ERRORS = this.ERRORS();
      _ref = this._ERRORS;
      for (key in _ref) {
        msg = _ref[key];
        if (!_.isFunction(msg)) {
          this._ERRORS[key] = _.template(msg);
        }
      }
    };

    Basic.prototype._validateEmailRegex = /^(?:[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+\.)*[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+@(?:(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9\-](?!\.)){0,61}[a-zA-Z0-9]?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9\-](?!$)){0,61}[a-zA-Z0-9]?)|(?:\[(?:(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\.){3}(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\]))$/;

    Basic.prototype._validateEmail = function(type, value, required, arrayAllowed) {
      var str, _i, _len;
      if (required == null) {
        required = false;
      }
      if (arrayAllowed == null) {
        arrayAllowed = true;
      }
      if ((value == null) && !required) {
        return;
      }
      if (arrayAllowed && _.isArray(value)) {
        for (_i = 0, _len = value.length; _i < _len; _i++) {
          str = value[_i];
          if (!str.match(this._validateEmailRegex)) {
            this._handleError(true, "validation-" + (type.toLowerCase()));
          }
        }
      } else if (_.isArray(value) && !arrayAllowed) {
        this._handleError(true, "validation-" + (type.toLowerCase()));
      } else if (!value.match(this._validateEmailRegex)) {
        this._handleError(true, "validation-" + (type.toLowerCase()));
      }
    };

    Basic.prototype._validateUrlRegex = /^(?!mailto:)(?:(?:https?|ftp):\/\/)?(?:\S+(?::\S*)?@)?(?:(?:(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))|localhost)(?::\d{2,5})?(?:\/[^\s]*)?$/i;

    Basic.prototype._validateUrl = function(type, value, required, arrayAllowed) {
      var str, _i, _len;
      if (required == null) {
        required = false;
      }
      if (arrayAllowed == null) {
        arrayAllowed = false;
      }
      if ((value == null) && !required) {
        return;
      }
      if (arrayAllowed && _.isArray(value)) {
        for (_i = 0, _len = value.length; _i < _len; _i++) {
          str = value[_i];
          if (str.length >= 2083 && !str.match(this._validateUrlRegex)) {
            this._handleError(true, "validation-" + (type.toLowerCase()));
          }
        }
      } else if (_.isArray(value) && !arrayAllowed) {
        this._handleError(true, "validation-" + (type.toLowerCase()));
      } else if (!value.match(this._validateUrlRegex)) {
        this._handleError(true, "validation-" + (type.toLowerCase()));
      }
    };

    Basic.prototype._validateObject = function(type, value, required) {
      if (required == null) {
        required = false;
      }
      if ((value == null) && !required) {
        return;
      }
      if (!_.isObject(value)) {
        this._handleError(true, "validation-" + (type.toLowerCase()));
      }
    };

    Basic.prototype._validateString = function(type, value, required) {
      if (required == null) {
        required = false;
      }
      if ((value == null) && !required) {
        return;
      }
      if (!_.isString(value)) {
        this._handleError(true, "validation-" + (type.toLowerCase()));
      }
    };

    Basic.prototype._validateCharset = function(type, value, required) {
      if (required == null) {
        required = false;
      }
      if ((value == null) && !required) {
        return;
      }
      if (!_.isString(value)) {
        this._handleError(true, "validation-" + (type.toLowerCase()));
      }
    };

    Basic.prototype.ERRORS = function() {
      return {};
    };

    return Basic;

  })(require('events').EventEmitter);

}).call(this);
