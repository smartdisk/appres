'use strict';

//window.global = window;
//window.Buffer = require('buffer').Buffer; // browserify
//const https = require('https');
//var tiny = require('tiny-json-http')

const pkg = require('../package.json');
const HOST = pkg.api.host;

Object.defineProperty(exports, "__esModule", { value: true });
var AppRes = /** @class */ (function () {
  
  function AppRes() {
  }

  AppRes.prototype.test = function () {
    let data = {
      pkey: "GXYqIgrafjTRatwTB96d",
      akey: "39f031e6-94a0-4e14-b600-82779ec899d7",
      cmd: "icon",
      file: "sample.png"
    };

    // tiny.post({HOST, data}, (err, res) => {
    //   console.log("res:" + res);
    //   console.log("err:" + err);

    // });
  
    return 'test';
  };

  AppRes.appres = new AppRes();
  AppRes.test = function() {
    return this.appres.test();
  };
  
  return AppRes;
}());

module.exports = AppRes;
module.exports.AppRes = AppRes;

