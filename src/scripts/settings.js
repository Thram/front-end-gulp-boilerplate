/**
 * Created by thram on 26/02/16.
 */

  // Settings

  // jQuery & Foundation Setup
  // global.$ = global.jQuery = require('jquery');
  // require('what-input');
  // require('foundation-sites');

  // Load Tags
require('tags/example/help.tag');
require('tags/example/container.tag');
require('tags/example/navigation.tag');
require('tags/example/view-home.tag');

// App Settings

var settings = {};

module.exports = {
  get: function (key) {
    return settings[key];
  },
  set: function (key, value) {
    settings[key] = value;
  }
};
