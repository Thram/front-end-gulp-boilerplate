/**
 * Created by thram on 1/04/16.
 */
var store    = require('store');
var settings = require('settings');

var cacheExpiration = settings.get('cache_expiration') || 300000; // Default 5 mins

module.exports = {
  enabled: settings.get('cache') || false,
  clear  : function () {
    store.clear();
  },
  remove : function (key) {
    store.remove(key);
  },
  set    : function (key, val, exp) {
    store.set(key, {val: val, exp: exp || cacheExpiration, time: new Date().getTime()});
  },
  get    : function (key) {
    var info = store.get(key);
    return (!!info && new Date().getTime() - info.time <= info.exp) ? info.val : undefined;
  }
};