/**
 * Created by thram on 26/02/16.
 */

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
