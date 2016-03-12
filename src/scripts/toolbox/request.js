/**
 * Created by thram on 12/03/16.
 */
/**
 * Created by thram on 23/07/15.
 *
 * AJAX Module
 *
 * Ajax implementation
 *
 * Options:
 *  - cors: CORS (true - false)
 *  - url: target endpoint
 *  - progress: Progress listenere function
 *  - data : Data
 *  - error: Error Function
 *  - success: Success Function
 *  - headers: Object with all the headers for the request
 *  - type: Content-Type
 *
 */

var _        = require('lodash');
var settings = {cors: false};

function processOptions() {
  var options     = arguments[0] || {};
  options.success = options.success || console.log;
  options.error   = options.error || console.error;
  return options;
}

function newReq() {
  var XMLHTTP_IDS, xmlhttp, success = false, i;
  try {
    // Mozilla/Chrome/Safari/IE7+ (normal browsers)
    xmlhttp = new XMLHttpRequest();
    // For cross-origin requests, some simple logic to determine if XDomainReqeust is needed.
    if (_.isUndefined(xmlhttp.withCredentials)) {
      xmlhttp = new XDomainRequest();
    }
  } catch (e1) {
    // Internet Explorer
    XMLHTTP_IDS = ['MSXML2.XMLHTTP.5.0', 'MSXML2.XMLHTTP.4.0', 'MSXML2.XMLHTTP.3.0', 'MSXML2.XMLHTTP', 'Microsoft.XMLHTTP'];
    for (i = 0; i < XMLHTTP_IDS.length && !success; i++) {
      try {
        success = true;
        xmlhttp = new ActiveXObject(XMLHTTP_IDS[i]);
      } catch (e2) {
      }
    }
    if (!success) {
      throw new Error('Unable to create XMLHttpRequest!');
    }
  }
  return xmlhttp;
}

function jsonp() {
  // TODO Implement jsonp

  //window.myJsonpCallback = function(data) {
  //    // handle requested data from server
  //};
  //var scriptEl = document.createElement('script');
  //scriptEl.setAttribute('src', 'http://jsonp-aware-endpoint.com/user?callback=myJsonpCallback&id=123');
  //document.body.appendChild(scriptEl);
}

function ajax(options) {
  var request = newReq();
  try {
    options.headers = options.headers || {};
    if (!options.headers['Content-Type']) {
      options.type = options.type || 'html';
      var contentType;
      switch (options.type) {
        case 'txt':
          contentType = 'text/plain';
          break;
        case 'jsonp':
          jsonp(options);
          return;
        case 'json':
          contentType     = 'application/json';
          var success     = options.success;
          options.success = function (res) {
            success && success(JSON.parse(res));
          };
          break;
        case 'html':
          contentType = 'text/html';
          break;
        default:
          contentType = 'application/x-www-form-urlencoded';

      }
      options.headers['Content-Type'] = contentType + '; charset=UTF-8';
    }

    request.withCredentials = options.cors || settings.cors;
    request.open(options.method, encodeURI(options.url), true);
    for (var header in options.headers) {
      options.headers.hasOwnProperty(header) && request.setRequestHeader(header, options.headers[header]);
    }
    request.onload             = function () {
      if (request.status === 200) {
        options.success && options.success(request.responseText);
      } else {
        throw {error: request.status, message: request.statusText};
      }
    };
    request.onreadystatechange = function () { // set request handler
      var level;
      if (request.readyState === 4) { // if state = 4 (operation is completed)
        if (request.status === 200) { // and the HTTP status is OK
          // get progress from the XML node and set progress bar width and innerHTML
          level = request.responseXML ? request.responseXML.getElementsByTagName('PROGRESS')[0].firstChild.nodeValue : 100;
          options.progress && options.progress(level);
        } else { // if request status is not OK
          throw {error: request.status, message: request.statusText};
        }
      }
    };
    var data                   = options.data || {};
    request.send(data instanceof FormData ? data : JSON.stringify(data));
  } catch (error) {
    options.error && options.error(error);
  }
}

module.exports = {
  settings: settings,
  get     : function (options) {
    options        = processOptions(options);
    options.method = 'GET';
    ajax(options);
  },
  post    : function (options) {
    options        = processOptions(options);
    options.method = 'POST';
    ajax(options);
  },
  put     : function (options) {
    options        = processOptions(options);
    options.method = 'PUT';
    ajax(options);

  },
  patch   : function (options) {
    options        = processOptions(options);
    options.method = 'PATCH';
    ajax(options);
  },
  delete  : function (options) {
    options        = processOptions(options);
    options.method = 'DELETE';
    ajax(options);
  },
  form    : function (options) {
    options      = processOptions(options);
    var formData = new FormData();
    for (var key in options.data) {
      options.data.hasOwnProperty(key) && formData.append(key, options.data[key]);
    }
    options.method = 'POST';
    options.data   = formData;
    ajax(options);
  }
};