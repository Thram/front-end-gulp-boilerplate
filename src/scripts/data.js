/**
 * Created by thram on 24/02/16.
 */

var _      = require('lodash');
var riot   = require('riot');
var models = require('models');
var cache  = require('toolbox/cache');

var cacheData = cache.enabled ? cache.get('data') || {} : {};
// Define Data object
var Data = function (values) {
  var self  = this;
  var _data = values;
  riot.observable(self);
  self.set    = function (key, value) {
    _data[key] = _.isObject(value) ? _.assign(_data[key], value) : _data[key] = value;
    if (cache.enabled) cache.set('data', _data);
    return _data[key];
  };
  self.get    = function (key) {
    return _data[key];
  };
  self.remove = function (key) {
    delete _data[key];
    if (cache.enabled) cache.remove(key);
  };
  self.clear  = function () {
    _.forEach(_data, function (obj, key) {
      obj.reset ? obj.reset() : delete _data[key];
    });
    if (cache.enabled) cache.clear();
  };
};

var data = new Data({
  user: new models.User(cacheData.user)
});

module.exports = data;