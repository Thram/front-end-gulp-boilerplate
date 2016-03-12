// Add your code
var settings = require('settings');
var lang     = require('lang');
var riot     = require('riot');
var router   = require('router');

var routes = [
  {url: '/'}
];

settings.set('routes', routes);

var app = function (update) {
  riot.mount('*');
  if (update) {
    router.trigger('render', router.info());
  } else {
    riot.route.base('/');
    riot.route.start(true);
  }
};

lang.on('change', function () {
  app(true);
});

app();