/**
 * Created by thram on 12/03/16.
 */
var riot = require('riot');

//Default values
var defaultUser = {
  username : '',
  role     : 'user',
  signed_in: false
};

module.exports = {
  User: function () {
    var self = this;
    riot.observable(self);
    self.reset = function () {
      _.assign(self, defaultUser);
    };
  }
};