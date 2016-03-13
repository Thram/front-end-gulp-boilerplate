// Add your code
require('loader');

var settings = require('settings');
var lang     = require('lang');
var riot     = require('riot');
var router   = require('router');

var routes = [
  {url: '/'}
];

router.set(routes);
router.rootView = 'home';

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