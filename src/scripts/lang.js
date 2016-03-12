/**
 * Created by thram on 12/03/16.
 */
var riot    = require('riot');
var request = require('toolbox/request');
// Defaults
var default_text = require('lang/en.yaml');

var Lang = function () {
  var self = this;
  riot.observable(self);

  self.selected  = 'en';
  self.params    = new RegExp("%\{(.*?)\}", 'g');
  self.t         = default_text;
  self.change    = function (language) {
    request.get({
      url    : 'js/lang/' + language + '.json',
      type   : 'json',
      success: function (json) {
        lang.t        = json;
        self.selected = language;
        lang.trigger('change');
      }
    });
  };
  self.setParams = function (values) {
    return function () {
      var matches = Array.prototype.slice.call(arguments);
      return values[matches[1]];
    };
  };
};

var lang       = new Lang();
module.exports = lang;