/**
 * Created by thram on 11/03/16.
 */
var riot       = require('riot');
var _          = require('lodash');
var settings   = require('settings');
var riotRouter = riot.route.create();

function Router() {
  var routes = settings.get('routes');
  var self   = this;
  riot.observable(self);
  var hash, params;
  var _render = function () {
    params = Array.prototype.slice.call(arguments);
    hash   = window.location.hash || '#/';
    self.trigger('render', self.info());
  };
  _.each(routes, function (value) {
    riotRouter(value.url, _render);
  });
  riotRouter(_render);

  self.validate = function (route, role) {
    var routeSetting = _.find(routes, {url: route});
    var valid        = false;
    if (routeSetting)
      valid = (!routeSetting.accept && !routeSetting.reject) || (routeSetting.accept && _.includes(routeSetting.accept, role)) || (routeSetting.reject && !_.includes(routeSetting.reject, role)) ? true : false;
    return valid;
  };

  self.info = function () {
    var view         = _.difference(hash.replace('#', '').replace('/', '').split('/'), params).join('-') || (hash === '#/' ? 'home' : 'not-found');
    var url          = '#/' + view + (!_.isEmpty(params) ? '/*' : '');
    var paramsObj    = {};
    var routeSetting = _.find(routes, {url: url});
    if (routeSetting && routeSetting.params) {
      _.each(routeSetting.params, function (paramKey, index) {
        paramsObj[paramKey] = params[index];
      });
    }

    return {
      view  : view,
      url   : url,
      params: paramsObj
    };
  };

  self.go = function (route) {
    riot.route(route);
  };
}
var router     = new Router();
module.exports = router;