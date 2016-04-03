/**
 * Created by thram on 12/03/16.
 */
var riot = require('riot');
var _    = require('lodash');

var Base = function (defaultValues, values) {
  defaultValues = _.assign(defaultValues || {}, values || {});
  var self      = this;
  _.assign(self, defaultValues);
  riot.observable(self);
  self.reset = function () {
    _.assign(self, defaultValues);
  };
};

module.exports = {
  User     : function (values) {
    return new Base({
      id       : 1,
      username : '',
      role     : 'user',
      signed_in: false
    }, values);
  }
};