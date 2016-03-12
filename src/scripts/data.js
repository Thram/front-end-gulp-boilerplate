/**
 * Created by thram on 24/02/16.
 */

var _    = require('lodash');
var models = require('models');

// User
var user = new models.User();

user.reset();
module.exports = {
  user: user
};