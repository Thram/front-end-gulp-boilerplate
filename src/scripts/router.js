/**
 * Created by thram on 11/03/16.
 */
var riot       = require('riot');
var _          = require('lodash');
var riotRouter = riot.route.create();

function Router() {
  var self          = this;
  self.rootView     = 'root';
  self.notFoundView = 'not-found';
  riot.observable(self);
  var hash, params, routes, route, view, settings;
  var render = function () {
    params   = _.compact(Array.prototype.slice.call(arguments));
    hash     = window.location.hash || '#/';
    route    = _.difference(hash.replace('#', '').replace('/', '').split('/'), params);
    view     = route.join('-') || (hash === '#/' ? self.rootView : self.notFoundView);
    settings = getSettings();
    self.trigger('render', self.info());
  };

  var getSettings = function () {
    var url = '#/' + (route || '') + (_.isEmpty(params) ? '' : '/*');
    return _.find(routes, function (r) {
      return r.url === url || (url === '#/' && (r.url === '#/' || r.url === '/'));
    });
  };

  self.validate = function (role) {
    var valid = false;
    if (settings)
      valid = (!settings.accept && !settings.reject) || (settings.accept && _.includes(settings.accept, role)) || (settings.reject && !_.includes(settings.reject, role)) ? true : false;
    return valid;
  };

  self.info = function () {
    var paramsObj = {};
    if (settings && settings.params) {
      _.each(settings.params, function (paramKey, index) {
        paramsObj[paramKey] = params[index];
      });
    }

    return {
      view  : view,
      url   : settings ? settings.url : undefined,
      params: paramsObj
    };
  };

  self.go = function (route) {
    riot.route(route);
  };

  self.set = function (appRoutes) {
    routes = appRoutes;
    _.each(routes, function (value) {
      riotRouter(value.url, render);
    });
    riotRouter(render);
  };
}
var router     = new Router();
module.exports = router;