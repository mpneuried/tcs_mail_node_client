(function() {
  var Mail,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  module.exports = Mail = (function(_super) {

    __extends(Mail, _super);

    function Mail(id, factory, options) {
      this.id = id;
      this.factory = factory;
      if (options == null) {
        options = {};
      }
      this.created = Date.now();
      Mail.__super__.constructor.call(this, options);
      return;
    }

    return Mail;

  })(require("./basic"));

}).call(this);
